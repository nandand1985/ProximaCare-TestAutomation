const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function generateDefaultTestData() {
  const targetDir = path.resolve(__dirname);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const filePath = path.join(targetDir, 'TestData.xlsx');
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'ProximaCare QA Automation';
  workbook.created = new Date();

  // Helper for styling sheet headers
  function formatHeaderRow(sheet, columns) {
    sheet.columns = columns.map(col => ({
      header: col.header,
      key: col.key,
      width: col.width || 22
    }));

    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4F46E5' } // Indigo
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 24;
  }

  // 1. Config Sheet
  const configSheet = workbook.addWorksheet('Config');
  formatHeaderRow(configSheet, [
    { header: 'Parameter', key: 'parameter', width: 25 },
    { header: 'Value', key: 'value', width: 35 },
    { header: 'Description', key: 'description', width: 45 }
  ]);
  configSheet.addRows([
    { parameter: 'BaseURL', value: 'http://localhost:80', description: 'Application URL (or http://13.237.36.95)' },
    { parameter: 'Headless', value: 'false', description: 'Run browser in background (true/false)' },
    { parameter: 'SlowMoMs', value: '250', description: 'Delay between actions in milliseconds for visibility' },
    { parameter: 'TimeoutMs', value: '30000', description: 'Default action/navigation timeout' },
    { parameter: 'Browser', value: 'chromium', description: 'Browser engine (chromium, firefox, webkit)' }
  ]);

  // 2. CustomerAuth Sheet
  const authSheet = workbook.addWorksheet('CustomerAuth');
  formatHeaderRow(authSheet, [
    { header: 'Phone', key: 'phone', width: 16 },
    { header: 'InvalidPhone', key: 'invalidPhone', width: 16 },
    { header: 'FullName', key: 'fullName', width: 22 },
    { header: 'Age', key: 'age', width: 10 },
    { header: 'Gender', key: 'gender', width: 12 },
    { header: 'Address', key: 'address', width: 30 },
    { header: 'Pincode', key: 'pincode', width: 12 },
    { header: 'City', key: 'city', width: 16 },
    { header: 'EmergencyName', key: 'emergencyName', width: 20 },
    { header: 'EmergencyPhone', key: 'emergencyPhone', width: 18 }
  ]);
  authSheet.addRow({
    phone: '9999912345',
    invalidPhone: '12345',
    fullName: 'Aravind Sharma',
    age: 68,
    gender: 'Male',
    address: '42 Indiranagar 100ft Road',
    pincode: '560038',
    city: 'Bangalore',
    emergencyName: 'Sunita Sharma',
    emergencyPhone: '9876543210'
  });

  // 3. Booking Sheet
  const bookingSheet = workbook.addWorksheet('Booking');
  formatHeaderRow(bookingSheet, [
    { header: 'PickupAddress', key: 'pickupAddress', width: 28 },
    { header: 'DestinationAddress', key: 'destAddress', width: 32 },
    { header: 'CompanionType', key: 'companionType', width: 20 },
    { header: 'PackageHours', key: 'packageHours', width: 15 },
    { header: 'TransportNeeded', key: 'transportNeeded', width: 18 },
    { header: 'TransportType', key: 'transportType', width: 16 },
    { header: 'CouponCode', key: 'couponCode', width: 16 }
  ]);
  bookingSheet.addRow({
    pickupAddress: 'Whitefield, Bangalore',
    destAddress: 'Columbia Asia Hospital, Whitefield',
    companionType: 'Hospital Visit',
    packageHours: 4,
    transportNeeded: 'true',
    transportType: 'Normal cab',
    couponCode: 'WELCOME50'
  });

  // 4. Agent Sheet
  const agentSheet = workbook.addWorksheet('Agent');
  formatHeaderRow(agentSheet, [
    { header: 'FullName', key: 'fullName', width: 20 },
    { header: 'Phone', key: 'phone', width: 16 },
    { header: 'Email', key: 'email', width: 28 },
    { header: 'ServiceType', key: 'serviceType', width: 18 },
    { header: 'City', key: 'city', width: 16 },
    { header: 'Pincode', key: 'pincode', width: 12 },
    { header: 'GovtId', key: 'govtId', width: 22 },
    { header: 'VehicleNumber', key: 'vehicleNumber', width: 18 }
  ]);
  agentSheet.addRow({
    fullName: 'Priya Raman',
    phone: '9876543201',
    email: 'priya.raman@proximacare.com',
    serviceType: 'hospital_visit',
    city: 'Bangalore',
    pincode: '560001',
    govtId: 'AADHAAR9876543210',
    vehicleNumber: 'KA 01 TR 1234'
  });

  // 5. Sales Sheet
  const salesSheet = workbook.addWorksheet('Sales');
  formatHeaderRow(salesSheet, [
    { header: 'Username', key: 'username', width: 14 },
    { header: 'Password', key: 'password', width: 14 },
    { header: 'ProposedCity', key: 'proposedCity', width: 16 },
    { header: 'BaseHourlyRate', key: 'baseHourlyRate', width: 16 },
    { header: 'MorningPeakMultiplier', key: 'morningPeak', width: 22 },
    { header: 'EveningPeakMultiplier', key: 'eveningPeak', width: 22 },
    { header: 'PerKmRate', key: 'perKmRate', width: 14 },
    { header: 'VehicleMarkup', key: 'vehicleMarkup', width: 16 }
  ]);
  salesSheet.addRow({
    username: 'sales',
    password: 'sales',
    proposedCity: 'Bangalore',
    baseHourlyRate: 350,
    morningPeak: 1.5,
    eveningPeak: 1.5,
    perKmRate: 18,
    vehicleMarkup: 250
  });

  // 6. Board Sheet
  const boardSheet = workbook.addWorksheet('Board');
  formatHeaderRow(boardSheet, [
    { header: 'Username', key: 'username', width: 14 },
    { header: 'Password', key: 'password', width: 14 },
    { header: 'ApprovalDecision', key: 'decision', width: 18 },
    { header: 'BoardRemarks', key: 'remarks', width: 35 }
  ]);
  boardSheet.addRow({
    username: 'board',
    password: 'board',
    decision: 'APPROVED',
    remarks: 'Approved dynamically via QA automation run'
  });

  // 7. Admin Sheet
  const adminSheet = workbook.addWorksheet('Admin');
  formatHeaderRow(adminSheet, [
    { header: 'Username', key: 'username', width: 14 },
    { header: 'Password', key: 'password', width: 14 },
    { header: 'MaxDistanceCapKm', key: 'distanceCap', width: 20 },
    { header: 'UrgentLeadTimeHours', key: 'urgentLead', width: 22 },
    { header: 'PlannedLeadTimeHours', key: 'plannedLead', width: 22 }
  ]);
  adminSheet.addRow({
    username: 'admin',
    password: 'admin',
    distanceCap: 25,
    urgentLead: 1.5,
    plannedLead: 1.0
  });

  await workbook.xlsx.writeFile(filePath);
  console.log(`✓ TestData.xlsx successfully generated at: ${filePath}`);
}

if (require.main === module) {
  generateDefaultTestData().catch(err => {
    console.error('Failed to generate TestData.xlsx:', err);
    process.exit(1);
  });
}

module.exports = { generateDefaultTestData };
