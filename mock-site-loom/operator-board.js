/* Operator Board — single-viewport instrument surface */

const data = window.FLOW_DATA;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const DOMAIN_IDS = ['fintech', 'erp', 'systems'];
const DUR = 0.35;
const SPRING = 'power2.out';
const SPRING_BACK = 'back.out(1.7)';
const BOOT_LINES = [
  'session ok',
  'ledger synced · record indexed',
  'proof surface online'
];

const board = document.getElementById('board');
const domainTabsEl = document.getElementById('domainTabs');
const proofStage = document.getElementById('proofStage');
const proofDomainDesc = document.getElementById('proofDomainDesc');
const proofAnchor = document.getElementById('proofAnchor');
const proofPeeks = document.getElementById('proofPeeks');
const commsCore = document.getElementById('commsCore');
const principlesList = document.getElementById('principlesList');
const commsNote = document.getElementById('commsNote');
const ledgerBar = document.getElementById('ledgerBar');
const ledgerCollapsed = document.getElementById('ledgerCollapsed');
const ledgerExpanded = document.getElementById('ledgerExpanded');
const ledgerExpandBtn = document.getElementById('ledgerExpandBtn');
const ledgerCloseBtn = document.getElementById('ledgerCloseBtn');
const ledgerEmployersPreview = document.getElementById('ledgerEmployersPreview');
const ledgerClientsPreview = document.getElementById('ledgerClientsPreview');
const statusSlots = document.getElementById('statusSlots');

const state = {
  domain: 'fintech',
  anchorIndex: 0,
  ledgerOpen: false
};

let domainSections = [];
let tabIndicator = null;
let caseTabIndicator = null;
let proofSwapTimer = null;

function clearProofAnchorMotion() {
  if (!proofAnchor || typeof gsap === 'undefined') return;
  gsap.killTweensOf([proofAnchor, proofPeeks]);
  gsap.set(proofAnchor, { clearProps: 'opacity,transform' });
  proofAnchor.querySelectorAll('.anchor-left, .anchor-right, .anchor-title-row').forEach((el) => {
    gsap.set(el, { clearProps: 'opacity,transform' });
  });
}

/* ── Logo mark helper ── */
function initials(name) {
  return name
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

const LOGO_PALETTE = [
  ['#e8e4ff', '#533afd'],
  ['#ebe8ff', '#6d5ce8'],
  ['#ffeaea', '#c03030'],
  ['#e4fff0', '#1a7a4a'],
  ['#fff8e4', '#8a6200'],
  ['#f0e4ff', '#7a30c0'],
  ['#e4f8ff', '#1a8aaa'],
  ['#fff0e4', '#b04010'],
];

function logoColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return LOGO_PALETTE[h % LOGO_PALETTE.length];
}

const LOGO_DEV_TOKEN = 'pk_R1LW9sQJQQKGPBHa1GofOQ';

function monogramMarkup(name, size, extraClass = '') {
  const init = initials(name);
  const [bg, fg] = logoColor(name);
  const fs = Math.round(size * 0.38);
  return `<span class="logo-mark ${extraClass}" style="--lm-bg:${bg};--lm-fg:${fg};width:${size}px;height:${size}px;font-size:${fs}px" aria-hidden="true" title="${escapeHtml(name)}">${init}</span>`;
}

/** Monogram fallback when no logo source is available. */
function logoMark(name, web, size = 28, extraClass = '', { logo = null } = {}) {
  if (!logo && !web) return monogramMarkup(name, size, extraClass);

  const init = initials(name);
  const [bg, fg] = logoColor(name);
  const fs = Math.round(size * 0.38);
  const logoAttr = logo ? ` data-logo-src="${escapeHtml(logo)}"` : '';
  const webAttr = web ? ` data-logo-web="${escapeHtml(web)}"` : '';
  return `<span class="logo-stack ${extraClass}"${logoAttr}${webAttr} data-logo-name="${escapeHtml(name)}" style="--lm-size:${size}px;--lm-fs:${fs}px;--lm-bg:${bg};--lm-fg:${fg}" title="${escapeHtml(name)}"><span class="logo-mark logo-mark--base" aria-hidden="true">${init}</span></span>`;
}

function recordLogo(record, size, extraClass = '') {
  return logoMark(record.name, record.web, size, extraClass, { logo: record.logo });
}

