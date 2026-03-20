// Netlify Function: vale-intake
// Receives form submissions and stores to Netlify Blobs or forwards to webhook

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse form data
    const contentType = event.headers['content-type'] || '';
    let data;

    if (contentType.includes('application/json')) {
      data = JSON.parse(event.body);
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      data = Object.fromEntries(new URLSearchParams(event.body));
    } else {
      // Try JSON first, fall back to form
      try {
        data = JSON.parse(event.body);
      } catch {
        data = Object.fromEntries(new URLSearchParams(event.body));
      }
    }

    // Generate client ID from name
    const clientName = data.user_name || data.name || 'unknown';
    const clientId = clientName.toLowerCase().replace(/[^a-z0-9]/g, '-');
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
        name: data.vale_name === 'custom' ? data.custom_vale_name : 'Valé',
        emoji: data.vale_emoji || '⚡'
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

    // Option 1: Store to Netlify Blobs (if configured)
    // const { getStore } = await import('@netlify/blobs');
    // const store = getStore('vale-intakes');
    // await store.setJSON(clientId, intake);

    // Option 2: Forward to webhook (e.g., your server, Zapier, etc.)
    const webhookUrl = process.env.INTAKE_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(intake)
      });
    }

    // Option 3: Send email notification
    // (Would need email service integration)

    // Log for Netlify dashboard
    console.log('Vale intake received:', JSON.stringify(intake, null, 2));

    // Return success - redirect to thank you page
    return {
      statusCode: 302,
      headers: {
        Location: '/vale/thank-you.html',
        'Cache-Control': 'no-cache'
      },
      body: ''
    };

  } catch (error) {
    console.error('Intake error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process intake' })
    };
  }
};
