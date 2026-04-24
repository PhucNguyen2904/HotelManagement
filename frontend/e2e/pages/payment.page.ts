import { BasePage } from './base.page';

/**
 * PaymentPage - Payment processing page
 * Handles: payment method selection (VNPAY, MOMO, CASH, BANK_TRANSFER), payment confirmation, error handling
 */
export class PaymentPage extends BasePage {
  // Selectors - Payment Method Selection
  readonly pageTitle = 'h1';
  readonly paymentMethodsContainer = '[class*="payment"], [class*="Payment"], form:has(input[type="radio"])';
  readonly vnpayOption = 'label:has-text("VNPay"), input[value="VNPAY"]';
  readonly momoOption = 'label:has-text("Momo"), input[value="MOMO"]';
  readonly cashOption = 'label:has-text("Tiền mặt"), label:has-text("Cash"), input[value="CASH"]';
  readonly bankTransferOption = 'label:has-text("Chuyển khoản"), label:has-text("Bank"), input[value="BANK_TRANSFER"]';
  readonly payButton = 'button:has-text("Thanh toán"), button:has-text("Pay"), button:has-text("Process Payment")';
  readonly confirmButton = 'button[type="submit"]:has-text("Xác nhận")';

  // Selectors - Booking Information
  readonly bookingCodeDisplay = '[class*="code"], [class*="booking-id"], span:has-text("Mã")';
  readonly amountDisplay = '[class*="amount"], span:has-text("Tổng")';
  readonly bookingDetailsCard = '[class*="summary"], [class*="details"], [class*="Card"]';
  readonly bookingRoomInfo = '[class*="room"], p[class*="font-semibold"]';
  readonly bookingDateInfo = 'span:has-text("Nhận"), span:has-text("Trả")';

  // Selectors - Status & Messaging
  readonly errorMessage = '.text-red-600, [role="alert"], .bg-red-50';
  readonly successMessage = '.text-green-600, [role="status"]';
  readonly loadingSpinner = '[class*="animate-spin"], [class*="loading"]';
  readonly processingMessage = 'span:has-text("Đang xử lý"), span:has-text("Processing")';

  // Selectors - Information
  readonly securePaymentBadge = 'span:has-text("Secure"), span:has-text("SSL")';
  readonly currencyDisplay = 'span:has-text("VND"), span:has-text("₫")';

  /**
   * Navigate to payment page
   */
  async goto(...args: any[]) {
    const bookingId = args[0] as string;
    await super.goto(`/bookings/${bookingId}/payment`);
  }

  /**
   * Wait for payment page to load
   */
  async waitForPageLoad() {
    await this.waitForReady();
    await this.page.waitForSelector(
      `${this.pageTitle}, ${this.errorMessage}, ${this.loadingSpinner}`,
      { timeout: 10000 }
    ).catch(() => {
      // Element may not exist immediately
    });
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    const exists = await this.elementExists(this.pageTitle);
    if (exists) {
      return this.getText(this.pageTitle);
    }
    return '';
  }

  /**
   * Check if page is loading
   */
  async isLoading(): Promise<boolean> {
    return this.elementExists(this.loadingSpinner);
  }

  /**
   * Check if processing message is displayed
   */
  async isProcessing(): Promise<boolean> {
    return this.elementExists(this.processingMessage);
  }

  /**
   * Get all available payment methods
   */
  async getAvailablePaymentMethods(): Promise<string[]> {
    const methods: string[] = [];

    if (await this.elementExists(this.vnpayOption)) methods.push('VNPAY');
    if (await this.elementExists(this.momoOption)) methods.push('MOMO');
    if (await this.elementExists(this.cashOption)) methods.push('CASH');
    if (await this.elementExists(this.bankTransferOption)) methods.push('BANK_TRANSFER');

    return methods;
  }

  /**
   * Select payment method
   */
  async selectPaymentMethod(method: 'VNPAY' | 'MOMO' | 'CASH' | 'BANK_TRANSFER') {
    let selector = '';
    switch (method) {
      case 'VNPAY':
        selector = this.vnpayOption;
        break;
      case 'MOMO':
        selector = this.momoOption;
        break;
      case 'CASH':
        selector = this.cashOption;
        break;
      case 'BANK_TRANSFER':
        selector = this.bankTransferOption;
        break;
    }

    if (selector) {
      const checkbox = this.page.locator(`input[value="${method}"]`).first();
      await checkbox.click();
      await this.page.waitForTimeout(300);
    }
  }

  /**
   * Check if payment method is selected
   */
  async isPaymentMethodSelected(method: string): Promise<boolean> {
    const input = this.page.locator(`input[value="${method}"]`).first();
    return input.isChecked();
  }

