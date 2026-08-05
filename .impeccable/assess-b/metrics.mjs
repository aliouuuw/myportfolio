import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import http from "node:http";

const URL = "http://127.0.0.1:4321/lab/precision";
const OUT = "/Users/aliouwade/Documents/myportfolio/.impeccable/assess-b";
const LIVE_SERVER = "/Users/aliouwade/.agents/skills/impeccable/scripts/live-server.mjs";

fs.mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { w: 1440, h: 900 },
  { w: 820, h: 900 },
  { w: 390, h: 844 },
];

const METRICS_SCRIPT = `
(() => {
  const doc = document.documentElement;
  const body = document.body;
  const scrollH = Math.max(doc.scrollHeight, body.scrollHeight);
  const clientH = window.innerHeight;
  const pageScrolls = scrollH > clientH + 1;
  const scrollW = Math.max(doc.scrollWidth, body.scrollWidth);
  const clientW = window.innerWidth;
  const pageHOverflow = scrollW > clientW + 1;

  const visual = document.querySelector(".proof-visual");
  let proofVisual = null;
  if (visual) {
    const r = visual.getBoundingClientRect();
    proofVisual = {
      w: Math.round(r.width * 10) / 10,
      h: Math.round(r.height * 10) / 10,
      ratio: r.height ? Math.round((r.width / r.height) * 1000) / 1000 : null,
      visible: r.width > 0 && r.height > 0,
    };
  }

  const filters = document.querySelector(".filters");
  let filterInfo = null;
  if (filters) {
    const fr = filters.getBoundingClientRect();
    const cs = getComputedStyle(filters);
    const kids = Array.from(filters.querySelectorAll(".filter")).filter((c) => c.getClientRects().length);
    const tops = [...new Set(kids.map((c) => Math.round(c.getBoundingClientRect().top)))].sort((a,b)=>a-b);
    const overflowX = filters.scrollWidth > filters.clientWidth + 1;
    const clippedKids = kids.filter((k) => {
      const r = k.getBoundingClientRect();
      return r.right > fr.right + 1 || r.left < fr.left - 1;
    }).map((k) => (k.textContent || "").trim().slice(0, 24));
    filterInfo = {
      visible: fr.width > 0 && fr.height > 0 && cs.display !== "none" && cs.visibility !== "hidden",
      lines: tops.length,
      overflowX,
      scrollWidth: filters.scrollWidth,
      clientWidth: filters.clientWidth,
      childCount: kids.length,
      clippedKids: clippedKids.slice(0, 6),
      overflowStyle: cs.overflowX,
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
        className: String(el.className || "").slice(0, 80),
        left: Math.round(r.left),
        right: Math.round(r.right),
        text: (el.textContent || "").trim().slice(0, 28),
      });
      if (overflowing.length >= 16) break;
    }
  }

  // Touch targets < 44px height among buttons/links that are visible
  const tinyTargets = [];
  for (const el of document.querySelectorAll("a, button, [role='button']")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || cs.pointerEvents === "none") continue;
    if (r.height < 44 - 0.5) {
      tinyTargets.push({
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        className: String(el.className || "").slice(0, 60),
        text: (el.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 40),
        w: Math.round(r.width * 10) / 10,
        h: Math.round(r.height * 10) / 10,
      });
    }
  }

  // Chin plate / surface keys
  const chin = document.querySelector(".chin");
  const plate = document.querySelector(".chin-plate");
  const surfaceBar = document.querySelector("#surface-bar") || document.querySelector(".surface-bar") || document.querySelector(".surface-keys");
  const surfaceKeys = Array.from(document.querySelectorAll("#surface-bar button, .surface-bar button, .surface-key"));
  let chinInfo = null;
  if (chin || plate || surfaceKeys.length) {
    const chinR = chin ? chin.getBoundingClientRect() : null;
    const plateR = plate ? plate.getBoundingClientRect() : null;
    const plateKids = plate ? Array.from(plate.children).filter((c) => c.getClientRects().length) : [];
    const plateTops = [...new Set(plateKids.map((c) => Math.round(c.getBoundingClientRect().top)))].sort((a,b)=>a-b);
    const plateOverflow = plate && plateR
      ? plateKids.some((c) => {
          const r = c.getBoundingClientRect();
          return r.right > plateR.right + 2 || r.left < plateR.left - 2 || r.bottom > plateR.bottom + 2;
        })
      : false;
    const keyRects = surfaceKeys.map((k) => {
      const r = k.getBoundingClientRect();
      return {
        text: (k.textContent || "").trim().slice(0, 24),
        top: Math.round(r.top),
        left: Math.round(r.left),
        w: Math.round(r.width),
        h: Math.round(r.height),
        wraps: (k.scrollHeight > k.clientHeight + 1) || ((k.textContent || "").includes("\\n")),
        overflowParent: !!(surfaceBar && (() => {
          const pr = surfaceBar.getBoundingClientRect();
          return r.right > pr.right + 2 || r.left < pr.left - 2 || r.bottom > pr.bottom + 2;
        })()),
      };
    }).filter((k) => k.w > 0 || k.h > 0);
    const keyTops = [...new Set(keyRects.map((k) => k.top))].sort((a,b)=>a-b);
    chinInfo = {
      chinH: chinR ? Math.round(chinR.height) : null,
      chinOverflowViewport: chinR ? (chinR.right > window.innerWidth + 1 || chinR.left < -1) : false,
      plateLines: plateTops.length,
      plateOverflow,
      plateChildCount: plateKids.length,
      surfaceKeyCount: keyRects.length,
      surfaceKeyRows: keyTops.length,
      surfaceKeysOverflowOrWrap: keyRects.some((k) => k.overflowParent || k.wraps),
      surfaceKeySamples: keyRects.slice(0, 8),
      surfaceBarScroll: surfaceBar
        ? { scrollW: surfaceBar.scrollWidth, clientW: surfaceBar.clientWidth, overflowX: surfaceBar.scrollWidth > surfaceBar.clientWidth + 1 }
        : null,
    };
  }

  // About board column stacking
  let aboutInfo = null;
  const aboutBoard = document.querySelector(".about-board");
  if (aboutBoard) {
    const wasHidden = aboutBoard.hasAttribute("hidden") || aboutBoard.hidden;
    const prevDisplay = aboutBoard.style.display;
    // Temporarily reveal for measurement without clicking (caller may also click)
    aboutBoard.hidden = false;
    aboutBoard.removeAttribute("hidden");
    aboutBoard.style.display = "";
    const sections = Array.from(aboutBoard.querySelectorAll(":scope > section, :scope > .about-intro, :scope > .about-section, .about-grid, .credentials, .about-columns"));
    const cols = Array.from(aboutBoard.querySelectorAll(".about-intro, .about-body, .credentials, .about-section, .about-grid > *, .credentials-grid > *"));
    const measurable = cols.length ? cols : Array.from(aboutBoard.children);
    const visible = measurable.filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
    const tops = [...new Set(visible.map((el) => Math.round(el.getBoundingClientRect().top)))].sort((a,b)=>a-b);
    const lefts = [...new Set(visible.map((el) => Math.round(el.getBoundingClientRect().left)))].sort((a,b)=>a-b);
    const grid = getComputedStyle(aboutBoard);
    aboutInfo = {
      measuredWhileRevealed: true,
      wasHidden,
      display: grid.display,
      gridTemplateColumns: grid.gridTemplateColumns,
      columnTops: tops.length,
      columnLefts: lefts.length,
      stacked: tops.length >= visible.length && visible.length > 1 ? true : lefts.length <= 1,
      childCount: visible.length,
      childSamples: visible.slice(0, 6).map((el) => ({
        className: String(el.className || "").slice(0, 40),
        top: Math.round(el.getBoundingClientRect().top),
        left: Math.round(el.getBoundingClientRect().left),
        w: Math.round(el.getBoundingClientRect().width),
      })),
    };
    // restore
    if (wasHidden) {
      aboutBoard.hidden = true;
      aboutBoard.setAttribute("hidden", "");
    }
    aboutBoard.style.display = prevDisplay;
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
    pageHOverflow,
    scrollWidth: scrollW,
    proofVisual,
    filterInfo,
    horizontalOverflowCount: overflowing.length,
    horizontalOverflowSample: overflowing.slice(0, 8),
    tinyTargetsCount: tinyTargets.length,
    tinyTargetsSample: tinyTargets.slice(0, 12),
    tinyTargetsAll: tinyTargets,
    chinInfo,
    aboutInfo,
    fonts,
  };
})()
`;

