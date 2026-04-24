# E2E Testing Guide - Hotel Management System

## 📁 Folder Structure

```
e2e/
├── playwright.config.ts       # Playwright configuration
├── tests/                     # Test files organized by feature
│   ├── auth.spec.ts          # Authentication flows
│   ├── homepage.spec.ts      # Homepage & hero section
│   ├── search-rooms.spec.ts  # Room search & filters
│   ├── room-detail.spec.ts   # Room details & reviews
│   ├── booking.spec.ts       # Complete booking flow
│   ├── payment.spec.ts       # Payment processing
│   ├── checkout.spec.ts      # Check-in/Check-out flows
│   ├── reviews.spec.ts       # Review submission
│   └── error-cases.spec.ts   # Error handling
├── fixtures/                 # Test data & setup
│   ├── test-data.ts         # Pre-defined test data
│   └── auth.fixture.ts      # Authentication setup
├── pages/                    # Page Object Model
│   ├── base.page.ts         # Base class for all pages
│   ├── home.page.ts         # HomePage
│   ├── login.page.ts        # LoginPage
│   ├── register.page.ts     # RegisterPage
│   ├── rooms.page.ts        # RoomsPage (search results)
│   ├── room-detail.page.ts  # RoomDetailPage
│   ├── booking.page.ts      # BookingPage
│   ├── payment.page.ts      # PaymentPage
│   ├── confirmation.page.ts # ConfirmationPage
│   └── header.page.ts       # Header component
└── utils/                    # Utilities
    ├── api.util.ts          # API helper functions
    ├── date.util.ts         # Date manipulation
    └── helpers.ts           # General helpers
```

## 🚀 Quick Start

### 1. Setup

```bash
# Install dependencies
npm install

# Start backend (in another terminal)
cd ../backend
npm run start:dev

# Start frontend (in another terminal)
npm run dev
```

### 2. Run Tests

```bash
# Run all tests
npm test:e2e

# Run specific test file
npm test:e2e -- tests/auth.spec.ts

# Run with UI mode (visual debugging)
npm test:e2e -- --ui

# Run with headed browser (see browser)
npm test:e2e -- --headed

# Debug single test
npm test:e2e -- --debug tests/auth.spec.ts

# Show test report
npm test:e2e:report
```

## 📖 Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';

test('Homepage loads successfully', async ({ page }) => {
  // Arrange
  const homePage = new HomePage(page);
  
  // Act
  await homePage.goto('/');
  
  // Assert
  expect(await homePage.isVisible('[data-testid="hero-section"]')).toBeTruthy();
});
```

### Using Page Objects

```typescript
import { LoginPage } from '../pages/login.page';
import { testData } from '../fixtures/test-data';

test('User can login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.goto('/(auth)/login');
  await loginPage.login(testData.users.guest.email, testData.users.guest.password);
  
  expect(page.url()).toContain('/');
});
```

### Using Test Data

```typescript
import { testData } from '../fixtures/test-data';
import { registerTestUser } from '../fixtures/auth.fixture';

test('Guest can book room', async ({ page }) => {
  // Create test user
  const user = await registerTestUser('guest');
  
  // Use test data
  const booking = {
    guestName: testData.bookings.standard.guestName,
    guestEmail: testData.bookings.standard.guestEmail,
    guestPhone: testData.bookings.standard.guestPhone,
  };
  
  // ... rest of test
});
```

### Using API Utilities

```typescript
import { apiUtil } from '../utils/api.util';
import { dateUtil } from '../utils/date.util';

test('Check room availability', async () => {
  const availability = await apiUtil.checkAvailability(
    hotelId,
    dateUtil.getTomorrow(),
    dateUtil.addDays(dateUtil.getTomorrow(), 2)
  );
  
  expect(availability.roomTypes.length).toBeGreaterThan(0);
});
```

### Using Helpers

```typescript
import { helpers } from '../utils/helpers';

test('Form validation works', async ({ page }) => {
  await page.fill('input[name="email"]', 'invalid-email');
  await page.click('button[type="submit"]');
  
  const errors = await helpers.getFormErrors(page);
  expect(errors).toContain('Invalid email format');
});
```

## 🔑 Key Features

### BasePage Class

All page objects inherit from `BasePage` which provides:

```typescript
// Navigation
await page.goto('/');
await page.waitForReady();