function logoSources(web, localSrc) {
  const sources = [];
  if (localSrc) sources.push(localSrc);
  if (web) {
    sources.push(`https://img.logo.dev/${encodeURIComponent(web)}?token=${LOGO_DEV_TOKEN}&size=128`);
    sources.push(`https://www.google.com/s2/favicons?domain=${encodeURIComponent(web)}&sz=128`);
  }
  return sources;
}

function isLikelyPlaceholderLogo(img) {
  return img.naturalWidth <= 16 && img.naturalHeight <= 16;
}

function hydrateLogos(root = document) {
  root.querySelectorAll('.logo-stack:not([data-logo-hydrated])').forEach((stack) => {
    const localSrc = stack.dataset.logoSrc;
    const web = stack.dataset.logoWeb;
    const sources = logoSources(web, localSrc);
    if (!sources.length) return;

    stack.dataset.logoHydrated = '1';
    let attempt = 0;

    const tryLoad = () => {
      if (attempt >= sources.length) return;

      const src = sources[attempt++];
      const img = document.createElement('img');
      img.className = 'logo-img logo-img--enhance';
      img.alt = '';
      img.decoding = 'async';
      img.loading = 'lazy';

      img.addEventListener('load', () => {
        if (isLikelyPlaceholderLogo(img) && attempt < sources.length) {
          img.remove();
          tryLoad();
          return;
        }
        if (img.naturalWidth > 0) stack.classList.add('is-loaded');
        else {
          img.remove();
          tryLoad();
        }
      });
      img.addEventListener('error', () => {
        img.remove();
        tryLoad();
      });

      stack.appendChild(img);
      img.src = src;
    };

    tryLoad();
  });
}

/* ── Time-of-day greeting ── */
function dakarGreeting() {
  const now = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Africa/Dakar' })
  );
  const h = now.getHours();
  if (h < 5) return 'Working late';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 21) return 'Good evening';
  return 'Good evening';
}

function startDakarClock() {
  const clockEl = document.getElementById('dakarclock');
  const greetEl = document.getElementById('statusGreeting');
  if (!clockEl) return;
  const tick = () => {
    const now = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Africa/Dakar' })
    );
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    clockEl.textContent = `${h}:${m}`;
    if (greetEl && !greetEl.textContent) greetEl.textContent = dakarGreeting();
  };
  tick();
  setInterval(tick, 30000);
}

/* ── Copy-to-clipboard toast ── */
let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById('copyToast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2200);
}

