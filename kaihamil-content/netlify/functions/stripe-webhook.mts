import Stripe from "stripe";
import { getStore } from "@netlify/blobs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async (request: Request) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return new Response("No signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const email = session.customer_email || session.metadata?.client_email;
    if (!email) {
      console.error("No email in session");
      return new Response("No email", { status: 400 });
    }

    try {
      const store = getStore("vale-clients");

      // Get or create client record
      let clientRecord;
      try {
        clientRecord = await store.get(email, { type: "json" }) || {};
      } catch {
        clientRecord = {};
      }

      // Update with payment info
      clientRecord.email = email;
      clientRecord.name = session.metadata?.client_name || clientRecord.name;
      clientRecord.status = "deposit_paid";
      clientRecord.deposit_paid = new Date().toISOString();
      clientRecord.stripe_session_id = session.id;
      clientRecord.stripe_payment_intent = session.payment_intent;

      // Store quiz answers if provided
      if (session.metadata?.quiz_answers) {
        try {
          clientRecord.quiz = JSON.parse(session.metadata.quiz_answers);
        } catch {
          // Ignore parse errors
        }
      }

      await store.setJSON(email, clientRecord);

      console.log(`Deposit received from ${email}`);

      // TODO: Send confirmation email
      // TODO: Notify admin

    } catch (error) {
      console.error("Error processing payment:", error);
      return new Response("Processing error", { status: 500 });
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
