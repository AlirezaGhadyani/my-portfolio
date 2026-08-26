import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = ["/", "/projects", "/projects/async-threat-platform"];

for (const route of routes) {
	test(`axe: no critical/serious violations on ${route}`, async ({ page }) => {
		await page.goto(route);
		await page.waitForLoadState("networkidle");
		const results = await new AxeBuilder({ page }).analyze();
		const serious = results.violations.filter((v) => ["critical", "serious"].includes(v.impact || ""));
		expect(
			serious.map((v) => `${v.id} (${v.impact}): ${v.nodes.length}`),
			JSON.stringify(serious, null, 2),
		).toEqual([]);
	});
}
