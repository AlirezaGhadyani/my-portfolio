import { test, expect } from "@playwright/test";

test.describe("palette selector", () => {
	test("selection persists and syncs between both selectors", async ({ page }) => {
		await page.goto("/");
		const selectors = page.locator("[data-palette-popup]");
		await expect(selectors).toHaveCount(2);

		// Open the desktop selector and pick "ocean"
		await selectors.first().locator("[data-palette-trigger]").click();
		await selectors.first().locator("[data-palette-option][data-palette-option='ocean']").click();

		await expect(page.locator("html")).toHaveAttribute("data-palette", "ocean");
		expect(await page.evaluate(() => localStorage.getItem("palette"))).toBe("ocean");
		const popup = selectors.first();
		await expect(popup).not.toHaveAttribute("open", "");

		// Both selectors reflect the active palette via aria-pressed
		for (const idx of [0, 1]) {
			const pressed = await selectors
				.nth(idx)
				.locator("[data-palette-option]")
				.evaluateAll((els) =>
					els.map((el) =>
						el.getAttribute("data-palette-option") === "ocean" ? el.getAttribute("aria-pressed") : null,
					),
				);
			expect(pressed).toContain("true");
		}

		// Persists across a reload
		await page.reload();
		await expect(page.locator("html")).toHaveAttribute("data-palette", "ocean");
	});
});
