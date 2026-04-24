import { BasePage } from './base.page';

/**
 * LoginPage - User authentication page
 * Handles: email/password login, form validation, error handling
 */
export class LoginPage extends BasePage {
  // Selectors
  readonly emailInput = 'input[type="email"]';
  readonly passwordInput = 'input[type="password"]';
  readonly submitButton = 'button[type="submit"]';
  readonly errorMessage = '[role="alert"], .error, .text-red-500';
  readonly loginForm = 'form';
  readonly registerLink = 'a:has-text("Đăng ký")';
  readonly forgotPasswordLink = 'a:has-text("Quên mật khẩu")';
  readonly pageTitle = 'h1';
  readonly emailError = 'input[type="email"] + .error, input[type="email"] ~ [role="alert"]';
  readonly passwordError = 'input[type="password"] + .error, input[type="password"] ~ [role="alert"]';

  /**
   * Navigate to login page
   */
  async goto() {
    await super.goto('/(auth)/login');
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return this.getText(this.pageTitle);
  }

  /**
   * Check if login form is visible
   */
  async isFormVisible(): Promise<boolean> {
    return this.isVisible(this.loginForm);
  }

  /**
   * Fill email input
   */
  async setEmail(email: string) {
    await this.fill(this.emailInput, email);
  }

  /**
   * Fill password input
   */
  async setPassword(password: string) {
    await this.fill(this.passwordInput, password);
  }

  /**
   * Click submit button
   */
  async clickSubmit() {
    await this.click(this.submitButton);
    // Wait for either success navigation or error message
    await this.page.waitForTimeout(500);
  }

  /**
   * Complete login flow
   */
  async login(email: string, password: string) {
    await this.setEmail(email);
    await this.setPassword(password);
    await this.clickSubmit();
    // Wait for navigation or error
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
   * Get email field error
   */
  async getEmailError(): Promise<string> {
    const hasError = await this.elementExists(this.emailError);
    if (!hasError) return '';
    return this.getText(this.emailError);
  }

  /**
   * Get password field error
   */
  async getPasswordError(): Promise<string> {
    const hasError = await this.elementExists(this.passwordError);
    if (!hasError) return '';
    return this.getText(this.passwordError);
  }

  /**
   * Click register link
   */
  async clickRegisterLink() {
    await this.click(this.registerLink);
    await this.waitForNavigation();
  }

  /**
   * Click forgot password link
   */
  async clickForgotPasswordLink() {
    await this.click(this.forgotPasswordLink);
    await this.waitForNavigation();
  }

  /**
   * Check if email field is focused
   */
  async isEmailFocused(): Promise<boolean> {
    return this.page.evaluate(() => {
      return document.activeElement?.getAttribute('type') === 'email';
    });
  }

  /**
   * Check if password field is focused
   */
  async isPasswordFocused(): Promise<boolean> {
    return this.page.evaluate(() => {
      return document.activeElement?.getAttribute('type') === 'password';
    });
  }

  /**
   * Get submit button text
   */
  async getSubmitButtonText(): Promise<string> {
    return this.getText(this.submitButton);
  }

  /**
   * Check if submit button is disabled
   */
  async isSubmitDisabled(): Promise<boolean> {
    const isDisabled = await this.page.locator(this.submitButton).isDisabled();
    return isDisabled;
  }

  /**
   * Clear email field
   */
  async clearEmail() {
    const input = this.page.locator(this.emailInput);
    await input.clear();
  }

  /**
   * Clear password field
   */
  async clearPassword() {
    const input = this.page.locator(this.passwordInput);
    await input.clear();
  }

  /**
   * Check email field value
   */
  async getEmailValue(): Promise<string> {
    return this.page.locator(this.emailInput).inputValue();
  }

  /**
   * Check password field value
   */
  async getPasswordValue(): Promise<string> {
    return this.page.locator(this.passwordInput).inputValue();
  }

  /**
   * Submit form using keyboard (Enter key)
   */
  async submitWithEnter() {
    await this.page.locator(this.passwordInput).press('Enter');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verify login success by checking if redirected to home
   */
  async verifyLoginSuccess(): Promise<boolean> {
    const url = await this.getURL();
    // Should be redirected away from login page
    return !url.includes('login');
  }

  /**
   * Get all form input values
   */
  async getFormValues(): Promise<{ email: string; password: string }> {
    return {
      email: await this.getEmailValue(),
      password: await this.getPasswordValue(),
    };
  }
}
