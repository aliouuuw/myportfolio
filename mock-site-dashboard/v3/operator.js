/* ═══════════════════════════════════════════════════════════════
   OPERATOR v3 — View-based IA, no scroll-to-section
   ═══════════════════════════════════════════════════════════════ */

'use strict';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─────────────────────────────────────────────────────────────
   DATA
   ───────────────────────────────────────────────────────────── */

const CASES = {
  everest: {
    kicker: 'Fintech · 2025 → now',
    title: 'Everest Finance',
    meta: ['Solo technical owner', 'Next.js 15', 'TypeScript', 'PostgreSQL', 'Tailwind'],
    body: `
      <p>West African finance company. Customer data and account opening lived in spreadsheets. I mapped the real workflow first — three teams, four friction points — before writing a line.</p>
      <p>Consolidated a public website, an internal CRM, and the Sama Naffa customer app into one TypeScript / PostgreSQL operational spine.</p>
      <ul>
        <li>Internal CRM and operations dashboard — replaces spreadsheet triage</li>
        <li>Public site on shared data layer — no duplicate content management</li>
        <li>Sama Naffa customer app foundations — account view, transaction history</li>
        <li>Solo technical owner from architecture to production</li>
      </ul>
      <p class="proof-quote">The team now operates from one system instead of reconciling three.</p>
    `
  },
  odoo: {
    kicker: 'ERP · QA · Open source',
    title: 'Odoo 18 Acceptance Testing Kit',
    meta: ['Robot Framework', 'Playwright Browser', 'Python', '39 tests', '9 suites'],
    body: `
      <p>Repeatable acceptance validation for Odoo 18 migrations. Localization behavior — fiscal year, journal sequences, multi-currency — fails quietly without suite-level discipline.</p>
      <p>Built selector guidelines specific to Odoo 18's DOM after the framework's own test conventions diverged from the UI in v17+.</p>
      <ul>
        <li>Robot Framework + Playwright Browser structure for readability and speed</li>
        <li>Odoo 18-specific selector reference — avoids brittle XPath chains</li>
        <li>39 acceptance tests across 9 domain suites</li>
        <li>Covers accounting, inventory, HR, and CRM flows</li>
      </ul>
      <p class="proof-quote">Specificity is the product. Generic test frameworks are already abundant.</p>
    `
  },
  bocalbun: {
    kicker: 'Systems judgment · 2022–2023',
    title: 'BocalBun retrospective',
    meta: ['Frozen deliberately', 'Bun', 'Full-stack framework', 'Architecture'],
    body: `
      <p>Full-stack Bun framework — stopped deliberately. It solved my desire to build a framework, not a customer's operational problem.</p>
      <p>Premature abstraction is a tax operations teams cannot pay. The gap between framework elegance and real ops friction is where most technical projects quietly fail.</p>
      <ul>
        <li>Stopping is a deliverable when direction is wrong</li>
        <li>Framework elegance ≠ operational usefulness</li>
        <li>Lessons applied directly to Everest scoping decisions</li>
        <li>The retrospective is the asset — not the repo</li>
      </ul>
      <p class="proof-quote">The discipline to stop and write the post-mortem is the same discipline that ships clean operational software.</p>
    `
  },
  greentec: {
    kicker: 'ERP · Shipped',
    title: 'Africa GreenTec',
    meta: ['Odoo', 'Accounting module', 'High-volume journals'],
    body: `<p>Accounting module for high-volume journal processing. Part of broader ERP work alongside ERGOBIT and Odoo 18 localization. Production deployment, West Africa operations.</p>`
  },
  purolator: {
    kicker: 'Logistics · Canada',
    title: 'Purolator Digital Lab',
    meta: ['Ottawa', 'COOP + contract', 'Software engineering'],
    body: `<p>Software engineering at Purolator's digital lab in Ottawa. The Canada chapter — operational software at logistics scale before consolidating work in West Africa.</p>`
  },
  orange: {
    kicker: 'Mobile · Community',
    title: 'Orange Digital Lab',
    meta: ['React Native', '1,000+ members', 'Senegal'],
    body: `<p>React Native application for a large member community at Orange Digital Lab Senegal. Consumer-facing, localized, high-frequency usage.</p>`
  },
  bankingbook: {
    kicker: 'Fintech · APIs',
    title: 'BankingBook Analytics',
    meta: ['Open banking', 'UEMOA markets', 'ERP-adjacent'],
    body: `<p>Open-banking API work for UEMOA markets. ERP and business intelligence adjacent — the infrastructure layer for financial data access across West African banking.</p>`
  },
  asaaman: {
    kicker: 'Drone · AI · Surveillance',
    title: 'Asaaman',
    meta: ['Video AI', 'Semantic search', 'Senegal'],
    body: `<p>Semantic video search and surveillance workflow tooling for an intelligent-drone startup. Backend logic for classifying, indexing, and querying video streams.</p>`
  },
  eduplan: {
    kicker: 'Education · SaaS',
    title: 'EduPlan',
    meta: ['Scheduling', 'Academic institutions', 'Senegal'],
    body: `<p>Academic scheduling and planning tool for educational institutions. Operational logic for timetable generation, constraint resolution, and administration workflows.</p>`
  }
};

