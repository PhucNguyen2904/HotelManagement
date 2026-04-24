import { BasePage } from './base.page';

/**
 * RegisterPage - User registration page
 * Handles: form filling, validation, password confirmation, error handling
 */
export class RegisterPage extends BasePage {
  // Selectors
  readonly fullNameInput = 'input[name="fullName"]';
  readonly emailInput = 'input[name="email"]';
  readonly phoneInput = 'input[name="phone"]';
  readonly passwordInput = 'input[name="password"]';
  readonly confirmPasswordInput = 'input[name="confirmPassword"]';
  readonly submitButton = 'button[type="submit"]';
  readonly errorMessage = '.bg-red-50, [role="alert"]';
  readonly loginLink = 'a:has-text("Đăng nhập")';
  readonly pageTitle = 'h1';
  readonly registerForm = 'form';

  /**
   * Navigate to register page
   */
  async goto() {
    await super.goto('/(auth)/register');
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return this.getText(this.pageTitle);
  }

  /**
   * Check if register form is visible
   */
  async isFormVisible(): Promise<boolean> {
    return this.isVisible(this.registerForm);
  }

  /**
   * Fill full name input
   */
  async setFullName(name: string) {
    await this.fill(this.fullNameInput, name);
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
   * Fill password input
   */
  async setPassword(password: string) {
    await this.fill(this.passwordInput, password);
  }

  /**
   * Fill confirm password input
   */
  async setConfirmPassword(password: string) {
    await this.fill(this.confirmPasswordInput, password);
  }

  /**
   * Click submit button
   */
  async clickSubmit() {
    await this.click(this.submitButton);
    await this.page.waitForTimeout(500);
  }

  /**
   * Complete registration flow
   */
  async register(
    fullName: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string
  ) {
    await this.setFullName(fullName);
    await this.setEmail(email);
    await this.setPhone(phone);
    await this.setPassword(password);
    await this.setConfirmPassword(confirmPassword);
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
   * Click login link
   */
  async clickLoginLink() {
    await this.click(this.loginLink);
    await this.waitForNavigation();
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
   * Clear full name field
   */
  async clearFullName() {
    const input = this.page.locator(this.fullNameInput);
    await input.clear();
  }

  /**
   * Clear email field
   */
  async clearEmail() {
    const input = this.page.locator(this.emailInput);
    await input.clear();
  }

  /**
   * Clear phone field
   */
  async clearPhone() {
    const input = this.page.locator(this.phoneInput);
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
   * Clear confirm password field
   */
  async clearConfirmPassword() {
    const input = this.page.locator(this.confirmPasswordInput);
    await input.clear();
  }

  /**
   * Get full name field value
   */
  async getFullNameValue(): Promise<string> {
    return this.page.locator(this.fullNameInput).inputValue();
  }

  /**
   * Get email field value
   */
  async getEmailValue(): Promise<string> {
    return this.page.locator(this.emailInput).inputValue();
  }

  /**
   * Get phone field value
   */
  async getPhoneValue(): Promise<string> {
    return this.page.locator(this.phoneInput).inputValue();
  }

  /**
   * Get password field value
   */
  async getPasswordValue(): Promise<string> {
    return this.page.locator(this.passwordInput).inputValue();
  }

  /**
   * Get confirm password field value
   */
  async getConfirmPasswordValue(): Promise<string> {
    return this.page.locator(this.confirmPasswordInput).inputValue();
  }

  /**
   * Get all form input values
   */
  async getFormValues(): Promise<{
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }> {
    return {
      fullName: await this.getFullNameValue(),
      email: await this.getEmailValue(),
      phone: await this.getPhoneValue(),
      password: await this.getPasswordValue(),
      confirmPassword: await this.getConfirmPasswordValue(),
    };
  }

  /**
   * Verify registration success by checking if redirected to login
   */
  async verifyRegistrationSuccess(): Promise<boolean> {
    const url = await this.getURL();
    return url.includes('/login');
  }

  /**
   * Submit form using keyboard (Enter key)
   */
  async submitWithEnter() {
    await this.page.locator(this.confirmPasswordInput).press('Enter');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if full name field is focused
   */
  async isFullNameFocused(): Promise<boolean> {
    return this.page.evaluate(() => {
      return document.activeElement?.getAttribute('name') === 'fullName';
    });
  }

  /**
   * Check if email field is focused
   */
  async isEmailFocused(): Promise<boolean> {
    return this.page.evaluate(() => {
      return document.activeElement?.getAttribute('name') === 'email';
    });
  }

  /**
   * Check if phone field is focused
   */
  async isPhoneFocused(): Promise<boolean> {
    return this.page.evaluate(() => {
      return document.activeElement?.getAttribute('name') === 'phone';
    });
  }

  /**
   * Check if password field is focused
   */
  async isPasswordFocused(): Promise<boolean> {
    return this.page.evaluate(() => {
      return document.activeElement?.getAttribute('name') === 'password';
    });
  }

  /**
   * Check if confirm password field is focused
   */
  async isConfirmPasswordFocused(): Promise<boolean> {
    return this.page.evaluate(() => {
      return document.activeElement?.getAttribute('name') === 'confirmPassword';
    });
  }
}
