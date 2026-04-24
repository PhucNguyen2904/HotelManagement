import { BasePage } from './base.page';

/**
 * BookingPage - Booking confirmation page
 * Handles: guest info form, room details display, price calculation, booking confirmation
 */
export class BookingPage extends BasePage {
  // Selectors
  readonly pageTitle = 'h1';
  readonly guestNameInput = 'input[aria-label*="Họ"], input[aria-label*="tên"], input[value*="name"]';
  readonly emailInput = 'input[type="email"]';
  readonly phoneInput = 'input[type="tel"]';
  readonly specialRequestsTextarea = 'textarea[placeholder*="chú"], textarea[placeholder*="note"]';
  readonly confirmButton = 'button[type="submit"]';
  readonly errorMessage = '.bg-red-50, [role="alert"]';
  readonly roomNameDisplay = 'p:has-text("phòng"), p[class*="font-semibold"]';
  readonly checkInDisplay = 'span:has-text("Nhận phòng")';
  readonly checkOutDisplay = 'span:has-text("Trả phòng")';
  readonly nightsDisplay = 'span:has-text("Số đêm")';
  readonly subtotalDisplay = 'span:has-text("Tiền phòng")';
  readonly taxDisplay = 'span:has-text("Thuế")';
  readonly totalDisplay = 'span:has-text("Tổng cộng"), span[class*="text-xl"]';
  readonly roomSummaryCard = '[class*="sticky"]';
  readonly loadingSpinner = '[class*="animate-spin"]';
  readonly bookingForm = 'form';
  readonly secureBookingBadges = '[class*="ShieldCheck"], [class*="BadgeCheck"]';

  /**
   * Navigate to booking page
   */
  async goto(...args: any[]) {
    const roomTypeId = args[0] as string;
    const checkIn = args[1] as string | undefined;
    const checkOut = args[2] as string | undefined;
    let path = `/booking?roomTypeId=${roomTypeId}`;
    if (checkIn && checkOut) {
      path += `&checkIn=${checkIn}&checkOut=${checkOut}`;
    }
    await super.goto(path);
  }

  /**
   * Wait for booking page to load
   */
  async waitForPageLoad() {
    await this.waitForReady();
    await this.page.waitForSelector(
      `${this.bookingForm}, ${this.loadingSpinner}`,
      { timeout: 10000 }
    ).catch(() => {
      // Element may not exist immediately
    });
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return this.getText(this.pageTitle);
  }

  /**
   * Check if page is loading
   */
  async isLoading(): Promise<boolean> {
    return this.elementExists(this.loadingSpinner);
  }

  /**
   * Fill guest name input
   */
  async setGuestName(name: string) {
    const input = this.page.locator('input').filter({ has: this.page.locator('label:has-text("Họ")') }).first();
    await input.fill(name);
  }

  /**
   * Fill email input
   */
  async setEmail(email: string) {
    await this.fill(this.emailInput, email);
  }

  /**
   * Fill phone input
   */
  async setPhone(phone: string) {
    await this.fill(this.phoneInput, phone);
  }

  /**
   * Fill special requests textarea
   */
  async setSpecialRequests(requests: string) {
    const textarea = this.page.locator('textarea').first();
    await textarea.fill(requests);
  }

  /**
   * Get guest name value
   */
  async getGuestNameValue(): Promise<string> {
    return this.page.locator('input').filter({ has: this.page.locator('label:has-text("Họ")') }).first().inputValue();
  }

  /**
   * Get email value
   */
  async getEmailValue(): Promise<string> {
    return this.page.locator(this.emailInput).inputValue();
  }

  /**
   * Get phone value
   */
  async getPhoneValue(): Promise<string> {
    return this.page.locator(this.phoneInput).inputValue();
  }

  /**
   * Get special requests value
   */
  async getSpecialRequestsValue(): Promise<string> {
    return this.page.locator('textarea').first().inputValue();
  }

  /**
   * Click confirm button
   */
  async clickConfirm() {
    await this.click(this.confirmButton);
    await this.page.waitForTimeout(500);
  }