async function copyText(text, label) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(`${label} copied`);
  } catch {
    showToast('Copy failed');
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function workUrl(slug) {
  return `${data.paths?.work ?? '/en/work'}/${slug}`;
}

function writingUrl(slug) {
  return `${data.paths?.writing ?? '/en/writing'}/${slug}`;
}

function getDomainSection(id) {
  return domainSections.find((section) => section.id === id);
}

function getCases() {
  const section = getDomainSection(state.domain);
  if (!section?.cases) return [];
  const cases = [...section.cases];
  if (state.anchorIndex > 0 && state.anchorIndex < cases.length) {
    const [anchor] = cases.splice(state.anchorIndex, 1);
    cases.unshift(anchor);
  }
  return cases;
}

function renderAnchor(caseItem) {
  const meta = caseItem.meta?.map((item) => `<span>${escapeHtml(item)}</span>`).join('') ?? '';
  const caseStudyLink =
    caseItem.caseStudySlug
      ? `<a class="case-study-link glass-btn glass-btn--primary" href="${escapeHtml(workUrl(caseItem.caseStudySlug))}">Read case study <span aria-hidden="true">↗</span></a>`
      : '';
  const essayLink = caseItem.essaySlug
    ? `<a class="essay-link glass-btn mono" href="${escapeHtml(writingUrl(caseItem.essaySlug))}">Essay →</a>`
    : '';
  const recordLink =
    !caseItem.caseStudySlug
      ? `<button type="button" class="record-link glass-btn mono" data-action="open-ledger">View in work record <span aria-hidden="true">↓</span></button>`
      : '';
  const logoHtml = `<div class="anchor-logo-wrap">${recordLogo({ name: caseItem.title, web: caseItem.web, logo: caseItem.logo }, 36, 'anchor-logo')}</div>`;

  const leftCol = `
    <div class="anchor-left">
      <div class="anchor-title-row">
        ${logoHtml}
        <div>
          ${caseItem.label ? `<span class="anchor-label mono">${escapeHtml(caseItem.label)}</span>` : ''}
          <h2 class="anchor-title">${escapeHtml(caseItem.title)}</h2>
        </div>
      </div>
      ${caseItem.period ? `<p class="anchor-period mono">${escapeHtml(caseItem.period)} · ${escapeHtml(caseItem.role)}</p>` : ''}
      <p class="anchor-summary">${escapeHtml(caseItem.summary)}</p>
      ${meta ? `<div class="anchor-meta mono">${meta}</div>` : ''}
    </div>
  `;

  const rightCol = `
    <div class="anchor-right">
      ${caseItem.outcome ? `
        <div class="anchor-outcome">
          <span class="anchor-outcome-label mono">Outcome</span>
          <p>${escapeHtml(caseItem.outcome)}</p>
        </div>
      ` : '<div class="anchor-outcome" style="flex:1"></div>'}
      ${caseStudyLink || essayLink || recordLink ? `<div class="anchor-actions">${caseStudyLink}${essayLink}${recordLink}</div>` : ''}
    </div>
  `;

  return leftCol + rightCol;
}

function renderCaseTab(caseItem, originalIndex, isActive) {
  return `
    <button
      type="button"
      class="case-tab glass-chip"
      role="tab"
      data-case-index="${originalIndex}"
      aria-selected="${isActive ? 'true' : 'false'}"
      aria-label="${escapeHtml(caseItem.title)}"
    >${escapeHtml(caseItem.title)}</button>
  `;
}

function positionCaseTabIndicator(animate = true) {
  const active = proofPeeks.querySelector('.case-tab[aria-selected="true"]');
  if (!active || !caseTabIndicator) return;

  const tabsRect = proofPeeks.getBoundingClientRect();
  const activeRect = active.getBoundingClientRect();
  const left = activeRect.left - tabsRect.left;
  const width = activeRect.width;

  if (animate && !reduceMotion && typeof gsap !== 'undefined') {
    gsap.to(caseTabIndicator, { left, width, opacity: 1, duration: 0.5, ease: SPRING_BACK });
  } else {
    caseTabIndicator.style.left = `${left}px`;
    caseTabIndicator.style.width = `${width}px`;
    caseTabIndicator.style.opacity = '1';
  }
}

function renderProofStage(animate = false) {
  const section = getDomainSection(state.domain);
  if (!section) return;

  const cases = getCases();
  const anchor = cases[0];

  const update = () => {
    proofDomainDesc.textContent = section.desc;
    proofAnchor.innerHTML = anchor ? renderAnchor(anchor) : '';

    const allCases = section.cases;
    proofPeeks.innerHTML = `<span class="case-tab-indicator glass-indicator" id="caseTabIndicator" aria-hidden="true"></span>${allCases
      .map((item, index) => renderCaseTab(item, index, index === state.anchorIndex))
      .join('')}`;
    caseTabIndicator = document.getElementById('caseTabIndicator');
    positionCaseTabIndicator(false);
    hydrateLogos(proofAnchor);

    const caseRow = proofPeeks.closest('.nav-row');
    if (caseRow) {
      caseRow.hidden = allCases.length <= 1;
    } else {
      proofPeeks.hidden = allCases.length <= 1;
    }
    document.title = `${anchor?.title ?? section.domain} · Aliou Wade · Operator Board`;
  };

  clearTimeout(proofSwapTimer);
  clearProofAnchorMotion();
  proofStage.parentElement.classList.remove('is-swapping');

  if (!animate || reduceMotion || typeof gsap === 'undefined') {
    update();
    clearProofAnchorMotion();
    return;
  }

  proofStage.parentElement.classList.add('is-swapping');
  proofSwapTimer = window.setTimeout(() => {
    update();
    proofStage.parentElement.classList.remove('is-swapping');
    gsap.fromTo(
      proofAnchor,
      { opacity: 0, y: 8 },
      {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: SPRING,
        clearProps: 'opacity,transform',
        onComplete: clearProofAnchorMotion
      }
    );
    gsap.fromTo(
      proofPeeks,
      { opacity: 0, y: 4 },
      { opacity: 1, y: 0, duration: 0.3, ease: SPRING, clearProps: 'opacity,transform' }
    );
  }, 180);
}

function renderDomainTabs() {
  const tabs = domainSections
    .map(
      (section) => `
        <button
          type="button"
          class="domain-tab glass-chip"
          role="tab"
          id="tab-${escapeHtml(section.id)}"
          aria-selected="${section.id === state.domain ? 'true' : 'false'}"
          aria-controls="proofStage"
          data-domain="${escapeHtml(section.id)}"
        >${escapeHtml(section.domain)}</button>
      `
    )
    .join('');

  domainTabsEl.innerHTML = `<span class="domain-tab-indicator glass-indicator" id="tabIndicator" aria-hidden="true"></span>${tabs}`;
  tabIndicator = document.getElementById('tabIndicator');
  positionTabIndicator(false);
}

function positionTabIndicator(animate = true) {
  const active = domainTabsEl.querySelector('.domain-tab[aria-selected="true"]');
  if (!active || !tabIndicator) return;

  const tabsRect = domainTabsEl.getBoundingClientRect();
  const activeRect = active.getBoundingClientRect();
  const left = activeRect.left - tabsRect.left;
  const width = activeRect.width;

  if (animate && !reduceMotion && typeof gsap !== 'undefined') {
    gsap.to(tabIndicator, { left, width, opacity: 1, duration: 0.5, ease: SPRING_BACK });
  } else {
    tabIndicator.style.left = `${left}px`;
    tabIndicator.style.width = `${width}px`;
    tabIndicator.style.opacity = '1';
  }
}

function setDomain(id, animate = true) {
  if (!DOMAIN_IDS.includes(id)) return;

  state.domain = id;
  state.anchorIndex = 0;

  domainTabsEl.querySelectorAll('.domain-tab').forEach((tab) => {
    tab.setAttribute('aria-selected', tab.dataset.domain === id ? 'true' : 'false');
  });

  proofStage.setAttribute('aria-labelledby', `tab-${id}`);

  positionTabIndicator(animate);
  renderProofStage(animate);
  highlightLedgerForDomain(id);
  syncUrlHash(id);
}

function highlightLedgerForDomain(domainId) {
  const domainMap = {
    fintech: ['Fintech', 'Finance', 'Marketplace'],
    erp: ['ERP', 'Operations', 'Education'],
    systems: ['Logistics', 'Drone', 'Automotive', 'Retail', 'Institution']
  };
  const keywords = domainMap[domainId] ?? [];

  document.querySelectorAll('.client-row').forEach((row) => {
    const domain = row.dataset.domain ?? '';
    const match = keywords.some((kw) => domain.includes(kw));
    row.classList.toggle('is-highlighted', match);
  });
}

function promoteCase(peekIndex) {
  const section = getDomainSection(state.domain);
  if (!section?.cases || peekIndex < 0 || peekIndex >= section.cases.length) return;
  if (peekIndex === state.anchorIndex) return;

  state.anchorIndex = peekIndex;
  renderProofStage(true);
}

function renderComms() {
  const { profile } = data;

  commsCore.innerHTML = `
    <p class="comms-intro">${escapeHtml(profile.intro)}</p>
    <nav class="comms-links" aria-label="Contact and profiles">
      <button type="button" class="comms-link glass-btn" data-copy="${escapeHtml(profile.email)}" data-copy-label="Email" title="${escapeHtml(profile.email)}">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M1 5l7 5 7-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        <span class="comms-link-label">Email</span>
      </button>
      <a href="${escapeHtml(profile.whatsapp)}" target="_blank" rel="noopener noreferrer" class="comms-link glass-btn" title="${escapeHtml(profile.whatsappDisplay)}">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2.5 2.5h11v7.5H9L5.5 12.5V10H2.5V2.5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
        <span>WhatsApp</span>
      </a>
      <a href="${escapeHtml(profile.linkedin)}" target="_blank" rel="noopener noreferrer" class="comms-link glass-btn">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
        <span>LinkedIn</span>
      </a>
      <a href="${escapeHtml(profile.github)}" target="_blank" rel="noopener noreferrer" class="comms-link glass-btn">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.341-3.369-1.341-.454-1.154-1.11-1.461-1.11-1.461-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.934.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
        <span>GitHub</span>
      </a>
    </nav>
    <p class="comms-off-clock mono">${escapeHtml(profile.offClock)}</p>
  `;

  principlesList.innerHTML = data.principles
    .map(
      (item) => `
        <details class="principle-item" name="principles">
          <summary class="principle-summary"><strong>${escapeHtml(item.label)}</strong></summary>
          <p>${escapeHtml(item.body)}</p>
        </details>
      `
    )
    .join('');

  commsNote.textContent = profile.repliesNote ?? profile.availabilityNote;
  if (statusSlots) statusSlots.textContent = profile.availability;

  const roleEl = document.getElementById('railRole');
  if (roleEl && profile.role) roleEl.textContent = profile.role;
}

function renderLedgerPreview() {
  const employers = data.employers.slice(0, 4);
  const clients = data.clients.slice(0, data.recordFeaturedClients ?? 4);
  const hiddenCount = Math.max(0, data.clients.length - clients.length);

  ledgerEmployersPreview.innerHTML = employers
    .map((item) => `<span class="ledger-chip">${recordLogo(item, 18, 'chip-logo')}<span>${escapeHtml(item.name)}</span></span>`)
    .join('');

  ledgerClientsPreview.innerHTML =
    clients.map((item) => `<span class="ledger-chip">${recordLogo(item, 18, 'chip-logo')}<span>${escapeHtml(item.name)}</span></span>`).join('') +
    (hiddenCount > 0 ? `<span class="ledger-chip ledger-chip--more">+${hiddenCount} more</span>` : '');

  hydrateLogos(ledgerEmployersPreview);
  hydrateLogos(ledgerClientsPreview);

  if (ledgerExpandBtn) {
    ledgerExpandBtn.textContent = 'Full record';
    ledgerExpandBtn.setAttribute(
      'aria-label',
      hiddenCount > 0
        ? `Expand full work record, includes ${hiddenCount} more client builds`
        : 'Expand full work record'
    );
  }
}

function renderLocaleSwitch() {
  const el = document.getElementById('localeSwitch');
  if (!el || !data?.paths) return;

  const homeFr = data.paths.homeFr ?? '/fr';
  el.innerHTML = `
    <span class="locale-opt is-active" aria-current="true">EN</span>
    <span class="locale-sep" aria-hidden="true">/</span>
    <a href="${escapeHtml(homeFr)}" class="locale-opt" hreflang="fr" lang="fr" title="Version française">FR</a>
  `;
}

function renderLedgerExpanded() {
  const employerList = document.getElementById('employerList');
  const clientList = document.getElementById('clientList');
  const stackList = document.getElementById('stackList');
  const essayTeaser = document.getElementById('essayTeaser');

  if (employerList) {
    employerList.innerHTML = data.employers
      .map(
        (item) => `
          <li class="employer-row">
            <span class="employer-period mono">${escapeHtml(item.period)}</span>
            <div class="employer-body">
              <div class="employer-name-row">
                ${recordLogo(item, 24, 'employer-logo')}
                <strong>${escapeHtml(item.name)}</strong>
              </div>
              <span class="employer-role">${escapeHtml(item.role)}</span>
              <p>${escapeHtml(item.proof)}</p>
            </div>
          </li>
        `
      )
      .join('');
    hydrateLogos(employerList);
  }

  if (clientList) {
    clientList.innerHTML = data.clients
      .map(
        (item) => `
          <li class="client-row" data-domain="${escapeHtml(item.domain)}">
            <div class="client-head">
              <div class="client-name-row">
                ${recordLogo(item, 22, 'client-logo')}
                <strong>${escapeHtml(item.name)}</strong>
              </div>
              <span class="client-domain mono">${escapeHtml(item.domain)}</span>
            </div>
            <p>${escapeHtml(item.scope)}</p>
          </li>
        `
      )
      .join('');
    hydrateLogos(clientList);
  }

  if (stackList) {
    stackList.innerHTML = data.stack
      .map((tech) => `<span class="stack-chip">${escapeHtml(tech)}</span>`)
      .join('');
  }

  if (essayTeaser) {
    essayTeaser.innerHTML = `
      <span class="field-notes-kicker mono">Essay</span>
      <h4 class="field-notes-title">${escapeHtml(data.writing.title)}</h4>
      <p class="field-notes-summary">${escapeHtml(data.writing.summary)}</p>
      <a class="field-notes-read glass-btn mono" href="${escapeHtml(writingUrl(data.writing.slug))}">Read essay →</a>
    `;
  }

  highlightLedgerForDomain(state.domain);
}

let ledgerFocusableElements = [];

function updateLedgerFocusableElements() {
  const selectors = 'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])';
  ledgerFocusableElements = Array.from(ledgerExpanded.querySelectorAll(selectors));
}

function openLedger() {
  state.ledgerOpen = true;
  board.classList.add('board--ledger-open');
  ledgerExpanded.hidden = false;
  ledgerExpandBtn?.setAttribute('aria-expanded', 'true');

  updateLedgerFocusableElements();
  if (ledgerFocusableElements.length > 0) {
    // Focus the close button or first interactive element
    ledgerFocusableElements[0].focus();
  }

  if (!reduceMotion && typeof gsap !== 'undefined') {
    gsap.fromTo(ledgerExpanded, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45, ease: SPRING });
  }
}

