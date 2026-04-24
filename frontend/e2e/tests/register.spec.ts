import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/register.page';
import { LoginPage } from '../pages/login.page';
import { authFixture } from '../fixtures/auth.fixture';
import { generateTestEmail, testData } from '../fixtures/test-data';

test.describe('Registration Flow', () => {
  /**
   * TEST 1: Register new guest account successfully
   */
  test('Register new guest account successfully', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);

    // Navigate to register page
    await registerPage.goto();

    // Verify page loaded
    expect(page.url()).toContain('/register');
    const isFormVisible = await registerPage.isFormVisible();
    expect(isFormVisible).toBeTruthy();

    // Register with valid data
    const testEmail = generateTestEmail('newguest');
    await registerPage.register(
      'Nguyễn Văn A',
      testEmail,
      '0901234567',
      'TestPassword123',
      'TestPassword123'
    );

    // Verify redirected to login page
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/login');
  });

  /**
   * TEST 2: Password mismatch validation error
   */
  test('Show error when passwords do not match', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    // Navigate to register page
    await registerPage.goto();

    // Fill form with mismatched passwords
    const testEmail = generateTestEmail('mismatch');
    await registerPage.setFullName('Test User');
    await registerPage.setEmail(testEmail);
    await registerPage.setPhone('0901234567');
    await registerPage.setPassword('TestPassword123');
    await registerPage.setConfirmPassword('DifferentPassword123');

    // Submit form
    await registerPage.clickSubmit();

    // Verify error message is displayed
    await page.waitForTimeout(500);
    const hasError = await registerPage.hasError();
    expect(hasError).toBeTruthy();

    // Error should mention password mismatch
    const errorMessage = await registerPage.getErrorMessage();
    expect(errorMessage.toLowerCase()).toContain('mật khẩu');
  });

  /**
   * TEST 3: Password too short validation error
   */
  test('Show error when password is less than 6 characters', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    // Navigate to register page
    await registerPage.goto();

    // Fill form with short password
    const testEmail = generateTestEmail('shortpass');
    await registerPage.setFullName('Test User');
    await registerPage.setEmail(testEmail);
    await registerPage.setPhone('0901234567');
    await registerPage.setPassword('short');
    await registerPage.setConfirmPassword('short');

    // Submit form
    await registerPage.clickSubmit();

    // Verify error message is displayed
    await page.waitForTimeout(500);
    const hasError = await registerPage.hasError();
    expect(hasError).toBeTruthy();

    // Error should mention password length
    const errorMessage = await registerPage.getErrorMessage();
    expect(errorMessage.toLowerCase()).toContain('ít nhất');
  });

  /**
   * TEST 4: Duplicate email validation error
   */
  test('Show error when email already exists', async ({ page }) => {
    // Setup: Create a user first
    const existingUser = await authFixture.registerTestUser('guest');

    const registerPage = new RegisterPage(page);

    // Navigate to register page
    await registerPage.goto();

    // Try to register with existing email
    await registerPage.setFullName('Another User');
    await registerPage.setEmail(existingUser.email);
    await registerPage.setPhone('0901234567');
    await registerPage.setPassword('TestPassword123');
    await registerPage.setConfirmPassword('TestPassword123');

    // Submit form
    await registerPage.clickSubmit();

    // Verify error message is displayed
    await page.waitForTimeout(500);
    const hasError = await registerPage.hasError();
    expect(hasError).toBeTruthy();

    // Verify still on register page
    expect(page.url()).toContain('/register');
  });

  /**
   * TEST 5: Required fields validation
   */
  test('Prevent submission when required fields are empty', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    // Navigate to register page
    await registerPage.goto();

    // Leave required fields empty and try to submit
    await registerPage.setEmail('');
    await registerPage.setPassword('');
    await registerPage.setConfirmPassword('');

    // Get initial state
    const emailValue = await registerPage.getEmailValue();
    const passwordValue = await registerPage.getPasswordValue();

    // Verify fields are empty
    expect(emailValue).toBe('');
    expect(passwordValue).toBe('');

    // Try to submit
    await registerPage.clickSubmit();

    // Either form should not submit or show validation error
    // Browser HTML5 validation should prevent submission
    await page.waitForTimeout(500);
    const stillOnRegister = page.url().includes('/register');
    expect(stillOnRegister).toBeTruthy();
  });

  /**
   * TEST 6: Navigation to login page
   */
  test('Navigate to login page from register page', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    // Navigate to register page
    await registerPage.goto();

    // Click login link
    await registerPage.clickLoginLink();

    // Verify redirected to login page
    expect(page.url()).toContain('/login');
  });

  /**
   * TEST 7: Form persistence during typing
   */
  test('Form inputs maintain values while typing', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    // Navigate to register page
    await registerPage.goto();

    // Fill form
    const testEmail = generateTestEmail('formtest');
    const fullName = 'Test User Full Name';
    const phone = '0901234567';
    const password = 'TestPassword123';

    await registerPage.setFullName(fullName);
    await registerPage.setEmail(testEmail);
    await registerPage.setPhone(phone);
    await registerPage.setPassword(password);
    await registerPage.setConfirmPassword(password);

    // Get values
    const values = await registerPage.getFormValues();

    // Verify all values are correct
    expect(values.fullName).toBe(fullName);
    expect(values.email).toBe(testEmail);
    expect(values.phone).toBe(phone);
    expect(values.password).toBe(password);
    expect(values.confirmPassword).toBe(password);
  });

  /**
   * TEST 8: Submit form using Enter key
   */
  test('Submit form using Enter key on confirm password field', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    // Navigate to register page
    await registerPage.goto();

    // Fill form
    const testEmail = generateTestEmail('enterkey');
    await registerPage.setFullName('Test User');
    await registerPage.setEmail(testEmail);
    await registerPage.setPhone('0901234567');
    await registerPage.setPassword('TestPassword123');
    await registerPage.setConfirmPassword('TestPassword123');

    // Submit using Enter key
    await registerPage.submitWithEnter();

    // Verify redirected to login page
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/login');
  });

  /**
   * TEST 9: Register form displays correctly
   */
  test('Register form elements are displayed correctly', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    // Navigate to register page
    await registerPage.goto();

    // Verify form is visible
    const isFormVisible = await registerPage.isFormVisible();
    expect(isFormVisible).toBeTruthy();

    // Verify page title
    const pageTitle = await registerPage.getPageTitle();
    expect(pageTitle).toContain('Đăng ký');

    // Verify form inputs exist
    const emailExists = await registerPage.elementExists(registerPage.emailInput);
    const passwordExists = await registerPage.elementExists(registerPage.passwordInput);
    const submitButtonExists = await registerPage.elementExists(registerPage.submitButton);

    expect(emailExists).toBeTruthy();
    expect(passwordExists).toBeTruthy();
    expect(submitButtonExists).toBeTruthy();

    // Verify button text
    const submitButtonText = await registerPage.getSubmitButtonText();
    expect(submitButtonText).toContain('Đăng ký');
  });

  /**
   * TEST 10: Phone field is optional
   */
  test('Register successfully without providing phone number', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    // Navigate to register page
    await registerPage.goto();

    // Register without phone number
    const testEmail = generateTestEmail('nophone');
    await registerPage.setFullName('Test User');
    await registerPage.setEmail(testEmail);
    // Skip phone
    await registerPage.setPassword('TestPassword123');
    await registerPage.setConfirmPassword('TestPassword123');

    // Submit form
    await registerPage.clickSubmit();

    // Verify redirected to login page
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/login');
  });
});
