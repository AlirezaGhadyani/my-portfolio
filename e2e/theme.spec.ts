import { test, expect } from "@playwright/test";

test.describe("theme toggle", () => {
	test("persists across navigation and works from both controls", async ({ page }) => {
		await page.goto("/");
		const toggle = page.locator("[data-theme-toggle]").first();
		const initial = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
		const target = initial === "dark" ? "light" : "dark";

		await toggle.click();
		await expect(page.locator("html")).toHaveAttribute("data-theme", target);
		const stored = await page.evaluate(() => localStorage.getItem("theme"));
		expect(stored).toBe(target);

		// Persists across navigation
		await page.goto("/projects");
		await expect(page.locator("html")).toHaveAttribute("data-theme", target);

		// Both controls carry the same next-action label
		const labels = await page
			.locator("[data-theme-toggle]")
			.evaluateAll((els) => els.map((el) => el.getAttribute("aria-label")));
		expect(labels[0]).toBe(labels[1]);
		expect(labels[0]).toContain("Switch to");
	});
});