// Interaction
await page.click(selector);
await page.fill(selector, text);
await page.type(selector, text);
await page.check(selector);
await page.selectOption(selector, value);

// Assertion
await page.isVisible(selector);
await page.elementExists(selector);
const text = await page.getText(selector);

// Waiting
await page.waitForSelector(selector);
await page.waitForSelectorHidden(selector);

// JavaScript
await page.executeScript(code);
await page.getLocalStorage(key);

// Screenshots
await page.screenshot('test-name');
```

### API Utilities

```typescript
// Authentication
const user = await apiUtil.registerUser({ email, password, fullName });
const login = await apiUtil.loginUser(email, password);

// Hotels & Rooms
const hotels = await apiUtil.getHotels();
const roomTypes = await apiUtil.getRoomTypes(hotelId);
const availability = await apiUtil.checkAvailability(hotelId, checkIn, checkOut);

// Bookings
const booking = await apiUtil.createBooking(token, bookingData);
const fetchedBooking = await apiUtil.getBooking(bookingId, token);

// Payments
const payment = await apiUtil.createPayment(token, paymentData);

// Reviews
const reviews = await apiUtil.getReviews(roomTypeId);
const review = await apiUtil.createReview(token, reviewData);
```

### Date Utilities

```typescript
import { dateUtil } from '../utils/date.util';

const today = dateUtil.getToday();              // YYYY-MM-DD
const tomorrow = dateUtil.getTomorrow();
const future = dateUtil.getFutureDate(7);       // 7 days from now
const past = dateUtil.getPastDate(5);           // 5 days ago
const nights = dateUtil.calculateNights(checkIn, checkOut);

// Pre-defined ranges
const { checkInSoon, checkOutSoon } = dateUtil.testDates;
```

### Auth Fixtures

```typescript
import { authFixture } from '../fixtures/auth.fixture';

// Register & get token
const user = await authFixture.registerTestUser('guest');
console.log(user.accessToken);

// Login
const loggedInUser = await authFixture.loginTestUser(email, password);

// Login in browser
const token = await authFixture.loginUserInBrowser(page, email, password);

// Logout
await authFixture.logoutUserInBrowser(page);

// Clear auth
await authFixture.clearAuthData(page);
```

### Test Data

```typescript
import { testData, generateTestEmail } from '../fixtures/test-data';

// Pre-defined data
console.log(testData.users.guest.email);           // guest@test.com
console.log(testData.bookings.standard.guestName); // Nguyen Van A
console.log(testData.coupons.welcome.code);        // WELCOME10

// Generate unique email
const email = generateTestEmail('guest'); // guest-timestamp-random@test.com

