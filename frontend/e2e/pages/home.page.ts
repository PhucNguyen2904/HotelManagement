import { BasePage } from './base.page';

/**
 * HomePage - Guest/Anonymous user's first page
 * Handles: hero section, hotel listing, search form
 */
export class HomePage extends BasePage {
  // Selectors
  readonly heroSection = '[data-testid="hero-section"]';
  readonly searchForm = '[data-testid="search-form"]';
  readonly checkInInput = 'input[name="checkIn"]';
  readonly checkOutInput = 'input[name="checkOut"]';
  readonly adultsInput = 'input[name="adults"]';
  readonly childrenInput = 'input[name="children"]';
  readonly searchButton = 'button:has-text("Tìm kiếm")';
  readonly hotelList = '[data-testid="hotel-list"]';
  readonly hotelCard = '[data-testid="hotel-card"]';
  readonly roomTypesGrid = '[data-testid="room-types"]';
  readonly roomTypeCard = '[data-testid="room-type-card"]';
  readonly logo = '[data-testid="logo"]';
  readonly headerNav = 'header nav';

  /**
   * Navigate to home page
   */
  async goto() {
    await super.goto('/');
  }

  /**
   * Check if hero section is visible
   */
  async isHeroVisible(): Promise<boolean> {
    return this.isVisible(this.heroSection);
  }

  /**
   * Get hero title text
   */
  async getHeroTitle(): Promise<string> {
    return this.getText('h1');
  }

  /**
   * Set check-in date in search form
   */
  async setCheckIn(date: string) {
    await this.fill(this.checkInInput, date);
  }

  /**
   * Set check-out date in search form
   */
  async setCheckOut(date: string) {
    await this.fill(this.checkOutInput, date);
  }

  /**
   * Set number of adults
   */
  async setAdults(count: number) {
    const input = this.page.locator(this.adultsInput);
    await input.clear();
    await input.fill(String(count));
  }

  /**
   * Set number of children
   */
  async setChildren(count: number) {
    const input = this.page.locator(this.childrenInput);
    await input.clear();
    await input.fill(String(count));
  }

  /**
   * Click search button
   */
  async clickSearch() {
    await this.click(this.searchButton);
    await this.waitForNavigation();
  }

  /**
   * Complete search flow
   */
  async searchRooms(checkIn: string, checkOut: string, adults: number, children: number = 0) {
    await this.setCheckIn(checkIn);
    await this.setCheckOut(checkOut);
    await this.setAdults(adults);
    if (children > 0) {
      await this.setChildren(children);
    }
    await this.clickSearch();
  }

  /**
   * Check if hotel list is visible
   */
  async isHotelListVisible(): Promise<boolean> {
    return this.isVisible(this.hotelList);
  }

  /**
   * Get number of hotels displayed
   */
  async getHotelCount(): Promise<number> {
    return this.page.locator(this.hotelCard).count();
  }

  /**
   * Get hotel names
   */
  async getHotelNames(): Promise<string[]> {
    return this.getTextList('[data-testid="hotel-card"] h3');
  }

  /**
   * Click on hotel by index
   */
  async clickHotel(index: number) {
    const hotels = await this.page.locator(this.hotelCard).all();
    if (index < hotels.length) {
      await hotels[index].click();
      await this.waitForNavigation();
    }
  }

  /**
   * Check if room types section is visible
   */
  async isRoomTypesVisible(): Promise<boolean> {
    return this.isVisible(this.roomTypesGrid);
  }

  /**
   * Get number of room types displayed
   */
  async getRoomTypeCount(): Promise<number> {
    return this.page.locator(this.roomTypeCard).count();
  }

  /**
   * Get room type names
   */
  async getRoomTypeNames(): Promise<string[]> {
    return this.getTextList('[data-testid="room-type-card"] h3');
  }

  /**
   * Get room type prices
   */
  async getRoomTypePrices(): Promise<number[]> {
    const priceTexts = await this.getTextList('[data-testid="room-type-card"] [data-testid="price"]');
    return priceTexts.map((text) => {
      const cleaned = text.replace(/[^\d,]/g, '').replace(',', '');
      return parseInt(cleaned, 10) || 0;
    });
  }

  /**
   * Click on room type by index
   */
  async clickRoomType(index: number) {
    const roomTypes = await this.page.locator(this.roomTypeCard).all();
    if (index < roomTypes.length) {
      await roomTypes[index].click();
      await this.waitForNavigation();
    }
  }

  /**
   * Click logo to return to home
   */
  async clickLogo() {
    await this.click(this.logo);
    await this.waitForNavigation();
  }

  /**
   * Scroll to hotel section
   */
  async scrollToHotels() {
    await this.scrollToElement(this.hotelList);
  }

  /**
   * Scroll to room types section
   */
  async scrollToRoomTypes() {
    await this.scrollToElement(this.roomTypesGrid);
  }

  /**
   * Check if contact section exists
   */
  async hasContactSection(): Promise<boolean> {
    return this.elementExists('[data-testid="contact-section"]');
  }

  /**
   * Get page h1 title
   */
  async getPageTitle(): Promise<string> {
    return this.getText('h1');
  }

  /**
   * Check if featured hotels section exists
   */
  async hasFeaturedSection(): Promise<boolean> {
    return this.elementExists('[data-testid="featured-hotels"]');
  }
}
