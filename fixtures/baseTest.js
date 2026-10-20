const { test: base, expect } = require('@playwright/test');
const { globalRecorder } = require('../helpers/screenRecorder');
const { loadTestData } = require('../helpers/dataLoader');
const { generateExcelReport } = require('../helpers/excelReporter');

const test = base.extend({
  testData: async ({}, use) => {
    const data = await loadTestData();
    await use(data);
  },
  recorder: async ({}, use) => {
    await use(globalRecorder);
  }
});

test.afterAll(async () => {
  try {
    await generateExcelReport();
  } catch (err) {
    console.error('⚠️ Could not generate final Excel report in afterAll hook:', err.message);
  }
});

module.exports = { test, expect };
