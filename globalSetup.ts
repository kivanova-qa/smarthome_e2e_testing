import { verifiedUser } from "./test-data/users";
import { chromium } from "playwright/test";
import config from "./playwright.config";
import { RegisterPage } from "./page-objects/registerPage";

export default async function globalSetup() {
    console.log("Starting Global setup...");

    const browser = await chromium.launch();

    const baseURL = config.use?.baseURL as string;
    const context = await browser.newContext({ baseURL });
    const page = await context.newPage();
    const registerPage: RegisterPage = new RegisterPage(page);

    await registerPage.goto();
    await registerPage.register({
        email: verifiedUser.email,
        password: verifiedUser.password,
        confirmPassword: verifiedUser.password,
    });

    const verificationUrl = await registerPage.getVerificationUrlGlobal();
    //await registerPage.copyVerificationLinkAndAcceptDialog();//
    if (verificationUrl) {
        await registerPage.copyVerificationLinkAndAcceptDialog();
        await page.goto(verificationUrl);
    }
    console.log("Global setup finished...");
}

 