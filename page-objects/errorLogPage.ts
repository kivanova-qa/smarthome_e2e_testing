import { type Page, type Locator, expect } from '@playwright/test';
import type { ErrorLogEntry } from '../models/errorLog';

export class ErrorLogPage {

  readonly page: Page;
  readonly heading: Locator;
  readonly subheading: Locator;
  readonly refreshButton: Locator;
  readonly clearLogsButton: Locator;
  readonly backButton: Locator;
  readonly errorRowContainer: Locator;
  readonly noErrorsMessage: Locator;

  constructor(page: Page) {

    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Server Error Log' });
    this.subheading = page.getByText('Mock server errors and debugging information');
    this.refreshButton = page.getByRole('button', { name: 'Refresh' });
    this.clearLogsButton = page.getByRole('button', { name: 'Clear Logs' });
    this.backButton = page.getByRole('button', { name: 'Back' });
    this.errorRowContainer = page.locator('div.bg-white.rounded-lg.shadow-lg div.flex.items-start.gap-4');
    this.noErrorsMessage = page.getByText('The server is running smoothly with no errors!', { exact: true });
  }

  async goto() {
    await this.page.goto('/errors');
  }

  async expectOnErrorLogPage() {
    await expect(this.page).toHaveURL(/error/i);
    await expect(this.heading).toBeVisible();
  }


  getErrorRow(status: number, endpoint: string, message: string): Locator {
    return this.errorRowContainer
      .filter({ hasText: status.toString() })
      .filter({ hasText: endpoint })
      .filter({ hasText: message })
      .first();
  }

  getStatusBadge(status: number): Locator {
    return this.errorRowContainer.getByText(status.toString(), { exact: false, });
  }

  getEndpointText(endpoint: string): Locator {
    return this.errorRowContainer.getByText(endpoint, { exact: false, });
  }

  getMessageText(message: string): Locator {
    return this.errorRowContainer.getByText(message, { exact: false, });
  }

  getTimestampText(partialTimestamp: string): Locator {
    return this.errorRowContainer.getByText(partialTimestamp, { exact: false, });
  }

  getEntry(entry: ErrorLogEntry): Locator {
    return this.getErrorRow(entry.status, entry.endpoint, entry.message);
  }

  async refresh() {
    await this.refreshButton.click();
  }

  async clearLogs() {
    await this.clearLogsButton.click();
  }

  async goBack() {
    await this.backButton.click();
  }
}
