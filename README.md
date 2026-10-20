# ProximaCare Test Automation Engine

A standalone, end-to-end test automation framework built with **Playwright** and **ExcelJS** for the **ProximaCare Ecosystem**.

---

## 🌟 Key Features

1. **Standalone Repository**: Completely independent from the main application codebase. Can be committed and pushed to its own Git repository.
2. **Dynamic Excel Test Data (`test-data/TestData.xlsx`)**: Modify test parameters (phone numbers, addresses, package hours, pricing rules, credentials) directly in an Excel spreadsheet and re-run tests dynamically without altering code.
3. **Screen Capture on Every Action**: Every user interaction, form input, modal transition, and verification step captures a high-resolution screenshot stored sequentially under `test-results/screenshots/`.
4. **Rich Excel Execution Report**: Generates `test-results/ProximaCare_Execution_Report.xlsx` featuring:
   - **Executive Summary Sheet**: Pass/Fail metrics, pass rates, test duration, and environment info.
   - **Screen Capture Registry Sheet**: Step-by-step audit log with direct clickable hyperlinks (`HYPERLINK(...)`) to open each captured screenshot.
5. **Full Role Coverage**:
   - 👤 **Customer**: Login, OTP verification, Profile Onboarding, Booking, Date-Time Picker, Payments, Orders, Passengers.
   - 🚗 **Agent / Companion**: Login, KYC Onboarding, Quiz Evaluation, Availability Toggle, Requests, Earnings.
   - 📈 **Sales Director**: Dashboard, Live Pricing, B2B Proposals, Contracts & Partnerships.
   - 🏛️ **Board President**: Governance Dashboard, Pricing Proposal Review & Approval Workflow.
   - 🛠️ **System Administrator**: Master Console, Trips Logistics, Agent BGV Verification, Dynamic Configurations.
   - 📍 **Public Tracking & Support**: Public family tracking link, SOS emergency button, Help Center.

---

## 📂 Repository Structure

```
ProximaCare-TestAutomation/
├── test-data/
│   ├── TestData.xlsx                     # Editable Excel Test Input Sheet
│   └── generateDefaultData.js            # Generator utility for default test data
├── helpers/
│   ├── dataLoader.js                     # Dynamic Excel data parser
│   ├── screenRecorder.js                 # Screenshot capture & step recorder
│   └── excelReporter.js                  # Excel test execution report builder
├── fixtures/
│   └── baseTest.js                       # Playwright test fixture
├── e2e/
│   ├── 01_customer_auth.spec.js          # Customer Login, OTP, and Profile Setup
│   ├── 02_customer_booking.spec.js       # Booking Flow, Date-Time Picker, Fare Breakup
│   ├── 03_customer_payment.spec.js       # Razorpay Modal, Coupons, Confirmation
│   ├── 04_customer_orders_profile.spec.js# Orders, Trip Status Tracker, Passengers
│   ├── 05_agent_portal.spec.js           # Companion KYC, Quiz, Requests, Earnings
│   ├── 06_sales_portal.spec.js           # Sales B2B Dynamic Pricing Proposals
│   ├── 07_board_portal.spec.js           # Board President Proposal Approval
│   ├── 08_admin_portal.spec.js           # Admin Console, Trips, Agents, Configurations
│   └── 09_tracking_and_support.spec.js   # Public Tracking & Support Queries
├── test-results/
│   ├── screenshots/                      # High-resolution action screenshots (PNG)
│   └── ProximaCare_Execution_Report.xlsx # Generated Execution Report
├── playwright.config.js                  # Playwright configuration
├── package.json
└── README.md
```

---

## 🚀 Quick Start

### 1. Installation

Ensure Node.js (v18+) is installed, then run:

```bash
npm install
npx playwright install chromium
```

### 2. Configure Target Environment

Open `test-data/TestData.xlsx` (or create a `.env` file) and set the `BaseURL`:
- Local server: `http://localhost:80` (or `http://localhost:3000`)
- Remote server: `http://13.237.36.95`

---

## 📝 Editing Test Data dynamically in Excel

You can open `test-data/TestData.xlsx` in Microsoft Excel, LibreOffice, or Google Sheets:

- **`Config`**: Adjust `BaseURL`, `Headless` (true/false), and `SlowMoMs` delay.
- **`CustomerAuth`**: Change phone numbers, names, addresses, emergency contacts.
- **`Booking`**: Modify pickup/destination locations, package hours, coupon codes.
- **`Agent`**: Update companion phone, email, Aadhaar ID, city.
- **`Sales`**: Change proposed hourly rates, peak multipliers, per-km fees.
- **`Board`**: Set approval decisions and executive remarks.
- **`Admin`**: Update system distance caps and lead-time parameters.

> **Reset to Defaults**: If you ever want to regenerate or reset the Excel sheet:
> ```bash
> npm run testdata:generate
> ```

---

## 🧪 Running the Tests

### Run all tests in Headed mode (watch actions live on screen):
```bash
npm run test:headed
```

### Run all tests in Headless mode (fast background run):
```bash
npm test
```

### Run specific roles / suites:
```bash
# Customer Auth & Onboarding:
npm run test:auth

# Customer Booking & Date-Time Picker:
npm run test:booking

# Customer Payment & Confirmation:
npm run test:payment

# Customer Orders & Passengers:
npm run test:orders

# Companion Agent Portal:
npm run test:agent

# Sales Director Portal:
npm run test:sales

# Board President Governance:
npm run test:board

# System Administrator Console:
npm run test:admin

# Public Tracking & Support:
npm run test:support
```

---

## 📊 Viewing the Test Execution Report & Screenshots

After tests execute, check the `test-results/` directory:

1. **Excel Report**: Open `test-results/ProximaCare_Execution_Report.xlsx`:
   - View pass/fail metrics on the **Executive Summary** tab.
   - Navigate to the **Screen Capture Registry** tab.
   - Click any link in the **Screenshot Link** column (`View Image`) to open that exact screen capture directly.
2. **Screenshots Folder**: Browse `test-results/screenshots/` for full-resolution PNG files named systematically by test ID and action.

---

## 🔗 Pushing to your own Separate GitHub Repository

This folder is already initialized as a Git repository. To connect it to GitHub:

```bash
# 1. Add all files
git add .
git commit -m "feat: initial commit of ProximaCare Playwright automation suite"

# 2. Link your new GitHub repository
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git branch -M main
git push -u origin main
```