const ANCHORS = ['everest', 'odoo', 'bocalbun'];

const WRITING = {
  bocalbun: {
    kicker: 'Essay · 2026.03',
    wordCount: '~1,200 words',
    title: 'Why I stopped building BocalBun as a framework',
    excerpt: `Frameworks feel productive because they generate code. They rarely generate revenue for an operational business waiting on a narrow tool.`,
    body: `
      <p>Frameworks feel productive because they generate code. They rarely generate revenue for an operational business waiting on a narrow tool.</p>
      <p>I built BocalBun through most of 2022 — clean abstractions, good DX, the kind of thing you'd showcase at a meetup. I stopped it because I asked one question too late: whose problem does this solve?</p>
      <p>Stopping is a deliverable when the direction is wrong. The retrospective documents that judgment — and the same discipline now shapes how I scope every Everest decision and client engagement.</p>
    `
  }
};

const RECORD = [
  { year: '2026', msg: '<strong>Everest Finance</strong> — CRM live, Sama Naffa in hardening', tag: 'Fintech', case: 'everest' },
  { year: '2025', msg: '<strong>EduPlan</strong> — academic scheduling tool, Dakar institutions', tag: 'Education', case: 'eduplan' },
  { year: '2024', msg: '<strong>Odoo 18 kit</strong> — 39 acceptance tests across 9 suites', tag: 'ERP · QA', case: 'odoo' },
  { year: '2024', msg: '<strong>Africa GreenTec</strong> — accounting module in production', tag: 'ERP', case: 'greentec' },
  { year: '2023', msg: '<strong>BankingBook Analytics</strong> — open-banking APIs, UEMOA', tag: 'Fintech', case: 'bankingbook' },
  { year: '2023', msg: '<strong>Purolator</strong> — logistics software engineering, Ottawa', tag: 'Canada', case: 'purolator' },
  { year: '2022', msg: '<strong>Orange</strong> — React Native, 1,000+ members', tag: 'Mobile', case: 'orange' },
  { year: '2022', msg: '<strong>BocalBun</strong> — stopped. Judgment asset kept', tag: 'Judgment', case: 'bocalbun' },
  { year: '2021', msg: '<strong>Asaaman</strong> — drone AI surveillance tooling', tag: 'AI', case: 'asaaman' }
];

const VIEW_LABELS = { live: 'now', proof: 'proof', record: 'record', note: 'note', reach: 'reach' };

/* ─────────────────────────────────────────────────────────────
   DOM REFS
   ───────────────────────────────────────────────────────────── */
const stage        = document.getElementById('stage');
const crumbView    = document.getElementById('crumbView');
const stageClock   = document.getElementById('stageClock');
const chromePulse  = document.getElementById('chromePulse');
const tickerTrack  = document.getElementById('ticker');
const layer        = document.getElementById('layer');
const layerScrim   = document.getElementById('layerScrim');
const aboutDialog  = document.getElementById('aboutDialog');
const aboutScrim   = document.getElementById('aboutScrim');
const tabs         = document.querySelectorAll('.rail-tab');

let currentView    = 'live';
let activeProof    = ANCHORS[0];
let lastFocus      = null;

/* ─────────────────────────────────────────────────────────────
   CLOCK + CHROME STATUS
   ───────────────────────────────────────────────────────────── */