function closeLedger() {
  state.ledgerOpen = false;
  board.classList.remove('board--ledger-open');
  ledgerExpanded.hidden = true;
  ledgerExpandBtn?.setAttribute('aria-expanded', 'false');
  ledgerExpandBtn?.focus();
}

function syncUrlHash(domainId) {
  if (!domainId || !history.replaceState) return;
  const url = new URL(window.location.href);
  url.hash = domainId;
  history.replaceState(null, '', url);
}

function parseDeepLink() {
  const hash = window.location.hash.replace(/^#/, '');
  if (DOMAIN_IDS.includes(hash)) {
    setDomain(hash, !reduceMotion);
  }
}

function bindEvents() {
  domainTabsEl.addEventListener('click', (event) => {
    const tab = event.target.closest('.domain-tab');
    if (!tab) return;
    setDomain(tab.dataset.domain);
  });

  proofPeeks.addEventListener('click', (event) => {
    const tab = event.target.closest('.case-tab');
    if (!tab) return;
    promoteCase(Number(tab.dataset.caseIndex));
  });

  proofStage?.addEventListener('click', (event) => {
    if (!event.target.closest('[data-action="open-ledger"]')) return;
    openLedger();
  });

  commsCore?.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-copy]');
    if (!btn) return;
    event.preventDefault();
    copyText(btn.dataset.copy, btn.dataset.copyLabel ?? 'Text');
    btn.classList.add('is-copied');
    const labelEl = btn.querySelector('.comms-link-label');
    if (labelEl) {
      const prev = labelEl.textContent;
      labelEl.textContent = 'Copied';
      setTimeout(() => {
        btn.classList.remove('is-copied');
        labelEl.textContent = prev;
      }, 1400);
    } else {
      setTimeout(() => btn.classList.remove('is-copied'), 1400);
    }
  });

  ledgerExpandBtn?.addEventListener('click', openLedger);
  ledgerCloseBtn?.addEventListener('click', closeLedger);

  document.addEventListener('keydown', (event) => {
    if (state.ledgerOpen) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeLedger();
        return;
      }
      if (event.key === 'Tab' && ledgerFocusableElements.length > 0) {
        const firstEl = ledgerFocusableElements[0];
        const lastEl = ledgerFocusableElements[ledgerFocusableElements.length - 1];
        if (event.shiftKey && document.activeElement === firstEl) {
          lastEl.focus();
          event.preventDefault();
        } else if (!event.shiftKey && document.activeElement === lastEl) {
          firstEl.focus();
          event.preventDefault();
        }
      }
    }

    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;

    const tabIndex = DOMAIN_IDS.indexOf(state.domain);
    if (event.key === 'ArrowRight' && tabIndex < DOMAIN_IDS.length - 1) {
      setDomain(DOMAIN_IDS[tabIndex + 1]);
    } else if (event.key === 'ArrowLeft' && tabIndex > 0) {
      setDomain(DOMAIN_IDS[tabIndex - 1]);
    } else if (event.key >= '1' && event.key <= '3') {
      setDomain(DOMAIN_IDS[Number(event.key) - 1]);
    }
  });

  window.addEventListener('hashchange', parseDeepLink);
  window.addEventListener('resize', () => {
    positionTabIndicator(false);
    positionCaseTabIndicator(false);
  });

  bindCursorTilt();
  bindChipHovers();
  if (document.fonts) {
    document.fonts.ready.then(() => {
      positionTabIndicator(false);
      positionCaseTabIndicator(false);
    });
  }
}

