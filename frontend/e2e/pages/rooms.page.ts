import { BasePage } from './base.page';

/**
 * RoomsPage - Room search and listing page
 * Handles: room display, filtering (price, amenities), pagination, room selection
 */
export class RoomsPage extends BasePage {
  // Selectors
  readonly roomCardContainer = '.grid';
  readonly roomCard = '[class*="grid"] > div > a > div, [class*="grid"] > [class*="Card"]';
  readonly roomCardLink = 'a[href*="/rooms/"]';
  readonly roomTitle = '[class*="Card"] h2, [class*="Card"] h3';
  readonly roomPrice = '[class*="formatCurrency"], [class*="price"]';
  readonly priceRangeInput = 'input[type="range"]';
  readonly amenityCheckbox = 'input[type="checkbox"]';
  readonly amenityLabel = 'label:has-text("Ocean Panorama"), label:has-text("Garden Retreat"), label:has-text("Sunrise Balcony")';
  readonly viewPreferenceSection = 'section:has-text("View Preference")';
  readonly priceRangeSection = 'section:has-text("Price Range")';
  readonly noResultsMessage = '.py-20, div:has-text("Không tìm thấy phòng")';
  readonly pageTitle = 'h1';
  readonly loadingMessage = 'div:has-text("Đang tải danh sách phòng")';
  readonly errorMessage = '.text-red-600';
  readonly bookButton = 'button:has-text("Đặt phòng"), a:has-text("Đặt phòng")';
  readonly roomImage = 'img[alt*="phòng"], img[alt*="room"]';
  readonly sortDropdown = 'select[name="sort"]';
  readonly availabilityBadge = 'span:has-text("Còn")';

  /**
   * Navigate to rooms page
   */
  async goto(...args: any[]) {
    const queryParams = args[0] as
      | { hotelId?: string; checkIn?: string; checkOut?: string; adults?: number }
      | undefined;
    let path = '/rooms';
    if (queryParams) {
      const params = new URLSearchParams();
      if (queryParams.hotelId) params.append('hotelId', queryParams.hotelId);
      if (queryParams.checkIn) params.append('checkIn', queryParams.checkIn);
      if (queryParams.checkOut) params.append('checkOut', queryParams.checkOut);
      if (queryParams.adults) params.append('adults', queryParams.adults.toString());
      if (params.toString()) path += `?${params.toString()}`;
    }
    await super.goto(path);
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return this.getText(this.pageTitle);
  }

  /**
   * Wait for page to load
   */
  async waitForPageLoad() {
    await this.waitForReady();
    // Wait for either room cards or no results message
    await this.page.waitForSelector(
      `${this.roomCard}, ${this.noResultsMessage}`,
      { timeout: 10000 }
    ).catch(() => {
      // Element may not exist, that's ok
    });
  }

  /**
   * Get all room cards count
   */
  async getRoomCount(): Promise<number> {
    const cards = await this.page.locator(this.roomCardLink).count();
    return cards;
  }

  /**
   * Get all room names/titles
   */
  async getRoomNames(): Promise<string[]> {
    const titles = await this.getTextList(this.roomTitle);
    return titles.filter(t => t.trim().length > 0);
  }

  /**
   * Click on a room by index
   */
  async clickRoom(index: number) {
    const rooms = this.page.locator(this.roomCardLink);
    const count = await rooms.count();
    if (index >= count) {
      throw new Error(`Room index ${index} is out of range. Total rooms: ${count}`);
    }
    await rooms.nth(index).click();
    await this.waitForNavigation();
  }

  /**
   * Click on a room by name
   */
  async clickRoomByName(roomName: string) {
    const roomLink = this.page.locator(`a[href*="/rooms/"] >> text="${roomName}"`);
    await roomLink.click();
    await this.waitForNavigation();
  }

  /**
   * Set price range filter
   */
  async setPriceRange(min: number, max: number) {
    // Note: The page uses a range input. We'll set it to a middle value for testing
    const priceInput = this.page.locator(this.priceRangeInput).first();
    await priceInput.fill(max.toString());
    await this.page.waitForTimeout(300); // Wait for filter to apply
  }

  /**
   * Get current price range value
   */
  async getPriceRangeValue(): Promise<number> {
    const value = await this.page.locator(this.priceRangeInput).first().inputValue();
    return parseInt(value || '0', 10);
  }

