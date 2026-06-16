/* Operator Shell — single surface, view-based IA */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CASES = {
  everest: {
    kicker: 'Fintech · 2025 → now',
    title: 'Everest Finance',
    meta: ['Solo technical owner', 'Next.js', 'TypeScript', 'Postgres'],
    body: `<p>West African finance company consolidating a public website, internal CRM, and customer-facing app into one operational spine.</p>
    <p>Customer data and account opening lived in spreadsheets. I mapped the real workflow first, then unified the highest-friction processes before touching presentation.</p>
    <ul><li>Internal CRM and operations dashboard</li><li>Public site on shared data layer</li><li>Sama Naffa customer app foundations</li></ul>
    <p class="proof-quote">The team now operates from one system instead of reconciling several.</p>`
  },
  odoo: {
    kicker: 'ERP / QA · Open source',
    title: 'Odoo 18 Acceptance Testing Kit',
    meta: ['Robot', 'Playwright', 'Python', '39 tests'],
    body: `<p>Repeatable acceptance validation for Odoo 18 migrations. Localization behavior fails quietly without suite-level discipline.</p>
    <ul><li>Robot Framework + Playwright Browser structure</li><li>Odoo 18 selector guidelines</li><li>39 tests across 9 suites</li></ul>
    <p class="proof-quote">Specificity is the product. Generic test frameworks are abundant.</p>`
  },
  bocalbun: {
    kicker: 'Systems judgment',
    title: 'BocalBun retrospective',
    meta: ['Frozen', 'Bun', 'Architecture'],
    body: `<p>Full-stack Bun framework stopped deliberately. It solved my desire to build a framework, not a customer's operational problem.</p>
    <ul><li>Premature abstraction is a tax ops teams cannot pay</li><li>Stopping is a deliverable when direction is wrong</li><li>Lessons applied directly to Everest scoping</li></ul>
    <p class="proof-quote">The retrospective is the asset now, not the repo.</p>`
  },
  greentec: {
    kicker: 'ERP · Shipped',
    title: 'Africa GreenTec',
    meta: ['Odoo', 'Accounting'],
    body: `<p>Accounting module for high-volume journal processing. Part of ERP work alongside ERGOBIT and Odoo 18 localization.</p>`
  },
  purolator: {
    kicker: 'Logistics · Canada',
    title: 'Purolator Digital Lab',
    meta: ['Ottawa', 'COOP + contract'],
    body: `<p>Software engineering at Purolator's digital lab. The Canada chapter before consolidating systems in West Africa.</p>`
  },
  orange: {
    kicker: 'Mobile',
    title: 'Orange Digital Lab',
    meta: ['React Native', '1,000+ members'],
    body: `<p>React Native application for a large member community at Orange Digital Lab Senegal.</p>`
  },
  bankingbook: {
    kicker: 'Fintech · APIs',
    title: 'BankingBook Analytics',
    meta: ['Open banking', 'UEMOA'],
    body: `<p>Open-banking API work for UEMOA markets. ERP and BI adjacent fintech systems.</p>`
  },
  asaaman: {
    kicker: 'Drone / AI',
    title: 'Asaaman',
    meta: ['Video AI', 'Senegal'],
    body: `<p>Semantic video search and surveillance workflows for an intelligent-drone startup.</p>`
  }
};

const ANCHORS = ['everest', 'odoo', 'bocalbun'];

const WRITING = {
  bocalbun: {
    kicker: 'Essay · 2026.03',
    title: 'Why I stopped building BocalBun as a framework',
    body: `<p>Frameworks feel productive because they generate code. They rarely generate revenue for an operational business waiting on a narrow tool.</p>
    <p>Stopping is a deliverable when the direction is wrong. The retrospective documents that judgment — and the same discipline now shapes how I scope Everest and client work.</p>`
  }
};