  /**
   * Complete booking flow
   */
  async confirmBooking(guestName: string, email: string, phone: string, specialRequests?: string) {
    await this.setGuestName(guestName);
    await this.setEmail(email);
    await this.setPhone(phone);
    if (specialRequests) {
      await this.setSpecialRequests(specialRequests);
    }
    await this.clickConfirm();
    // Wait for booking to be created and navigation
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get error message
   */
  async getErrorMessage(): Promise<string> {
    const errors = await this.getTextList(this.errorMessage);
    return errors.join(', ');
  }

  /**
   * Check if error is displayed
   */
  async hasError(): Promise<boolean> {
    return this.elementExists(this.errorMessage);
  }

  /**
   * Get room name display
   */
  async getRoomName(): Promise<string> {
    return this.getText(this.roomNameDisplay);
  }

  /**
   * Get check-in date
   */
  async getCheckInDate(): Promise<string> {
    const text = await this.getText(this.checkInDisplay);
    // Extract date from "Nhận phòng: YYYY-MM-DD" format
    const match = text.match(/(\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : '';
  }

  /**
   * Get check-out date
   */
  async getCheckOutDate(): Promise<string> {
    const text = await this.getText(this.checkOutDisplay);
    // Extract date from "Trả phòng: YYYY-MM-DD" format
    const match = text.match(/(\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : '';
  }

  /**
   * Get number of nights
   */
  async getNights(): Promise<number> {
    const text = await this.getText(this.nightsDisplay);
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Get subtotal (room price)
   */
  async getSubtotal(): Promise<number> {
    const text = await this.getText(this.subtotalDisplay);
    return this.extractPriceFromText(text);
  }

  /**
   * Get tax amount
   */
  async getTaxAmount(): Promise<number> {
    const text = await this.getText(this.taxDisplay);
    return this.extractPriceFromText(text);
  }

  /**
   * Get total amount
   */
  async getTotalAmount(): Promise<number> {
    const text = await this.getText(this.totalDisplay);
    return this.extractPriceFromText(text);
  }

  /**
   * Helper to extract price from text
   */
  private extractPriceFromText(text: string): number {
    const match = text.match(/[\d,]+/);
    if (match) {
      return parseInt(match[0].replace(/,/g, ''), 10);
    }
    return 0;
  }

  /**
   * Get booking summary information
   */
  async getBookingSummary(): Promise<{
    roomName: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    subtotal: number;
    tax: number;
    total: number;
  }> {
    return {
      roomName: await this.getRoomName(),
      checkIn: await this.getCheckInDate(),
      checkOut: await this.getCheckOutDate(),
      nights: await this.getNights(),
      subtotal: await this.getSubtotal(),
      tax: await this.getTaxAmount(),
      total: await this.getTotalAmount(),
    };
  }

  /**
   * Get guest info form data
   */
  async getGuestInfo(): Promise<{
    name: string;
    email: string;
    phone: string;
    specialRequests: string;
  }> {
    return {
      name: await this.getGuestNameValue(),
      email: await this.getEmailValue(),
      phone: await this.getPhoneValue(),
      specialRequests: await this.getSpecialRequestsValue(),
    };
  }

  /**
   * Check if booking summary card is visible
   */
  async isSummaryCardVisible(): Promise<boolean> {
    return this.isVisible(this.roomSummaryCard);
  }

  /**
   * Check if form is visible
   */
  async isFormVisible(): Promise<boolean> {
    return this.isVisible(this.bookingForm);
  }

  /**
   * Check if secure booking badges are displayed
   */
  async hasSecureBookingBadges(): Promise<boolean> {
    return this.elementExists(this.secureBookingBadges);
  }

  /**
   * Get confirm button text
   */
  async getConfirmButtonText(): Promise<string> {
    return this.getText(this.confirmButton);
  }

  /**
   * Check if confirm button is disabled
   */
  async isConfirmDisabled(): Promise<boolean> {
    return this.page.locator(this.confirmButton).isDisabled();
  }

  /**
   * Clear all form fields
   */
  async clearForm() {
    await this.page.locator('input').filter({ has: this.page.locator('label:has-text("Họ")') }).first().clear();
    await this.page.locator(this.emailInput).clear();
    await this.page.locator(this.phoneInput).clear();
    await this.page.locator('textarea').first().clear();
  }

  /**
   * Verify booking total matches expected calculation
   */
  async verifyTotalCalculation(): Promise<boolean> {
    const subtotal = await this.getSubtotal();
    const tax = await this.getTaxAmount();
    const total = await this.getTotalAmount();

    // Tax should be ~10% of subtotal, total should be subtotal + tax
    const expectedTotal = subtotal + tax;
    return Math.abs(total - expectedTotal) < 1000; // Allow for rounding
  }

  /**
   * Get URL to verify correct page
   */
  async getURL(): Promise<string> {
    return this.page.url();
  }

  /**
   * Verify all required fields are present
   */
  async verifyAllFieldsPresent(): Promise<boolean> {
    const hasNameInput = await this.elementExists('input[type="text"]');
    const hasEmailInput = await this.elementExists(this.emailInput);
    const hasPhoneInput = await this.elementExists(this.phoneInput);
    const hasButton = await this.elementExists(this.confirmButton);
    const hasSummary = await this.isSummaryCardVisible();

    return hasNameInput && hasEmailInput && hasPhoneInput && hasButton && hasSummary;
  }
}
