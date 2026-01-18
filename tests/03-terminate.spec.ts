import { test, expect } from '@playwright/test';
import { RegisterPage } from '../page-objects/registerPage';
import { VerifyRegisterPage } from '../page-objects/verifyRegisterPage';
import { DashboardPage } from '../page-objects/dashboardPage';
import { LoginPage } from '../page-objects/loginPage';
import { HomePage } from '../page-objects/homePage';
import { createRandomRegistrationData, verifiedUser } from '../test-data/users';

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
});

test.describe('Authentication & User Management', () => {
  test('[03.1] User Logout - verified user logs out successfully', async ({ page }) => {

    await loginPage.goto();
    await loginPage.login(verifiedUser.email, verifiedUser.password);
    await dashboardPage.expectOnDashboard();
    await dashboardPage.logoutButton.click();
    await homePage.expectOnHome();
    await loginPage.goto();
  });

  test ('[03.2] Account Deletion - newly registered user can delete their account', async ({ page }) => {

    const registrationData = createRandomRegistrationData();
    await registerPage.goto();
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
    await loginPage.goto();
    await loginPage.login(registrationData.email, registrationData.password);
    await dashboardPage.expectOnDashboard();
    // Delete the account
    page.once('dialog', async dialog => {
      await dialog.accept();
    });
    await dashboardPage.deleteAccountButton.click();
    await homePage.expectOnHome();
    // Try to login again with the deleted account → should fail
    await loginPage.goto();
    await loginPage.login(registrationData.email, registrationData.password);
    await loginPage.expectOnLogin();
    await expect(loginPage.invalidCredentialsAlert).toBeVisible();

  });

});

