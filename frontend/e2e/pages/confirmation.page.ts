import { BasePage } from './base.page';

/**
 * ConfirmationPage - Booking confirmation/details page
 * Handles: booking confirmation display, booking code, booking details, status, guest info
 */
export class ConfirmationPage extends BasePage {
  // Selectors
  readonly pageTitle = 'h1';
  readonly bookingCodeDisplay = 'p:has-text("Mã"), span:has-text("Mã")';
  readonly statusBadge = '[class*="px-4 py-2 rounded-full"]';
  readonly guestNameDisplay = 'p:has-text("Tên") ~ p, [class*="font-medium"] >> ../*/text("Tên")/../..';
  readonly guestEmailDisplay = 'p:has-text("Email") ~ p, [class*="font-medium"] >> ../*/text("Email")/../..';
  readonly guestPhoneDisplay = 'p:has-text("Số điện thoại") ~ p, [class*="font-medium"] >> ../*/text("Số điện thoại")/../..';
  readonly checkInDateDisplay = 'p:has-text("Nhận phòng") ~ p';
  readonly checkOutDateDisplay = 'p:has-text("Trả phòng") ~ p';
  readonly totalNightsDisplay = 'p:has-text("Số đêm") ~ p';
  readonly roomDetailsSection = 'p:has-text("Phòng được đặt")';
  readonly roomsList = '[class*="bg-gray-50"][class*="p-3"]';
  readonly pricingSummaryCard = 'h2:has-text("Tổng cộng")';
  readonly totalPriceDisplay = '[class*="text-2xl"][class*="font-bold"]';
  readonly specialRequestsSection = 'p:has-text("Yêu cầu đặc biệt")';
  readonly guestInfoCard = 'h3:has-text("Thông tin khách hàng"), h2:has-text("Thông tin khách hàng")';
  readonly bookingDetailsCard = 'h3:has-text("Chi tiết đặt phòng"), h2:has-text("Chi tiết đặt phòng")';
  readonly cancelButton = 'button:has-text("Hủy"), button:has-text("Cancel")';
  readonly backLink = 'a[href*="/bookings"], button:has-text("Quay lại")';
  readonly loadingSpinner = '[class*="animate-spin"]';
  readonly errorMessage = '[class*="text-red"], .bg-red-50';
  readonly successMessage = '[class*="text-green"], .bg-green-50';
  readonly downloadButton = 'button:has-text("Download"), button:has-text("Tải")';
  readonly printButton = 'button:has-text("Print"), button:has-text("In")';

  /**
   * Navigate to booking confirmation page
   */
  async goto(...args: any[]) {
    const bookingId = args[0] as string;
    await super.goto(`/bookings/${bookingId}`);
  }

