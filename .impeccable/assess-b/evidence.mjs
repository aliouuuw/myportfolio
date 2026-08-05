import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import http from "node:http";

const URL = "http://127.0.0.1:4321/lab/precision";
const OUT = "/Users/aliouwade/Documents/myportfolio/.impeccable/assess-b";
const LIVE_SERVER = "/Users/aliouwade/.agents/skills/impeccable/scripts/live-server.mjs";
const DETECT_JS_CANDIDATES = [
  "/Users/aliouwade/.agents/skills/impeccable/scripts/detector/detect.js",
  "/Users/aliouwade/.agents/skills/impeccable/scripts/live/detect.js",
];

fs.mkdirSync(OUT, { recursive: true });

function parseColor(value) {
  if (!value) return null;
  const s = value.trim();
  let m = s.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i);
  if (m) return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] };
  m = s.match(/^color\(\s*srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)$/i);
  if (m) return { r: +m[1] * 255, g: +m[2] * 255, b: +m[3] * 255, a: m[4] === undefined ? 1 : +m[4] };
  return null;
}

function relLum(c) {
  const toLin = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLin(c.r) + 0.7152 * toLin(c.g) + 0.0722 * toLin(c.b);
}

function contrast(fg, bg) {
  const L1 = relLum(fg);
  const L2 = relLum(bg);
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}

function flattenOver(fg, bg) {
  if (!fg) return bg;
  if (fg.a >= 0.999) return fg;
  if (!bg) return { ...fg, a: 1 };
  const a = fg.a;
  return { r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a), a: 1 };
}

const SAMPLE_SCRIPT = `
(() => {
  ${parseColor.toString()}
  ${relLum.toString()}
  ${contrast.toString()}
  ${flattenOver.toString()}

  function resolveBg(el) {
    let bgEl = el;
    let bg = null;
    while (bgEl && bgEl.nodeType === 1) {
      const bcs = getComputedStyle(bgEl);
      const bgC = parseColor(bcs.backgroundColor);
      if (bgC && bgC.a > 0) { bg = bgC; break; }
      bgEl = bgEl.parentElement;
    }
    if (!bg) {
      const htmlBg = parseColor(getComputedStyle(document.documentElement).backgroundColor);
      const bodyBg = parseColor(getComputedStyle(document.body).backgroundColor);
      bg = htmlBg && htmlBg.a > 0 ? htmlBg : bodyBg && bodyBg.a > 0 ? bodyBg : { r: 255, g: 255, b: 255, a: 1 };
    }
    return { bg, bgRaw: bgEl ? getComputedStyle(bgEl).backgroundColor : getComputedStyle(document.body).backgroundColor };
  }

  function sample(label, el) {
    if (!el) return { label, missing: true };
    const cs = getComputedStyle(el);
    const fg = parseColor(cs.color);
    const { bg, bgRaw } = resolveBg(el);
    const fgFlat = flattenOver(fg, bg);
    const ratio = contrast(fgFlat, bg);
    return {
      label,
      text: (el.textContent || "").trim().slice(0, 48),
      selector: el.id ? "#" + el.id : (el.className ? "." + String(el.className).split(/\\s+/).slice(0,2).join(".") : el.tagName.toLowerCase()),
      fg: cs.color,
      bg: bgRaw,
      ratio: Math.round(ratio * 100) / 100,
      pass45: ratio >= 4.5,
      fontFamily: cs.fontFamily,
      ariaPressed: el.getAttribute("aria-pressed"),
    };
  }

  const idleFilter = Array.from(document.querySelectorAll(".filter")).find((f) => f.getAttribute("aria-pressed") !== "true");
  const surfaceIdle = Array.from(document.querySelectorAll("#surface-bar button")).find((b) => b.getAttribute("aria-pressed") !== "true");
  const surfacePressed = Array.from(document.querySelectorAll("#surface-bar button")).find((b) => b.getAttribute("aria-pressed") === "true");
  const modeIdle = Array.from(document.querySelectorAll(".mode-nav button")).find((b) => b.getAttribute("aria-pressed") !== "true");

  return [
    sample("positioning", document.querySelector(".positioning")),
    sample("row-meta", document.querySelector(".row.is-selected .row-meta") || document.querySelector(".row-meta")),
    sample("location-meta", document.querySelector(".location-meta")),
    sample("filter-idle", idleFilter),
    sample("chin-state", document.querySelector("#chin-state-text") || document.querySelector("#chin-state")),
    sample("chin-dt", document.querySelector("#chin-plate dt")),
    sample("surface-key-idle", surfaceIdle),
    sample("surface-key-pressed", surfacePressed),
    sample("availability", document.querySelector(".availability")),
    sample("mode-nav-idle", modeIdle),
  ];
})()
`;

