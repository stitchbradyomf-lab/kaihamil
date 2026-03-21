import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export default async (request: Request) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const data = await request.json();
    const { email, name, quiz_answers } = data;

    if (!email) {
      return new Response("Email required", { status: 400 });
    }

    // Create Stripe Checkout Session for $100 deposit
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Valé Setup Deposit",
              description: "Applied toward your full Valé build. Refundable if we're not a fit.",
            },
            unit_amount: 10000, // $100.00 in cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        client_email: email,
        client_name: name || "",
        quiz_answers: JSON.stringify(quiz_answers || {}),
      },
      success_url: `${process.env.URL}/vale/configure.html?payment=success`,
      cancel_url: `${process.env.URL}/vale/setup.html?payment=cancelled`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Stripe error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
