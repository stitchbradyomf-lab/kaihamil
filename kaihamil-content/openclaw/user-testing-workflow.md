# Automated User Testing Workflow
## Browser-Based Smoke Tests for Kai Hamil

**Version:** 1.0  
**Last Updated:** 2026-03-17  
**Schedule:** Daily at 6 AM (before morning brief)  
**Scope:** Critical user flows, core functionality

---

## Test Philosophy

**Purpose:** Ensure core user journeys remain functional without manual checking  
**Approach:** Smoke tests, not exhaustive coverage  
**Failure Response:** Immediate alert + log details for investigation

---

## Critical User Flows (Test Suite)

### Flow 1: Homepage Entry → Time & Focus Assessment
**Priority:** CRITICAL (Primary entry point)

**Steps:**
1. Navigate to content.kaihamil.com
2. Verify hero section loads ("Age of Intelligence")
3. Click "Find Your Focus" CTA
4. Verify Time & Focus tool loads
5. Complete Section 1 (select days)
6. Verify progress bar advances
7. Continue through all 5 sections
8. Verify results page displays waste chart

**Expected Results:**
- Page loads < 3 seconds
- All interactive elements responsive
- Progress bar tracks correctly
- Results calculate and display
- No console errors

**Failure Indicators:**
- 404 errors
- Broken styling (missing CSS variables)
- JavaScript errors in console
- Form submissions fail

---

### Flow 2: Homepage → System Side Navigation
**Priority:** HIGH

**Steps:**
1. Load homepage
2. Click "Frameworks" in System section
3. Verify Frameworks page loads
4. Return to homepage
5. Click "Tools" in System section
6. Verify Tools page loads with all tool cards

**Expected Results:**
- Both pages load correctly
- Navigation preserved
- Cards display with proper styling
- No broken links

---

### Flow 3: Email Gate Flow
**Priority:** CRITICAL (Tier 2 access control)

**Steps:**
1. Navigate to /gate.html
2. Verify gate form loads
3. Enter test name and email
4. Submit form
5. Verify "Check Your Email" state displays
6. (Optional with test email) Click verification link
7. Verify access granted

**Expected Results:**
- Form accepts input
- Submission triggers function
- State transitions work
- Email would send (can't verify delivery in test)
- No JavaScript errors

**Note:** Cannot fully test email delivery in automated test, but can verify form submission reaches backend.

---

### Flow 4: Mobile Responsive Check
**Priority:** MEDIUM

**Steps:**
1. Load homepage at desktop viewport (1200px)
2. Verify split layout displays correctly
3. Resize to tablet viewport (768px)
4. Verify layout stacks/adapts
5. Resize to mobile viewport (375px)
6. Verify hamburger menu appears
7. Click hamburger menu
8. Verify mobile menu opens

**Expected Results:**
- Layout adapts at breakpoints
- No horizontal scroll
- Touch targets adequate size
- Menu functional on mobile

---

### Flow 5: Knowledge Graph Visualization
**Priority:** MEDIUM

**Steps:**
1. Navigate to /graph/
2. Wait for D3.js visualization to load
3. Verify nodes render
4. Click a node
5. Verify node details display
6. Test zoom/pan functionality

**Expected Results:**
- Visualization renders within 5 seconds
- Interactive elements respond
- No console errors from D3

---

### Flow 6: Agent OS Sales Page
**Priority:** HIGH (Revenue critical)

**Steps:**
1. Navigate to /openclaw/agent-workflow-demo.html
2. Verify hero section loads
3. Scroll to pricing section
4. Verify all three pricing tiers display
5. Click "Get Started" on Foundation tier
6. Verify mailto: link opens correctly

**Expected Results:**
- Page loads completely
- Pricing displays accurately
- CTA buttons functional
- No broken assets

---

## Test Execution Protocol

### Daily Test Run (6 AM)
```
1. Launch headless browser
2. Execute all 6 flows sequentially
3. Capture screenshots on failure
4. Log timing metrics
5. Generate pass/fail report
6. Send to Kyle if any failures
```

### On Failure
```
1. Capture full-page screenshot
2. Log console errors
3. Log network failures (404s, 500s)
4. Record timestamp
5. Send alert via Telegram
6. Continue remaining tests (don't stop on first failure)
```

---

## Success Criteria

| Metric | Target | Alert Threshold |
|--------|--------|----------------|
| Page load time | < 3s | > 5s |
| Test pass rate | 100% | < 95% |
| Console errors | 0 | > 0 |
| 404 errors | 0 | > 0 |
| Visual regressions | 0 | Any detected |

---

## Technical Implementation

### Browser Automation Stack
- **Tool:** Playwright (via browser tool)
- **Mode:** Headless for speed
- **Screenshots:** On failure only
- **Logging:** JSON format for parsing

### Sample Test Code Structure
```javascript
async function testHomepageToTimeFocus() {
  const results = {
    flow: 'homepage-to-time-focus',
    status: 'pending',
    steps: [],
    errors: [],
    timing: {}
  };
  
  try {
    // Step 1: Navigate
    const start = Date.now();
    await page.goto('https://content.kaihamil.com');
    results.timing.load = Date.now() - start;
    results.steps.push({ step: 1, status: 'pass', time: results.timing.load });
    
    // Step 2: Verify hero
    const hero = await page.$eval('h1', el => el.textContent);
    if (!hero.includes('Age of Intelligence')) {
      throw new Error('Hero text mismatch');
    }
    results.steps.push({ step: 2, status: 'pass' });
    
    // Step 3: Click CTA
    await page.click('a[href="/tools/time-and-focus.html"]');
    await page.waitForNavigation();
    results.steps.push({ step: 3, status: 'pass' });
    
    // Step 4: Verify tool loaded
    const toolTitle = await page.$eval('h1', el => el.textContent);
    if (!toolTitle.includes('Time & Focus')) {
      throw new Error('Tool page not loaded');
    }
    results.steps.push({ step: 4, status: 'pass' });
    
    results.status = 'pass';
    
  } catch (error) {
    results.status = 'fail';
    results.errors.push(error.message);
    await page.screenshot({ path: `failure-${Date.now()}.png` });
  }
  
  return results;
}
```

---

## Reporting Format

### Daily Test Report (Sent if failures OR weekly summary)
```
🧪 Daily User Test Results - March 17, 2026

✅ Passed: 5/6 flows
❌ Failed: 1/6 flows

FAILURES:
1. Flow 3: Email Gate
   - Error: Form submission timeout
   - Screenshot: failure-1712345678.png
   - Time: 6:02 AM

TIMING METRICS:
- Homepage load: 1.2s ✓
- Tool load: 2.1s ✓
- Gate page load: 4.5s ⚠️ (slow but passed)

RECOMMENDATION:
Investigate gate form submission timeout.
```

---

## Maintenance

### Quarterly Reviews
- Add new critical flows as site grows
- Remove tests for deprecated features
- Update expected results if designs change
- Review failure patterns for systemic issues

### On Site Redesign
- Update all expected selectors
- Re-capture baseline screenshots
- Run full test suite before deploy

---

## Related Files
- `/openclaw/testing/automated-tests.js` — Test implementation
- `/openclaw/testing/test-results/` — Failure screenshots
- `/openclaw/testing/baselines/` — Visual regression baselines

---

*This workflow ensures core user journeys remain functional without manual daily checking.*
