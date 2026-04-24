import { test, expect } from '@playwright/test';
import { RoomDetailPage } from '../pages/room-detail.page';
import { RoomsPage } from '../pages/rooms.page';

test.describe('Room Detail Page', () => {
  /**
   * TEST 1: Load room detail page and display information
   */
  test('Load room detail page and display room information', async ({ page }) => {
    const roomDetailPage = new RoomDetailPage(page);

    // Use a known room slug (from the Nganha hotel)
    await roomDetailPage.goto('phong-deluxe');

    // Wait for room to load
    await roomDetailPage.waitForRoomLoad();

    // Verify page loaded
    const url = await roomDetailPage.getURL();
    expect(url).toContain('/rooms/');

    // Verify room name is displayed
    const roomName = await roomDetailPage.getRoomName();
    expect(roomName.length).toBeGreaterThan(0);
  });

  /**
   * TEST 2: Display room price
   */
  test('Display room price per night', async ({ page }) => {
    const roomDetailPage = new RoomDetailPage(page);

    // Navigate to room detail
    await roomDetailPage.goto('phong-deluxe');
    await roomDetailPage.waitForRoomLoad();

    // Get room price
    const price = await roomDetailPage.getRoomPrice();
    expect(price).toBeGreaterThan(0);
  });

  /**
   * TEST 3: Display room amenities
   */
  test('Display room amenities list', async ({ page }) => {
    const roomDetailPage = new RoomDetailPage(page);

    // Navigate to room detail
    await roomDetailPage.goto('phong-deluxe');
    await roomDetailPage.waitForRoomLoad();

    // Check if amenities section exists
    const hasAmenitiesSection = await roomDetailPage.hasAmenitiesSection();

    if (hasAmenitiesSection) {
      // Get amenities
      const amenities = await roomDetailPage.getAmenities();
      expect(amenities.length).toBeGreaterThan(0);

      // Verify amenities are strings
      expect(typeof amenities[0]).toBe('string');
    }
  });

  /**
   * TEST 4: Display room specifications
   */
  test('Display room specifications (capacity, bed type, area)', async ({ page }) => {
    const roomDetailPage = new RoomDetailPage(page);

    // Navigate to room detail
    await roomDetailPage.goto('phong-deluxe');
    await roomDetailPage.waitForRoomLoad();

    // Check specifications
    const hasCapacity = await roomDetailPage.hasCapacityInfo();
    const hasBedType = await roomDetailPage.hasBedTypeInfo();
    const hasArea = await roomDetailPage.hasAreaSize();

    // At least some specs should be displayed
    expect(hasCapacity || hasBedType || hasArea).toBeTruthy();

    if (hasCapacity) {
      const capacity = await roomDetailPage.getCapacityInfo();
      expect(capacity.length).toBeGreaterThan(0);
    }
  });

  /**
   * TEST 5: Display image gallery
   */
  test('Display room image gallery', async ({ page }) => {
    const roomDetailPage = new RoomDetailPage(page);

    // Navigate to room detail
    await roomDetailPage.goto('phong-deluxe');
    await roomDetailPage.waitForRoomLoad();

    // Check if gallery exists
    const hasGallery = await roomDetailPage.hasImageGallery();
    expect(hasGallery).toBeTruthy();

    // Get images count
    const imagesCount = await roomDetailPage.getGalleryImagesCount();
    expect(imagesCount).toBeGreaterThan(0);
  });

  /**
   * TEST 6: Display reserve button
   */
  test('Display reserve/book button', async ({ page }) => {
    const roomDetailPage = new RoomDetailPage(page);

    // Navigate to room detail
    await roomDetailPage.goto('phong-deluxe');
    await roomDetailPage.waitForRoomLoad();

    // Check if reserve button is visible
    const isButtonVisible = await roomDetailPage.isReserveButtonVisible();
    expect(isButtonVisible).toBeTruthy();

    // Get button text
    const buttonText = await roomDetailPage.getReserveButtonText();
    expect(buttonText.length).toBeGreaterThan(0);
  });

  /**
   * TEST 7: Navigate back to rooms list
   */
  test('Navigate back to rooms list from detail page', async ({ page }) => {
    const roomDetailPage = new RoomDetailPage(page);

    // Navigate to room detail
    await roomDetailPage.goto('phong-deluxe');
    await roomDetailPage.waitForRoomLoad();

    // Click back link
    await roomDetailPage.clickBackLink();

    // Verify navigated to rooms page
    expect(page.url()).toContain('/rooms');
  });

  /**
   * TEST 8: Navigate to booking page from reserve button
   */
  test('Click reserve button to navigate to booking page', async ({ page }) => {
    const roomDetailPage = new RoomDetailPage(page);

    // Navigate to room detail
    await roomDetailPage.goto('phong-deluxe');
    await roomDetailPage.waitForRoomLoad();

    // Click reserve button
    await roomDetailPage.clickReserveButton();

    // Verify navigated to booking page
    const url = await page.url();
    expect(url).toContain('/booking');
  });

  /**
   * TEST 9: Display secure booking badge
   */
  test('Display secure booking badge for trust', async ({ page }) => {
    const roomDetailPage = new RoomDetailPage(page);

    // Navigate to room detail
    await roomDetailPage.goto('phong-deluxe');
    await roomDetailPage.waitForRoomLoad();

    // Check for secure booking badge
    const hasSecureBadge = await roomDetailPage.hasSecureBookingBadge();
    expect(hasSecureBadge).toBeTruthy();
  });

  /**
   * TEST 10: Verify complete room information
   */
  test('Verify complete and consistent room information', async ({ page }) => {
    const roomDetailPage = new RoomDetailPage(page);

    // Navigate to room detail
    await roomDetailPage.goto('phong-deluxe');
    await roomDetailPage.waitForRoomLoad();

    // Get all room specs
    const specs = await roomDetailPage.getRoomSpecs();

    // Verify data consistency
    const isConsistent = await roomDetailPage.verifyRoomDataConsistency();
    expect(isConsistent).toBeTruthy();

    // Verify each spec
    expect(specs.name).toBeTruthy();
    expect(specs.price).toBeGreaterThan(0);
    expect(Array.isArray(specs.amenities)).toBeTruthy();
  });

  /**
   * TEST 11: Handle invalid room slug
   */
  test('Display error for invalid room slug', async ({ page }) => {
    const roomDetailPage = new RoomDetailPage(page);

    // Try to navigate to non-existent room
    await roomDetailPage.goto('non-existent-room-slug');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Should show error or redirect
    const hasError = await roomDetailPage.hasError();
    const url = await roomDetailPage.getURL();

    // Either shows error or redirects
    expect(hasError || !url.includes('non-existent')).toBeTruthy();
  });

  /**
   * TEST 12: Scroll and view all sections
   */
  test('All major sections are accessible by scrolling', async ({ page }) => {
    const roomDetailPage = new RoomDetailPage(page);

    // Navigate to room detail
    await roomDetailPage.goto('phong-deluxe');
    await roomDetailPage.waitForRoomLoad();

    // Scroll to gallery
    await roomDetailPage.scrollToGallery();
    await page.waitForTimeout(200);
    let hasGallery = await roomDetailPage.hasImageGallery();
    expect(hasGallery).toBeTruthy();

    // Scroll to amenities
    const hasAmenitiesSection = await roomDetailPage.hasAmenitiesSection();
    if (hasAmenitiesSection) {
      await roomDetailPage.scrollToAmenities();
      await page.waitForTimeout(200);
      hasGallery = await roomDetailPage.hasImageGallery();
      expect(hasGallery || hasAmenitiesSection).toBeTruthy();
    }

    // Scroll to booking
    await roomDetailPage.scrollToBooking();
    await page.waitForTimeout(200);
    const isButtonVisible = await roomDetailPage.isReserveButtonVisible();
    expect(isButtonVisible).toBeTruthy();
  });
});
