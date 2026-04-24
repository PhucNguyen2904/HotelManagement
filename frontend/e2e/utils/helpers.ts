/**
 * Helpers - Utility functions for tests
 */

import { Page, expect } from '@playwright/test';

/**
 * Wait for a condition to be true
 */
export async function waitForCondition(
  condition: () => Promise<boolean>,
  timeout = 5000,
  interval = 100
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error(`Condition not met within ${timeout}ms`);
}

/**
 * Get auth token from localStorage
 */
export async function getAuthToken(page: Page): Promise<string | null> {
  return page.evaluate(() => {
    return localStorage.getItem('token') || localStorage.getItem('accessToken');
  });
}

/**
 * Store auth token in localStorage
 */
export async function setAuthToken(page: Page, token: string): Promise<void> {
  await page.evaluate((t: string) => {
    localStorage.setItem('token', t);
    localStorage.setItem('accessToken', t);
  }, token);
}

/**
 * Get all form errors on page
 */
export async function getFormErrors(page: Page): Promise<string[]> {
  const errorElements = await page.locator('[role="alert"], .error, .text-red-500').all();
  const errors: string[] = [];

  for (const element of errorElements) {
    const text = await element.textContent();
    if (text) errors.push(text.trim());
  }

  return errors;
}

/**
 * Fill form with data
 */
export async function fillForm(
  page: Page,
  formData: Record<string, string | number | boolean>
): Promise<void> {
  for (const [key, value] of Object.entries(formData)) {
    const input = page.locator(`input[name="${key}"], input[id="${key}"]`);

    if (await input.evaluate((el: HTMLInputElement) => el.type) === 'checkbox') {
      if (value) {
        await input.check();
      } else {
        await input.uncheck();
      }
    } else {
      await input.fill(String(value));
    }
  }
}

/**
 * Format currency (VND)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

/**
 * Parse currency string to number
 */
export function parseCurrency(currencyString: string): number {
  const cleaned = currencyString
    .replace(/[^\d,-]/g, '')
    .replace(/\./g, '')
    .replace(/,/g, '');
  return parseInt(cleaned, 10) || 0;
}

/**
 * Wait for toast message
 */
export async function waitForToast(
  page: Page,
  message?: string,
  timeout = 5000
): Promise<void> {
  const toastLocator = page.locator('[role="alert"], .toast, .notification');

  if (message) {
    await toastLocator.filter({ hasText: message }).waitFor({ state: 'visible', timeout });
  } else {
    await toastLocator.first().waitFor({ state: 'visible', timeout });
  }
}

/**
 * Get all visible text on page
 */
export async function getPageText(page: Page): Promise<string> {
  return page.evaluate(() => {
    return document.body.innerText;
  });
}

/**
 * Check if page has text
 */
export async function pageHasText(page: Page, text: string): Promise<boolean> {
  const pageText = await getPageText(page);
  return pageText.includes(text);
}

/**
 * Get table data as array of objects
 */
export async function getTableData(
  page: Page,
  tableSelector = 'table'
): Promise<Record<string, string>[]> {
  return page.evaluate((selector: string) => {
    const table = document.querySelector(selector) as HTMLTableElement;
    if (!table) return [];

    const headers = Array.from(table.querySelectorAll('thead th')).map((th) => th.textContent);
    const rows: Record<string, string>[] = [];

    table.querySelectorAll('tbody tr').forEach((tr) => {
      const cells = Array.from(tr.querySelectorAll('td')).map((td) => td.textContent);
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header || ''] = cells[index] || '';
      });
      rows.push(row);
    });

    return rows;
  }, tableSelector);
}

/**
 * Intercept and mock API response
 */
export async function mockApiResponse(
  page: Page,
  urlPattern: string | RegExp,
  response: unknown,
  status = 200
): Promise<void> {
  await page.route(urlPattern, async (route) => {
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });
}

/**
 * Wait for API call and get response
 */
export async function waitForApiCall(
  page: Page,
  urlPattern: string | RegExp,
  timeout = 5000
): Promise<unknown> {
  let responseData: unknown;

  const responsePromise = page.waitForResponse((response) => {
    const matches = typeof urlPattern === 'string' 
      ? response.url().includes(urlPattern) 
      : urlPattern.test(response.url());
    return matches;
  });

  const response = await Promise.race([
    responsePromise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`API call timeout: ${timeout}ms`)), timeout)
    ),
  ]);

  if (response) {
    try {
      responseData = await (response as any).json();
    } catch {
      responseData = null;
    }
  }

  return responseData;
}

/**
 * Generate random string
 */
export function randomString(length = 10): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

/**
 * Generate random number
 */
export function randomNumber(min = 0, max = 100): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const helpers = {
  waitForCondition,
  getAuthToken,
  setAuthToken,
  getFormErrors,
  fillForm,
  formatCurrency,
  parseCurrency,
  waitForToast,
  getPageText,
  pageHasText,
  getTableData,
  mockApiResponse,
  waitForApiCall,
  randomString,
  randomNumber,
};
