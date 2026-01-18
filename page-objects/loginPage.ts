import { type Page, type Locator, expect } from '@playwright/test';

export class LoginPage {

  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly signUpLink: Locator;
  readonly backToGuideLink: Locator;
  readonly invalidCredentialsAlert: Locator;
  readonly fillAllFieldsAlert: Locator;
  readonly unverifiedAlert: Locator;

  constructor(page: Page) {

    this.page = page;
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.signUpLink = page.getByRole('link', { name: 'Sign up' });
    this.backToGuideLink = page.getByRole('link', { name: /Back to Testing Guide/ });
    this.invalidCredentialsAlert = page.getByText('Invalid credentials');
    this.fillAllFieldsAlert = page.getByText('Please fill in all fields');
    this.unverifiedAlert = page.getByText(
      'Please verify your email before logging in. Check your email for the confirmation link.');

  }

  async goto() {
    const response = await this.page.goto('/login');
    //await expect(this.page).toHaveURL(/\/login$/);
    return response;
  }

  async expectOnLogin() {
    await expect(this.page).toHaveURL(/\/login$/);
    await expect(this.signInButton).toBeVisible();
  }



  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

}