// Generate booking code
const code = generateBookingCode(); // BK20240317ABC12
```

## 🏗️ Common Test Patterns

### Pattern 1: Happy Path Flow

```typescript
test('Complete booking flow', async ({ page }) => {
  // Setup
  const homePage = new HomePage(page);
  const roomsPage = new RoomsPage(page);
  const bookingPage = new BookingPage(page);
  
  // Navigate & search
  await homePage.goto('/');
  await homePage.searchRooms('2026-03-05', '2026-03-07', 2, 0);
  
  // Select room
  const firstRoom = await roomsPage.getFirstRoom();
  await roomsPage.selectRoom(firstRoom);
  
  // Complete booking
  await bookingPage.fillGuestInfo('John Doe', 'john@example.com', '0901234567');
  await bookingPage.confirmBooking();
  
  // Verify
  expect(page.url()).toContain('/confirmation');
});
```

### Pattern 2: API-Driven Setup + UI Verification

```typescript
test('User sees booking in list', async ({ page }) => {
  // Setup via API
  const user = await authFixture.registerTestUser('guest');
  const booking = await apiUtil.createBooking(user.accessToken, bookingData);
  
  // Verify in UI
  await authFixture.getAuthenticatedPage(page, user.accessToken);
  const myBookingsPage = new MyBookingsPage(page);
  await myBookingsPage.goto('/bookings');
  
  expect(await myBookingsPage.bookingCodeExists(booking.bookingCode)).toBeTruthy();
});
```

### Pattern 3: Error Case

```typescript
test('Overbooking prevention', async ({ page }) => {
  // Book room as User 1
  const user1 = await authFixture.registerTestUser('guest');
  const booking1 = await apiUtil.createBooking(user1.accessToken, {
    hotelId: hotelId,
    checkIn: '2026-03-05',
    checkOut: '2026-03-07',
    rooms: [{ roomTypeId, quantity: 1, adults: 2, children: 0 }],
    guestName: 'Guest 1',
    guestEmail: 'guest1@test.com',
    guestPhone: '0901111111',
  });
  
  // User 2 tries to book same room - should fail
  const user2 = await authFixture.registerTestUser('guest');
  
  const error = await expect(async () => {
    await apiUtil.createBooking(user2.accessToken, {
      hotelId: hotelId,
      checkIn: '2026-03-05',
      checkOut: '2026-03-07',
      rooms: [{ roomTypeId, quantity: 1, adults: 2, children: 0 }],
      guestName: 'Guest 2',
      guestEmail: 'guest2@test.com',
      guestPhone: '0902222222',
    });
  }).rejects.toThrow('Room no longer available');
});
```

## 📊 Test Report

After running tests:

```bash
npm test:e2e:report
```

Opens `playwright-report/index.html` with:
- ✅ Pass/fail status
- ⏱️ Execution time
- 📷 Screenshots on failure
- 🎥 Videos of failed tests
- 🔍 Trace for debugging

## 🐛 Debugging

### Run Single Test in Debug Mode

```bash
npx playwright test tests/auth.spec.ts --debug
```

This opens Playwright Inspector where you can:
- Step through test
- Evaluate JavaScript
- Inspect DOM
- Take screenshots

### Headed Mode (See Browser)

```bash
npx playwright test --headed
```

### UI Mode (Best for Development)

```bash
npx playwright test --ui
```

Interactive mode to:
- Watch tests run
- Pause at specific steps
- Re-run tests
- See detailed logs

## ⚙️ Configuration

### playwright.config.ts

Key settings:

```typescript
// Base URL for all tests
baseURL: 'http://localhost:3000'

// Test timeout
timeout: 30_000,
expect: { timeout: 5_000 }

// Screenshots & videos
screenshot: 'only-on-failure'
video: 'retain-on-failure'

// Retries (for CI only)
retries: process.env.CI ? 2 : 0

// Parallel execution
fullyParallel: false  // Run tests sequentially
workers: 1            // Single worker
```

### package.json Scripts

Add these to your `package.json`:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:report": "playwright show-report"
  }
}
```

## 📝 Best Practices

1. **Use Page Objects**: Never locate elements in tests, always use page objects
2. **Use Test Data**: Don't hardcode values, use `testData` fixture
3. **API Setup**: For complex setup, use API utilities instead of UI
4. **Meaningful Names**: Test names should describe what's being tested
5. **Assertions**: Prefer explicit assertions over implicit waits
6. **No Sleep**: Use `waitForSelector` instead of `page.waitForTimeout()`
7. **Cleanup**: Ensure test data is cleaned up after tests
8. **Parallel**: Keep tests independent, no dependencies between tests

## 🚨 Common Issues

### "Target page, context or browser has been closed"
- Backend server not running
- Frontend server crashed
- Test killed the browser early

**Fix**: Ensure both servers are running before tests

### "Timeout waiting for selector"
- Selector doesn't exist or is wrong
- Page hasn't loaded yet
- Element hidden by modal/overlay

**Fix**: Check selector in DevTools, increase timeout, wait for conditions

### "Token not found in localStorage"
- Login failed
- Token not being set
- Different key name used

**Fix**: Verify backend login endpoint, check localStorage key names

### "Overbooking test fails randomly"
- Race condition in DB
- Transaction isolation issue

**Fix**: Add small delay, verify DB indexes, check transaction locks

## 📚 References

- [Playwright Documentation](https://playwright.dev)
- [Test Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- Backend API Spec: `../docs/api-spec.md`
- Database Schema: `../docs/database-design.md`

---

**Status**: ✅ E2E Testing Infrastructure Ready
**Next**: Implement first test (Authentication)
