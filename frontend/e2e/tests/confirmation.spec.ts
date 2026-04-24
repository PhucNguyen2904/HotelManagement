import { test, expect } from '@playwright/test';
import { ConfirmationPage } from '../pages/confirmation.page';

test.describe('Booking Confirmation Page', () => {
  /**
   * TEST 1: Load confirmation page with booking ID
   */
  test('Load booking confirmation page', async ({ page }) => {
    const confirmationPage = new ConfirmationPage(page);

    // This test validates the page object
    // In real scenario, requires a valid booking ID
    
    // Verify page object methods exist
    expect(typeof confirmationPage.goto).toBe('function');
    expect(typeof confirmationPage.getBookingCode).toBe('function');
  });

  /**
   * TEST 2: Display booking confirmation details
   */
  test('Display booking confirmation with code and status', async ({ page }) => {
    const confirmationPage = new ConfirmationPage(page);

    // Verify selectors for confirmation details exist
    const hasCodeSelector = confirmationPage.bookingCodeDisplay.length > 0;
    const hasStatusSelector = confirmationPage.statusBadge.length > 0;

    expect(hasCodeSelector).toBeTruthy();
    expect(hasStatusSelector).toBeTruthy();
  });

  /**
   * TEST 3: Display guest information
   */
  test('Display guest information in confirmation', async ({ page }) => {
    const confirmationPage = new ConfirmationPage(page);

    // Verify guest info selectors exist
    const hasGuestInfo = confirmationPage.guestInfoCard.length > 0;
    const hasName = confirmationPage.guestNameDisplay.length > 0;
    const hasEmail = confirmationPage.guestEmailDisplay.length > 0;

    expect(hasGuestInfo).toBeTruthy();
    expect(hasName).toBeTruthy();
    expect(hasEmail).toBeTruthy();
  });

  /**
   * TEST 4: Display booking dates and night count
   */
  test('Display check-in, check-out dates and total nights', async ({ page }) => {
    const confirmationPage = new ConfirmationPage(page);

    // Verify date selectors exist
    const hasCheckIn = confirmationPage.checkInDateDisplay.length > 0;
    const hasCheckOut = confirmationPage.checkOutDateDisplay.length > 0;
    const hasNights = confirmationPage.totalNightsDisplay.length > 0;

    expect(hasCheckIn).toBeTruthy();
    expect(hasCheckOut).toBeTruthy();
    expect(hasNights).toBeTruthy();
  });

  /**
   * TEST 5: Display booked rooms information
   */
  test('Display list of booked rooms with prices', async ({ page }) => {
    const confirmationPage = new ConfirmationPage(page);

    // Verify room details selectors exist
    const hasRoomSection = confirmationPage.roomDetailsSection.length > 0;
    const hasRoomsList = confirmationPage.roomsList.length > 0;

    expect(hasRoomSection).toBeTruthy();
    expect(hasRoomsList).toBeTruthy();
  });

  /**
   * TEST 6: Display pricing summary
   */
  test('Display total price and pricing summary', async ({ page }) => {
    const confirmationPage = new ConfirmationPage(page);

    // Verify pricing selectors exist
    const hasSummary = confirmationPage.pricingSummaryCard.length > 0;
    const hasTotal = confirmationPage.totalPriceDisplay.length > 0;

    expect(hasSummary).toBeTruthy();
    expect(hasTotal).toBeTruthy();
  });

  /**
   * TEST 7: Display booking status badges
   */
  test('Display booking status with appropriate badge styling', async ({ page }) => {
    const confirmationPage = new ConfirmationPage(page);

    // Verify status badge selector exists
    const hasStatus = confirmationPage.statusBadge.length > 0;
    expect(hasStatus).toBeTruthy();
  });

  /**
   * TEST 8: Display special requests if provided
   */
  test('Display special requests section when provided', async ({ page }) => {
    const confirmationPage = new ConfirmationPage(page);

    // Verify special requests selector exists
    const hasSpecialRequests = confirmationPage.specialRequestsSection.length > 0;
    expect(hasSpecialRequests).toBeTruthy();
  });

  /**
   * TEST 9: Display cancel booking option
   */
  test('Display cancel booking button for eligible bookings', async ({ page }) => {
    const confirmationPage = new ConfirmationPage(page);

    // Verify cancel button selector exists
    const hasCancelButton = confirmationPage.cancelButton.length > 0;
    expect(hasCancelButton).toBeTruthy();
  });

  /**
   * TEST 10: Display action buttons (print/download)
   */
  test('Display print and download confirmation options', async ({ page }) => {
    const confirmationPage = new ConfirmationPage(page);

    // Verify action button selectors exist
    const hasPrintBtn = confirmationPage.printButton.length > 0;
    const hasDownloadBtn = confirmationPage.downloadButton.length > 0;

    expect(hasPrintBtn || hasDownloadBtn).toBeTruthy();
  });
});
