import { defineConfig, devices } from '@playwright/test';
import { allureCategories } from './constants/allure-categories';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

const TEN_SECONDS = 10000;
require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  snapshotDir: './snapshots',
  timeout: 18 * TEN_SECONDS,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['allure-playwright',
      {
        resultsDir: 'test-results/allure-results',
        detail: true,
        suiteTitle: true,
        categories: allureCategories,
        environmentInfo: {
          framework: 'Playwright',
          node_version: process.version,
          env: process.env.ENV,
          branch: process.env.BUILD_SOURCEBRANCHNAME,
        }
      }
    ]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    headless: false,
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: {
      mode: 'retain-on-failure',
      snapshots: false,
      screenshots: true,
      sources: true,
      attachments: true,
    },
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure'
  },
  testMatch: '*.spec.ts',
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'desktop-',
      testMatch: '/*/desktop/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'],
        channel: 'chrome',
        viewport: { width: 1280, height: 900 },
        isMobile: false,
        launchOptions: {
          args: ['--disable-blink-features=AutomationControlled'],
        },
       },
    },
    {
      name: 'mobile-e2e',
      testMatch: '/*/mobile/**/*.spec.ts',
      use: { ...devices['Pixel 7'],
        viewport: { width: 412, height: 915 },
        isMobile: true,
       },
    },
    {
      name: 'api',
      testMatch: '**/api/*.spec.ts',
      use: {
        extraHTTPHeaders: {
          'Accept': 'application/json',
        },
      },
    }
  ],
});