function httpGet(url, timeoutMs = 2000) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => resolve({ ok: true, status: res.statusCode, body: data.slice(0, 120) }));
    });
    req.on("error", (e) => resolve({ ok: false, error: String(e.message || e) }));
    req.setTimeout(timeoutMs, () => {
      req.destroy();
      resolve({ ok: false, error: "timeout" });
    });
  });
}

async function measureViewport(page, { w, h }) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("operator-board-theme", "dark");
  });
  await page.waitForTimeout(400);

  // Work mode metrics (default)
  const work = await page.evaluate(METRICS_SCRIPT);

  // About mode — click About and remeasure stacking with real visibility
  let aboutLive = null;
  try {
    const aboutBtn = page.locator('button[data-mode="about"]').first();
    if (await aboutBtn.count()) {
      await aboutBtn.click();
      await page.waitForTimeout(400);
      aboutLive = await page.evaluate(() => {
        const aboutBoard = document.querySelector(".about-board");
        if (!aboutBoard) return { missing: true };
        const cs = getComputedStyle(aboutBoard);
        const kids = Array.from(aboutBoard.children).filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        });
        const tops = [...new Set(kids.map((el) => Math.round(el.getBoundingClientRect().top)))].sort((a,b)=>a-b);
        const lefts = [...new Set(kids.map((el) => Math.round(el.getBoundingClientRect().left)))].sort((a,b)=>a-b);
        // Also check nested multi-column sections
        const nested = Array.from(aboutBoard.querySelectorAll(".about-grid, .credentials-grid, .about-columns")).map((el) => {
          const g = getComputedStyle(el);
          const children = Array.from(el.children).filter((c) => c.getBoundingClientRect().width > 0);
          const cTops = [...new Set(children.map((c) => Math.round(c.getBoundingClientRect().top)))].sort((a,b)=>a-b);
          const cLefts = [...new Set(children.map((c) => Math.round(c.getBoundingClientRect().left)))].sort((a,b)=>a-b);
          return {
            className: String(el.className || "").slice(0, 40),
            display: g.display,
            gridTemplateColumns: g.gridTemplateColumns,
            childCount: children.length,
            rowCount: cTops.length,
            colCount: cLefts.length,
            stacked: cLefts.length <= 1 && children.length > 1,
          };
        });
        return {
          hidden: aboutBoard.hidden || aboutBoard.hasAttribute("hidden"),
          display: cs.display,
          gridTemplateColumns: cs.gridTemplateColumns,
          directChildCount: kids.length,
          rowCount: tops.length,
          colCount: lefts.length,
          stacked: lefts.length <= 1 && kids.length > 1,
          nested,
          childSamples: kids.slice(0, 8).map((el) => ({
            className: String(el.className || el.tagName).slice(0, 40),
            top: Math.round(el.getBoundingClientRect().top),
            left: Math.round(el.getBoundingClientRect().left),
            w: Math.round(el.getBoundingClientRect().width),
          })),
        };
      });
    }
  } catch (e) {
    aboutLive = { error: String(e && e.message ? e.message : e) };
  }

  return { ...work, aboutLive };
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

  let liveProc = null;
  try {
    liveProc = spawn("node", [LIVE_SERVER, "--background"], {
      cwd: "/Users/aliouwade/Documents/myportfolio",
      stdio: ["ignore", "pipe", "pipe"],
    });
    let liveOut = "";
    liveProc.stdout.on("data", (d) => { liveOut += d.toString(); });
    liveProc.stderr.on("data", (d) => { liveOut += d.toString(); });
    await new Promise((r) => setTimeout(r, 1800));

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
      result.reason = `live-server /detect.js unreachable: ${ping.error || ping.status}; out=${liveOut.slice(0, 240)}`;
    } else {
      result.liveServerStarted = true;
      // Preflight mutable injection
      await page.goto(URL, { waitUntil: "networkidle" });
      let mutableOk = false;
      try {
        await page.evaluate(() => {
          document.title = "impeccable-preflight";
          const s = document.createElement("script");
          s.setAttribute("data-impeccable-preflight", "1");
          document.documentElement.appendChild(s);
        });
        mutableOk = await page.evaluate(() =>
          document.title === "impeccable-preflight" &&
          !!document.querySelector("[data-impeccable-preflight]")
        );
      } catch (e) {
        result.status = "skipped";
        result.reason = `mutable injection preflight failed: ${e && e.message ? e.message : e}`;
      }

      if (mutableOk) {
        page.on("console", (msg) => {
          const t = msg.text();
          if (/impeccable|detect|antipattern|overlay/i.test(t)) {
            result.consoleMessages.push({ type: msg.type(), text: t.slice(0, 300) });
          }
        });
        try {
          await page.addScriptTag({ url: `http://127.0.0.1:${port}/detect.js` });
          await page.waitForTimeout(2000);
          const overlayPresent = await page.evaluate(() => !!(
            document.querySelector("[data-impeccable]") ||
            document.querySelector("#impeccable-overlay") ||
            document.querySelector(".impeccable-overlay") ||
            window.__impeccable ||
            window.impeccable
          ));
          result.status = overlayPresent || result.consoleMessages.length ? "succeeded" : "skipped";
          if (result.status === "skipped") {
            result.reason = "detect.js injected; no overlay DOM/global/console markers";
          }
        } catch (e) {
          result.status = "skipped";
          result.reason = `inject detect.js failed: ${e && e.message ? e.message : e}`;
        }
      } else if (!result.reason) {
        result.status = "skipped";
        result.reason = "mutable injection preflight returned false";
      }
    }
  } catch (e) {
    result.status = "skipped";
    result.reason = `live-server spawn failed: ${e && e.message ? e.message : e}`;
  }

  // Cleanup
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
      setTimeout(resolve, 3500);
    });
    if (liveProc && !liveProc.killed) {
      try { liveProc.kill("SIGTERM"); } catch {}
    }
    // Also try stop without keep-inject to remove any inject tags from source
    const stop2 = spawn("node", [LIVE_SERVER, "stop"], {
      cwd: "/Users/aliouwade/Documents/myportfolio",
      stdio: ["ignore", "pipe", "pipe"],
    });
    await new Promise((resolve) => {
      stop2.on("close", resolve);
      setTimeout(resolve, 2500);
    });
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
  viewports: {},
  overlay: null,
  falsePositives: [],
};

