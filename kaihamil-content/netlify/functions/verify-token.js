// Netlify Function: verify-token.js
// Handles verification link clicks and grants access

const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  try {
    const { token, email } = event.queryStringParameters || {};
    
    if (!token || !email) {
      return {
        statusCode: 302,
        headers: {
          'Location': '/gate.html?error=invalid'
        },
        body: ''
      };
    }

    // Read allowlist
    const allowlistPath = path.join(__dirname, '../../data/allowlist.json');
    const allowlistData = JSON.parse(fs.readFileSync(allowlistPath, 'utf8'));
    
    // Find pending entry
    const pendingIndex = allowlistData.pendingVerifications.findIndex(
      entry => entry.email.toLowerCase() === email.toLowerCase() && 
               entry.verificationToken === token
    );
    
    if (pendingIndex === -1) {
      return {
        statusCode: 302,
        headers: {
          'Location': '/gate.html?error=expired'
        },
        body: ''
      };
    }

    // Move from pending to verified
    const verifiedEntry = allowlistData.pendingVerifications[pendingIndex];
    verifiedEntry.verified = true;
    verifiedEntry.dateVerified = new Date().toISOString().split('T')[0];
    delete verifiedEntry.verificationToken; // Remove token after use
    
    // Add to access list
    allowlistData.accessList.push(verifiedEntry);
    
    // Remove from pending
    allowlistData.pendingVerifications.splice(pendingIndex, 1);
    
    // Update stats
    allowlistData.stats.totalVerified++;
    allowlistData.stats.totalPending--;
    allowlistData.stats.lastEntry = new Date().toISOString().split('T')[0];
    
    // Save updated allowlist
    fs.writeFileSync(allowlistPath, JSON.stringify(allowlistData, null, 2));
    
    // Redirect to success page with auth token
    const authToken = Buffer.from(`${verifiedEntry.email}:${Date.now()}`).toString('base64');
    
    return {
      statusCode: 302,
      headers: {
        'Location': `/gate.html?verified=true&name=${encodeURIComponent(verifiedEntry.name)}&token=${authToken}`
      },
      body: ''
    };

  } catch (error) {
    console.error('Error verifying token:', error);
    return {
      statusCode: 302,
      headers: {
        'Location': '/gate.html?error=server'
      },
      body: ''
    };
  }
};