const LAYOUT_SCRIPT = `
(() => {
  const doc = document.documentElement;
  const body = document.body;
  const scrollH = Math.max(doc.scrollHeight, body.scrollHeight);
  const clientH = window.innerHeight;
  const pageScrolls = scrollH > clientH + 1;

  const visual = document.querySelector(".proof-visual") || document.querySelector("#proof-media") || document.querySelector(".instrument");
  let proofVisual = null;
  if (visual) {
    const r = visual.getBoundingClientRect();
    proofVisual = {
      w: Math.round(r.width * 100) / 100,
      h: Math.round(r.height * 100) / 100,
      ratio: r.height ? Math.round((r.width / r.height) * 1000) / 1000 : null,
      selector: visual.className || visual.id || visual.tagName,
    };
  }

  const filters = document.querySelector(".filters");
  let filterLines = null;
  if (filters) {
    const kids = Array.from(filters.children).filter((c) => c.getClientRects().length);
    const tops = [...new Set(kids.map((c) => Math.round(c.getBoundingClientRect().top)))].sort((a,b)=>a-b);
    filterLines = tops.length;
  }

  const control = document.querySelector("#media-control");
  const media = document.querySelector("#proof-media") || document.querySelector(".proof-media") || document.querySelector(".proof-visual");
  let controlOverScreen = null;
  if (control && media) {
    const cr = control.getBoundingClientRect();
    const mr = media.getBoundingClientRect();
    const overlaps = !(cr.right < mr.left || cr.left > mr.right || cr.bottom < mr.top || cr.top > mr.bottom);
    const controlInChin = !!control.closest(".chin");
    controlOverScreen = {
      overlaps,
      controlInChin,
      controlHidden: control.hidden || getComputedStyle(control).display === "none",
      controlRect: { x: Math.round(cr.x), y: Math.round(cr.y), w: Math.round(cr.width), h: Math.round(cr.height) },
      mediaRect: { x: Math.round(mr.x), y: Math.round(mr.y), w: Math.round(mr.width), h: Math.round(mr.height) },
    };
  }

  const overflowing = [];
  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    if (r.right > window.innerWidth + 1 || r.left < -1) {
      overflowing.push({
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        className: String(el.className || "").slice(0, 60),
        left: Math.round(r.left),
        right: Math.round(r.right),
        vw: window.innerWidth,
      });
      if (overflowing.length >= 12) break;
    }
  }

  const fonts = {
    linkHrefs: Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map((l) => l.href).filter((h) => /font|switzer|jetbrains/i.test(h)),
    bodyFamily: getComputedStyle(document.body).fontFamily,
    monoSample: getComputedStyle(document.querySelector(".row-meta") || document.body).fontFamily,
    sansSample: getComputedStyle(document.querySelector(".positioning") || document.body).fontFamily,
  };

  return {
    viewport: { w: window.innerWidth, h: window.innerHeight },
    scrollHeight: scrollH,
    clientHeight: clientH,
    pageScrolls,
    proofVisual,
    filterLines,
    controlOverScreen,
    horizontalOverflowCount: overflowing.length,
    horizontalOverflowSample: overflowing,
    fonts,
  };
})()
`;

async function measureTheme(page, theme) {
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.evaluate((t) => {
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("operator-board-theme", t);
  }, theme);
  await page.waitForTimeout(350);
  const samples = await page.evaluate(SAMPLE_SCRIPT);
  return samples;
}

