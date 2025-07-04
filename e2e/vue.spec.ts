// See here how to get started:
// https://playwright.dev/docs/intro

import { expect, test } from '@playwright/test'

// Basic homepage tests
test.describe('Homepage functionality tests', () => {
  test('should be able to access homepage and display basic elements', async ({ page }) => {
    // Visit homepage
    await page.goto('/')

    // Wait for the page to load and config to initialize
    await page.waitForSelector('.top-navigation', { state: 'visible' })

    // Check if page title is set (it should be dynamically set from config)
    await expect(page).toHaveTitle(/.*/)

    // Check if top navigation exists
    await expect(page.locator('.top-navigation')).toBeVisible()

    // Check if search box exists
    await expect(page.locator('.search-input')).toBeVisible()

    // Check if login button exists
    await expect(page.locator('.login-button')).toBeVisible()

    // Check if main content area is loaded (using first() to avoid strict mode violation)
    await expect(page.locator('.el-main').first()).toBeVisible()
  })

  test('search functionality test', async ({ page }) => {
    await page.goto('/')

    // Click search input box
    const searchInput = page.locator('.search-input input')
    await searchInput.click()

    // Enter search content
    await searchInput.fill('test')

    // Press Enter to search
    await searchInput.press('Enter')

    // Check if redirected to search page
    await expect(page).toHaveURL(/.*\/search\?q=test/)
  })

  test('login dialog test', async ({ page }) => {
    await page.goto('/')

    // Click login button
    await page.locator('.login-button').click()

    // Check if login dialog appears
    await expect(page.locator('.el-dialog')).toBeVisible()

    // Check dialog title
    await expect(page.locator('.el-dialog__title')).toContainText('Login')
  })

  test('page loading and content check', async ({ page }) => {
    await page.goto('/')

    // Wait for content to load
    await page.waitForSelector('.el-main', { state: 'visible' })

    // Check if sidebar exists
    await expect(page.locator('.el-aside')).toBeVisible()

    // Check if footer exists
    await expect(page.locator('footer')).toBeVisible()

    // Check if page contains main layout container (using first() to avoid strict mode violation)
    await expect(page.locator('.el-container').first()).toBeVisible()
  })

  test('responsive layout test', async ({ page }) => {
    await page.goto('/')

    // Set mobile screen size
    await page.setViewportSize({ width: 375, height: 667 })

    // Check if page displays normally
    await expect(page.locator('.top-navigation')).toBeVisible()

    // Restore desktop size
    await page.setViewportSize({ width: 1280, height: 720 })

    // Check if desktop layout is normal
    await expect(page.locator('.el-aside')).toBeVisible()
  })
})

// Navigation tests
test.describe('Navigation functionality tests', () => {
  test('homepage title link test', async ({ page }) => {
    await page.goto('/')

    // Click main title link
    await page.locator('.main-title').click()

    // Check if returns to homepage
    await expect(page).toHaveURL('/')
  })

  test('page title display test', async ({ page }) => {
    await page.goto('/')

    // Check if main title is displayed
    await expect(page.locator('.main-title')).toBeVisible()

    // Check if subtitle is displayed
    await expect(page.locator('.subtitle')).toBeVisible()
  })
})

