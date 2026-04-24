/**
 * Auth Fixture - Pre-authenticated user for tests
 */

import { Page } from '@playwright/test';
import { apiUtil } from '../utils/api.util';
import { testData, generateTestEmail } from './test-data';

export interface AuthUser {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  userId: string;
  accessToken: string;
}

/**
 * Register a new user via API
 */
export async function registerTestUser(role: 'guest' | 'staff' = 'guest'): Promise<AuthUser> {
  const email = generateTestEmail(role);
  const userData = {
    email,
    password: testData.users.guest.password,
    fullName: `Test ${role}`,
    phone: testData.users.guest.phone,
  };

  try {
    const user = await apiUtil.registerUser(userData);
    const loginResponse = await apiUtil.loginUser(email, userData.password);

    return {
      email,
      password: userData.password,
      fullName: userData.fullName,
      phone: userData.phone,
      userId: user.id,
      accessToken: loginResponse.accessToken,
    };
  } catch (error) {
    console.error('Failed to register test user:', error);
    throw error;
  }
}

/**
 * Login user via API
 */
export async function loginTestUser(email: string, password: string): Promise<AuthUser> {
  const loginResponse = await apiUtil.loginUser(email, password);

  return {
    email,
    password,
    fullName: loginResponse.user.fullName,
    phone: '', // Not returned from login
    userId: loginResponse.user.id,
    accessToken: loginResponse.accessToken,
  };
}

/**
 * Login user in browser (via UI)
 * Stores token in localStorage
 */
export async function loginUserInBrowser(page: Page, email: string, password: string) {
  await page.goto('/');
  
  // Click login button in header
  await page.click('a[href="/(auth)/login"]');
  await page.waitForLoadState('networkidle');

  // Fill form
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);

  // Submit
  await page.click('button[type="submit"]');

  // Wait for navigation
  await page.waitForLoadState('networkidle');

  // Verify logged in
  const localStorageToken = await page.evaluate(() => {
    return localStorage.getItem('token') || localStorage.getItem('accessToken');
  });

  if (!localStorageToken) {
    throw new Error('Failed to login - no token in localStorage');
  }

  return localStorageToken;
}

/**
 * Logout user in browser
 */
export async function logoutUserInBrowser(page: Page) {
  // Click user menu
  await page.click('[data-testid="user-menu"]');
  await page.waitForTimeout(200);

  // Click logout
  await page.click('[data-testid="logout-button"]');

  // Wait for navigation to home
  await page.waitForLoadState('networkidle');

  // Verify logged out
  const token = await page.evaluate(() => {
    return localStorage.getItem('token') || localStorage.getItem('accessToken');
  });

  if (token) {
    throw new Error('Failed to logout - token still in localStorage');
  }
}

/**
 * Get authenticated page context (with token in localStorage)
 */
export async function getAuthenticatedPage(page: Page, token: string): Promise<Page> {
  await page.evaluate((t: string) => {
    localStorage.setItem('token', t);
    localStorage.setItem('accessToken', t);
  }, token);

  return page;
}

/**
 * Clear all auth data from browser
 */
export async function clearAuthData(page: Page) {
  await page.evaluate(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    sessionStorage.clear();
  });
}

export const authFixture = {
  registerTestUser,
  loginTestUser,
  loginUserInBrowser,
  logoutUserInBrowser,
  getAuthenticatedPage,
  clearAuthData,
};
