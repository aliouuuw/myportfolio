import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const URL = "http://127.0.0.1:4321/lab/precision";
const OUT_DIR = "/Users/aliouwade/Documents/myportfolio/.impeccable/assess-b";
fs.mkdirSync(OUT_DIR, { recursive: true });

const findings = {
  contrast: { dark: [], light: [] },
  focus: [],
  colorOnly: [],
  reducedMotion: [],
  typeState: null,
  failedSteps: [],
};

async function attachMeasure(page) {
  await page.addScriptTag({ content: `
    window.__assessBMeasure = function() {
      function parseColor(value) {
        if (!value) return null;
        const s = value.trim();
        let m = s.match(/^rgba?\\(\\s*([\\d.]+)\\s*,\\s*([\\d.]+)\\s*,\\s*([\\d.]+)\\s*(?:,\\s*([\\d.]+)\\s*)?\\)$/i);
        if (m) return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] };
        m = s.match(/^color\\(\\s*srgb\\s+([\\d.]+)\\s+([\\d.]+)\\s+([\\d.]+)(?:\\s*\\/\\s*([\\d.]+))?\\s*\\)$/i);
        if (m) return { r: +m[1] * 255, g: +m[2] * 255, b: +m[3] * 255, a: m[4] === undefined ? 1 : +m[4] };
        return null;
      }
      function relLum(c) {
        if (!c) return null;
        const toLin = (v) => { const s = v/255; return s <= 0.03928 ? s/12.92 : Math.pow((s+0.055)/1.055, 2.4); };
        return 0.2126*toLin(c.r) + 0.7152*toLin(c.g) + 0.0722*toLin(c.b);
      }
      function contrast(fg, bg) {
        const L1 = relLum(fg), L2 = relLum(bg);
        if (L1 === null || L2 === null) return null;
        return (Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05);
      }
      function flattenOver(fg, bg) {
        if (!fg) return bg;
        if (fg.a >= 0.999) return fg;
        if (!bg) return { ...fg, a: 1 };
        const a = fg.a;
        return { r: fg.r*a+bg.r*(1-a), g: fg.g*a+bg.g*(1-a), b: fg.b*a+bg.b*(1-a), a: 1 };
      }
      function isLarge(cs) {
        const fs2 = parseFloat(cs.fontSize);
        const fw = parseInt(cs.fontWeight, 10);
        if (fs2 >= 24) return true;
        if (fw >= 700 && fs2 >= 18.66) return true;
        return false;
      }
      function selectorFor(el) {
        const parts = [];
        let cur = el;
        while (cur && cur.nodeType === 1 && cur !== cur.ownerDocument.documentElement) {
          let part = cur.tagName.toLowerCase();
          if (cur.id) part += '#' + cur.id;
          const cls = Array.from(cur.classList).slice(0,2).join('.');
          if (cls) part += '.' + cls;
          const parent = cur.parentElement;
          if (parent) {
            const same = Array.from(parent.children).filter((c) => c.tagName === cur.tagName);
            if (same.length > 1) part += ':nth-of-type(' + (same.indexOf(cur)+1) + ')';
          }
          parts.unshift(part);
          cur = cur.parentElement;
        }
        return parts.length ? parts.join(' > ') : '(root)';
      }
      const results = [];
      const all = document.querySelectorAll('body *');
      for (const el of all) {
        const ownText = Array.from(el.childNodes).filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').trim();
        if (!ownText) continue;
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) continue;
        if (el.closest('[hidden]') || el.hasAttribute('hidden')) continue;
        const fg = parseColor(cs.color);
        if (!fg) continue;
        let bgEl = el, bg = null;
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
        const fgFlat = flattenOver(fg, bg);
        const ratio = contrast(fgFlat, bg);
        if (ratio === null) continue;
        const large = isLarge(cs);
        const threshold = large ? 3 : 4.5;
        const pass = ratio >= threshold;
        results.push({
          selector: selectorFor(el),
          text: ownText.slice(0, 40),
          fg: cs.color,
          bg: getComputedStyle(bgEl || el).backgroundColor,
          ratio: Math.round(ratio*100)/100,
          threshold, large, pass,
        });
      }
      return results;
    };
  `});
}