function updateClock() {
  const now   = new Date();
  const dakar = now.toLocaleTimeString('en-GB', { timeZone: 'Africa/Dakar', hour: '2-digit', minute: '2-digit' });
  stageClock.textContent = `Dakar ${dakar}`;
}

function updateChromeStatus() {
  const hour = new Date().toLocaleString('en-US', { timeZone: 'Africa/Dakar', hour: 'numeric', hour12: false });
  const h = parseInt(hour, 10);
  const online = h >= 7 && h < 22;
  chromePulse.innerHTML = online
    ? `<span class="pulse" aria-hidden="true"></span> online`
    : `<span class="pulse" style="background:var(--ink-faint);box-shadow:none" aria-hidden="true"></span> away`;
  chromePulse.style.color = online ? 'var(--live)' : 'var(--ink-faint)';
}

updateClock();
updateChromeStatus();
setInterval(updateClock, 30000);
setInterval(updateChromeStatus, 60000);

/* ─────────────────────────────────────────────────────────────
   TICKER
   ───────────────────────────────────────────────────────────── */
function buildTicker() {
  const items = RECORD.map((r) => {
    const plain = r.msg.replace(/<[^>]+>/g, '');
    return `<span class="yr">${r.year}</span> ${plain} <span class="yr">·</span>`;
  });
  const doubled = [...items, ...items].join(' ');
  tickerTrack.innerHTML = doubled;
}

/* ─────────────────────────────────────────────────────────────
   VIEW TEMPLATES
   ───────────────────────────────────────────────────────────── */

/* NOW */
function renderLive() {
  const now = new Date();
  const ts = (offset) => {
    const d = new Date(now.getTime() - offset * 60000);
    return d.toLocaleTimeString('en-GB', { timeZone: 'Africa/Dakar', hour: '2-digit', minute: '2-digit' });
  };

  return `
    <p class="view-kicker mono">Operator · Now</p>
    <h1 class="view-title">Current focus</h1>
    <p class="view-lead">Live operational state — what's being built, what shipped, and why it matters for the team running it.</p>

    <div class="live-primary">
      <div class="live-badge"><span class="pulse" aria-hidden="true"></span> Active engagement</div>
      <h2>Everest Finance — operational spine</h2>
      <p>Consolidating a public site, internal CRM, and Sama Naffa customer app into one TypeScript / PostgreSQL system. Solo technical owner, architecture to production.</p>
      <button type="button" class="live-open" data-open-case="everest">Open case file →</button>
    </div>

    <div class="metrics-row">
      <div class="metric">
        <div class="metric-k mono">Domains</div>
        <div class="metric-v">8+</div>
        <div class="metric-u">Fintech · ERP · Logistics · Education · Mobile · Health · Retail · Drone</div>
      </div>
      <div class="metric">
        <div class="metric-k mono">Career arc</div>
        <div class="metric-v">6 yr</div>
        <div class="metric-u">Ottawa logistics engineering → Dakar consolidation</div>
      </div>
      <div class="metric">
        <div class="metric-k mono">Availability</div>
        <div class="metric-v">Q3</div>
        <div class="metric-u">Selective engagements · remote-first</div>
      </div>
    </div>

    <div class="syslog" aria-label="System activity log">
      <div class="syslog-head">
        <span class="syslog-title mono">activity.log</span>
        <div class="syslog-dots" aria-hidden="true">
          <div class="syslog-dot"></div>
          <div class="syslog-dot"></div>
          <div class="syslog-dot"></div>
        </div>
      </div>
      <div class="syslog-lines">
        <div class="log-line">
          <span class="log-ts mono">${ts(2)}</span>
          <span class="log-tag log-tag--live">active</span>
          <span class="log-msg"><strong>Everest CRM</strong> — hardening Sama Naffa app layer</span>
        </div>
        <div class="log-line">
          <span class="log-ts mono">${ts(18)}</span>
          <span class="log-tag log-tag--ship">shipped</span>
          <span class="log-msg"><strong>Odoo 18 kit</strong> — 39 acceptance tests passing across 9 suites</span>
        </div>
        <div class="log-line">
          <span class="log-ts mono">${ts(34)}</span>
          <span class="log-tag log-tag--ship">shipped</span>
          <span class="log-msg"><strong>EduPlan</strong> — scheduling module deployed to pilot institutions</span>
        </div>
        <div class="log-line">
          <span class="log-ts mono">${ts(51)}</span>
          <span class="log-tag log-tag--warn">paused</span>
          <span class="log-msg"><strong>BocalBun</strong> — frozen. Judgment asset extracted, lessons carried forward</span>
        </div>
      </div>
    </div>
  `;
}