  /**
   * Select amenity filter by name
   */
  async selectAmenity(amenityName: 'Ocean Panorama' | 'Garden Retreat' | 'Sunrise Balcony') {
    const checkbox = this.page.locator(`input[type="checkbox"] >> ..//*:has-text("${amenityName}")`).first();
    const isChecked = await checkbox.isChecked();
    if (!isChecked) {
      await checkbox.check();
      await this.page.waitForTimeout(300); // Wait for filter to apply
    }
  }

  /**
   * Deselect amenity filter by name
   */
  async deselectAmenity(amenityName: string) {
    const checkbox = this.page.locator(`input[type="checkbox"] >> ..//*:has-text("${amenityName}")`).first();
    const isChecked = await checkbox.isChecked();
    if (isChecked) {
      await checkbox.uncheck();
      await this.page.waitForTimeout(300); // Wait for filter to apply
    }
  }

  /**
   * Check if amenity is selected
   */
  async isAmenitySelected(amenityName: string): Promise<boolean> {
    const checkbox = this.page.locator(`input[type="checkbox"] >> ..//*:has-text("${amenityName}")`).first();
    return checkbox.isChecked();
  }

  /**
   * Get available amenity options
   */
  async getAvailableAmenities(): Promise<string[]> {
    const labels = await this.getTextList(this.amenityLabel);
    return labels.filter(l => l.trim().length > 0);
  }

  /**
   * Check if no results message is displayed
   */
  async hasNoResults(): Promise<boolean> {
    return this.elementExists(this.noResultsMessage);
  }

  /**
   * Get no results message text
   */
  async getNoResultsMessage(): Promise<string> {
    if (await this.hasNoResults()) {
      return this.getText(this.noResultsMessage);
    }
    return '';
  }

  /**
   * Check if page is loading
   */
  async isLoading(): Promise<boolean> {
    return this.elementExists(this.loadingMessage);
  }

  /**
   * Check if error message is displayed
   */
  async hasError(): Promise<boolean> {
    return this.elementExists(this.errorMessage);
  }

  /**
   * Get error message
   */
  async getErrorMessage(): Promise<string> {
    if (await this.hasError()) {
      return this.getText(this.errorMessage);
    }
    return '';
  }

  /**
   * Check if view preference section is visible
   */
  async isViewPreferenceSectionVisible(): Promise<boolean> {
    return this.isVisible(this.viewPreferenceSection);
  }

  /**
   * Check if price range section is visible
   */
  async isPriceRangeSectionVisible(): Promise<boolean> {
    return this.isVisible(this.priceRangeSection);
  }

  /**
   * Get room images count (for first room card)
   */
  async getRoomImagesCount(): Promise<number> {
    const images = await this.page.locator(this.roomImage).count();
    return images;
  }

  /**
   * Check if room has availability badge
   */
  async hasAvailabilityBadge(): Promise<boolean> {
    return this.elementExists(this.availabilityBadge);
  }

  /**
   * Get availability information (e.g., "Còn 5 phòng")
   */
  async getAvailabilityInfo(): Promise<string> {
    if (await this.hasAvailabilityBadge()) {
      return this.getText(this.availabilityBadge);
    }
    return '';
  }

  /**
   * Get URL to verify correct page
   */
  async getURL(): Promise<string> {
    return this.page.url();
  }

  /**
   * Wait until rooms are loaded or no results shown
   */
  async waitForRoomsToLoad() {
    await this.page.waitForSelector(
      `${this.roomCardLink}, ${this.noResultsMessage}, ${this.errorMessage}`,
      { timeout: 15000 }
    );
  }

  /**
   * Check if rooms grid is visible
   */
  async isRoomsGridVisible(): Promise<boolean> {
    return this.isVisible(this.roomCardContainer);
  }

  /**
   * Get all room availability counts
   */
  async getAllAvailabilityCounts(): Promise<number[]> {
    const badges = await this.getTextList(this.availabilityBadge);
    return badges
      .map(badge => {
        const match = badge.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(num => num > 0);
  }

  /**
   * Scroll to filters section
   */
  async scrollToFilters() {
    const filterSection = this.page.locator(this.priceRangeSection);
    await filterSection.scrollIntoViewIfNeeded();
  }

  /**
   * Clear all filters (reload page with no filters)
   */
  async clearAllFilters() {
    await this.goto();
  }
}