  /**
   * Get booking code/ID
   */
  async getBookingCode(): Promise<string> {
    const exists = await this.elementExists(this.bookingCodeDisplay);
    if (exists) {
      const text = await this.getText(this.bookingCodeDisplay);
      // Extract booking code from text
      const match = text.match(/[\w-]+/);
      return match ? match[0] : '';
    }
    return '';
  }

  /**
   * Get payment amount
   */
  async getPaymentAmount(): Promise<number> {
    const exists = await this.elementExists(this.amountDisplay);
    if (exists) {
      const text = await this.getText(this.amountDisplay);
      const match = text.match(/[\d,]+/);
      if (match) {
        return parseInt(match[0].replace(/,/g, ''), 10);
      }
    }
    return 0;
  }

  /**
   * Click pay button
   */
  async clickPay() {
    await this.click(this.payButton);
    await this.page.waitForTimeout(500);
  }

  /**
   * Click confirm button
   */
  async clickConfirm() {
    const confirmBtn = this.page.locator(this.confirmButton).first();
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click();
      await this.page.waitForTimeout(500);
    }
  }

  /**
   * Process payment with specific method
   */
  async processPayment(method: 'VNPAY' | 'MOMO' | 'CASH' | 'BANK_TRANSFER') {
    // Select payment method
    await this.selectPaymentMethod(method);

    // Wait for method to be selected
    await this.page.waitForTimeout(300);

    // Click confirm/pay button
    const payButton = this.page.locator(this.payButton).first();
    if (await payButton.isVisible()) {
      await this.clickPay();
    } else {
      await this.clickConfirm();
    }

    // Wait for processing
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get error message
   */
  async getErrorMessage(): Promise<string> {
    const exists = await this.elementExists(this.errorMessage);
    if (exists) {
      const errors = await this.getTextList(this.errorMessage);
      return errors.join(', ');
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
   * Get success message
   */
  async getSuccessMessage(): Promise<string> {
    const exists = await this.elementExists(this.successMessage);
    if (exists) {
      return this.getText(this.successMessage);
    }
    return '';
  }

  /**
   * Check if success message is displayed
   */
  async hasSuccess(): Promise<boolean> {
    return this.elementExists(this.successMessage);
  }

  /**
   * Check if booking details are displayed
   */
  async hasBookingDetails(): Promise<boolean> {
    return this.elementExists(this.bookingDetailsCard);
  }

  /**
   * Get booking details summary
   */
  async getBookingDetails(): Promise<{
    code: string;
    amount: number;
    room?: string;
    dates?: string;
  }> {
    return {
      code: await this.getBookingCode(),
      amount: await this.getPaymentAmount(),
      room: await this.elementExists(this.bookingRoomInfo) ? await this.getText(this.bookingRoomInfo) : undefined,
      dates: await this.elementExists(this.bookingDateInfo) ? await this.getText(this.bookingDateInfo) : undefined,
    };
  }

  /**
   * Check if secure payment badge is displayed
   */
  async hasSecurePaymentBadge(): Promise<boolean> {
    return this.elementExists(this.securePaymentBadge);
  }

  /**
   * Check if payment methods are visible
   */
  async hasPaymentMethods(): Promise<boolean> {
    return this.elementExists(this.paymentMethodsContainer);
  }

  /**
   * Check if pay button is visible
   */
  async isPayButtonVisible(): Promise<boolean> {
    return this.elementExists(this.payButton);
  }

  /**
   * Get URL to verify correct page
   */
  async getURL(): Promise<string> {
    return this.page.url();
  }

  /**
   * Verify payment page is properly loaded with all elements
   */
  async verifyPageComplete(): Promise<boolean> {
    const hasTitle = await this.elementExists(this.pageTitle);
    const hasMethods = await this.hasPaymentMethods();
    const hasDetails = await this.hasBookingDetails();
    const hasButton = await this.isPayButtonVisible();

    return hasTitle && hasMethods && hasDetails && hasButton;
  }

  /**
   * Retry failed payment
   */
  async retryPayment() {
    // Find and click retry button if available
    const retryButton = this.page.locator('button:has-text("Retry"), button:has-text("Thử lại")').first();
    if (await retryButton.isVisible()) {
      await retryButton.click();
      await this.page.waitForTimeout(500);
    }
  }

  /**
   * Go back to booking details
   */
  async goBackToBooking() {
    const backButton = this.page.locator('a[href*="/bookings"], button:has-text("Quay lại")').first();
    if (await backButton.isVisible()) {
      await backButton.click();
      await this.waitForNavigation();
    }
  }
}
