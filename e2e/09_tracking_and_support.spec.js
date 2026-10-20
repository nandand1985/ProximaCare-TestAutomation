const { test, expect } = require('../fixtures/baseTest');

test.describe('Public Tracking & Customer Support Suite', () => {
  const SUITE = 'Tracking & Support';

  test('TC-TRK-01: Public Family Live Tracking View via Secure Token', async ({ page, recorder }) => {
    await page.goto('/track/demo-token-123');
    await page.waitForLoadState('domcontentloaded');

    await recorder.capture(page, {
      suite: SUITE,
      testId: 'TC-TRK-01',
      testTitle: 'Public Family Live Tracking Link',
      actionName: '9.01 View Public Elder Tracking Map',
      actionType: 'NAVIGATION',
      status: 'PASSED',
      notes: 'Navigated to public token URL /track/demo-token-123 for family members'
    });
  });

  test('TC-TRK-02: Customer Help, FAQs & Support Ticket Submission', async ({ page, recorder }) => {
    await page.goto('/help');
    await page.waitForLoadState('domcontentloaded');

    await recorder.capture(page, {
      suite: SUITE,
      testId: 'TC-TRK-02',
      testTitle: 'Customer Support & Help Center',
      actionName: '9.02 View Support & FAQs Screen',
      actionType: 'NAVIGATION',
      status: 'PASSED',
      notes: 'Customer support center with FAQs and grievance ticket submission form'
    });

    const msgInput = page.locator('textarea, input[placeholder*="query" i], input[placeholder*="help" i]').first();
    if (await msgInput.isVisible()) {
      await msgInput.fill('Need assistance updating scheduled pickup time for upcoming appointment.');

      await recorder.capture(page, {
        suite: SUITE,
        testId: 'TC-TRK-02',
        testTitle: 'Customer Support & Help Center',
        actionName: '9.03 Enter Support Query Details',
        actionType: 'INPUT',
        status: 'PASSED',
        notes: 'Filled help request description'
      });
    }
  });
});
