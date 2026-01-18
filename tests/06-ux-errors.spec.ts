import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/homePage';
import { LoginPage } from '../page-objects/loginPage';
import { RegisterPage } from '../page-objects/registerPage';
import { VerifyRegisterPage } from '../page-objects/verifyRegisterPage';
import { DashboardPage } from '../page-objects/dashboardPage';
import { ErrorLogPage } from '../page-objects/errorLogPage';
import {
    createRandomRegistrationData,
    verifiedUser
} from '../test-data/users';
import { invalidLoginError, duplicateEmailError } from '../test-data/errors';

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
    await homePage.viewErrorButton.click();
    await expect(errorLogPage.heading).toBeVisible();
    await errorLogPage.clearLogsButton.click();
    await errorLogPage.backButton.click();
});

test.describe('UI / UX - Error Handling', () => {

    test('[06.1] Error Handling - Login with invalid password + Logs', async ({ page }) => {

        await homePage.goto();
        await homePage.openLogin();
        await expect(loginPage.emailInput).toBeVisible();
        await loginPage.login(verifiedUser.email, 'wrong_password');
        await loginPage.expectOnLogin();
        await expect(loginPage.invalidCredentialsAlert).toBeVisible();
        await errorLogPage.goto();
        await errorLogPage.refresh();
        await expect(errorLogPage.getEntry(invalidLoginError)).toBeVisible();
        await expect(errorLogPage.noErrorsMessage).toBeHidden();
    });



    test('[06.2] Error Handling - duplicate email on registration + Logs', async ({ page }) => {

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
        await homePage.openLogin();
        await loginPage.login(registrationData.email, registrationData.password);
        await dashboardPage.expectOnDashboard();
        await dashboardPage.logoutButton.click();
        await homePage.expectOnHome();
        //Try to register AGAIN with the SAME credentials
        await registerPage.goto();
        await registerPage.register(registrationData);
        await expect(registerPage.duplicateEmailBanner).toBeVisible();
        await expect(registerPage.duplicateEmailBanner).toContainText('User already exists');
        await errorLogPage.goto();
        await errorLogPage.refresh();
        await expect(errorLogPage.getEntry(duplicateEmailError)).toBeVisible();
        await expect(errorLogPage.noErrorsMessage).toBeHidden();
        //CLEANUP – delete this account
        await homePage.goto();
        await homePage.openLogin();
        await loginPage.login(registrationData.email, registrationData.password);
        await dashboardPage.expectOnDashboard();
        page.once('dialog', async dialog => {
            await dialog.accept();
        });
        await dashboardPage.deleteAccountButton.click();
        await homePage.expectOnHome();
    });

    test('[06.3] Registration - empty form shows validation message', async ({ page }) => {

        await registerPage.submitRegistration({
            email: '',
            password: '',
            confirmPassword: '',
        });
        await expect(registerPage.validationErrorBanner).toBeVisible();
        await expect(registerPage.validationErrorBanner).toContainText(
            'Please fill in all fields'
        );
    });

    test('[06.4] Registration - mismatched passwords show validation message', async ({ page }) => {

        const mismatchedData = createRandomRegistrationData();
        mismatchedData.confirmPassword = 'different_password';
        await registerPage.submitRegistration(mismatchedData);
        await expect(registerPage.passwordMismatchBanner).toBeVisible();
    })

});
