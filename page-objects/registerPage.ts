import type { Page, Locator, Response } from '@playwright/test';
import { expect } from '@playwright/test';
import type { RegistrationData } from '../models/auth';

export class RegisterPage {

  readonly page: Page;

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly signUpButton: Locator;
  readonly signInLink: Locator;
  readonly backToGuideLink: Locator;
  readonly successBanner: Locator;
  readonly verificationLinkButton: Locator;
  readonly goToLoginButton: Locator;
  readonly validationErrorBanner: Locator;
  readonly passwordMismatchBanner: Locator;
  readonly duplicateEmailBanner: Locator;

  constructor(page: Page) {

    this.page = page;
    this.emailInput = page.locator('input[placeholder="Enter your email"]');
    this.passwordInput = page.locator('input[placeholder="Enter your password"]');
    this.confirmPasswordInput = page.locator('input[placeholder="Confirm your password"]');
    this.signUpButton = page.getByRole('button', { name: 'Sign Up' });
    this.signInLink = page.getByRole('link', { name: /Sign in/ });
    this.backToGuideLink = page.getByRole('link', { name: /Back to Testing Guide/ });
    this.successBanner = page.getByText('Registration successful! Please check your email to verify your account.', { exact: false },);
    this.verificationLinkButton = page.getByRole('button', { name: /verify\?token=/i, });
    this.goToLoginButton = page.getByRole('button', { name: /Go to Login/i });
    this.validationErrorBanner = this.page.getByText('Please fill in all fields', { exact: false });
    this.passwordMismatchBanner = page.getByText('Passwords do not match', { exact: false });
    this.duplicateEmailBanner = page.getByText(/User already exists/i);

  }

  async goto(): Promise<Response> {
    const response = this.page.goto("/register");
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await this.page.waitForLoadState("networkidle");
    return response;
  }


  async expectOnRegister() {
    await expect(this.page).toHaveURL(/\/register$/);
    await expect(this.emailInput).toBeVisible();
  }


  async register(data: RegistrationData) {
    await this.emailInput.fill(data.email);
    expect(await this.emailInput.inputValue()).toBe(data.email);
    await this.passwordInput.fill(data.password);
    expect(await this.passwordInput.inputValue()).toBe(data.password);
    await this.confirmPasswordInput.fill(data.confirmPassword);
    expect(await this.confirmPasswordInput.inputValue()).toBe(data.confirmPassword);  
    await this.signUpButton.click();
  }




  async getVerificationUrl(): Promise<string | null> {
    const text = await this.verificationLinkButton.textContent();
    return text?.trim() ?? null;
  }

  async getVerificationUrlGlobal(): Promise<string | undefined> {
    if (await this.successBanner.isVisible()) {
      const text = await this.verificationLinkButton.textContent();
      return text?.trim();
    } else {
      return undefined;
    }
  }

  async copyVerificationLinkAndAcceptDialog() {
    this.page.once('dialog', async dialog => {
      await dialog.accept();
    });
    await this.verificationLinkButton.click();

  }

  async goToLogin() {
    await Promise.all([
      this.page.waitForURL('**/login'),
      this.goToLoginButton.click(),
    ]);
  }

  async submitRegistration(data: RegistrationData) {
    await this.goto();
    await this.register(data);
  }


}