/* PROOF */
function renderProof() {
  const list = ANCHORS.map((id, i) => {
    const c = CASES[id];
    return `
      <button type="button" class="proof-item${id === activeProof ? ' is-active' : ''}" data-proof="${id}">
        <div class="proof-item__idx mono">0${i + 1}</div>
        <div class="proof-item__info">
          <div class="proof-item__title">${c.title}</div>
          <div class="proof-item__kicker mono">${c.kicker}</div>
        </div>
      </button>
    `;
  }).join('');

  const c = CASES[activeProof];
  const detail = `
    <p class="layer-k mono">${c.kicker}</p>
    <h3>${c.title}</h3>
    <div class="tags">${c.meta.map((m) => `<span>${m}</span>`).join('')}</div>
    ${c.body}
    <button type="button" class="live-open" data-open-case="${activeProof}" style="margin-top:4px">Full case file →</button>
  `;

  return `
    <p class="view-kicker mono">Operator · Proof</p>
    <p class="view-lead">Three anchor cases — judgment, not a project grid. Select to inspect.</p>
    <div class="proof-layout">
      <div class="proof-list">${list}</div>
      <div class="proof-detail" id="proofDetail">${detail}</div>
    </div>
  `;
}

/* RECORD */
function renderRecord() {
  const lines = RECORD.map((row, i) => `
    <div class="record-entry${i === 0 ? ' is-active' : ''}" data-record="${i}" data-case="${row.case || ''}">
      <div class="record-entry__year mono">${row.year}</div>
      <div class="record-entry__text">${row.msg}</div>
      <span class="record-entry__tag mono">${row.tag}</span>
    </div>
  `).join('');

  return `
    <p class="view-kicker mono">Operator · Record</p>
    <p class="view-lead">Operational software timeline — click any entry to inspect the case.</p>
    <div class="record-scrub">
      <div class="record-scrub-head">
        <h2>Shipped record</h2>
        <p>9 engagements across 8 domains. Ottawa → Dakar. 2021 → now.</p>
      </div>
      <div class="record-lines">${lines}</div>
    </div>
  `;
}

/* NOTE */
function renderNote() {
  const w = WRITING.bocalbun;
  return `
    <p class="view-kicker mono">Operator · Note</p>
    <p class="view-lead">Writing on systems judgment — not marketing copy.</p>
    <div class="note-card">
      <p class="note-date mono">${w.kicker}</p>
      <h2 class="note-title">${w.title}</h2>
      <div class="note-body">${w.body}</div>
      <div class="note-footer">
        <span class="note-meta mono">${w.wordCount} · BocalBun retrospective</span>
        <button type="button" class="live-open" data-open-case="bocalbun">Full context →</button>
      </div>
    </div>
  `;
}

/* REACH */
function renderReach() {
  return `
    <p class="view-kicker mono">Operator · Reach</p>
    <p class="view-lead">Direct contact — no form funnel, no calendar link.</p>
    <div class="reach-grid">
      <div class="reach-block">
        <h3>Email</h3>
        <a href="mailto:wadealiou00@gmail.com" class="reach-email">wadealiou00@gmail.com</a>
        <p class="reach-note">Best for scope, timeline, and technical fit. I read everything; I reply to what's specific.</p>
      </div>
      <div class="reach-block">
        <h3>WhatsApp</h3>
        <a href="https://wa.me/221777228845" class="reach-link" target="_blank" rel="noopener noreferrer">Message on WhatsApp →</a>
        <p class="reach-note">Dakar timezone. Fast for brief questions. Longer threads better over email.</p>
        <div class="reach-locale">
          <span class="locale-tag mono">FR</span>
          <span class="locale-tag mono">EN</span>
          <span class="locale-tag mono">Remote-first</span>
        </div>
      </div>
    </div>
    <div class="v-line"></div>
    <p class="view-lead" style="margin-bottom:0">
      Not sure if this is the right fit?
      <button type="button" class="live-open" data-view-jump="proof" style="display:inline;font-size:inherit">Review the proof →</button>
    </p>
  `;
}

