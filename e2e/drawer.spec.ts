import { test, expect } from "@playwright/test";

test.describe("mobile drawer", () => {
	test("opens, traps focus via inert, and closes on Escape", async ({ page }) => {
		await page.setViewportSize({ width: 400, height: 800 });
		await page.goto("/");

		const toggle = page.locator("[data-nav-toggle]");
		await toggle.click();
		await expect(page.locator("#nav-mobile")).toBeVisible();
		await expect(page.locator("main")).toHaveJSProperty("inert", true);
		await expect(page.locator("footer")).toHaveJSProperty("inert", true);

		// First focusable link receives focus when opened
		await expect(page.locator("#nav-mobile a").first()).toBeFocused();

		// Escape closes and returns focus to the trigger
		await page.keyboard.press("Escape");
		await expect(page.locator("#nav-mobile")).toBeHidden();
		await expect(page.locator("main")).toHaveJSProperty("inert", false);
		await expect(toggle).toBeFocused();
	});
});