const RECORD = [
  { year: '2026', msg: '<strong>Everest Finance</strong> — CRM live, Sama Naffa in hardening', tag: 'Fintech · Dakar', case: 'everest' },
  { year: '2024', msg: '<strong>Odoo 18 kit</strong> — 39 acceptance tests across 9 suites', tag: 'ERP / QA', case: 'odoo' },
  { year: '2024', msg: '<strong>Africa GreenTec</strong> — accounting module in production', tag: 'ERP', case: 'greentec' },
  { year: '2023', msg: '<strong>BankingBook Analytics</strong> — open-banking APIs', tag: 'Fintech', case: 'bankingbook' },
  { year: '2023', msg: '<strong>Purolator</strong> — logistics software, Ottawa', tag: 'Canada', case: 'purolator' },
  { year: '2022', msg: '<strong>Orange</strong> — React Native, 1,000+ members', tag: 'Mobile', case: 'orange' },
  { year: '2022', msg: '<strong>BocalBun</strong> — stopped. Lessons carried forward', tag: 'Judgment', case: 'bocalbun' },
  { year: '2021', msg: '<strong>Asaaman</strong> — drone AI surveillance tooling', tag: 'AI', case: 'asaaman' }
];

const VIEW_LABELS = {
  live: 'now',
  proof: 'proof',
  record: 'record',
  note: 'note',
  reach: 'reach'
};

/* ── DOM ── */
const stage = document.getElementById('stage');
const crumbView = document.getElementById('crumbView');
const stageClock = document.getElementById('stageClock');
const ticker = document.getElementById('ticker');
const layer = document.getElementById('layer');
const layerScrim = document.getElementById('layerScrim');
const aboutDialog = document.getElementById('aboutDialog');
const aboutScrim = document.getElementById('aboutScrim');
const tabs = document.querySelectorAll('.rail-tab');

let currentView = 'live';
let activeProof = ANCHORS[0];
let activeRecordIdx = 0;
let lastFocus = null;

/* ── Ticker ── */
function buildTicker() {
  const items = RECORD.map((r) => {
    const plain = r.msg.replace(/<[^>]+>/g, '');
    return `<span>${r.year}</span> ${plain}`;
  });
  const doubled = [...items, ...items].join(' · ');
  ticker.innerHTML = doubled;
}

/* ── Clock ── */
function updateClock() {
  const now = new Date();
  const dakar = now.toLocaleTimeString('en-GB', { timeZone: 'Africa/Dakar', hour: '2-digit', minute: '2-digit' });
  stageClock.textContent = `Dakar ${dakar}`;
}
updateClock();
setInterval(updateClock, 30000);

/* ── View templates ── */
function renderLive() {
  return `
    <p class="view-lead">Current operator focus — what I'm building and why it matters for the team running it.</p>
    <div class="live-grid">
      <div class="live-primary">
        <div class="live-badge"><span class="pulse"></span> Active</div>
        <h2>Everest Finance — operational spine</h2>
        <p>Consolidating public site, internal CRM, and Sama Naffa customer app into one TypeScript / PostgreSQL system. Solo technical owner.</p>
        <button type="button" class="live-open" data-open-case="everest">Open case file →</button>
      </div>
      <div class="live-metrics">
        <div class="metric">
          <div class="metric-k">Domains</div>
          <div class="metric-v">8+</div>
          <div class="metric-u">Fintech, ERP, logistics, education, mobile, health, retail, drone</div>
        </div>
        <div class="metric">
          <div class="metric-k">Arc</div>
          <div class="metric-v">6 yr</div>
          <div class="metric-u">Ottawa logistics → Dakar consolidation</div>
        </div>
        <div class="metric">
          <div class="metric-k">Availability</div>
          <div class="metric-v">Q3</div>
          <div class="metric-u">Selective engagements · remote</div>
        </div>
      </div>
    </div>
  `;
}

function renderProof() {
  const list = ANCHORS.map((id, i) => {
    const c = CASES[id];
    return `
      <button type="button" class="proof-item${id === activeProof ? ' is-active' : ''}" data-proof="${id}">
        <div class="proof-item__idx mono">0${i + 1}</div>
        <div class="proof-item__title">${c.title}</div>
      </button>
    `;
  }).join('');

  const c = CASES[activeProof];
  const detail = `
    <h3>${c.title}</h3>
    <div class="tags">${c.meta.map((m) => `<span>${m}</span>`).join('')}</div>
    ${c.body}
    <button type="button" class="live-open" data-open-case="${activeProof}">Full case file →</button>
  `;

  return `
    <p class="view-lead">Three anchor cases — judgment, not a project grid. Select to inspect.</p>
    <div class="proof-layout">
      <div class="proof-list">${list}</div>
      <div class="proof-detail" id="proofDetail">${detail}</div>
    </div>
  `;
}