const VIEWS = { live: renderLive, proof: renderProof, record: renderRecord, note: renderNote, reach: renderReach };

/* ─────────────────────────────────────────────────────────────
   STAGE EVENT BINDING
   ───────────────────────────────────────────────────────────── */
function bindStageEvents() {
  stage.querySelectorAll('[data-open-case]').forEach((el) => {
    el.addEventListener('click', () => openLayer(el.dataset.openCase));
  });

  stage.querySelectorAll('[data-proof]').forEach((el) => {
    el.addEventListener('click', () => {
      if (el.dataset.proof === activeProof) return;
      activeProof = el.dataset.proof;
      const detail = document.getElementById('proofDetail');
      if (!detail) return;

      stage.querySelectorAll('.proof-item').forEach((p) =>
        p.classList.toggle('is-active', p.dataset.proof === activeProof)
      );

      const c = CASES[activeProof];
      const html = `
        <p class="layer-k mono">${c.kicker}</p>
        <h3>${c.title}</h3>
        <div class="tags">${c.meta.map((m) => `<span>${m}</span>`).join('')}</div>
        ${c.body}
        <button type="button" class="live-open" data-open-case="${activeProof}" style="margin-top:4px">Full case file →</button>
      `;

      if (typeof gsap !== 'undefined' && !reduceMotion) {
        gsap.to(detail, {
          opacity: 0, y: 6, duration: 0.15, ease: 'power2.in',
          onComplete: () => {
            detail.innerHTML = html;
            detail.querySelector('[data-open-case]')?.addEventListener('click', () => openLayer(activeProof));
            gsap.fromTo(detail, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' });
          }
        });
      } else {
        detail.innerHTML = html;
        detail.querySelector('[data-open-case]')?.addEventListener('click', () => openLayer(activeProof));
      }
    });
  });

  stage.querySelectorAll('[data-record]').forEach((el) => {
    el.addEventListener('click', () => {
      stage.querySelectorAll('.record-entry').forEach((r, i) =>
        r.classList.toggle('is-active', i === parseInt(el.dataset.record, 10))
      );
      const caseId = el.dataset.case;
      if (caseId && CASES[caseId]) openLayer(caseId);
    });
  });

  stage.querySelectorAll('[data-view-jump]').forEach((el) => {
    el.addEventListener('click', () => switchView(el.dataset.viewJump));
  });
}

/* ─────────────────────────────────────────────────────────────
   VIEW SWITCHING
   ───────────────────────────────────────────────────────────── */
function switchView(viewId) {
  if (!VIEWS[viewId] || viewId === currentView) return;

  tabs.forEach((t) => t.classList.toggle('is-active', t.dataset.view === viewId));
  crumbView.textContent = VIEW_LABELS[viewId] || viewId;

  const render = () => {
    stage.innerHTML = VIEWS[viewId]();
    currentView = viewId;
    bindStageEvents();
    stage.scrollTop = 0;
  };

  if (typeof gsap !== 'undefined' && !reduceMotion) {
    gsap.to(stage, {
      opacity: 0, y: -8, duration: 0.18, ease: 'power2.in',
      onComplete: () => {
        render();
        gsap.fromTo(stage, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' });
      }
    });
  } else {
    render();
  }
}

tabs.forEach((tab) => tab.addEventListener('click', () => switchView(tab.dataset.view)));

/* ─────────────────────────────────────────────────────────────
   DETAIL LAYER
   ───────────────────────────────────────────────────────────── */
function openLayer(id) {
  const c = CASES[id];
  if (!c) return;
  lastFocus = document.activeElement;

  layer.innerHTML = `
    <button type="button" class="layer-x" id="layerClose" aria-label="Close case file">✕</button>
    <div class="layer-inner">
      <p class="layer-k mono">${c.kicker}</p>
      <h2>${c.title}</h2>
      <div class="tags">${c.meta.map((m) => `<span>${m}</span>`).join('')}</div>
      ${c.body}
    </div>
  `;

  document.getElementById('layerClose').addEventListener('click', closeLayer);
  layer.classList.add('open');
  layerScrim.classList.add('open');
  layer.setAttribute('aria-hidden', 'false');
  layerScrim.setAttribute('aria-hidden', 'false');
  document.body.classList.add('is-locked');

  if (typeof gsap !== 'undefined' && !reduceMotion) {
    gsap.fromTo(layer, { x: '100%' }, { x: '0%', duration: 0.42, ease: 'power4.out' });
    gsap.from('.layer-inner > *', {
      y: 10, opacity: 0, duration: 0.35, stagger: 0.04, delay: 0.12, ease: 'power3.out'
    });
  }
}

function closeLayer() {
  const done = () => {
    layer.classList.remove('open');
    layerScrim.classList.remove('open');
    layer.setAttribute('aria-hidden', 'true');
    layerScrim.setAttribute('aria-hidden', 'true');
    if (!aboutDialog.classList.contains('open')) document.body.classList.remove('is-locked');
    if (lastFocus) lastFocus.focus();
  };

  if (typeof gsap !== 'undefined' && !reduceMotion && layer.classList.contains('open')) {
    gsap.to(layer, { x: '100%', duration: 0.3, ease: 'power3.in', onComplete: done });
  } else {
    done();
  }
}

layerScrim.addEventListener('click', closeLayer);

/* ─────────────────────────────────────────────────────────────
   ABOUT DIALOG
   ───────────────────────────────────────────────────────────── */
function openAbout() {
  aboutDialog.classList.add('open');
  aboutScrim.classList.add('open');
  document.body.classList.add('is-locked');

  if (typeof gsap !== 'undefined' && !reduceMotion) {
    gsap.fromTo(aboutDialog,
      { scale: 0.96, opacity: 0, y: 10 },
      { scale: 1, opacity: 1, y: 0, duration: 0.32, ease: 'power3.out' }
    );
  }
}

function closeAbout() {
  aboutDialog.classList.remove('open');
  aboutScrim.classList.remove('open');
  if (!layer.classList.contains('open')) document.body.classList.remove('is-locked');
}

document.getElementById('aboutBtn')?.addEventListener('click', openAbout);
document.querySelectorAll('[data-close-about]').forEach((el) => el.addEventListener('click', closeAbout));

/* ─────────────────────────────────────────────────────────────
   KEYBOARD
   ───────────────────────────────────────────────────────────── */
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (layer.classList.contains('open')) closeLayer();
  else if (aboutDialog.classList.contains('open')) closeAbout();
});

