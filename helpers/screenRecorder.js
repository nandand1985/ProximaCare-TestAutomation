const path = require('path');
const fs = require('fs');

class ScreenRecorder {
  constructor() {
    this.steps = [];
    this.stepCounter = 0;
    this.lastActionTimestamp = Date.now();
    this.screenshotsDir = path.resolve(__dirname, '../test-results/screenshots');
    
    if (!fs.existsSync(this.screenshotsDir)) {
      fs.mkdirSync(this.screenshotsDir, { recursive: true });
    }
  }

  slugify(text) {
    return String(text || 'action')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .substring(0, 40);
  }

  async capture(page, {
    suite = 'General',
    testId = 'TC-01',
    testTitle = 'Test Case',
    actionName = 'Action',
    actionType = 'CLICK',
    status = 'PASSED',
    notes = ''
  } = {}) {
    this.stepCounter += 1;
    const now = Date.now();
    const duration = now - this.lastActionTimestamp;
    this.lastActionTimestamp = now;

    const safeTestId = String(testId).replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeAction = this.slugify(actionName);
    const stepNumStr = String(this.stepCounter).padStart(3, '0');
    const fileName = `${safeTestId}_s${stepNumStr}_${safeAction}.png`;
    const targetFilePath = path.join(this.screenshotsDir, fileName);

    try {
      // Allow DOM animations to stabilize before capturing
      await page.waitForTimeout(350);
      await page.screenshot({ path: targetFilePath, fullPage: false });
    } catch (err) {
      console.warn(`⚠️ Warning: Failed to capture full-page screenshot for ${fileName}:`, err.message);
      try {
        await page.screenshot({ path: targetFilePath });
      } catch (innerErr) {
        console.error(`🔴 Error: Screenshot completely failed for ${fileName}:`, innerErr.message);
      }
    }

    const timestampStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const stepRecord = {
      index: this.stepCounter,
      suite,
      testId,
      testTitle,
      actionName,
      actionType,
      status,
      timestamp: timestampStr,
      durationMs: duration,
      screenshotFileName: fileName,
      screenshotRelativePath: `screenshots/${fileName}`,
      notes: notes || (status === 'PASSED' ? 'Action completed successfully' : 'Action failed or encountered warning')
    };

    this.steps.push(stepRecord);
    console.log(`📸 [Capture #${stepNumStr}] [${status}] ${testId}: ${actionName} -> ${fileName}`);
    return stepRecord;
  }

  getSteps() {
    return this.steps;
  }

  reset() {
    this.steps = [];
    this.stepCounter = 0;
    this.lastActionTimestamp = Date.now();
  }
}

// Global singleton instance so all test files log into the shared report
const globalRecorder = new ScreenRecorder();

module.exports = {
  ScreenRecorder,
  globalRecorder
};