function renderRecord() {
  const lines = RECORD.map((row, i) => `
    <div class="record-entry${i === activeRecordIdx ? ' is-active' : ''}" data-record="${i}" data-case="${row.case || ''}">
      <div class="record-entry__year mono">${row.year}</div>
      <div class="record-entry__text">${row.msg}</div>
      <span class="record-entry__tag">${row.tag}</span>
    </div>
  `).join('');

  return `
    <div class="record-scrub">
      <div class="record-scrub-head">
        <h2 class="view-title">Shipped record</h2>
        <p class="view-lead">Timeline of operational software — click any entry for detail.</p>
      </div>
      <div class="record-lines">${lines}</div>
    </div>
  `;
}

function renderNote() {
  const w = WRITING.bocalbun;
  return `
    <p class="view-lead">Writing on systems judgment — not marketing copy.</p>
    <article class="note-card">
      <p class="note-date mono">${w.kicker}</p>
      <h2 class="note-title">${w.title}</h2>
      <div class="note-body">${w.body}</div>
      <button type="button" class="live-open" data-open-case="bocalbun" style="margin-top:20px">Read full retrospective context →</button>
    </article>
  `;
}

function renderReach() {
  return `
    <p class="view-lead">Direct contact — no form funnel.</p>
    <div class="reach-grid">
      <div class="reach-block">
        <h3>Email</h3>
        <a href="mailto:wadealiou00@gmail.com" class="reach-email">wadealiou00@gmail.com</a>
        <p style="color:var(--ink-soft);font-size:0.88rem">Best for scope, timeline, and technical fit.</p>
      </div>
      <div class="reach-block">
        <h3>WhatsApp</h3>
        <div class="reach-links">
          <a href="https://wa.me/221777228845" class="reach-link" target="_blank" rel="noopener noreferrer">Message on WhatsApp</a>
          <button type="button" class="reach-link" data-view-jump="proof">View proof</button>
        </div>
        <p style="color:var(--ink-soft);font-size:0.88rem;margin-top:12px">Dakar · remote · FR / EN</p>
      </div>
    </div>
  `;
}

const VIEWS = {
  live: renderLive,
  proof: renderProof,
  record: renderRecord,
  note: renderNote,
  reach: renderReach
};

/* ── View switching ── */
function bindStageEvents() {
  stage.querySelectorAll('[data-open-case]').forEach((el) => {
    el.addEventListener('click', () => openLayer(el.dataset.openCase));
  });

  stage.querySelectorAll('[data-proof]').forEach((el) => {
    el.addEventListener('click', () => {
      activeProof = el.dataset.proof;
      const detail = document.getElementById('proofDetail');
      if (!detail) return;
      const c = CASES[activeProof];
      stage.querySelectorAll('.proof-item').forEach((p) => p.classList.toggle('is-active', p.dataset.proof === activeProof));
      const html = `
        <h3>${c.title}</h3>
        <div class="tags">${c.meta.map((m) => `<span>${m}</span>`).join('')}</div>
        ${c.body}
        <button type="button" class="live-open" data-open-case="${activeProof}">Full case file →</button>
      `;
      if (typeof gsap !== 'undefined' && !reduceMotion) {
        gsap.to(detail, { opacity: 0, y: 8, duration: 0.15, onComplete: () => {
          detail.innerHTML = html;
          detail.querySelector('[data-open-case]')?.addEventListener('click', () => openLayer(activeProof));
          gsap.fromTo(detail, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' });
        }});
      } else {
        detail.innerHTML = html;
        detail.querySelector('[data-open-case]')?.addEventListener('click', () => openLayer(activeProof));
      }
    });
  });

  stage.querySelectorAll('[data-record]').forEach((el) => {
    el.addEventListener('click', () => {
      activeRecordIdx = parseInt(el.dataset.record, 10);
      stage.querySelectorAll('.record-entry').forEach((r, i) => r.classList.toggle('is-active', i === activeRecordIdx));
      const caseId = el.dataset.case;
      if (caseId) openLayer(caseId);
    });
  });

  stage.querySelectorAll('[data-view-jump]').forEach((el) => {
    el.addEventListener('click', () => switchView(el.dataset.viewJump));
  });
}

function switchView(viewId) {
  if (!VIEWS[viewId] || viewId === currentView) return;

  tabs.forEach((t) => t.classList.toggle('is-active', t.dataset.view === viewId));
  crumbView.textContent = VIEW_LABELS[viewId] || viewId;

  const render = () => {
    stage.innerHTML = VIEWS[viewId]();
    currentView = viewId;
    bindStageEvents();
  };

  if (typeof gsap !== 'undefined' && !reduceMotion) {
    gsap.to(stage, {
      opacity: 0, y: -12, duration: 0.2, ease: 'power2.in',
      onComplete: () => {
        render();
        gsap.fromTo(stage, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' });
      }
    });
  } else {
    render();
  }
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => switchView(tab.dataset.view));
});