try {
  const page = await browser.newPage();
  for (const vp of VIEWPORTS) {
    const key = `${vp.w}x${vp.h}`;
    report.viewports[key] = await measureViewport(page, vp);
  }

  const fonts = report.viewports["1440x900"]?.fonts;
  if (fonts) {
    const sansUsesSwitzer = /Switzer/i.test(fonts.sansSample || "");
    const monoUsesJet = /JetBrains/i.test(fonts.monoSample || "");
    if (sansUsesSwitzer && monoUsesJet) {
      report.falsePositives.push({
        antipattern: "single-font",
        reason: "CLI flagged single-font (jetbrains mono only); live CSS uses Switzer (sans) + JetBrains Mono (meta/chin).",
        evidence: {
          sansSample: fonts.sansSample,
          monoSample: fonts.monoSample,
          linkHrefs: fonts.linkHrefs,
        },
      });
    }
  }

  report.overlay = await tryOverlay(page);
  await page.close();
} catch (e) {
  report.error = String(e && e.message ? e.message : e);
}

await browser.close();

const outPath = path.join(OUT, "metrics.json");
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

// Compact summary for stdout
const summary = {
  wrote: outPath,
  viewports: {},
  overlay: {
    status: report.overlay?.status,
    reason: report.overlay?.reason,
    cleanup: report.overlay?.cleanup?.ok,
  },
  falsePositives: report.falsePositives,
  error: report.error || null,
};

for (const [key, m] of Object.entries(report.viewports)) {
  summary.viewports[key] = {
    pageScrolls: m.pageScrolls,
    pageHOverflow: m.pageHOverflow,
    hOverflowCount: m.horizontalOverflowCount,
    proofRatio: m.proofVisual?.ratio,
    proofWH: m.proofVisual ? `${m.proofVisual.w}x${m.proofVisual.h}` : null,
    filterVisible: m.filterInfo?.visible,
    filterLines: m.filterInfo?.lines,
    filterOverflowX: m.filterInfo?.overflowX,
    tinyTargets: m.tinyTargetsCount,
    chinPlateLines: m.chinInfo?.plateLines,
    chinPlateOverflow: m.chinInfo?.plateOverflow,
    surfaceKeyRows: m.chinInfo?.surfaceKeyRows,
    surfaceKeysOverflowOrWrap: m.chinInfo?.surfaceKeysOverflowOrWrap,
    aboutStacked: m.aboutLive?.stacked,
    aboutCols: m.aboutLive?.colCount,
    aboutRows: m.aboutLive?.rowCount,
    aboutNested: m.aboutLive?.nested,
  };
}

console.log(JSON.stringify(summary, null, 2));
