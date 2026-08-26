import { test, expect } from "@playwright/test";

test.describe("contact form", () => {
	test("empty submit surfaces field errors and focuses the first invalid field", async ({ page }) => {
		await page.goto("/");
		const contact = page.locator("#contact");
		await contact.scrollIntoViewIfNeeded();

		await page.locator("#submit-btn").click();

		await expect(page.locator("#name-error")).toHaveText("Please enter at least 2 characters.");
		await expect(page.locator("#contact-name")).toHaveAttribute("aria-invalid", "true");
		await expect(page.locator("#contact-name")).toBeFocused();
		await expect(page.locator("#form-status")).toHaveText("Please fix the errors above before submitting.");
		await expect(page.locator("#contact-name")).toHaveAttribute("aria-describedby", "name-error");
	});
});