/* ─────────────────────────────────────────────────────────────
   KEYBOARD SHORTCUT HINTS (power user)
   ───────────────────────────────────────────────────────────── */
const KEY_MAP = { '1': 'live', '2': 'proof', '3': 'record', '4': 'note', '5': 'reach' };
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (layer.classList.contains('open') || aboutDialog.classList.contains('open')) return;
  const view = KEY_MAP[e.key];
  if (view) switchView(view);
});

/* ─────────────────────────────────────────────────────────────
   INIT
   ───────────────────────────────────────────────────────────── */
buildTicker();
stage.innerHTML = VIEWS.live();
bindStageEvents();

if (typeof gsap !== 'undefined' && !reduceMotion) {
  gsap.from('.rail-id', { x: -16, opacity: 0, duration: 0.55, ease: 'power3.out' });
  gsap.from('.rail-tab', { x: -12, opacity: 0, duration: 0.45, stagger: 0.05, delay: 0.12, ease: 'power3.out' });
  gsap.from('.rail-telemetry', { x: -10, opacity: 0, duration: 0.4, delay: 0.35, ease: 'power3.out' });
  gsap.from('.rail-actions', { x: -10, opacity: 0, duration: 0.4, delay: 0.45, ease: 'power3.out' });
  gsap.from('.stage-chrome', { y: -8, opacity: 0, duration: 0.4, delay: 0.2, ease: 'power3.out' });
  gsap.from('#stage > *', { y: 16, opacity: 0, duration: 0.5, stagger: 0.06, delay: 0.3, ease: 'power3.out' });
  gsap.from('.ticker', { y: 8, opacity: 0, duration: 0.35, delay: 0.5, ease: 'power3.out' });
}
