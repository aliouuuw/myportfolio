import { chromium } from "playwright";
import { mkdir } from "fs/promises";

const out = ".impeccable/screenshots/assess-a";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const viewports = [
  { name: "1440x900", width: 1440, height: 900 },
  { name: "820x900", width: 820, height: 900 },
  { name: "390x844", width: 390, height: 844 },
];

for (const vp of viewports) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    colorScheme: "dark",
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4321/lab/precision", { waitUntil: "networkidle", timeout: 60000 });
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${out}/work-${vp.name}-dark.png`, fullPage: false });
  // About mode
  await page.locator('button[data-mode="about"]').first().click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${out}/about-${vp.name}-dark.png`, fullPage: false });
  // also fullPage for mobile to see scroll stack
  if (vp.width <= 820) {
    await page.screenshot({ path: `${out}/about-${vp.name}-dark-full.png`, fullPage: true });
    await page.locator('button[data-mode="work"]').first().click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${out}/work-${vp.name}-dark-full.png`, fullPage: true });
  }
  await context.close();
  console.log("done", vp.name);
}
await browser.close();
console.log("ALL_OK");