/* ── Detail layer ── */
function openLayer(id) {
  const c = CASES[id];
  if (!c) return;
  lastFocus = document.activeElement;

  layer.innerHTML = `
    <button type="button" class="layer-x" id="layerClose" aria-label="Close">✕</button>
    <div class="layer-inner">
      <p class="layer-k">${c.kicker}</p>
      <h2>${c.title}</h2>
      <div class="tags" style="margin-bottom:16px">${c.meta.map((m) => `<span>${m}</span>`).join('')}</div>
      ${c.body}
    </div>
  `;

  document.getElementById('layerClose').addEventListener('click', closeLayer);
  layer.classList.add('open');
  layerScrim.classList.add('open');
  layer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('is-locked');

  if (typeof gsap !== 'undefined' && !reduceMotion) {
    gsap.fromTo(layer, { x: '100%' }, { x: '0%', duration: 0.45, ease: 'power4.out' });
    gsap.from('.layer-inner > *', { y: 12, opacity: 0, duration: 0.4, stagger: 0.04, delay: 0.1 });
  }
}

function closeLayer() {
  const done = () => {
    layer.classList.remove('open');
    layerScrim.classList.remove('open');
    layer.setAttribute('aria-hidden', 'true');
    if (!aboutDialog.classList.contains('open')) document.body.classList.remove('is-locked');
    if (lastFocus) lastFocus.focus();
  };

  if (typeof gsap !== 'undefined' && !reduceMotion && layer.classList.contains('open')) {
    gsap.to(layer, { x: '100%', duration: 0.32, ease: 'power3.in', onComplete: done });
  } else {
    done();
  }
}

layerScrim.addEventListener('click', closeLayer);

/* ── About ── */
function openAbout() {
  aboutDialog.classList.add('open');
  aboutScrim.classList.add('open');
  document.body.classList.add('is-locked');
  if (typeof gsap !== 'undefined' && !reduceMotion) {
    gsap.fromTo(aboutDialog, { scale: 0.96, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'power3.out' });
  }
}

function closeAbout() {
  aboutDialog.classList.remove('open');
  aboutScrim.classList.remove('open');
  if (!layer.classList.contains('open')) document.body.classList.remove('is-locked');
}

document.getElementById('aboutBtn')?.addEventListener('click', openAbout);
document.querySelectorAll('[data-close-about]').forEach((el) => el.addEventListener('click', closeAbout));

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (layer.classList.contains('open')) closeLayer();
  else if (aboutDialog.classList.contains('open')) closeAbout();
});

/* ── Init ── */
buildTicker();
stage.innerHTML = VIEWS.live();
bindStageEvents();

if (typeof gsap !== 'undefined' && !reduceMotion) {
  gsap.from('.rail-top', { x: -20, opacity: 0, duration: 0.6, ease: 'power3.out' });
  gsap.from('.rail-tab', { x: -16, opacity: 0, duration: 0.5, stagger: 0.06, delay: 0.15, ease: 'power3.out' });
  gsap.from('.stage-chrome', { y: -10, opacity: 0, duration: 0.5, delay: 0.2 });
  gsap.from('#stage > *', { y: 20, opacity: 0, duration: 0.6, stagger: 0.08, delay: 0.35, ease: 'power3.out' });
}
