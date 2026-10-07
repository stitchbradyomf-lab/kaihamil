import { getStore } from "@netlify/blobs";

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");
  
  // Fail closed: never fall back to a default secret (this repo is public).
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret || secret !== adminSecret) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const store = getStore("vale-intakes");
    const { blobs } = await store.list();
    
    const intakes = [];
    for (const blob of blobs) {
      try {
        const intake = await store.get(blob.key, { type: "json" });
        if (intake) {
          intakes.push(intake);
        }
      } catch (e) {
        // Skip invalid entries
      }
    }
    
    // Sort by receivedAt descending
    intakes.sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());

    return new Response(JSON.stringify({ 
      count: intakes.length,
      intakes 
    }, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("List intakes error:", error);
    return new Response(JSON.stringify({ error: "Server error", details: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
