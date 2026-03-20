import { Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

export default async (req: Request, context: Context) => {
  // Only allow POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    // Parse form data
    const contentType = req.headers.get("content-type") || "";
    let data: Record<string, any>;

    if (contentType.includes("application/json")) {
      data = await req.json();
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      data = Object.fromEntries(formData.entries());
      
      // Handle multiple checkbox values (tools)
      const tools: string[] = [];
      formData.getAll("tools").forEach(v => tools.push(String(v)));
      if (tools.length > 0) data.tools = tools;
    } else {
      const text = await req.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = Object.fromEntries(new URLSearchParams(text));
      }
    }

    // Generate client ID from name
    const clientName = data.user_name || data.name || "unknown";
    const clientId = clientName.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const timestamp = new Date().toISOString();

    // Structure the intake data
    const intake = {
      id: clientId,
      submittedAt: timestamp,
      profile: {
        name: data.user_name,
        role: data.user_role,
        timezone: data.timezone,
        workStart: data.work_start,
        workEnd: data.work_end
      },
      vale: {
        name: data.vale_name === "custom" ? data.custom_vale_name : "Valé",
        emoji: data.vale_emoji || "⚡"
      },
      focus: {
        primary: data.focus,
        mainGoal: data.main_goal,
        painPoint: data.pain_point
      },
      communication: {
        formality: data.formality,
        proactivity: data.proactivity,
        detail: data.detail,
        tone: data.tone,
        personality: data.personality
      },
      integrations: {
        tools: Array.isArray(data.tools) ? data.tools : [data.tools].filter(Boolean),
        other: data.other_tools
      },
      schedule: {
        morningBrief: data.morning_brief,
        quietHours: data.quiet_hours
      },
      memory: {
        level: data.memory,
        neverStore: data.never_store
      },
      context: {
        aboutYou: data.about_you
      },
      raw: data
    };

    // Store to Netlify Blobs
    const store = getStore("vale-intakes");
    const key = `${clientId}-${Date.now()}`;
    await store.setJSON(key, intake);

    // Log for debugging
    console.log("Vale intake stored:", key, JSON.stringify(intake, null, 2));

    // Redirect to thank you page
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/vale/thank-you.html",
        "Cache-Control": "no-cache"
      }
    });

  } catch (error) {
    console.error("Intake error:", error);
    return new Response(JSON.stringify({ error: "Failed to process intake" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