async function measureLayout(page, viewport) {
  await page.setViewportSize(viewport);
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  });
  await page.waitForTimeout(350);
  return await page.evaluate(LAYOUT_SCRIPT);
}

function httpGet(url, timeoutMs = 2000) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => resolve({ ok: true, status: res.statusCode, body: data.slice(0, 200) }));
    });
    req.on("error", (e) => resolve({ ok: false, error: String(e.message || e) }));
    req.setTimeout(timeoutMs, () => {
      req.destroy();
      resolve({ ok: false, error: "timeout" });
    });
  });
}

async function tryOverlay(page) {
  const result = {
    status: "skipped",
    reason: null,
    liveServerStarted: false,
    livePort: null,
    consoleMessages: [],
    cleanup: null,
  };

  // Prefer live-server background; fall back to direct detect.js injection if available.
  let liveProc = null;
  try {
    liveProc = spawn("node", [LIVE_SERVER, "--background"], {
      cwd: "/Users/aliouwade/Documents/myportfolio",
      stdio: ["ignore", "pipe", "pipe"],
    });
    let liveOut = "";
    liveProc.stdout.on("data", (d) => { liveOut += d.toString(); });
    liveProc.stderr.on("data", (d) => { liveOut += d.toString(); });
    await new Promise((r) => setTimeout(r, 1500));

    const infoPath = "/Users/aliouwade/Documents/myportfolio/.impeccable/live/server.json";
    let port = null;
    if (fs.existsSync(infoPath)) {
      try {
        const info = JSON.parse(fs.readFileSync(infoPath, "utf8"));
        port = info.port || info.livePort || null;
      } catch {}
    }
    if (!port) {
      const m = liveOut.match(/port[=:\\s]+(\\d+)/i) || liveOut.match(/listening.*?(\\d{4})/i);
      if (m) port = +m[1];
    }
    if (!port) port = 8400;

    result.livePort = port;
    const ping = await httpGet(`http://127.0.0.1:${port}/detect.js`);
    if (!ping.ok) {
      result.status = "skipped";
      result.reason = `live-server started but /detect.js unreachable: ${ping.error || ping.status}; stdout=${liveOut.slice(0, 300)}`;
      // try local detect.js file injection
    } else {
      result.liveServerStarted = true;
      page.on("console", (msg) => {
        const t = msg.text();
        if (/impeccable|detect|antipattern|overlay/i.test(t)) {
          result.consoleMessages.push({ type: msg.type(), text: t.slice(0, 300) });
        }
      });
      await page.goto(URL, { waitUntil: "networkidle" });
      try {
        await page.addScriptTag({ url: `http://127.0.0.1:${port}/detect.js` });
        await page.waitForTimeout(1200);
        const overlayPresent = await page.evaluate(() => {
          return !!(
            document.querySelector("[data-impeccable]") ||
            document.querySelector("#impeccable-overlay") ||
            document.querySelector(".impeccable-overlay") ||
            window.__impeccable ||
            window.impeccable
          );
        });
        result.status = overlayPresent || result.consoleMessages.length ? "succeeded" : "skipped";
        if (result.status === "skipped") {
          result.reason = "detect.js loaded from live-server but no overlay DOM/global/console markers observed";
        }
      } catch (e) {
        result.status = "skipped";
        result.reason = `inject detect.js from live-server failed: ${e && e.message ? e.message : e}`;
      }
    }
  } catch (e) {
    result.status = "skipped";
    result.reason = `live-server spawn failed: ${e && e.message ? e.message : e}`;
  }

  // Fallback: inject local detect.js content if still skipped
  if (result.status === "skipped") {
    const detectPath = DETECT_JS_CANDIDATES.find((p) => fs.existsSync(p));
    if (detectPath) {
      try {
        page.on("console", (msg) => {
          const t = msg.text();
          if (/impeccable|detect|antipattern|overlay/i.test(t)) {
            result.consoleMessages.push({ type: msg.type(), text: t.slice(0, 300) });
          }
        });
        await page.goto(URL, { waitUntil: "networkidle" });
        await page.addScriptTag({ path: detectPath });
        await page.waitForTimeout(1200);
        const overlayPresent = await page.evaluate(() => {
          return !!(
            document.querySelector("[data-impeccable]") ||
            document.querySelector("#impeccable-overlay") ||
            document.querySelector(".impeccable-overlay") ||
            window.__impeccable ||
            window.impeccable
          );
        });
        if (overlayPresent || result.consoleMessages.length) {
          result.status = "succeeded";
          result.reason = (result.reason || "") + ` | fallback local inject from ${detectPath}`;
        } else {
          result.reason = (result.reason || "overlay missing") + ` | local detect.js inject produced no markers (${detectPath})`;
        }
      } catch (e) {
        result.reason = (result.reason || "") + ` | local detect inject failed: ${e && e.message ? e.message : e}`;
      }
    } else if (!result.reason) {
      result.reason = "no live-server detect.js and no local detect.js found";
    }
  }

  // Cleanup live server
  try {
    const stop = spawn("node", [LIVE_SERVER, "stop", "--keep-inject"], {
      cwd: "/Users/aliouwade/Documents/myportfolio",
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stopOut = "";
    stop.stdout.on("data", (d) => { stopOut += d.toString(); });
    stop.stderr.on("data", (d) => { stopOut += d.toString(); });
    await new Promise((resolve) => {
      stop.on("close", resolve);
      setTimeout(resolve, 3000);
    });
    if (liveProc && !liveProc.killed) {
      try { liveProc.kill("SIGTERM"); } catch {}
    }
    result.cleanup = { ok: true, stopOut: stopOut.slice(0, 400) };
  } catch (e) {
    result.cleanup = { ok: false, error: String(e && e.message ? e.message : e) };
    if (liveProc && !liveProc.killed) {
      try { liveProc.kill("SIGTERM"); } catch {}
    }
  }

  return result;
}

const browser = await chromium.launch({ headless: true });
const report = {
  contrast: { dark: [], light: [] },
  layout1440: null,
  layout390: null,
  overlay: null,
  falsePositives: [],
};

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  report.contrast.dark = await measureTheme(page, "dark");
  report.contrast.light = await measureTheme(page, "light");
  report.layout1440 = await measureLayout(page, { width: 1440, height: 900 });
  report.layout390 = await measureLayout(page, { width: 390, height: 844 });

  // False positive: single-font — both families loaded and used
  const fonts = report.layout1440?.fonts;
  if (fonts) {
    const hasSwitzerLink = fonts.linkHrefs.some((h) => /switzer/i.test(h));
    const hasJetLink = fonts.linkHrefs.some((h) => /jetbrains/i.test(h));
    const sansUsesSwitzer = /Switzer/i.test(fonts.sansSample || "");
    const monoUsesJet = /JetBrains/i.test(fonts.monoSample || "");
    if (hasSwitzerLink && hasJetLink && (sansUsesSwitzer || monoUsesJet)) {
      report.falsePositives.push({
        antipattern: "single-font",
        reason: "CLI flagged single-font (jetbrains mono only), but page loads Switzer (Fontshare) + JetBrains Mono (Google Fonts); body/positioning uses Switzer, row-meta uses JetBrains Mono.",
        evidence: fonts,
      });
    }
  }

  report.overlay = await tryOverlay(page);
  await page.close();
} catch (e) {
  report.error = String(e && e.message ? e.message : e);
}

await browser.close();

const outPath = path.join(OUT, "evidence.json");
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
console.log(JSON.stringify({
  wrote: outPath,
  darkFails: report.contrast.dark.filter((s) => s.pass45 === false).map((s) => s.label),
  lightFails: report.contrast.light.filter((s) => s.pass45 === false).map((s) => s.label),
  pageScrolls1440: report.layout1440?.pageScrolls,
  proofRatio: report.layout1440?.proofVisual?.ratio,
  filterLines: report.layout1440?.filterLines,
  controlOver: report.layout1440?.controlOverScreen,
  phoneOverflow: report.layout390?.horizontalOverflowCount,
  overlay: report.overlay?.status,
  overlayReason: report.overlay?.reason,
  cleanup: report.overlay?.cleanup?.ok,
  falsePositives: report.falsePositives.map((f) => f.antipattern),
  error: report.error || null,
}, null, 2));
