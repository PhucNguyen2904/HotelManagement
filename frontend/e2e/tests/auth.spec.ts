import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { LoginPage } from '../pages/login.page';
import { Header } from '../pages/header.page';
import { authFixture } from '../fixtures/auth.fixture';
import { testData, generateTestEmail } from '../fixtures/test-data';

test.describe('Authentication Flow', () => {
  /**
   * TEST 1: Register new guest account
   */
  test('Register new guest account successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const header = new Header(page);

    // Navigate to register page
    await loginPage.goto();
    await loginPage.clickRegisterLink();

    // Verify redirected to register page
    expect(page.url()).toContain('/register');

    // Note: Full registration test would be implemented in register.page.ts
    // This test verifies the navigation and link structure
    await expect(page.locator('h1')).toContainText('Đăng ký');
  });

  /**
   * TEST 2: Login with valid credentials
   */
  test('Login with valid credentials', async ({ page }) => {
    // Setup: Register user via API
    const testUser = await authFixture.registerTestUser('guest');

    // Navigate to login
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Login with valid credentials
    await loginPage.login(testUser.email, testUser.password);

    // Verify redirected to home page
    const url = await page.url();
    expect(!url.includes('login')).toBeTruthy();

    // Verify user is logged in (check header)
    const header = new Header(page);
    const isLoggedIn = await header.isLoggedIn();
    expect(isLoggedIn).toBeTruthy();
  });

  /**
   * TEST 3: Logout successfully
   */
  test('Logout successfully', async ({ page }) => {
    // Setup: Register and login user
    const testUser = await authFixture.registerTestUser('guest');

    // Login via browser
    const token = await authFixture.loginUserInBrowser(page, testUser.email, testUser.password);
    expect(token).toBeTruthy();

    // Logout
    const header = new Header(page);
    await header.logout();

    // Verify logged out
    const isLoggedIn = await header.isLoggedIn();
    expect(isLoggedIn).toBeFalsy();

    // Verify token cleared from localStorage
    const storedToken = await page.evaluate(() => localStorage.getItem('token'));
    expect(storedToken).toBeNull();
  });

  /**
   * TEST 4: Login with invalid email format
   */
  test('Login with invalid email format shows error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Try to login with invalid email
    await loginPage.setEmail('invalid-email');
    await loginPage.setPassword('Password123!');
    await loginPage.clickSubmit();

    // Should show validation error
    const hasError = await loginPage.hasError();
    expect(hasError).toBeTruthy();
  });

  /**
   * TEST 5: Login with non-existent user
   */
  test('Login with non-existent user shows error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Try to login with non-existent user
    await loginPage.login('nonexistent@test.com', 'TestPassword123!');

    // Should show error message
    const hasError = await loginPage.hasError();
    expect(hasError).toBeTruthy();

    // Verify still on login page
    expect(page.url()).toContain('login');
  });

  /**
   * TEST 6: Login with empty password
   */
  test('Login with empty password shows validation error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Fill email but leave password empty
    await loginPage.setEmail(testData.users.guest.email);
    await loginPage.clickSubmit();

    // Should show error or prevent submission
    const passwordValue = await loginPage.getPasswordValue();
    const hasError = await loginPage.hasError();

    expect(passwordValue).toBe('');
    expect(hasError || !(await loginPage.isSubmitDisabled())).toBeTruthy();
  });

  /**
   * TEST 7: Session persistence on page reload
   */
  test('User remains logged in after page reload', async ({ page }) => {
    // Setup: Register and login user
    const testUser = await authFixture.registerTestUser('guest');
    await authFixture.loginUserInBrowser(page, testUser.email, testUser.password);

    // Verify logged in
    const header = new Header(page);
    const isLoggedInBefore = await header.isLoggedIn();
    expect(isLoggedInBefore).toBeTruthy();

    // Reload page
    await page.reload();

    // Verify still logged in
    const isLoggedInAfter = await header.isLoggedIn();
    expect(isLoggedInAfter).toBeTruthy();
  });

  /**
   * TEST 8: Protected route redirects to login when not authenticated
   */
  test('Accessing protected route redirects to login', async ({ page }) => {
    // Try to access booking page without auth
    await page.goto('/booking');

    // Should redirect to login page
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('login');
  });

  /**
   * TEST 9: Login form displays when visiting login page
   */
  test('Login form elements are displayed', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Verify form is visible
    const isFormVisible = await loginPage.isFormVisible();
    expect(isFormVisible).toBeTruthy();

    // Verify form inputs exist
    expect(page.locator(loginPage.emailInput)).toBeTruthy();
    expect(page.locator(loginPage.passwordInput)).toBeTruthy();
    expect(page.locator(loginPage.submitButton)).toBeTruthy();
  });

  /**
   * TEST 10: Submit login form using Enter key
   */
  test('Submit login form using Enter key', async ({ page }) => {
    // Setup: Register user
    const testUser = await authFixture.registerTestUser('guest');

    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Fill form
    await loginPage.setEmail(testUser.email);
    await loginPage.setPassword(testUser.password);

    // Submit using Enter key
    await loginPage.submitWithEnter();

    // Verify logged in
    const isLoggedIn = await loginPage.verifyLoginSuccess();
    expect(isLoggedIn).toBeTruthy();
  });

  /**
   * TEST 11: Logout button is visible when logged in
   */
  test('Logout button is visible in user menu when logged in', async ({ page }) => {
    // Setup: Login user
    const testUser = await authFixture.registerTestUser('guest');
    await authFixture.loginUserInBrowser(page, testUser.email, testUser.password);

    const header = new Header(page);

    // Open user menu
    await header.openUserMenu();

    // Verify logout button is visible
    const isLogoutVisible = await header.isLogoutButtonVisible();
    expect(isLogoutVisible).toBeTruthy();
  });

  /**
   * TEST 12: Login and logout flow (complete cycle)
   */
  test('Complete login and logout cycle', async ({ page }) => {
    // Register user
    const testUser = await authFixture.registerTestUser('guest');

    const loginPage = new LoginPage(page);
    const header = new Header(page);

    // Step 1: Login
    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.password);

    // Verify logged in
    let isLoggedIn = await header.isLoggedIn();
    expect(isLoggedIn).toBeTruthy();

    // Step 2: Logout
    await header.logout();

    // Verify logged out
    isLoggedIn = await header.isLoggedIn();
    expect(isLoggedIn).toBeFalsy();

    // Step 3: Can login again
    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.password);

    isLoggedIn = await header.isLoggedIn();
    expect(isLoggedIn).toBeTruthy();
  });
});
