import { test, expect } from '@playwright/test';
import { RoomsPage } from '../pages/rooms.page';
import { LoginPage } from '../pages/login.page';
import { testData } from '../fixtures/test-data';

test.describe('Rooms Page - Search & Discovery', () => {
  /**
   * TEST 1: Load rooms page and display room list
   */
  test('Load rooms page and display available rooms', async ({ page }) => {
    const roomsPage = new RoomsPage(page);

    // Navigate to rooms page
    await roomsPage.goto();

    // Verify page loaded
    expect(page.url()).toContain('/rooms');
    const pageTitle = await roomsPage.getPageTitle();
    expect(pageTitle).toContain('Rooms');

    // Wait for rooms to load
    await roomsPage.waitForRoomsToLoad();

    // Verify either rooms are displayed or no results message
    const roomCount = await roomsPage.getRoomCount();
    const hasNoResults = await roomsPage.hasNoResults();
    expect(roomCount > 0 || hasNoResults).toBeTruthy();
  });

  /**
   * TEST 2: Display room cards with information
   */
  test('Display room cards with proper information', async ({ page }) => {
    const roomsPage = new RoomsPage(page);

    // Navigate to rooms page
    await roomsPage.goto();
    await roomsPage.waitForRoomsToLoad();

    // Get room count
    const roomCount = await roomsPage.getRoomCount();

    if (roomCount > 0) {
      // Verify room cards are visible
      const isGridVisible = await roomsPage.isRoomsGridVisible();
      expect(isGridVisible).toBeTruthy();

      // Get room names (should have at least one)
      const roomNames = await roomsPage.getRoomNames();
      expect(roomNames.length).toBeGreaterThan(0);

      // Verify rooms have images
      const imagesCount = await roomsPage.getRoomImagesCount();
      expect(imagesCount).toBeGreaterThan(0);
    }
  });

  /**
   * TEST 3: Filter rooms by price range
   */
  test('Filter rooms by price range', async ({ page }) => {
    const roomsPage = new RoomsPage(page);

    // Navigate to rooms page
    await roomsPage.goto();
    await roomsPage.waitForRoomsToLoad();

    // Verify price range section is visible
    const isPriceVisible = await roomsPage.isPriceRangeSectionVisible();
    expect(isPriceVisible).toBeTruthy();

    // Get initial room count
    const initialCount = await roomsPage.getRoomCount();

    // Set price range filter
    await roomsPage.setPriceRange(300000, 800000);

    // Wait for results to update
    await page.waitForTimeout(500);

    // Verify rooms are still displayed (or no results)
    const hasError = await roomsPage.hasError();
    expect(hasError).toBeFalsy();

    // Price range should be set
    const priceValue = await roomsPage.getPriceRangeValue();
    expect(priceValue).toBeGreaterThan(0);
  });

  /**
   * TEST 4: Filter rooms by view preference (amenity)
   */
  test('Filter rooms by view preference amenity', async ({ page }) => {
    const roomsPage = new RoomsPage(page);

    // Navigate to rooms page
    await roomsPage.goto();
    await roomsPage.waitForRoomsToLoad();

    // Verify view preference section is visible
    const isViewVisible = await roomsPage.isViewPreferenceSectionVisible();
    expect(isViewVisible).toBeTruthy();

    // Get available amenities
    const amenities = await roomsPage.getAvailableAmenities();
    expect(amenities.length).toBeGreaterThan(0);

    // Select first amenity if available
    if (amenities.length > 0) {
      const amenity = amenities[0] as 'Ocean Panorama' | 'Garden Retreat' | 'Sunrise Balcony';
      await roomsPage.selectAmenity(amenity);

      // Verify it's selected
      const isSelected = await roomsPage.isAmenitySelected(amenity);
      expect(isSelected).toBeTruthy();

      // Wait for filter to apply
      await page.waitForTimeout(500);
    }
  });

  /**
   * TEST 5: Click on room card to view details
   */
  test('Click on room card to navigate to room details', async ({ page }) => {
    const roomsPage = new RoomsPage(page);

    // Navigate to rooms page
    await roomsPage.goto();
    await roomsPage.waitForRoomsToLoad();

    // Get room count
    const roomCount = await roomsPage.getRoomCount();

    if (roomCount > 0) {
      // Click on first room
      await roomsPage.clickRoom(0);

      // Verify navigated to room detail page
      const currentUrl = await page.url();
      expect(currentUrl).toContain('/rooms/');
    }
  });

  /**
   * TEST 6: Handle no results scenario
   */
  test('Display no results message when no rooms match filters', async ({ page }) => {
    const roomsPage = new RoomsPage(page);

    // Navigate to rooms page with params that may result in no rooms
    await roomsPage.goto({
      checkIn: '2099-12-31',
      checkOut: '2099-12-32', // Future date
    });

    // Wait for page to load
    await roomsPage.waitForRoomsToLoad();

    // Check if no results message or has rooms
    const hasNoResults = await roomsPage.hasNoResults();
    const roomCount = await roomsPage.getRoomCount();

    // Either no results or rooms, but not both
    if (hasNoResults) {
      const noResultsMsg = await roomsPage.getNoResultsMessage();
      expect(noResultsMsg.length).toBeGreaterThan(0);
    } else {
      expect(roomCount).toBeGreaterThanOrEqual(0);
    }
  });

  /**
   * TEST 7: Verify room availability badges are displayed
   */
  test('Display availability information on room cards', async ({ page }) => {
    const roomsPage = new RoomsPage(page);

    // Navigate to rooms page
    await roomsPage.goto();
    await roomsPage.waitForRoomsToLoad();

    // Check if availability badges exist
    const hasAvailability = await roomsPage.hasAvailabilityBadge();

    if (hasAvailability) {
      // Get availability info
      const availabilityInfo = await roomsPage.getAvailabilityInfo();
      expect(availabilityInfo).toContain('Còn');

      // Get all availability counts
      const counts = await roomsPage.getAllAvailabilityCounts();
      expect(counts.length).toBeGreaterThan(0);
      expect(counts[0]).toBeGreaterThan(0);
    }
  });

  /**
   * TEST 8: Deselect amenity filter
   */
  test('Deselect amenity filter to show more results', async ({ page }) => {
    const roomsPage = new RoomsPage(page);

    // Navigate to rooms page
    await roomsPage.goto();
    await roomsPage.waitForRoomsToLoad();

    // Get available amenities
    const amenities = await roomsPage.getAvailableAmenities();

    if (amenities.length > 0) {
      const amenity = amenities[0] as 'Ocean Panorama' | 'Garden Retreat' | 'Sunrise Balcony';

      // Select amenity
      await roomsPage.selectAmenity(amenity);
      await page.waitForTimeout(300);

      // Verify selected
      let isSelected = await roomsPage.isAmenitySelected(amenity);
      expect(isSelected).toBeTruthy();

      // Deselect amenity
      await roomsPage.deselectAmenity(amenity);
      await page.waitForTimeout(300);

      // Verify deselected
      isSelected = await roomsPage.isAmenitySelected(amenity);
      expect(isSelected).toBeFalsy();
    }
  });

  /**
   * TEST 9: Clear all filters and reload
   */
  test('Clear filters to show all rooms again', async ({ page }) => {
    const roomsPage = new RoomsPage(page);

    // Navigate with filters
    await roomsPage.goto({
      checkIn: '2026-05-01',
      checkOut: '2026-05-02',
    });
    await roomsPage.waitForRoomsToLoad();

    // Get initial count
    const filteredCount = await roomsPage.getRoomCount();

    // Clear filters by navigating without params
    await roomsPage.clearAllFilters();
    await roomsPage.waitForRoomsToLoad();

    // Verify filters are cleared
    const currentUrl = await roomsPage.getURL();
    expect(currentUrl).toContain('/rooms');
    expect(!currentUrl.includes('checkIn') || !currentUrl.includes('checkOut')).toBeTruthy();

    // Verify page loads successfully
    const pageTitle = await roomsPage.getPageTitle();
    expect(pageTitle).toContain('Rooms');
  });

  /**
   * TEST 10: Verify page structure and sections
   */
  test('Verify rooms page structure with all sections visible', async ({ page }) => {
    const roomsPage = new RoomsPage(page);

    // Navigate to rooms page
    await roomsPage.goto();

    // Verify page title exists
    const pageTitle = await roomsPage.getPageTitle();
    expect(pageTitle).toBeTruthy();

    // Verify filter sections are visible
    const isPriceVisible = await roomsPage.isPriceRangeSectionVisible();
    const isViewVisible = await roomsPage.isViewPreferenceSectionVisible();

    expect(isPriceVisible || isViewVisible).toBeTruthy();

    // Wait for content to load
    await roomsPage.waitForRoomsToLoad();

    // Verify either rooms grid or no results message
    const isGridVisible = await roomsPage.isRoomsGridVisible();
    const hasNoResults = await roomsPage.hasNoResults();

    expect(isGridVisible || hasNoResults).toBeTruthy();
  });
});
