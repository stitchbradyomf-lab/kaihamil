import { getStore } from "@netlify/blobs";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default async function handler(req: Request) {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders }
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
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });

  } catch (error) {
    console.error("Vale intake error:", error);
    return new Response(JSON.stringify({ error: "Server error", details: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
}
