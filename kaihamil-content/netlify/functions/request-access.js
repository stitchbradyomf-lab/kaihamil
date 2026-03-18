// Netlify Function: request-access.js
// Handles new access requests and sends verification emails

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// TODO: Configure your email service here
// Options: SendGrid, Mailgun, AWS SES, Postmark
const EMAIL_SERVICE = 'SENDGRID'; // Change to your provider
const EMAIL_API_KEY = process.env.EMAIL_API_KEY; // Set in Netlify environment variables
const FROM_EMAIL = 'kyle@kaihamil.com';
const SITE_URL = 'https://content.kaihamil.com';

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST'
  };

  try {
    const { name, email } = JSON.parse(event.body);
    
    if (!name || !email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Name and email required' })
      };
    }

    const normalizedEmail = email.toLowerCase().trim();
    
    // Read allowlist
    const allowlistPath = path.join(__dirname, '../../data/allowlist.json');
    const allowlistData = JSON.parse(fs.readFileSync(allowlistPath, 'utf8'));
    
    // Check if already exists
    const existingEntry = allowlistData.accessList.find(
      entry => entry.email.toLowerCase() === normalizedEmail
    );
    
    if (existingEntry) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Already registered',
          alreadyVerified: existingEntry.verified
        })
      };
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    // Create pending entry
    const newEntry = {
      email: normalizedEmail,
      name: name.trim(),
      verified: false,
      dateAdded: new Date().toISOString().split('T')[0],
      tier: 'email-verified',
      source: 'gate-form',
      verificationToken: verificationToken
    };
    
    // Add to pending
    allowlistData.pendingVerifications.push(newEntry);
    allowlistData.stats.totalPending++;
    
    // Save updated allowlist
    fs.writeFileSync(allowlistPath, JSON.stringify(allowlistData, null, 2));
    
    // Send verification email
    const emailSent = await sendVerificationEmail(name, normalizedEmail, verificationToken);
    
    if (!emailSent) {
      console.error('Failed to send verification email to:', normalizedEmail);
      // Still return success - user can request resend
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Verification email sent'
      })
    };

  } catch (error) {
    console.error('Error requesting access:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

async function sendVerificationEmail(name, email, token) {
  const verificationUrl = `${SITE_URL}/verify?token=${token}&email=${encodeURIComponent(email)}`;
  
  const emailSubject = 'Verify your access to Kai Hamil';
  const emailBody = `
Hi ${name},

Click the link below to unlock Tier 2 access to Kai Hamil:

${verificationUrl}

This link will grant you access to:
- Complete decision frameworks
- Research library & deep dives  
- Advanced tools and assessments
- Email newsletter updates

If you didn't request this, you can ignore this email.

Best,
Kyle

---
Kai Hamil | System // Self
https://content.kaihamil.com
  `;

  const emailHtml = `
<!DOCTYPE html>
<html>
<body style="font-family: Georgia, serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
  <h2 style="color: #2c2420;">Hi ${name},</h2>
  
  <p>Click the button below to unlock Tier 2 access to Kai Hamil:</p>
  
  <a href="${verificationUrl}" 
     style="display: inline-block; background: #b87a5e; color: white; padding: 16px 32px; 
            text-decoration: none; border-radius: 50px; margin: 20px 0;">
    Verify Access
  </a>
  
  <p>Or copy this link:<br>
  <code style="background: #f8f5f0; padding: 10px; display: block; word-break: break-all;">
    ${verificationUrl}
  </code></p>
  
  <h3 style="color: #2c2420; margin-top: 30px;">This grants you access to:</h3>
  <ul style="color: #5a5048;">
    <li>Complete decision frameworks</li>
    <li>Research library & deep dives</li>
    <li>Advanced tools and assessments</li>
    <li>Email newsletter updates</li>
  </ul>
  
  <p style="color: #5a5048; font-size: 0.9rem; margin-top: 30px;">
    If you didn't request this, you can ignore this email.
  </p>
  
  <hr style="border: none; border-top: 1px solid #e8ddd3; margin: 30px 0;">
  
  <p style="color: #5a5048; font-size: 0.85rem;">
    Best,<br>
    Kyle<br>
    <strong>Kai Hamil</strong> | System // Self<br>
    <a href="https://content.kaihamil.com" style="color: #b87a5e;">content.kaihamil.com</a>
  </p>
</body>
</html>
  `;

  // TODO: Implement with your chosen email service
  // Example for SendGrid:
  /*
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${EMAIL_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      personalizations: [{
        to: [{ email: email, name: name }]
      }],
      from: { email: FROM_EMAIL, name: 'Kai Hamil' },
      subject: emailSubject,
      content: [
        { type: 'text/plain', value: emailBody },
        { type: 'text/html', value: emailHtml }
      ]
    })
  });
  
  return response.ok;
  */

  // For now, log the email that would be sent
  console.log('=== VERIFICATION EMAIL ===');
  console.log('To:', email);
  console.log('Subject:', emailSubject);
  console.log('Verification URL:', verificationUrl);
  console.log('==========================');
  
  // Return true to simulate success
  return true;
}
