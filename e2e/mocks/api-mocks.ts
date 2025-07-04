import { Page, Route } from '@playwright/test'
import { ConfigFiled } from '../../src/constant/index.js'

// Mock system configuration - only the essential config needed
const mockConfig = [
  { configKey: ConfigFiled.BLOG_TITLE.toLowerCase(), configValue: 'Mock Blog Title' },
  { configKey: ConfigFiled.BLOG_SUBTITLE.toLowerCase(), configValue: 'Mock Blog Subtitle' },
  { configKey: ConfigFiled.INITIALIZED.toLowerCase(), configValue: 'true' },
  { configKey: ConfigFiled.PAGE_SIZE.toLowerCase(), configValue: '5' },
  { configKey: ConfigFiled.CONFIG_VERSION.toLowerCase(), configValue: '1' },
]

export async function setupApiMocks(page: Page) {
  // Mock system status/config - the key API call that determines if system is initialized
  await page.route('**/api/v1/status', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockConfig),
    })
  })

  // Mock system version
  await page.route('**/api/v1/status/version', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify('1'),
    })
  })
}
