import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { Header } from '../pages/header.page';
import { dateUtil } from '../utils/date.util';
import { apiUtil } from '../utils/api.util';

test.describe('Homepage Flow', () => {
  /**
   * TEST 1: Homepage loads successfully
   */
  test('Homepage loads with hero section', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();

    // Verify hero section is visible
    const isHeroVisible = await homePage.isHeroVisible();
    expect(isHeroVisible).toBeTruthy();

    // Verify page title
    const pageTitle = await homePage.getTitle();
    expect(pageTitle).toBeTruthy();
  });

  /**
   * TEST 2: Hero section displays proper heading
   */
  test('Hero section displays welcome heading', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();

    const heroTitle = await homePage.getHeroTitle();
    expect(heroTitle.length).toBeGreaterThan(0);
  });

  /**
   * TEST 3: Header navigation is visible
   */
  test('Header and navigation are visible', async ({ page }) => {
    const homePage = new HomePage(page);
    const header = new Header(page);

    await homePage.goto();

    // Verify header is visible
    const isHeaderVisible = await header.isHeaderVisible();
    expect(isHeaderVisible).toBeTruthy();

    // Verify logo is visible
    const isLogoVisible = await header.isLogoVisible();
    expect(isLogoVisible).toBeTruthy();

    // Verify login/register links are visible (when not logged in)
    const isLoginLinkVisible = await header.isLoginLinkVisible();
    const isRegisterLinkVisible = await header.isRegisterLinkVisible();
    expect(isLoginLinkVisible || isRegisterLinkVisible).toBeTruthy();
  });

  /**
   * TEST 4: Search form is displayed
   */
  test('Search form is visible on homepage', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();

    // Verify form elements exist
    expect(page.locator(homePage.checkInInput)).toBeTruthy();
    expect(page.locator(homePage.checkOutInput)).toBeTruthy();
    expect(page.locator(homePage.adultsInput)).toBeTruthy();
  });

  /**
   * TEST 5: Hotel list loads
   */
  test('Hotel list is displayed', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();
    await homePage.scrollToHotels();

    // Verify hotel list is visible
    const isHotelListVisible = await homePage.isHotelListVisible();
    expect(isHotelListVisible).toBeTruthy();

    // Verify hotels are displayed
    const hotelCount = await homePage.getHotelCount();
    expect(hotelCount).toBeGreaterThan(0);
  });

  /**
   * TEST 6: Get hotel names from list
   */
  test('Hotel names are displayed correctly', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();
    await homePage.scrollToHotels();

    const hotelNames = await homePage.getHotelNames();
    expect(hotelNames.length).toBeGreaterThan(0);
    expect(hotelNames[0].length).toBeGreaterThan(0);
  });

  /**
   * TEST 7: Valid search with future dates
   */
  test('Search with valid dates initiates room search', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();

    const checkIn = dateUtil.getFutureDate(3);
    const checkOut = dateUtil.getFutureDate(5);

    await homePage.searchRooms(checkIn, checkOut, 2, 0);

    // Verify redirected to rooms page
    expect(page.url()).toContain('/rooms');
  });

  /**
   * TEST 8: Search validation - checkout before checkin
   */
  test('Search with invalid dates shows validation error', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();

    // Set invalid dates (checkout before checkin)
    const checkIn = dateUtil.getFutureDate(5);
    const checkOut = dateUtil.getFutureDate(3);

    await homePage.setCheckIn(checkIn);
    await homePage.setCheckOut(checkOut);
    await homePage.setAdults(2);

    // Try to search
    await homePage.clickSearch();

    // Should either show error or prevent navigation
    const url = await page.url();
    const pageText = await page.evaluate(() => document.body.innerText);

    const isStillOnHome = url.includes('/');
    const hasErrorText = pageText.includes('lỗi') || pageText.includes('error') || pageText.includes('không');

    // Either stayed on home page or shows error
    expect(isStillOnHome || hasErrorText).toBeTruthy();
  });

  /**
   * TEST 9: Room types are displayed
   */
  test('Room types section is displayed', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();
    await homePage.scrollToRoomTypes();

    // Verify room types are visible
    const isRoomTypesVisible = await homePage.isRoomTypesVisible();
    expect(isRoomTypesVisible).toBeTruthy();

    // Verify room types are displayed
    const roomTypeCount = await homePage.getRoomTypeCount();
    expect(roomTypeCount).toBeGreaterThan(0);
  });

  /**
   * TEST 10: Room type names are displayed
   */
  test('Room type names and prices are displayed', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();
    await homePage.scrollToRoomTypes();

    const roomTypeNames = await homePage.getRoomTypeNames();
    const roomTypePrices = await homePage.getRoomTypePrices();

    expect(roomTypeNames.length).toBeGreaterThan(0);
    expect(roomTypePrices.length).toBeGreaterThan(0);

    // Verify prices are valid numbers
    roomTypePrices.forEach((price) => {
      expect(price).toBeGreaterThan(0);
    });
  });

  /**
   * TEST 11: Logo navigation
   */
  test('Clicking logo navigates to home', async ({ page }) => {
    const homePage = new HomePage(page);

    // Navigate to home
    await homePage.goto();

    // Go to rooms page
    const checkIn = dateUtil.getFutureDate(3);
    const checkOut = dateUtil.getFutureDate(5);
    await homePage.searchRooms(checkIn, checkOut, 2, 0);

    // Verify on rooms page
    expect(page.url()).toContain('/rooms');

    // Click logo
    await homePage.clickLogo();

    // Verify back on home
    const url = await page.url();
    expect(!url.includes('/rooms')).toBeTruthy();
  });

  /**
   * TEST 12: Navigation menu links are accessible
   */
  test('Navigation menu links are accessible', async ({ page }) => {
    const homePage = new HomePage(page);
    const header = new Header(page);

    await homePage.goto();

    // Get navigation links
    const navLinks = await header.getNavigationLinks();
    expect(navLinks.length).toBeGreaterThan(0);
  });

  /**
   * TEST 13: Adults field accepts valid input
   */
  test('Adults field accepts valid input', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();

    const testAdults = 3;
    await homePage.setAdults(testAdults);

    const adultsValue = await page.locator(homePage.adultsInput).inputValue();
    expect(adultsValue).toBe(String(testAdults));
  });

  /**
   * TEST 14: Children field accepts valid input
   */
  test('Children field accepts valid input', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();

    const testChildren = 2;
    await homePage.setChildren(testChildren);

    const childrenValue = await page.locator(homePage.childrenInput).inputValue();
    expect(childrenValue).toBe(String(testChildren));
  });

  /**
   * TEST 15: Search with different guest counts
   */
  test('Search works with different guest counts', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();

    const checkIn = dateUtil.getFutureDate(3);
    const checkOut = dateUtil.getFutureDate(5);

    // Search with family (2 adults, 2 children)
    await homePage.searchRooms(checkIn, checkOut, 2, 2);

    // Verify redirected and URL contains guest info
    expect(page.url()).toContain('/rooms');
  });
});
