import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;

  readonly heading: Locator;
  readonly logoutButton: Locator;
  readonly deleteAccountButton: Locator;

  readonly addLightToggleButton: Locator;
  readonly emptyStateAddFirstLightButton: Locator;

  readonly addLightNameInput: Locator;
  readonly addLightConfirmButton: Locator;
  readonly addLightCancelButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.getByRole('heading', { name: 'Smart Home Lights' });
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
    this.deleteAccountButton = page.getByRole('button', { name: 'Delete Account' });

    this.addLightToggleButton = page.getByRole('button', { name: '+ Add Light' });
    this.emptyStateAddFirstLightButton = page.getByRole('button', {
      name: 'Add Your First Light',
    });

    this.addLightNameInput = page.getByPlaceholder('Enter light name');
    this.addLightConfirmButton = page.getByRole('button', { name: 'Add' });
    this.addLightCancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  async goto() {
    await this.page.goto('/dashboard');
  }

  async expectOnDashboard() {
    await expect(this.page).toHaveURL(/\/dashboard$/);
    await expect(this.heading).toBeVisible();
  }


  async openAddLightForm() {
    if (await this.emptyStateAddFirstLightButton.isVisible().catch(() => false)) {
      await this.emptyStateAddFirstLightButton.click();
    } else {
      await this.addLightToggleButton.click();
    }
    await expect(this.addLightNameInput).toBeVisible();
  }

  async addNewLight(lightName: string) {
    await this.openAddLightForm();
    await this.addLightNameInput.fill(lightName);
    await this.addLightConfirmButton.click();
  }

  getLightCard(lightName: string): Locator {
    return this.page
      .getByRole('heading', { name: lightName, exact: true })
      .locator('xpath=ancestor::div[contains(@class,"rounded-lg")]')
      .first();
  }

  getColorInput(lightName: string): Locator {
    return this.getLightCard(lightName).locator('input[type="color"]');
  }

  getEditButton(lightName: string): Locator {
    return this.getLightCard(lightName).getByTitle('Edit name');
  }

  getDeleteButton(lightName: string): Locator {
    return this.getLightCard(lightName).getByTitle('Delete');
  }

  getToggleButton(lightName: string): Locator {
    return this.getLightCard(lightName).getByRole('button', {
      name: /Turn On|Turn Off/,
    });
  }

  getEditNameInput(_lightName: string): Locator {
    return this.page.locator('div.grid input[type="text"]').first();
  }

  getSaveEditedNameButton(_lightName: string): Locator {
    return this.page.locator('div.grid button[title="Save"]').first();
  }

  async clickEditLight(lightName: string) {
    await this.getEditButton(lightName).click();
  }

  async clickDeleteLight(lightName: string) {
    await this.getDeleteButton(lightName).click();
  }

  async renameLight(oldName: string, newName: string) {
    await this.clickEditLight(oldName);
    await this.getEditNameInput(oldName).fill(newName);
    await this.getSaveEditedNameButton(oldName).click();
  }
}
