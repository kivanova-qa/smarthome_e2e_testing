import type { Page, Locator } from '@playwright/test';

export class VerifyRegisterPage {

  readonly page: Page;

  readonly emailVerifiedHeading: Locator;
  readonly goToLoginButton: Locator;
  readonly successCheckMark: Locator;
  readonly emailVerifiedSuccessMessage: Locator;


  constructor(page: Page) {
    this.page = page;
    this.emailVerifiedHeading = page.getByRole('heading', { name: 'Email Verified!' });
    this.goToLoginButton = page.getByRole('button', { name: 'Go to Login' });
    this.successCheckMark = page.getByText('✓');
    this.emailVerifiedSuccessMessage = page.getByText('Email verified successfully! You can now log in.', { exact: true });

  }


}
