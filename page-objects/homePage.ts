import { type Page, type Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly loginButton: Locator;
  readonly registerButton: Locator;
  readonly viewErrorButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.registerButton = page.getByRole('button', { name: 'Register' });
    this.viewErrorButton = page.getByRole('button', { name: 'View Error Log' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async expectOnHome() {
    await expect(this.page).toHaveURL('/');
    await expect(this.loginButton).toBeVisible();
  }

  async openLogin() {
    await Promise.all([
      this.page.waitForURL('**/login'),
      this.loginButton.click(),
    ]);
  }

  async waitLoginScreenReady() {
    await this.page.locator('input[type="email"]').waitFor({
      state: 'visible',
      timeout: 10000
    });
  }
}
