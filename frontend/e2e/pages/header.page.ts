import { BasePage } from './base.page';

/**
 * Header - Shared navigation component
 * Appears on all pages, handles auth links, navigation, user menu
 */
export class Header extends BasePage {
  // Selectors
  readonly header = 'header';
  readonly logo = '[data-testid="logo"]';
  readonly loginLink = 'a[href="/(auth)/login"]';
  readonly registerLink = 'a[href="/(auth)/register"]';
  readonly userMenu = '[data-testid="user-menu"]';
  readonly logoutButton = '[data-testid="logout-button"]';
  readonly profileLink = '[data-testid="profile-link"]';
  readonly myBookingsLink = '[data-testid="my-bookings-link"]';
  readonly userName = '[data-testid="user-name"]';
  readonly homeLink = 'a[href="/"]';
  readonly roomsLink = 'a[href="/rooms"]';
  readonly aboutLink = 'a[href="/about"]';
  readonly contactLink = 'a[href="/contact"]';
  readonly mobileMenuButton = '[data-testid="mobile-menu-button"]';
  readonly mobileMenu = '[data-testid="mobile-menu"]';

  /**
   * Check if header is visible
   */
  async isHeaderVisible(): Promise<boolean> {
    return this.isVisible(this.header);
  }

  /**
   * Check if logo is visible
   */
  async isLogoVisible(): Promise<boolean> {
    return this.isVisible(this.logo);
  }

  /**
   * Click logo (navigate to home)
   */
  async clickLogo() {
    await this.click(this.logo);
    await this.waitForNavigation();
  }

  /**
   * Check if user is logged in (by checking if logout button visible)
   */
  async isLoggedIn(): Promise<boolean> {
    return this.elementExists(this.userMenu);
  }

  /**
   * Check if login link is visible
   */
  async isLoginLinkVisible(): Promise<boolean> {
    return this.isVisible(this.loginLink);
  }

  /**
   * Check if register link is visible
   */
  async isRegisterLinkVisible(): Promise<boolean> {
    return this.isVisible(this.registerLink);
  }

  /**
   * Click login link
   */
  async clickLoginLink() {
    await this.click(this.loginLink);
    await this.waitForNavigation();
  }

  /**
   * Click register link
   */
  async clickRegisterLink() {
    await this.click(this.registerLink);
    await this.waitForNavigation();
  }

  /**
   * Get logged-in user's name
   */
  async getUserName(): Promise<string> {
    return this.getText(this.userName);
  }

  /**
   * Click user menu to open dropdown
   */
  async openUserMenu() {
    await this.click(this.userMenu);
    await this.page.waitForTimeout(300); // Wait for dropdown animation
  }

  /**
   * Click logout button
   */
  async logout() {
    await this.openUserMenu();
    await this.click(this.logoutButton);
    await this.waitForNavigation();
  }

  /**
   * Click profile link
   */
  async clickProfileLink() {
    await this.openUserMenu();
    await this.click(this.profileLink);
    await this.waitForNavigation();
  }

  /**
   * Click my bookings link
   */
  async clickMyBookingsLink() {
    await this.openUserMenu();
    await this.click(this.myBookingsLink);
    await this.waitForNavigation();
  }

  /**
   * Check if logout button is visible in menu
   */
  async isLogoutButtonVisible(): Promise<boolean> {
    return this.isVisible(this.logoutButton);
  }

  /**
   * Click home link
   */
  async clickHomeLink() {
    await this.click(this.homeLink);
    await this.waitForNavigation();
  }

  /**
   * Click rooms link
   */
  async clickRoomsLink() {
    await this.click(this.roomsLink);
    await this.waitForNavigation();
  }

  /**
   * Click about link
   */
  async clickAboutLink() {
    await this.click(this.aboutLink);
    await this.waitForNavigation();
  }

  /**
   * Click contact link
   */
  async clickContactLink() {
    await this.click(this.contactLink);
    await this.waitForNavigation();
  }

  /**
   * Check if home link is active
   */
  async isHomeActive(): Promise<boolean> {
    const href = await this.getAttribute(this.homeLink, 'href');
    const url = await this.getURL();
    return url === `http://localhost:3000${href}`;
  }

  /**
   * Check if rooms link is active
   */
  async isRoomsActive(): Promise<boolean> {
    const href = await this.getAttribute(this.roomsLink, 'href');
    const url = await this.getURL();
    return url === `http://localhost:3000${href}`;
  }

  /**
   * Open mobile menu
   */
  async openMobileMenu() {
    const hasMobileButton = await this.elementExists(this.mobileMenuButton);
    if (hasMobileButton) {
      await this.click(this.mobileMenuButton);
      await this.page.waitForTimeout(300);
    }
  }

  /**
   * Close mobile menu
   */
  async closeMobileMenu() {
    const hasMobileMenu = await this.elementExists(this.mobileMenu);
    if (hasMobileMenu) {
      // Click outside menu or press escape
      await this.pressKey('Escape');
      await this.page.waitForTimeout(300);
    }
  }

  /**
   * Check if mobile menu is visible
   */
  async isMobileMenuVisible(): Promise<boolean> {
    return this.isVisible(this.mobileMenu);
  }

  /**
   * Get all navigation links
   */
  async getNavigationLinks(): Promise<string[]> {
    return this.getTextList('nav a');
  }

  /**
   * Check if specific navigation link exists
   */
  async hasNavigationLink(text: string): Promise<boolean> {
    const links = await this.getNavigationLinks();
    return links.some((link) => link.toLowerCase().includes(text.toLowerCase()));
  }
}