function bindChipHovers() {
  document.querySelectorAll('.ledger-chip').forEach((chip) => {
    chip.addEventListener('mouseenter', () => {
      if (reduceMotion || typeof gsap === 'undefined') return;
      gsap.to(chip, { y: -2, scale: 1.04, duration: 0.18, ease: 'power2.out' });
    });
    chip.addEventListener('mouseleave', () => {
      if (reduceMotion || typeof gsap === 'undefined') return;
      gsap.to(chip, { y: 0, scale: 1, duration: 0.25, ease: 'power2.out' });
    });
  });
}

function bindCursorTilt() {
  const tray = document.querySelector('.proof-anchor-tray');
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (!tray || reduceMotion || !finePointer) return;

  const MAX = 1.5;
  tray.addEventListener('pointermove', (event) => {
    const rect = tray.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    proofAnchor.style.setProperty('--tilt-x', `${(px * MAX).toFixed(3)}deg`);
    proofAnchor.style.setProperty('--tilt-y', `${(-py * MAX).toFixed(3)}deg`);
  });
  tray.addEventListener('pointerleave', () => {
    proofAnchor.style.setProperty('--tilt-x', '0deg');
    proofAnchor.style.setProperty('--tilt-y', '0deg');
  });
}

function revealBoard() {
  document.body.classList.add('is-booted');

  if (!reduceMotion && typeof gsap !== 'undefined') {
    gsap.from('.proof-anchor-tray', {
      scale: 0.98,
      opacity: 0,
      duration: 0.55,
      delay: 0.1,
      ease: SPRING
    });
  }
}

