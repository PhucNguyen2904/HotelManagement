import { Page, Locator } from '@playwright/test';

/**
 * Base Page Object
 * All pages inherit from this class for common utilities
 */
export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific path
   */
  async goto(...args: any[]) {
    const path = typeof args[0] === 'string' ? args[0] : '/';
    await this.page.goto(path);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for page to be ready
   */
  async waitForReady() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Click an element
   */
  async click(selector: string) {
    await this.page.click(selector);
  }

  /**
   * Fill input field
   */
  async fill(selector: string, text: string) {
    await this.page.fill(selector, text);
  }

  /**
   * Get text content
   */
  async getText(selector: string): Promise<string> {
    const element = await this.page.locator(selector);
    return (await element.textContent()) ?? '';
  }

  /**
   * Check if element is visible
   */
  async isVisible(selector: string): Promise<boolean> {
    return this.page.locator(selector).isVisible();
  }

  /**
   * Wait for selector to be visible
   */
  async waitForSelector(selector: string, timeout = 5000) {
    await this.page.locator(selector).waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for element to disappear
   */
  async waitForSelectorHidden(selector: string, timeout = 5000) {
    await this.page.locator(selector).waitFor({ state: 'hidden', timeout });
  }

  /**
   * Get attribute value
   */
  async getAttribute(selector: string, attribute: string): Promise<string | null> {
    return this.page.locator(selector).getAttribute(attribute);
  }

  /**
   * Check if element exists
   */
  async elementExists(selector: string): Promise<boolean> {
    const count = await this.page.locator(selector).count();
    return count > 0;
  }

  /**
   * Get all text content matching selector
   */
  async getTextList(selector: string): Promise<string[]> {
    const locators = await this.page.locator(selector).all();
    const texts: string[] = [];
    for (const locator of locators) {
      const text = await locator.textContent();
      if (text) texts.push(text);
    }
    return texts;
  }

  /**
   * Select option in dropdown
   */
  async selectOption(selector: string, value: string) {
    await this.page.selectOption(selector, value);
  }

  /**
   * Type text slowly (more reliable than fill for some cases)
   */
  async type(selector: string, text: string) {
    await this.page.locator(selector).type(text);
  }

  /**
   * Press key (Enter, Escape, etc)
   */
  async pressKey(key: string) {
    await this.page.keyboard.press(key);
  }

  /**
   * Take screenshot
   */
  async screenshot(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }

  /**
   * Get all cookies
   */
  async getCookies() {
    return this.page.context()?.cookies() || [];
  }

  /**
   * Get localStorage value
   */
  async getLocalStorage(key: string): Promise<string | null> {
    return this.page.evaluate((k) => localStorage.getItem(k), key);
  }

  /**
   * Get current URL
   */
  async getURL(): Promise<string> {
    return this.page.url();
  }

  /**
   * Reload page
   */
  async reload() {
    await this.page.reload();
    await this.waitForReady();
  }

  /**
   * Hover over element
   */
  async hover(selector: string) {
    await this.page.locator(selector).hover();
  }

  /**
   * Check checkbox
   */
  async check(selector: string) {
    await this.page.locator(selector).check();
  }

  /**
   * Uncheck checkbox
   */
  async uncheck(selector: string) {
    await this.page.locator(selector).uncheck();
  }

  /**
   * Get checked state
   */
  async isChecked(selector: string): Promise<boolean> {
    return this.page.locator(selector).isChecked();
  }

  /**
   * Execute JavaScript
   */
  async executeScript<T>(script: string): Promise<T> {
    return this.page.evaluate((s: string) => eval(s), script) as Promise<T>;
  }

  /**
   * Get page height
   */
  async getPageHeight(): Promise<number> {
    return (await this.executeScript<number>('return document.body.scrollHeight')) || 0;
  }

  /**
   * Scroll to element
   */
  async scrollToElement(selector: string) {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Wait for navigation
   */
  async waitForNavigation() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get locator
   */
  getLocator(selector: string): Locator {
    return this.page.locator(selector);
  }
}
