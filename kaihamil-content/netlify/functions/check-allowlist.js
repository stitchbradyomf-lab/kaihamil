// Netlify Function: check-allowlist.js
// Checks if an email is on the allowlist

const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { email } = JSON.parse(event.body);
    
    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email required' })
      };
    }

    // Read allowlist
    const allowlistPath = path.join(__dirname, '../../data/allowlist.json');
    const allowlistData = JSON.parse(fs.readFileSync(allowlistPath, 'utf8'));
    
    // Check if email exists and is verified
    const entry = allowlistData.accessList.find(
      entry => entry.email.toLowerCase() === email.toLowerCase() && entry.verified
    );

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        allowed: !!entry,
        email: entry ? entry.email : null,
        name: entry ? entry.name : null,
        tier: entry ? entry.tier : null
      })
    };

  } catch (error) {
    console.error('Error checking allowlist:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
