import { chromium } from "playwright";

const base = "http://127.0.0.1:4321/lab/precision";
const out = ".impeccable/screenshots";

const shots = [
  { name: "v6-work-desktop", width: 1440, height: 900, mode: "work" },
  { name: "v6-work-phone", width: 390, height: 844, mode: "work", full: true },
  { name: "v6-about-desktop", width: 1440, height: 900, mode: "about" },
  { name: "v6-about-phone", width: 390, height: 844, mode: "about", full: true },
];

const browser = await chromium.launch();
for (const s of shots) {
  const page = await browser.newPage({
    viewport: { width: s.width, height: s.height },
    deviceScaleFactor: 2,
  });
  await page.goto(base, { waitUntil: "networkidle" });
  if (s.mode === "about") {
    await page.click('[data-mode="about"]');
    await page.waitForTimeout(500);
  }
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${out}/${s.name}.png`, fullPage: Boolean(s.full) });
  await page.close();
  console.log("shot", s.name);
}
await browser.close();