async function measure(page) {
  return await page.evaluate(() => window.__assessBMeasure());
}

const browser = await chromium.launch();

// DARK
try {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    const t = document.getElementById("theme-toggle"); if (t) t.textContent = "Light";
  });
  await page.waitForTimeout(300);
  await attachMeasure(page);
  await page.screenshot({ path: path.join(OUT_DIR, "dark-full.png"), fullPage: true });
  findings.contrast.dark = await measure(page);

  // TYPE STATE
  try {
    const noMediaName = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll(".row"));
      const target = rows.find((r) => !r.dataset.media);
      return target ? target.getAttribute("data-name") : null;
    });
    if (noMediaName) {
      await page.evaluate((name) => {
        const rows = Array.from(document.querySelectorAll(".row"));
        const target = rows.find((r) => r.getAttribute("data-name") === name);
        if (target) target.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
      }, noMediaName);
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(OUT_DIR, "type-state-no-preview.png") });
      findings.typeState = await page.evaluate(() => {
        const lamp = document.querySelector("#chin-state .lamp");
        const lampCS = lamp ? getComputedStyle(lamp) : null;
        const chinState = document.getElementById("chin-state");
        const chinCS = chinState ? getComputedStyle(chinState) : null;
        const chinText = document.getElementById("chin-state-text");
        const plate = document.getElementById("chin-plate");
        const plateDd = plate ? plate.querySelectorAll("dd") : [];
        return {
          hoveredRow: document.querySelector(".row.is-selected")?.getAttribute("data-name") || null,
          lampColor: lampCS ? lampCS.backgroundColor : null,
          lampBoxShadow: lampCS ? lampCS.boxShadow : null,
          chinState: chinState ? chinState.getAttribute("data-state") : null,
          chinStateText: chinText ? chinText.textContent : null,
          chinColor: chinCS ? chinCS.color : null,
          plateValues: Array.from(plateDd).map((dd) => dd.textContent.trim()),
          proofTypeHidden: document.getElementById("proof-type")?.hidden,
          proofMediaHidden: document.getElementById("proof-media")?.hidden,
          surfaceBarHidden: document.getElementById("surface-bar")?.hidden,
          mediaControlHidden: document.getElementById("media-control")?.hidden,
        };
      });
    } else {
      findings.typeState = { error: "No row without data-media found" };
    }
  } catch (e) {
    findings.typeState = { error: String(e && e.message ? e.message : e) };
  }

  // FOCUS
  try {
    await page.evaluate(() => { document.body.focus(); window.scrollTo(0,0); });
    await page.keyboard.press("Tab");
    const focusData = [];
    for (let i = 0; i < 8; i++) {
      const info = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return { tag: "body", selector: "body", outline: "none" };
        const cs = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          tag: el.tagName.toLowerCase(),
          id: el.id || null,
          text: (el.textContent || "").trim().slice(0, 30),
          selector: el.id ? "#" + el.id : el.tagName.toLowerCase() + (el.classList[0] ? "." + el.classList[0] : ""),
          outlineWidth: cs.outlineWidth,
          outlineStyle: cs.outlineStyle,
          outlineColor: cs.outlineColor,
          outlineOffset: cs.outlineOffset,
          borderWidth: cs.borderWidth,
          borderStyle: cs.borderStyle,
          borderColor: cs.borderColor,
          boxShadow: cs.boxShadow,
          rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) },
        };
      });
      focusData.push(info);
      await page.keyboard.press("Tab");
    }
    findings.focus = focusData;
  } catch (e) {
    findings.focus = [{ error: String(e && e.message ? e.message : e) }];
  }

  // COLOR-ONLY
  try {
    findings.colorOnly = await page.evaluate(() => {
      const out = [];
      const filters = Array.from(document.querySelectorAll(".filter"));
      const activeFilters = filters.filter((f) => f.getAttribute("aria-pressed") === "true");
      for (const f of activeFilters) {
        const cs = getComputedStyle(f);
        out.push({
          element: "filter[aria-pressed=true]",
          text: f.textContent.trim().slice(0, 30),
          bg: cs.backgroundColor, color: cs.color, borderColor: cs.borderColor,
          fontWeight: cs.fontWeight,
          nonColorCues: {
            ariaPressed: true,
            fontWeightBold: parseInt(cs.fontWeight, 10) >= 600,
            borderDifference: cs.borderTopWidth !== "0px" || cs.borderBottomWidth !== "0px",
          },
        });
      }
      const lamp = document.querySelector("#chin-state .lamp");
      if (lamp) {
        const cs = getComputedStyle(lamp);
        out.push({
          element: "chin-state .lamp",
          bg: cs.backgroundColor, boxShadow: cs.boxShadow, borderRadius: cs.borderRadius,
          size: cs.width + " x " + cs.height,
          nonColorCues: {
            textLabel: document.getElementById("chin-state-text")?.textContent,
            dataState: document.getElementById("chin-state")?.getAttribute("data-state"),
          },
        });
      }
      const modeBtns = Array.from(document.querySelectorAll("[data-mode]"));
      for (const b of modeBtns) {
        const cs = getComputedStyle(b);
        out.push({
          element: "mode-btn[data-mode=" + b.dataset.mode + "]",
          text: b.textContent.trim(),
          ariaPressed: b.getAttribute("aria-pressed"),
          color: cs.color, bg: cs.backgroundColor, fontWeight: cs.fontWeight,
        });
      }
      return out;
    });
  } catch (e) {
    findings.colorOnly = [{ error: String(e && e.message ? e.message : e) }];
  }

  await ctx.close();
} catch (e) {
  findings.failedSteps.push({ step: "dark-theme", error: String(e && e.message ? e.message : e) });
}

