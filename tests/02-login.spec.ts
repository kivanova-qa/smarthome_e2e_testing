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

    test('[02.1] User Login - verified user can login successfully', async ({ page }) => {
        await loginPage.goto();
        await loginPage.login(verifiedUser.email, verifiedUser.password);
        await dashboardPage.expectOnDashboard();
    });

    test('[02.2] User Login - invalid credentials (wrong password)', async ({ page }) => {
        await loginPage.goto();
        await loginPage.login(verifiedUser.email, 'wrong_password');
        await loginPage.expectOnLogin();
        await expect(loginPage.invalidCredentialsAlert).toBeVisible();
    });

    test('[02.3] User Login - invalid credentials (empty password)', async ({ page }) => {
        await loginPage.goto();
        await loginPage.login('', '');
        await loginPage.expectOnLogin();
        await expect(loginPage.fillAllFieldsAlert).toBeVisible();
    });

    test.only('[02.4] User Login - unverified account is rejected', async ({ page }) => {

        // 1) Create random, unique user (NOT verified)
        const registrationData = createRandomRegistrationData();
        await registerPage.goto();
        await registerPage.register(registrationData);
        await verifyRegisterPage.goToLoginButton.click();
        await loginPage.expectOnLogin();
        // Try to login with the UNVERIFIED account
        await loginPage.login(registrationData.email, registrationData.password);
        await loginPage.expectOnLogin();
        await expect(loginPage.unverifiedAlert).toBeVisible();
        await expect(loginPage.unverifiedAlert).toContainText(
            'Please verify your email before logging in.',
        );
    });

});
