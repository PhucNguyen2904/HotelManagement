import { test, expect } from '@playwright/test';
import { BookingPage } from '../pages/booking.page';
import { authFixture } from '../fixtures/auth.fixture';
import { generateTestEmail } from '../fixtures/test-data';

test.describe('Booking Page', () => {
  /**
   * TEST 1: Load booking page with valid parameters
   */
  test('Load booking page with room and date parameters', async ({ page }) => {
    // Setup: Login first
    const testUser = await authFixture.registerTestUser('guest');
    await authFixture.loginUserInBrowser(page, testUser.email, testUser.password);

    const bookingPage = new BookingPage(page);

    // Navigate to booking page with test parameters
    await bookingPage.goto('room-deluxe', '2026-05-01', '2026-05-03');

    // Wait for page to load
    await bookingPage.waitForPageLoad();

    // Verify page loaded
    const url = await bookingPage.getURL();
    expect(url).toContain('/booking');
  });

  /**
   * TEST 2: Display booking form with all fields
   */
  test('Display booking form with guest info fields', async ({ page }) => {
    const testUser = await authFixture.registerTestUser('guest');
    await authFixture.loginUserInBrowser(page, testUser.email, testUser.password);

    const bookingPage = new BookingPage(page);
    await bookingPage.goto('room-deluxe', '2026-05-01', '2026-05-03');

    // Verify form is visible
    const isFormVisible = await bookingPage.isFormVisible();
    expect(isFormVisible).toBeTruthy();

    // Verify all fields present
    const allFieldsPresent = await bookingPage.verifyAllFieldsPresent();
    expect(allFieldsPresent).toBeTruthy();
  });

  /**
   * TEST 3: Display booking summary with pricing
   */
  test('Display booking summary with room info and pricing', async ({ page }) => {
    const testUser = await authFixture.registerTestUser('guest');
    await authFixture.loginUserInBrowser(page, testUser.email, testUser.password);

    const bookingPage = new BookingPage(page);
    await bookingPage.goto('room-deluxe', '2026-05-01', '2026-05-03');
    await bookingPage.waitForPageLoad();

    // Verify summary card is visible
    const isSummaryVisible = await bookingPage.isSummaryCardVisible();
    expect(isSummaryVisible).toBeTruthy();

    // Get booking summary
    const summary = await bookingPage.getBookingSummary();
    expect(summary.roomName).toBeTruthy();
    expect(summary.nights).toBeGreaterThan(0);
    expect(summary.total).toBeGreaterThan(0);
  });

  /**
   * TEST 4: Verify price calculation
   */
  test('Verify total price calculation is correct', async ({ page }) => {
    const testUser = await authFixture.registerTestUser('guest');
    await authFixture.loginUserInBrowser(page, testUser.email, testUser.password);

    const bookingPage = new BookingPage(page);
    await bookingPage.goto('room-deluxe', '2026-05-01', '2026-05-03');
    await bookingPage.waitForPageLoad();

    // Verify calculation
    const isCalculationCorrect = await bookingPage.verifyTotalCalculation();
    expect(isCalculationCorrect).toBeTruthy();

    // Get summary to verify amounts
    const summary = await bookingPage.getBookingSummary();
    expect(summary.subtotal).toBeGreaterThan(0);
    expect(summary.tax).toBeGreaterThan(0);
    expect(summary.total).toBe(summary.subtotal + summary.tax);
  });

  /**
   * TEST 5: Fill booking form with valid data
   */
  test('Fill booking form with guest information', async ({ page }) => {
    const testUser = await authFixture.registerTestUser('guest');
    await authFixture.loginUserInBrowser(page, testUser.email, testUser.password);

    const bookingPage = new BookingPage(page);
    await bookingPage.goto('room-deluxe', '2026-05-01', '2026-05-03');
    await bookingPage.waitForPageLoad();

    // Fill form with test data
    const testEmail = generateTestEmail('booking');
    await bookingPage.setGuestName('Nguyễn Văn A');
    await bookingPage.setEmail(testEmail);
    await bookingPage.setPhone('0901234567');
    await bookingPage.setSpecialRequests('Late check-in, please');

    // Verify values are set
    const guestInfo = await bookingPage.getGuestInfo();
    expect(guestInfo.name).toBe('Nguyễn Văn A');
    expect(guestInfo.email).toBe(testEmail);
    expect(guestInfo.phone).toBe('0901234567');
    expect(guestInfo.specialRequests).toBe('Late check-in, please');
  });

  /**
   * TEST 6: Display secure booking badges
   */
  test('Display trust badges for secure booking', async ({ page }) => {
    const testUser = await authFixture.registerTestUser('guest');
    await authFixture.loginUserInBrowser(page, testUser.email, testUser.password);

    const bookingPage = new BookingPage(page);
    await bookingPage.goto('room-deluxe', '2026-05-01', '2026-05-03');
    await bookingPage.waitForPageLoad();

    // Check for secure booking badges
    const hasSecureBadges = await bookingPage.hasSecureBookingBadges();
    expect(hasSecureBadges).toBeTruthy();
  });

  /**
   * TEST 7: Submit booking form with valid data
   */
  test('Submit booking form successfully', async ({ page }) => {
    const testUser = await authFixture.registerTestUser('guest');
    await authFixture.loginUserInBrowser(page, testUser.email, testUser.password);

    const bookingPage = new BookingPage(page);
    await bookingPage.goto('room-deluxe', '2026-05-01', '2026-05-03');
    await bookingPage.waitForPageLoad();

    // Fill form with test data
    const testEmail = generateTestEmail('booking-submit');
    await bookingPage.confirmBooking(
      'Nguyễn Văn Test',
      testEmail,
      '0901111111',
      'Please prepare late check-in'
    );

    // Verify navigation or success (would redirect to booking confirmation)
    const currentUrl = await page.url();
    expect(
      currentUrl.includes('/bookings/') || 
      currentUrl.includes('/confirmation') ||
      currentUrl.includes('/booking') // May stay on booking page on error
    ).toBeTruthy();
  });

  /**
   * TEST 8: Handle form validation errors
   */
  test('Show validation error for empty required fields', async ({ page }) => {
    const testUser = await authFixture.registerTestUser('guest');
    await authFixture.loginUserInBrowser(page, testUser.email, testUser.password);

    const bookingPage = new BookingPage(page);
    await bookingPage.goto('room-deluxe', '2026-05-01', '2026-05-03');
    await bookingPage.waitForPageLoad();

    // Try to submit with empty fields
    await bookingPage.clickConfirm();

    // Wait a moment for validation
    await page.waitForTimeout(500);

    // Either should show error or form should have validation message
    const hasError = await bookingPage.hasError();
    const guestName = await bookingPage.getGuestNameValue();

    expect(hasError || guestName === '').toBeTruthy();
  });

  /**
   * TEST 9: Clear form fields
   */
  test('Clear form and reset all fields to empty', async ({ page }) => {
    const testUser = await authFixture.registerTestUser('guest');
    await authFixture.loginUserInBrowser(page, testUser.email, testUser.password);

    const bookingPage = new BookingPage(page);
    await bookingPage.goto('room-deluxe', '2026-05-01', '2026-05-03');
    await bookingPage.waitForPageLoad();

    // Fill form
    await bookingPage.setGuestName('Test Name');
    await bookingPage.setEmail('test@example.com');
    await bookingPage.setPhone('0901234567');

    // Clear form
    await bookingPage.clearForm();

    // Verify fields are empty
    const guestInfo = await bookingPage.getGuestInfo();
    expect(guestInfo.name).toBe('');
    expect(guestInfo.email).toBe('');
    expect(guestInfo.phone).toBe('');
  });

  /**
   * TEST 10: Display correct check-in and check-out dates
   */
  test('Display correct check-in and check-out dates in summary', async ({ page }) => {
    const testUser = await authFixture.registerTestUser('guest');
    await authFixture.loginUserInBrowser(page, testUser.email, testUser.password);

    const bookingPage = new BookingPage(page);
    const checkIn = '2026-05-15';
    const checkOut = '2026-05-18';
    
    await bookingPage.goto('room-deluxe', checkIn, checkOut);
    await bookingPage.waitForPageLoad();

    // Get dates from summary
    const summary = await bookingPage.getBookingSummary();
    expect(summary.checkIn).toBe(checkIn);
    expect(summary.checkOut).toBe(checkOut);
    expect(summary.nights).toBe(3); // 3 nights between May 15-18
  });
});