// LIGHT
try {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.click("#theme-toggle");
  await page.waitForTimeout(400);
  await attachMeasure(page);
  await page.screenshot({ path: path.join(OUT_DIR, "light-full.png"), fullPage: true });
  findings.contrast.light = await measure(page);
  await ctx.close();
} catch (e) {
  findings.failedSteps.push({ step: "light-theme", error: String(e && e.message ? e.message : e) });
}

// REDUCED MOTION
try {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT_DIR, "reduced-motion.png"), fullPage: true });
  findings.reducedMotion = await page.evaluate(() => {
    const v = document.getElementById("proof-video");
    const cs = v ? getComputedStyle(v) : null;
    return {
      videoPaused: v ? v.paused : null,
      videoAutoplayAttr: v ? v.hasAttribute("autoplay") : null,
      videoDisplay: cs ? cs.display : null,
      animationsRunning: document.getAnimations().length,
      proofVisualAnimations: document.querySelector(".proof-visual")?.getAnimations().length || 0,
      lampAnimations: document.querySelector("#chin-state .lamp")?.getAnimations().length || 0,
    };
  });
  await ctx.close();
} catch (e) {
  findings.failedSteps.push({ step: "reduced-motion", error: String(e && e.message ? e.message : e) });
}

await browser.close();
fs.writeFileSync(path.join(OUT_DIR, "findings.json"), JSON.stringify(findings, null, 2));
console.log(JSON.stringify({ ok: true, counts: {
  darkContrast: findings.contrast.dark.length,
  lightContrast: findings.contrast.light.length,
  focus: findings.focus.length,
  colorOnly: findings.colorOnly.length,
  reducedMotion: typeof findings.reducedMotion === "object" ? Object.keys(findings.reducedMotion).length : 0,
  failedSteps: findings.failedSteps.length,
}}, null, 2));
