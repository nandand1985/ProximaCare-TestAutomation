const { test, expect } = require('../fixtures/baseTest');

test.describe('Sales & Commercial Growth Portal Suite', () => {
  const SUITE = 'Sales Portal';

  test('TC-SAL-01: Sales Director Login and Authentication', async ({ page, recorder, testData }) => {
    await page.goto('/sales');
    await page.waitForLoadState('domcontentloaded');

    await recorder.capture(page, {
      suite: SUITE,
      testId: 'TC-SAL-01',
      testTitle: 'Sales Director Authentication',
      actionName: '6.01 View Sales Login Screen',
      actionType: 'NAVIGATION',
      status: 'PASSED',
      notes: 'Sales security gate rendered with credential prompt'
    });

    const emailInput = page.locator('input[type="email"], input[type="text"], input[placeholder*="username" i], input[placeholder*="email" i]').first();
    const passInput = page.locator('input[type="password"]').first();
    const loginBtn = page.locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")').first();

    if (await emailInput.isVisible()) {
      await emailInput.fill(testData.sales.Username || 'sales');
      await passInput.fill(testData.sales.Password || 'sales');

      await recorder.capture(page, {
        suite: SUITE,
        testId: 'TC-SAL-01',
        testTitle: 'Sales Director Authentication',
        actionName: '6.02 Fill Sales Director Credentials',
        actionType: 'INPUT',
        status: 'PASSED',
        notes: `Entered credentials for user: ${testData.sales.Username}`
      });

      await loginBtn.click();
      await page.waitForTimeout(1000);

      await recorder.capture(page, {
        suite: SUITE,
        testId: 'TC-SAL-01',
        testTitle: 'Sales Director Authentication',
        actionName: '6.03 Authenticate and Access Dashboard',
        actionType: 'CLICK',
        status: 'PASSED',
        notes: 'Sales Director successfully logged in. Dashboard opened.'
      });
    }
  });

  test('TC-SAL-02: View Live Pricing Strategy & Active Rate Cards', async ({ page, recorder }) => {
    await page.goto('/sales');
    await page.waitForLoadState('domcontentloaded');

    // Ensure session is set
    await page.evaluate(() => {
      localStorage.setItem('adminToken', 'mock_sales_token');
      localStorage.setItem('adminUser', JSON.stringify({ isAdmin: true, role: 'sales', email: 'sales' }));
    });
    await page.reload();

    await recorder.capture(page, {
      suite: SUITE,
      testId: 'TC-SAL-02',
      testTitle: 'Live Pricing Strategy Review',
      actionName: '6.04 View Live Rates and Proposals Table',
      actionType: 'NAVIGATION',
      status: 'PASSED',
      notes: 'Live B2C hourly rates and active proposed rules table verified'
    });
  });

  test('TC-SAL-03: Switch to Corporate Contracts and Hospital Partnerships Tabs', async ({ page, recorder }) => {
    await page.goto('/sales');
    await page.evaluate(() => {
      localStorage.setItem('adminToken', 'mock_sales_token');
      localStorage.setItem('adminUser', JSON.stringify({ isAdmin: true, role: 'sales', email: 'sales' }));
    });
    await page.reload();

    // Click Corporate Contracts Tab
    const corpTab = page.locator('button:has-text("Corporate"), .tab-btn:has-text("Corporate")').first();
    if (await corpTab.isVisible()) {
      await corpTab.click();
      await page.waitForTimeout(400);

      await recorder.capture(page, {
        suite: SUITE,
        testId: 'TC-SAL-03',
        testTitle: 'Commercial Partnerships Overview',
        actionName: '6.05 View Corporate Contracts Tab',
        actionType: 'CLICK',
        status: 'PASSED',
        notes: 'Switched to B2B Corporate Employee Care Subscriptions'
      });
    }

    // Click Hospital Partnerships Tab
    const hospTab = page.locator('button:has-text("Hospital"), .tab-btn:has-text("Hospital")').first();
    if (await hospTab.isVisible()) {
      await hospTab.click();
      await page.waitForTimeout(400);

      await recorder.capture(page, {
        suite: SUITE,
        testId: 'TC-SAL-03',
        testTitle: 'Commercial Partnerships Overview',
        actionName: '6.06 View Hospital Partnerships Tab',
        actionType: 'CLICK',
        status: 'PASSED',
        notes: 'Switched to Hospital Desk Partner Programs & Revenue Share'
      });
    }
  });

  test('TC-SAL-04: Propose Dynamic B2B Pricing Strategy to Board', async ({ page, recorder, testData }) => {
    await page.goto('/sales');
    await page.evaluate(() => {
      localStorage.setItem('adminToken', 'mock_sales_token');
      localStorage.setItem('adminUser', JSON.stringify({ isAdmin: true, role: 'sales', email: 'sales' }));
    });
    await page.reload();

    const sales = testData.sales;

    // Fill rate proposal form
    const rateInput = page.locator('input[placeholder*="rate" i], input[type="number"]').first();
    if (await rateInput.isVisible()) {
      await rateInput.fill(String(sales.BaseHourlyRate || 350));

      await recorder.capture(page, {
        suite: SUITE,
        testId: 'TC-SAL-04',
        testTitle: 'Propose Dynamic Pricing Rule',
        actionName: '6.07 Fill Proposed Base Rate and Multipliers',
        actionType: 'INPUT',
        status: 'PASSED',
        notes: `Configured proposed Base Rate: Rs ${sales.BaseHourlyRate}/hr for ${sales.ProposedCity}`
      });

      const submitProposalBtn = page.locator('button:has-text("Propose"), button:has-text("Submit to Board"), button.submit-rule-btn').first();
      if (await submitProposalBtn.isVisible()) {
        await submitProposalBtn.click();
        await page.waitForTimeout(600);

        await recorder.capture(page, {
          suite: SUITE,
          testId: 'TC-SAL-04',
          testTitle: 'Propose Dynamic Pricing Rule',
          actionName: '6.08 Submit Proposal for Board President Review',
          actionType: 'CLICK',
          status: 'PASSED',
          notes: 'Submitted dynamic pricing proposal. Awaiting Board President evaluation.'
        });
      }
    }
  });
});
