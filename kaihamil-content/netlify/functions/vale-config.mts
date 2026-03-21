import { getStore } from "@netlify/blobs";

export default async (request: Request) => {
  // Only allow POST
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Verify auth token
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const data = await request.json();
    const email = data.email;

    if (!email) {
      return new Response("Email required", { status: 400 });
    }

    // Get the vale-clients store
    const store = getStore("vale-clients");

    // Get existing client record or create new one
    let clientRecord;
    try {
      const existing = await store.get(email, { type: "json" });
      clientRecord = existing || {};
    } catch {
      clientRecord = {};
    }

    // Update with config data
    clientRecord.email = email;
    clientRecord.config = data.config;
    clientRecord.config_submitted = data.submitted;
    clientRecord.status = "config_submitted";

    // Determine suggested tier based on config
    const users = data.config.users;
    const focus = data.config.focus;
    
    if (users === "team" || users === "family") {
      clientRecord.suggested_tier = "business";
    } else if (users === "2" || focus === "business" || focus === "hybrid") {
      clientRecord.suggested_tier = "professional";
    } else {
      clientRecord.suggested_tier = "personal";
    }

    // Save to Blobs
    await store.setJSON(email, clientRecord);

    // Log for admin notification (you could add email trigger here)
    console.log(`New Vale config submitted: ${email}, suggested tier: ${clientRecord.suggested_tier}`);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error saving config:", error);
    return new Response("Server error", { status: 500 });
  }
};
