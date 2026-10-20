const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');
const { generateDefaultTestData } = require('../test-data/generateDefaultData');

let cachedTestData = null;

async function loadTestData(forceReload = false) {
  if (cachedTestData && !forceReload) {
    return cachedTestData;
  }

  const filePath = path.resolve(__dirname, '../test-data/TestData.xlsx');
  if (!fs.existsSync(filePath)) {
    console.log('⚠️ TestData.xlsx not found. Auto-generating default test data...');
    await generateDefaultTestData();
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const testData = {
    config: {},
    customerAuth: {},
    booking: {},
    agent: {},
    sales: {},
    board: {},
    admin: {}
  };

  // Helper to parse key-value sheet like Config
  const configSheet = workbook.getWorksheet('Config');
  if (configSheet) {
    configSheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const param = row.getCell(1).value ? String(row.getCell(1).value).trim() : null;
        let val = row.getCell(2).value;
        if (param) {
          if (typeof val === 'object' && val !== null && val.text) val = val.text;
          testData.config[param] = val;
        }
      }
    });
  }

  // Helper to parse single-row module sheets
  function parseRowSheet(sheetName, targetKey) {
    const sheet = workbook.getWorksheet(sheetName);
    if (!sheet) return;

    const headers = [];
    sheet.getRow(1).eachCell((cell, colNumber) => {
      headers[colNumber] = cell.value ? String(cell.value).trim() : `col_${colNumber}`;
    });

    const dataRow = sheet.getRow(2);
    if (dataRow) {
      headers.forEach((header, colNumber) => {
        if (header) {
          let cellVal = dataRow.getCell(colNumber).value;
          if (typeof cellVal === 'object' && cellVal !== null && cellVal.text) {
            cellVal = cellVal.text;
          }
          testData[targetKey][header] = cellVal !== undefined ? cellVal : '';
        }
      });
    }
  }

  parseRowSheet('CustomerAuth', 'customerAuth');
  parseRowSheet('Booking', 'booking');
  parseRowSheet('Agent', 'agent');
  parseRowSheet('Sales', 'sales');
  parseRowSheet('Board', 'board');
  parseRowSheet('Admin', 'admin');

  cachedTestData = testData;
  return testData;
}

module.exports = { loadTestData };
