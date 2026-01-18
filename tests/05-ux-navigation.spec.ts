import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/homePage';
import { LoginPage } from '../page-objects/loginPage';
import { RegisterPage } from '../page-objects/registerPage';
import { VerifyRegisterPage } from '../page-objects/verifyRegisterPage';
import { DashboardPage } from '../page-objects/dashboardPage';
import { ErrorLogPage } from '../page-objects/errorLogPage';
import { verifiedUser } from '../test-data/users';

let loginPage: LoginPage;
let registerPage: RegisterPage;
let verifyRegisterPage: VerifyRegisterPage;
let dashboardPage: DashboardPage;
let homePage: HomePage;
let errorLogPage: ErrorLogPage;

test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    registerPage = new RegisterPage(page);
    verifyRegisterPage = new VerifyRegisterPage(page);
    dashboardPage = new DashboardPage(page);
    errorLogPage = new ErrorLogPage(page);
    await homePage.goto();
    await homePage.expectOnHome();
});

test.describe('UI / UX - Navigation', () => {

    test('[05.1] Navigation - user can move between Home, Login, Dashboard and Register', async ({ page }) => {

        await homePage.loginButton.click();
        await loginPage.expectOnLogin();
        await expect(loginPage.emailInput).toBeVisible();

        await loginPage.login(verifiedUser.email, verifiedUser.password);
        await dashboardPage.expectOnDashboard();

        await dashboardPage.logoutButton.click();
        await homePage.expectOnHome();

        await homePage.registerButton.click();
        await registerPage.expectOnRegister();

        await registerPage.signInLink.click();
        await loginPage.expectOnLogin();
        await expect(loginPage.emailInput).toBeVisible();

        await loginPage.signUpLink.click();
        await registerPage.expectOnRegister();

    });

    test('[05.2] Navigation - Error Log page back navigation works', async ({ page }) => {

        await homePage.viewErrorButton.click();
        await expect(errorLogPage.heading).toBeVisible();
        await errorLogPage.expectOnErrorLogPage();
        await errorLogPage.backButton.click();
        await homePage.expectOnHome();

    });

});