function runBoot() {
  const overlay = document.getElementById('bootOverlay');
  const linesEl = document.getElementById('bootLines');
  const alreadyBooted = sessionStorage.getItem('ob-booted') === '1';

  if (!overlay || !linesEl || alreadyBooted || reduceMotion || typeof gsap === 'undefined') {
    overlay?.remove();
    revealBoard();
    return;
  }

  let finished = false;
  let tl;

  const finish = () => {
    if (finished) return;
    finished = true;
    sessionStorage.setItem('ob-booted', '1');
    tl?.kill();
    document.removeEventListener('keydown', onSkip);
    overlay.removeEventListener('click', onSkip);
    revealBoard();
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.4,
      ease: SPRING,
      onComplete: () => overlay.remove()
    });
  };
  const onSkip = () => finish();

  document.addEventListener('keydown', onSkip);
  overlay.addEventListener('click', onSkip);

  tl = gsap.timeline({ onComplete: () => gsap.delayedCall(0.4, finish) });
  BOOT_LINES.forEach((line, index) => {
    const lineEl = document.createElement('div');
    lineEl.className = 'boot-line';
    lineEl.innerHTML = '<span class="boot-prompt" aria-hidden="true">\u25C9</span><span class="boot-text"></span>';
    linesEl.appendChild(lineEl);
    const textEl = lineEl.querySelector('.boot-text');
    const cursor = { n: 0 };
    tl.to(cursor, {
      n: line.length,
      duration: Math.max(0.28, line.length * 0.024),
      ease: 'none',
      onUpdate: () => { textEl.textContent = line.slice(0, Math.round(cursor.n)); }
    }, index === 0 ? 0.25 : '>0.12');
  });
}

function applyGlassChrome() {
  domainTabsEl?.classList.add('glass-well');
  proofPeeks?.classList.add('glass-well', 'glass-well--nested');
  principlesList?.classList.add('glass-well');
  document.getElementById('localeSwitch')?.classList.add('glass-well');
  ledgerExpandBtn?.classList.add('glass-btn');
  ledgerCloseBtn?.classList.add('glass-btn');
}

function init() {
  if (!data) return;

  domainSections = (data.sectionsSoft ?? data.sections).filter(
    (section) => section.type === 'domain' && DOMAIN_IDS.includes(section.id)
  );

  applyGlassChrome();

  renderDomainTabs();
  renderLocaleSwitch();
  renderComms();
  renderLedgerPreview();
  renderLedgerExpanded();
  renderProofStage(false);
  bindEvents();
  parseDeepLink();
  startDakarClock();
  runBoot();
}

init();
