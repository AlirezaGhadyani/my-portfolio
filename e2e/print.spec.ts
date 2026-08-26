import { test, expect } from "@playwright/test";

function countPdfPages(buffer: Buffer): number {
	const matches = buffer.toString("latin1").match(/\/Type\s*\/Page[^s]/g);
	return matches ? matches.length : 0;
}

test.describe("print brief", () => {
	test("renders exactly one A4 page", async ({ page }) => {
		await page.goto("/print/resume/brief/");
		await expect(page.locator("h1")).toBeVisible();
		await page.evaluate(() => document.fonts.ready);
		const pdf = await page.pdf({
			format: "A4",
			printBackground: true,
			preferCSSPageSize: true,
			margin: { top: 0, bottom: 0, left: 0, right: 0 },
		});
		expect(countPdfPages(pdf)).toBe(1);
	});
});
