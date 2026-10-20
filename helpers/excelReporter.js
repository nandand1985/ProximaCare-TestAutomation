const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');
const { globalRecorder } = require('./screenRecorder');

async function generateExcelReport(outputPath = null) {
  const targetDir = path.resolve(__dirname, '../test-results');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const reportFilePath = outputPath || path.join(targetDir, 'ProximaCare_Execution_Report.xlsx');
  const steps = globalRecorder.getSteps();

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'ProximaCare Test Automation Engine';
  workbook.created = new Date();

  // Metrics Calculations
  const totalActions = steps.length;
  const passedActions = steps.filter(s => s.status === 'PASSED').length;
  const failedActions = steps.filter(s => s.status === 'FAILED').length;
  const uniqueTestIds = new Set(steps.map(s => s.testId)).size;
  const passRate = totalActions > 0 ? ((passedActions / totalActions) * 100).toFixed(1) : '100.0';
  const totalDurationMs = steps.reduce((acc, s) => acc + (s.durationMs || 0), 0);
  const totalDurationSec = (totalDurationMs / 1000).toFixed(1);

  // ----------------------------------------------------
  // SHEET 1: EXECUTIVE SUMMARY
  // ----------------------------------------------------
  const summarySheet = workbook.addWorksheet('Executive Summary');
  summarySheet.views = [{ showGridLines: true }];

  summarySheet.columns = [
    { width: 5 },
    { width: 28 },
    { width: 32 },
    { width: 25 },
    { width: 25 }
  ];

  // Header Banner
  summarySheet.mergeCells('B2:E2');
  const titleCell = summarySheet.getCell('B2');
  titleCell.value = 'PROXIMACARE TEST AUTOMATION - EXECUTION REPORT';
  titleCell.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E1B4B' } }; // Deep Indigo
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  summarySheet.getRow(2).height = 36;

  // Metadata block
  const metaRows = [
    ['Execution Timestamp', new Date().toISOString().replace('T', ' ').substring(0, 19)],
    ['Report Output', 'ProximaCare_Execution_Report.xlsx'],
    ['Total Screen Captures', totalActions],
    ['Total Unique Test Cases', uniqueTestIds],
    ['Total Execution Duration', `${totalDurationSec} seconds`],
    ['Overall Pass Rate', `${passRate}%`],
    ['Passed Actions', passedActions],
    ['Failed Actions', failedActions]
  ];

  let currRow = 4;
  metaRows.forEach(([label, val]) => {
    summarySheet.getCell(`B${currRow}`).value = label;
    summarySheet.getCell(`B${currRow}`).font = { bold: true, color: { argb: 'FF374151' } };
    summarySheet.getCell(`B${currRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } };

    const valCell = summarySheet.getCell(`C${currRow}`);
    valCell.value = val;
    valCell.font = { bold: true };

    if (label === 'Passed Actions') {
      valCell.font = { bold: true, color: { argb: 'FF059669' } }; // Green
    } else if (label === 'Failed Actions' && val > 0) {
      valCell.font = { bold: true, color: { argb: 'FFDC2626' } }; // Red
    } else if (label === 'Overall Pass Rate') {
      valCell.font = { bold: true, color: { argb: 'FF4338CA' } };
    }

    summarySheet.getRow(currRow).height = 22;
    currRow++;
  });

  // ----------------------------------------------------
  // SHEET 2: SCREEN CAPTURE REGISTRY
  // ----------------------------------------------------
  const registrySheet = workbook.addWorksheet('Screen Capture Registry');
  registrySheet.views = [{ showGridLines: true }];

  registrySheet.columns = [
    { header: '#', key: 'index', width: 7 },
    { header: 'Test Suite', key: 'suite', width: 22 },
    { header: 'Test ID', key: 'testId', width: 14 },
    { header: 'Test Title', key: 'testTitle', width: 30 },
    { header: 'Screen / Action Name', key: 'actionName', width: 35 },
    { header: 'Action Type', key: 'actionType', width: 16 },
    { header: 'Status', key: 'status', width: 14 },
    { header: 'Timestamp', key: 'timestamp', width: 20 },
    { header: 'Duration (ms)', key: 'durationMs', width: 14 },
    { header: 'Screenshot File', key: 'screenshotFileName', width: 38 },
    { header: 'Screenshot Link', key: 'screenshotLink', width: 20 },
    { header: 'Notes / Error Details', key: 'notes', width: 40 }
  ];

  // Format Header Row
  const regHeader = registrySheet.getRow(1);
  regHeader.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 };
  regHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F46E5' } };
  regHeader.alignment = { horizontal: 'center', vertical: 'middle' };
  regHeader.height = 26;

  // Add Data Rows
  steps.forEach((step, idx) => {
    const rowNum = idx + 2;
    const row = registrySheet.addRow({
      index: step.index,
      suite: step.suite,
      testId: step.testId,
      testTitle: step.testTitle,
      actionName: step.actionName,
      actionType: step.actionType,
      status: step.status,
      timestamp: step.timestamp,
      durationMs: step.durationMs,
      screenshotFileName: step.screenshotFileName,
      screenshotLink: '',
      notes: step.notes
    });

    row.height = 22;
    row.alignment = { vertical: 'middle' };

    // Format Status Cell
    const statusCell = row.getCell('status');
    statusCell.alignment = { horizontal: 'center', vertical: 'middle' };
    if (step.status === 'PASSED') {
      statusCell.font = { bold: true, color: { argb: 'FF065F46' } };
      statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1FAE5' } };
    } else {
      statusCell.font = { bold: true, color: { argb: 'FF991B1B' } };
      statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
    }

    // Set Clickable Hyperlink to Screenshot
    const linkCell = row.getCell('screenshotLink');
    linkCell.value = {
      formula: `HYPERLINK("${step.screenshotRelativePath}", "🖼️ View Image")`,
      result: '🖼️ View Image'
    };
    linkCell.font = { color: { argb: 'FF2563EB' }, underline: true, bold: true };
    linkCell.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  await workbook.xlsx.writeFile(reportFilePath);
  console.log(`\n=============================================================`);
  console.log(`📊 EXECUTION REPORT GENERATED: ${reportFilePath}`);
  console.log(`📸 Total Screenshots Captured: ${totalActions}`);
  console.log(`✅ Passed: ${passedActions} | ❌ Failed: ${failedActions} | Rate: ${passRate}%`);
  console.log(`=============================================================\n`);
  return reportFilePath;
}

module.exports = { generateExcelReport };
