// auth-check.js
// Include this script on any protected (Tier 2) pages
// Place before closing </body> tag

(function() {
  'use strict';
  
  const PUBLIC_PATHS = [
    '/',
    '/index.html',
    '/about.html',
    '/gate.html',
    '/tools/time-and-focus.html',
    '/tools/ai-user-quiz.html'
  ];
  
  const currentPath = window.location.pathname;
  
  // Skip check for public pages
  if (PUBLIC_PATHS.includes(currentPath)) {
    return;
  }
  
  // Check for verified session
  const verifiedEmail = localStorage.getItem('kh_verified_email');
  const verifiedName = localStorage.getItem('kh_verified_name');
  const sessionExpiry = localStorage.getItem('kh_session_expiry');
  
  // Check if session is valid (30 days)
  const now = new Date().getTime();
  const isSessionValid = sessionExpiry && parseInt(sessionExpiry) > now;
  
  if (!verifiedEmail || !isSessionValid) {
    // No valid session - redirect to gate
    const returnUrl = encodeURIComponent(window.location.href);
    window.location.href = `/gate.html?return=${returnUrl}`;
    return;
  }
  
  // Valid session - optionally show welcome back message
  console.log(`Welcome back, ${verifiedName}`);
  
  // Add "Logged in as" indicator to page (optional)
  addUserIndicator(verifiedName);
  
  function addUserIndicator(name) {
    const nav = document.querySelector('.nav') || document.querySelector('nav');
    if (nav && !document.getElementById('user-indicator')) {
      const indicator = document.createElement('div');
      indicator.id = 'user-indicator';
      indicator.innerHTML = `
        <span style="font-size: 0.85rem; color: #5a5048;">
          👤 ${name}
        </span>
      `;
      indicator.style.cssText = 'margin-left: auto; padding: 0 20px;';
      nav.appendChild(indicator);
    }
  }
})();
