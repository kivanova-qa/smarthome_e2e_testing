import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/homePage';
import { LoginPage } from '../page-objects/loginPage';
import { DashboardPage } from '../page-objects/dashboardPage';
import { verifiedUser } from '../test-data/users';
import { createRandomLightName } from '../test-data/lights';

test.describe.serial('Light Management', () => {
  let homePage: HomePage;
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let lightName: string;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);

    await homePage.goto();
    await homePage.openLogin();
    await loginPage.login(verifiedUser.email, verifiedUser.password);
    await dashboardPage.expectOnDashboard();
    lightName = createRandomLightName();
    await dashboardPage.addNewLight(lightName);
  });

  test.afterEach(async ({ page }) => {
    page.once('dialog', async dialog => {
      await dialog.accept();
    });
    await dashboardPage.clickDeleteLight(lightName);
    await expect(dashboardPage.getLightCard(lightName)).toHaveCount(0);
  });


  test('[04.1] Add New Light and Delete it', async () => {
    await expect(dashboardPage.getLightCard(lightName)).toBeVisible();
  });


  test('[04.2] Toggle Light On/Off', async () => {

    await expect(dashboardPage.getLightCard(lightName)).toBeVisible();
    const toggleButton = dashboardPage.getToggleButton(lightName);
    const initialLabel = (await toggleButton.innerText()).trim();
    await toggleButton.click();
    await expect(toggleButton).toHaveText(
      initialLabel === 'Turn On' ? 'Turn Off' : 'Turn On',
    );
    await toggleButton.click();
    await expect(toggleButton).toHaveText(initialLabel);
  });


  test('[04.3] Change Light Color', async () => {

    await expect(dashboardPage.getLightCard(lightName)).toBeVisible();
    const colorInput = dashboardPage.getColorInput(lightName);
    const currentColor = (await colorInput.inputValue()).toLowerCase();
    const red = '#ff0000';
    const fallback = '#00ff00';
    const newColor = currentColor === red ? fallback : red;
    await colorInput.fill(newColor);
    await expect(colorInput).toHaveValue(newColor);
  });


  test('[04.4] Edit Light Name', async () => {

    await expect(dashboardPage.getLightCard(lightName)).toBeVisible();
    const editedName = `${lightName} Edited`;
    await dashboardPage.clickEditLight(lightName);
    await dashboardPage.getEditNameInput(lightName).fill(editedName);
    await dashboardPage.getSaveEditedNameButton(editedName).click();
    await expect(dashboardPage.getLightCard(editedName)).toBeVisible();
    await expect(dashboardPage.getLightCard(lightName)).toHaveCount(0);
    await dashboardPage.clickEditLight(editedName);
    await dashboardPage.getEditNameInput(editedName).fill(lightName);
    await dashboardPage.getSaveEditedNameButton(lightName).click();
  });


  test('[04.5] Changes Persist After Refresh Page', async ({ page }) => {
    
    const lightTwoBaseName = `Temporary Light ${Date.now()}`;
    await dashboardPage.addNewLight(lightTwoBaseName);
    await expect(dashboardPage.getLightCard(lightTwoBaseName)).toBeVisible();

    const lightOneToggle = dashboardPage.getToggleButton(lightName);
    await lightOneToggle.click();
    await expect(dashboardPage.getToggleButton(lightName)).toHaveText(/Turn Off/);

    const lightOneColorInput = dashboardPage.getColorInput(lightName);
    await lightOneColorInput.fill('#ff0000');
    await expect(lightOneColorInput).toHaveValue('#ff0000');

    const lightTwoModifiedName = `${lightTwoBaseName} Modified`;

    await dashboardPage.clickEditLight(lightTwoBaseName);
    await dashboardPage.getEditNameInput(lightTwoBaseName).fill(lightTwoModifiedName);
    await dashboardPage.getSaveEditedNameButton(lightTwoBaseName).click();
    await expect(dashboardPage.getLightCard(lightTwoModifiedName)).toBeVisible();

    await dashboardPage.getToggleButton(lightTwoModifiedName).click();
    await expect(dashboardPage.getToggleButton(lightTwoModifiedName)).toHaveText(/Turn Off/);

    const lightTwoColorInput = dashboardPage.getColorInput(lightTwoModifiedName);
    await lightTwoColorInput.fill('#00ff00');
    await expect(lightTwoColorInput).toHaveValue('#00ff00');

    const lightOneColorBefore = await dashboardPage.getColorInput(lightName).inputValue();
    const lightOneToggleBefore = (await dashboardPage.getToggleButton(lightName).innerText()).trim();

    const lightTwoColorBefore = await dashboardPage
      .getColorInput(lightTwoModifiedName)
      .inputValue();
    const lightTwoToggleBefore = (await dashboardPage
      .getToggleButton(lightTwoModifiedName)
      .innerText()).trim();

    await page.reload();
    await expect(dashboardPage.heading).toBeVisible();

    expect(await dashboardPage.getColorInput(lightName).inputValue())
      .toBe(lightOneColorBefore);
    expect((await dashboardPage.getToggleButton(lightName).innerText()).trim())
      .toBe(lightOneToggleBefore);

    expect(await dashboardPage.getColorInput(lightTwoModifiedName).inputValue())
      .toBe(lightTwoColorBefore);
    expect((await dashboardPage.getToggleButton(lightTwoModifiedName).innerText()).trim())
      .toBe(lightTwoToggleBefore);

    page.once('dialog', async dialog => {
      await dialog.accept();
    });
    await dashboardPage.clickDeleteLight(lightTwoModifiedName);
    await expect(dashboardPage.getLightCard(lightTwoModifiedName)).toHaveCount(0);
  });


});
