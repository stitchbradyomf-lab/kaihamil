import { getStore } from "@netlify/blobs";

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const body = await req.json();
    
    // Generate unique ID
    const id = `intake-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const intake = {
      id,
      ...body,
      receivedAt: new Date().toISOString()
    };
    
    // Store in Netlify Blobs
    const store = getStore("vale-intakes");
    await store.setJSON(id, intake);
    
    // Log for visibility
    console.log("VALE_INTAKE:", JSON.stringify({
      id,
      userType: body.userType,
      gapScore: body.gapScore,
      contactEmail: body.contactEmail || 'not provided yet',
      timestamp: intake.receivedAt
    }));
    
    return new Response(JSON.stringify({ 
      success: true, 
      id,
      gapScore: body.gapScore
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Vale intake error:", error);
    return new Response(JSON.stringify({ error: "Server error", details: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