  /**
   * Wait for confirmation page to load
   */
  async waitForPageLoad() {
    await this.waitForReady();
    await this.page.waitForSelector(
      `${this.pageTitle}, ${this.errorMessage}`,
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
   * Get booking code
   */
  async getBookingCode(): Promise<string> {
    const exists = await this.elementExists(this.bookingCodeDisplay);
    if (exists) {
      const text = await this.getText(this.bookingCodeDisplay);
      // Extract code like "Mã: ABC123"
      const match = text.match(/[\w-]+$/);
      return match ? match[0] : '';
    }
    return '';
  }

  /**
   * Get booking status
   */
  async getBookingStatus(): Promise<string> {
    const exists = await this.elementExists(this.statusBadge);
    if (exists) {
      const text = await this.getText(this.statusBadge);
      return text.trim();
    }
    return '';
  }

  /**
   * Check if booking is confirmed
   */
  async isConfirmed(): Promise<boolean> {
    const status = await this.getBookingStatus();
    return status.includes('CONFIRMED');
  }

  /**
   * Check if booking is pending
   */
  async isPending(): Promise<boolean> {
    const status = await this.getBookingStatus();
    return status.includes('PENDING');
  }

  /**
   * Check if booking is cancelled
   */
  async isCancelled(): Promise<boolean> {
    const status = await this.getBookingStatus();
    return status.includes('CANCELLED');
  }

  /**
   * Get guest name
   */
  async getGuestName(): Promise<string> {
    const guestCard = this.page.locator(this.guestInfoCard).first();
    const name = await guestCard.locator('>> text=/Tên/').first().inputValue().catch(() => '');
    if (!name) {
      // Try alternate selector
      const parent = await guestCard.locator('..').first();
      const nameText = await parent.locator('>> text=/Tên/').first().evaluate(el => el.nextElementSibling?.textContent);
      return nameText || '';
    }
    return name;
  }

  /**
   * Get check-in date
   */
  async getCheckInDate(): Promise<string> {
    const text = await this.getText(this.checkInDateDisplay);
    return text.trim();
  }

  /**
   * Get check-out date
   */
  async getCheckOutDate(): Promise<string> {
    const text = await this.getText(this.checkOutDateDisplay);
    return text.trim();
  }

  /**
   * Get total nights
   */
  async getTotalNights(): Promise<number> {
    const text = await this.getText(this.totalNightsDisplay);
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Get booking details summary
   */
  async getBookingDetails(): Promise<{
    code: string;
    status: string;
    checkIn: string;
    checkOut: string;
    nights: number;
  }> {
    return {
      code: await this.getBookingCode(),
      status: await this.getBookingStatus(),
      checkIn: await this.getCheckInDate(),
      checkOut: await this.getCheckOutDate(),
      nights: await this.getTotalNights(),
    };
  }

  /**
   * Check if guest info section is visible
   */
  async hasGuestInfo(): Promise<boolean> {
    return this.elementExists(this.guestInfoCard);
  }

  /**
   * Check if booking details section is visible
   */
  async hasBookingDetailsSection(): Promise<boolean> {
    return this.elementExists(this.bookingDetailsCard);
  }

  /**
   * Check if room details are visible
   */
  async hasRoomDetails(): Promise<boolean> {
    return this.elementExists(this.roomDetailsSection);
  }

  /**
   * Get number of booked rooms
   */
  async getBookedRoomsCount(): Promise<number> {
    const rooms = await this.page.locator(this.roomsList).count();
    return rooms;
  }

  /**
   * Check if special requests are displayed
   */
  async hasSpecialRequests(): Promise<boolean> {
    return this.elementExists(this.specialRequestsSection);
  }

  /**
   * Get special requests text
   */
  async getSpecialRequests(): Promise<string> {
    if (await this.hasSpecialRequests()) {
      const section = this.page.locator(this.specialRequestsSection).first();
      const requests = await section.locator('..').first().locator('p').last().textContent();
      return requests || '';
    }
    return '';
  }

  /**
   * Get total price display
   */
  async getTotalPrice(): Promise<number> {
    const exists = await this.elementExists(this.totalPriceDisplay);
    if (exists) {
      const text = await this.getText(this.totalPriceDisplay);
      const match = text.match(/[\d,]+/);
      if (match) {
        return parseInt(match[0].replace(/,/g, ''), 10);
      }
    }
    return 0;
  }

  /**
   * Get error message
   */
  async getErrorMessage(): Promise<string> {
    const exists = await this.elementExists(this.errorMessage);
    if (exists) {
      return this.getText(this.errorMessage);
    }
    return '';
  }

  /**
   * Check if error is displayed
   */
  async hasError(): Promise<boolean> {
    return this.elementExists(this.errorMessage);
  }

  /**
   * Click cancel booking button
   */
  async clickCancelButton() {
    const btn = this.page.locator(this.cancelButton).first();
    if (await btn.isVisible()) {
      await btn.click();
      // Wait for confirmation dialog
      await this.page.waitForTimeout(500);
    }
  }

  /**
   * Confirm cancellation in dialog
   */
  async confirmCancellation() {
    // Handle browser confirmation dialog
    this.page.once('dialog', dialog => dialog.accept());
    // Click cancel again if needed
    const btn = this.page.locator(this.cancelButton).first();
    if (await btn.isVisible()) {
      await btn.click();
    }
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click back link
   */
  async clickBack() {
    const backBtn = this.page.locator(this.backLink).first();
    if (await backBtn.isVisible()) {
      await backBtn.click();
      await this.waitForNavigation();
    }
  }

  /**
   * Check if print button is visible
   */
  async hasPrintButton(): Promise<boolean> {
    return this.elementExists(this.printButton);
  }

  /**
   * Check if download button is visible
   */
  async hasDownloadButton(): Promise<boolean> {
    return this.elementExists(this.downloadButton);
  }

  /**
   * Get URL to verify correct page
   */
  async getURL(): Promise<string> {
    return this.page.url();
  }

  /**
   * Verify booking confirmation is complete
   */
  async verifyConfirmationComplete(): Promise<boolean> {
    const hasCode = (await this.getBookingCode()).length > 0;
    const hasStatus = (await this.getBookingStatus()).length > 0;
    const hasDetails = await this.hasBookingDetailsSection();
    const hasInfo = await this.hasGuestInfo();

    return hasCode && hasStatus && hasDetails && hasInfo;
  }
}
