import { test, expect } from '@playwright/test';
import { RegisterPage } from '../page-objects/registerPage';
import { VerifyRegisterPage } from '../page-objects/verifyRegisterPage';
import { DashboardPage } from '../page-objects/dashboardPage';
import { LoginPage } from '../page-objects/loginPage';
import { HomePage } from '../page-objects/homePage';
import { createRandomRegistrationData } from '../test-data/users';

let loginPage: LoginPage;
let registerPage: RegisterPage;
let verifyRegisterPage: VerifyRegisterPage;
let dashboardPage: DashboardPage;
let homePage: HomePage;

test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page);
  loginPage = new LoginPage(page);
  registerPage = new RegisterPage(page);
  verifyRegisterPage = new VerifyRegisterPage(page);
  dashboardPage = new DashboardPage(page);
  await registerPage.goto();
});

test.describe('Authentication & User Management', () => {
  test('[01.1] User Registration (happy path)', async ({ page }) => {

    const registrationData = createRandomRegistrationData();
    await registerPage.register(registrationData);
    const verificationUrl = await registerPage.getVerificationUrl();
    await registerPage.copyVerificationLinkAndAcceptDialog();
    if (verificationUrl) {
      await page.goto(verificationUrl);
    }
    await expect(verifyRegisterPage.successCheckMark).toBeVisible();
    await expect(verifyRegisterPage.emailVerifiedHeading).toBeVisible();
    await expect(verifyRegisterPage.emailVerifiedSuccessMessage).toBeVisible();
    await verifyRegisterPage.goToLoginButton.click();
    await homePage.expectOnHome();
    await homePage.openLogin();
    await loginPage.expectOnLogin();
    await loginPage.login(registrationData.email, registrationData.password);
    await dashboardPage.expectOnDashboard();
    page.once('dialog', async dialog => {
      await dialog.accept();
    })
    await dashboardPage.deleteAccountButton.click();
    await homePage.expectOnHome();

  });

});
