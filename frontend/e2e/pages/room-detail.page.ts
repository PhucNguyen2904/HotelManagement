import { BasePage } from './base.page';

/**
 * RoomDetailPage - Room details and booking initiation page
 * Handles: image gallery, amenities display, room info, booking button
 */
export class RoomDetailPage extends BasePage {
  // Selectors
  readonly pageTitle = 'h1';
  readonly roomName = 'h1';
  readonly roomDescription = 'p:has-text("description"), p[class*="leading-relaxed"]';
  readonly roomPrice = '[class*="text-3xl"] >> text=/[0-9]/';
  readonly pricePerNight = '/đêm';
  readonly imageGallery = '[class*="ImageGallery"], [class*="gallery"]';
  readonly galleryImage = 'img[alt*="phòng"], img[alt*="room"]';
  readonly amenitiesSection = 'h2:has-text("Amenities"), h2:has-text("Curated")';
  readonly amenityItem = '[class*="grid"] >> [class*="flex"]:has-text("Check"), span >> ../span';
  readonly capacityInfo = 'span:has-text("Sức chứa"), span:has-text("adults")';
  readonly bedTypeInfo = 'span:has-text("Loại giường")';
  readonly areaSize = 'span:has-text("m²")';
  readonly backLink = 'a:has-text("Danh sách phòng")';
  readonly reserveButton = 'button:has-text("Reserve"), a:has-text("Đặt phòng")';
  readonly bookingLink = 'a[href*="/booking"]';
  readonly loadingState = '[class*="animate-pulse"]';
  readonly errorMessage = 'h1:has-text("Không tìm thấy")';
  readonly secureBookingBadge = 'span:has-text("Secure booking")';
  readonly roomSpecsContainer = '[class*="flex"] >> text=/Sức chứa/';
  readonly priceDisplay = 'span >> text=/VND|₫/';

  /**
   * Navigate to room detail page by slug
   */
  async goto(...args: any[]) {
    const slug = args[0] as string;
    const hotelId = args[1] as string | undefined;
    let path = `/rooms/${slug}`;
    if (hotelId) {
      path += `?hotelId=${hotelId}`;
    }
    await super.goto(path);
  }

  /**
   * Wait for room details to load
   */
  async waitForRoomLoad() {
    // Wait for either room name or error message
    await this.page.waitForSelector(
      `${this.roomName}, ${this.errorMessage}`,
      { timeout: 10000 }
    );
  }

  /**
   * Get room name/title
   */
  async getRoomName(): Promise<string> {
    return this.getText(this.roomName);
  }

  /**
   * Get room price
   */
  async getRoomPrice(): Promise<number> {
    const priceText = await this.getText(this.roomPrice);
    // Extract number from price string
    const match = priceText.match(/[\d,]+/);
    if (match) {
      return parseInt(match[0].replace(/,/g, ''), 10);
    }
    return 0;
  }

  /**
   * Get room description
   */
  async getRoomDescription(): Promise<string> {
    const exists = await this.elementExists(this.roomDescription);
    if (exists) {
      return this.getText(this.roomDescription);
    }
    return '';
  }

  /**
   * Get all amenities
   */
  async getAmenities(): Promise<string[]> {
    const exists = await this.elementExists(this.amenitiesSection);
    if (!exists) return [];

    // Get all amenity items
    const amenities = await this.getTextList(this.amenityItem);
    return amenities.filter(a => a.trim().length > 0);
  }

  /**
   * Check if amenities section is visible
   */
  async hasAmenitiesSection(): Promise<boolean> {
    return this.elementExists(this.amenitiesSection);
  }

  /**
   * Get amenities count
   */
  async getAmenitiesCount(): Promise<number> {
    const amenities = await this.getAmenities();
    return amenities.length;
  }

  /**
   * Check if room capacity info is displayed
   */
  async hasCapacityInfo(): Promise<boolean> {
    return this.elementExists(this.capacityInfo);
  }

  /**
   * Get room capacity information
   */
  async getCapacityInfo(): Promise<string> {
    if (await this.hasCapacityInfo()) {
      return this.getText(this.capacityInfo);
    }
    return '';
  }

