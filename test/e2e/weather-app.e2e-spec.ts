import { test, expect, Page } from '@playwright/test';

test.describe('Weather Updates Service - E2E Test Suite', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('/');
  });

  test.describe('Weather Search API and UI', () => {
    test('should display weather information for a valid city', async () => {
      await page.route('**/weather*', async (route) => {
        const url = route.request().url();
        if (url.includes('city=Kyiv')) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              temperature: 20,
              humidity: 65,
              description: 'Partly cloudy',
            }),
          });
        }
      });

      await page.fill('#citySearch', 'Kyiv');
      await page.click('#searchBtn');

      await expect(page.locator('#weatherResult')).toBeVisible();
      await expect(page.locator('#cityName')).toHaveText('Kyiv');
      await expect(page.locator('#temperature')).toHaveText('20°C');
      await expect(page.locator('#humidity')).toHaveText('65%');
      await expect(page.locator('#description')).toHaveText('Partly cloudy');
    });

    test('should display error message for invalid city', async () => {
      await page.route('**/weather*', async (route) => {
        const url = route.request().url();
        if (url.includes('city=InvalidCity')) {
          await route.fulfill({
            status: 404,
            contentType: 'application/json',
            body: JSON.stringify({ message: 'City not found' }),
          });
        }
      });

      await page.fill('#citySearch', 'InvalidCity');
      await page.click('#searchBtn');

      await expect(page.locator('#weatherError')).toBeVisible();
      await expect(page.locator('#weatherError')).toContainText(
        'City not found',
      );
    });

    test('search should work when pressing Enter key', async () => {
      await page.route('**/weather*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            temperature: 15,
            humidity: 70,
            description: 'Rainy',
          }),
        });
      });

      await page.fill('#citySearch', 'London');
      await page.press('#citySearch', 'Enter');

      await expect(page.locator('#weatherResult')).toBeVisible();
      await expect(page.locator('#cityName')).toHaveText('London');
    });
  });

  test.describe('Subscription API and UI', () => {
    test('should show success message after successful subscription', async () => {
      await page.route('**/subscribe', async (route) => {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            message:
              'Subscription request sent! Please check your email to confirm.',
            token: 'test-token-123',
          }),
        });
      });

      await page.fill('#email', 'test@example.com');
      await page.fill('#city', 'Paris');
      await page.selectOption('#frequency', 'daily');

      await page.click('.subscribe-btn');

      await expect(page.locator('#subscriptionSuccess')).toBeVisible();
      await expect(page.locator('#subscriptionError')).not.toBeVisible();
    });

    test('should show error for already subscribed email', async () => {
      await page.route('**/subscribe', async (route) => {
        await route.fulfill({
          status: 409,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'This email is already subscribed for this city.',
          }),
        });
      });

      await page.fill('#email', 'existing@example.com');
      await page.fill('#city', 'Berlin');
      await page.selectOption('#frequency', 'hourly');

      await page.click('.subscribe-btn');

      await expect(page.locator('#subscriptionError')).toBeVisible();
      await expect(page.locator('#subscriptionError')).toContainText(
        'already subscribed',
      );
    });

    test('should display city value from weather search in subscription form', async () => {
      await page.route('**/weather*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            temperature: 25,
            humidity: 50,
            description: 'Sunny',
          }),
        });
      });

      await page.fill('#citySearch', 'Tokyo');
      await page.click('#searchBtn');

      await expect(page.locator('#weatherResult')).toBeVisible();

      await expect(page.locator('#city')).toHaveValue('Tokyo');
    });

    test('should validate required form fields', async () => {
      await page.click('.subscribe-btn');

      const isFormValid = await page.evaluate(() => {
        const form = document.getElementById(
          'subscriptionForm',
        ) as HTMLFormElement;
        return form.checkValidity();
      });

      expect(isFormValid).toBeFalsy();
    });

    test('should validate email format', async () => {
      await page.fill('#email', 'invalid-email');
      await page.fill('#city', 'Rome');
      await page.selectOption('#frequency', 'daily');

      await page.click('.subscribe-btn');

      const isEmailValid = await page.evaluate(() => {
        const email = document.getElementById('email') as HTMLInputElement;
        return email.validity.valid;
      });

      expect(isEmailValid).toBeFalsy();
    });
  });

  test.describe('Subscription Confirmation API', () => {
    test('should simulate successful subscription confirmation', async () => {
      await page.route('**/confirm/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Subscription confirmed successfully',
          }),
        });
      });

      await page.goto('/confirm/valid-token-123');

      await expect(
        page.locator('text=Subscription confirmed successfully'),
      ).toBeVisible();
    });

    test('should simulate failed subscription confirmation', async () => {
      await page.route('**/confirm/invalid-token', async (route) => {
        await route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Token not found or has expired',
          }),
        });
      });

      await page.goto('/confirm/invalid-token');

      await expect(
        page.locator('text=Token not found or has expired'),
      ).toBeVisible();
    });
  });

  test.describe('Unsubscribe API', () => {
    test('should simulate successful unsubscribe', async () => {
      await page.route('**/unsubscribe/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Subscription deleted successfully',
          }),
        });
      });

      await page.goto('/unsubscribe/valid-token-123');

      await expect(
        page.locator('text=Subscription deleted successfully'),
      ).toBeVisible();
    });

    test('should simulate failed unsubscribe', async () => {
      await page.route('**/unsubscribe/invalid-token', async (route) => {
        await route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Token not found or subscription already deleted',
          }),
        });
      });

      await page.goto('/unsubscribe/invalid-token');

      await expect(
        page.locator('text=Token not found or subscription already deleted'),
      ).toBeVisible();
    });
  });

  test.describe('UI and Accessibility', () => {
    test('page title should be correct', async () => {
      await expect(page).toHaveTitle('Weather Updates Subscription');
    });

    test('page should have proper header content', async () => {
      await expect(page.locator('header h1')).toHaveText(
        'Weather Updates Service',
      );
      await expect(page.locator('header p')).toContainText('weather updates');
    });

    test('should have footer with copyright information', async () => {
      await expect(page.locator('footer')).toContainText(
        'Weather Updates Service',
      );
      await expect(page.locator('footer')).toContainText('2025');
    });

    test('form elements should have proper labels', async () => {
      const labels = await page.locator('.form-group label').allTextContents();
      expect(labels).toContain('Email Address');
      expect(labels).toContain('City');
      expect(labels).toContain('Update Frequency');
    });
  });

  test.describe('Complex User Flows', () => {
    test('should complete full search-then-subscribe flow', async () => {
      await page.route('**/weather*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            temperature: 22,
            humidity: 45,
            description: 'Clear sky',
          }),
        });
      });

      await page.route('**/subscribe', async (route) => {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            message:
              'Subscription request sent! Please check your email to confirm.',
            token: 'flow-test-token',
          }),
        });
      });

      await page.fill('#citySearch', 'Madrid');
      await page.click('#searchBtn');

      await expect(page.locator('#weatherResult')).toBeVisible();
      await expect(page.locator('#cityName')).toHaveText('Madrid');

      await expect(page.locator('#city')).toHaveValue('Madrid');

      await page.fill('#email', 'flow-test@example.com');
      await page.selectOption('#frequency', 'daily');

      await page.click('.subscribe-btn');

      await expect(page.locator('#subscriptionSuccess')).toBeVisible();
    });

    test('should handle errors correctly when searching for non-existent city then fixing input', async () => {
      await page.route('**/weather*', async (route) => {
        const url = route.request().url();

        if (url.includes('city=NonexistentCity')) {
          await route.fulfill({
            status: 404,
            contentType: 'application/json',
            body: JSON.stringify({ message: 'City not found' }),
          });
        } else if (url.includes('city=Paris')) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              temperature: 19,
              humidity: 60,
              description: 'Cloudy',
            }),
          });
        }
      });

      await page.fill('#citySearch', 'NonexistentCity');
      await page.click('#searchBtn');

      await expect(page.locator('#weatherError')).toBeVisible();

      await page.fill('#citySearch', 'Paris');
      await page.click('#searchBtn');

      await expect(page.locator('#weatherResult')).toBeVisible();
      await expect(page.locator('#weatherError')).not.toBeVisible();
    });
  });
});