  /**
   * Check if bed type info is displayed
   */
  async hasBedTypeInfo(): Promise<boolean> {
    return this.elementExists(this.bedTypeInfo);
  }

  /**
   * Get bed type information
   */
  async getBedTypeInfo(): Promise<string> {
    if (await this.hasBedTypeInfo()) {
      return this.getText(this.bedTypeInfo);
    }
    return '';
  }

  /**
   * Check if area size is displayed
   */
  async hasAreaSize(): Promise<boolean> {
    return this.elementExists(this.areaSize);
  }

  /**
   * Get area size information
   */
  async getAreaSize(): Promise<string> {
    if (await this.hasAreaSize()) {
      const sizeText = await this.getText(this.areaSize);
      const match = sizeText.match(/(\d+)/);
      return match ? match[1] + ' m²' : '';
    }
    return '';
  }

  /**
   * Get image gallery
   */
  async hasImageGallery(): Promise<boolean> {
    return this.elementExists(this.imageGallery);
  }

  /**
   * Get gallery images count
   */
  async getGalleryImagesCount(): Promise<number> {
    const images = await this.page.locator(this.galleryImage).count();
    return images;
  }

  /**
   * Check if page is loading
   */
  async isLoading(): Promise<boolean> {
    return this.elementExists(this.loadingState);
  }

  /**
   * Check if error is displayed
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
   * Click back link to return to rooms list
   */
  async clickBackLink() {
    await this.click(this.backLink);
    await this.waitForNavigation();
  }

  /**
   * Click reserve/book button
   */
  async clickReserveButton() {
    const bookingLink = this.page.locator(this.bookingLink).first();
    await bookingLink.click();
    await this.waitForNavigation();
  }

  /**
   * Check if reserve button is visible
   */
  async isReserveButtonVisible(): Promise<boolean> {
    return this.elementExists(this.reserveButton);
  }

  /**
   * Get reserve button text
   */
  async getReserveButtonText(): Promise<string> {
    return this.getText(this.reserveButton);
  }

  /**
   * Check if secure booking badge is visible
   */
  async hasSecureBookingBadge(): Promise<boolean> {
    return this.elementExists(this.secureBookingBadge);
  }

  /**
   * Navigate to booking page with this room
   */
  async navigateToBooking() {
    await this.clickReserveButton();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get room specifications as object
   */
  async getRoomSpecs(): Promise<{
    name: string;
    price: number;
    capacity?: string;
    bedType?: string;
    areaSize?: string;
    amenities: string[];
  }> {
    return {
      name: await this.getRoomName(),
      price: await this.getRoomPrice(),
      capacity: await this.getCapacityInfo(),
      bedType: await this.getBedTypeInfo(),
      areaSize: await this.getAreaSize(),
      amenities: await this.getAmenities(),
    };
  }

  /**
   * Scroll to amenities section
   */
  async scrollToAmenities() {
    const amenitiesSection = this.page.locator(this.amenitiesSection);
    await amenitiesSection.scrollIntoViewIfNeeded();
  }

  /**
   * Scroll to price/booking section
   */
  async scrollToBooking() {
    const bookingButton = this.page.locator(this.reserveButton);
    await bookingButton.scrollIntoViewIfNeeded();
  }

  /**
   * Scroll to image gallery
   */
  async scrollToGallery() {
    const gallery = this.page.locator(this.imageGallery);
    await gallery.scrollIntoViewIfNeeded();
  }

  /**
   * Check if all room info is displayed
   */
  async hasAllRoomInfo(): Promise<boolean> {
    const hasName = await this.elementExists(this.roomName);
    const hasPrice = await this.elementExists(this.roomPrice);
    const hasGallery = await this.hasImageGallery();
    const hasButton = await this.isReserveButtonVisible();

    return hasName && hasPrice && hasGallery && hasButton;
  }

  /**
   * Get URL to verify correct page
   */
  async getURL(): Promise<string> {
    return this.page.url();
  }

  /**
   * Verify room data consistency (price, specs, etc)
   */
  async verifyRoomDataConsistency(): Promise<boolean> {
    const specs = await this.getRoomSpecs();
    return (
      specs.name.length > 0 &&
      specs.price > 0 &&
      specs.amenities.length >= 0
    );
  }
}
