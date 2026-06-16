/* Mission Atlas — room ↔ atlas ↔ drawer */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const DOMAINS = {
  fintech: {
    code: 'FIN', title: 'Fintech', x: 22, y: 22, spine: true,
    systems: [
      { id: 'everest', name: 'Everest Finance', note: 'CRM, public site, Sama Naffa spine — solo owner' },
      { id: 'bankingbook', name: 'BankingBook Analytics', note: 'Open-banking APIs, UEMOA markets' }
    ]
  },
  erp: {
    code: 'ERP', title: 'ERP / BI', x: 50, y: 14,
    systems: [
      { id: 'odoo', name: 'Odoo 18 Testing Kit', note: '39 tests · 9 suites · Robot + Playwright' },
      { id: 'greentec', name: 'Africa GreenTec', note: 'Accounting module · high-volume journals' },
      { id: 'ergobit', name: 'ERGOBIT', note: 'Odoo 18 localization and QA' }
    ]
  },
  logistics: {
    code: 'LOG', title: 'Logistics', x: 78, y: 24,
    systems: [
      { id: 'purolator', name: 'Purolator Digital Lab', note: 'Software engineering · Ottawa, Canada' },
      { id: 'transit', name: 'Ndouckmane Transit', note: 'Freight ops dashboard discovery' }
    ]
  },
  education: {
    code: 'EDU', title: 'Education', x: 14, y: 58,
    systems: [
      { id: 'eduplan', name: 'EduPlan', note: 'School operations pilot' },
      { id: 'hirondelles', name: 'Les Hirondelles', note: 'Institutional CMS' }
    ]
  },
  mobile: {
    code: 'MOB', title: 'Mobile / IoT', x: 42, y: 50,
    systems: [
      { id: 'orange', name: 'Orange Digital Lab', note: 'React Native · 1,000+ members' },
      { id: 'itech', name: 'ITech Solutions', note: 'Arduino geolocation prototype' }
    ]
  },
  drone: {
    code: 'UAV', title: 'Drone / AI', x: 72, y: 52,
    systems: [
      { id: 'asaaman', name: 'Asaaman', note: 'Semantic video search · surveillance workflows' }
    ]
  },
  health: {
    code: 'HLT', title: 'Health', x: 28, y: 82,
    systems: [
      { id: 'prescriptos', name: 'Prescriptos', note: 'Pharmacy workflow monorepo' }
    ]
  },
  retail: {
    code: 'RTL', title: 'Retail', x: 62, y: 78,
    systems: [
      { id: 'dakarsport', name: 'Dakar Sport Shop', note: 'Commerce surface shipped' },
      { id: 'gerpain', name: 'Gerpain', note: 'Multi-bakery ops · inventory · RBAC' }
    ]
  }
};

const EDGES = [
  ['fintech', 'erp'], ['erp', 'logistics'], ['fintech', 'mobile'],
  ['erp', 'mobile'], ['mobile', 'drone'], ['fintech', 'education'],
  ['education', 'health'], ['mobile', 'retail'], ['logistics', 'retail']
];

const CASES = {
  everest: {
    kicker: 'Anchor · Fintech',
    title: 'Everest Finance',
    meta: ['Solo owner', 'Next.js', 'Postgres', '2025 → now'],
    body: `<p>West African finance company consolidating public site, internal CRM, and customer app foundations into one operational spine.</p>
    <p>Customer data and account opening lived in spreadsheets. I mapped the real workflow first, then unified the highest-friction processes before presentation layer work.</p>
    <ul><li>Internal CRM and ops dashboard</li><li>Public site on shared data layer</li><li>Sama Naffa customer app foundations</li></ul>`
  },
  odoo: {
    kicker: 'Anchor · ERP / QA',
    title: 'Odoo 18 Acceptance Testing Kit',
    meta: ['Robot', 'Playwright', 'Python', 'Open source path'],
    body: `<p>Repeatable acceptance validation for Odoo 18 migrations — localization behavior fails quietly without suite-level discipline.</p>
    <ul><li>39 tests across 9 suites</li><li>Profile-based environments</li><li>CI-friendly report output</li></ul>`
  },
  bocalbun: {
    kicker: 'Anchor · Judgment',
    title: 'BocalBun retrospective',
    meta: ['Frozen', 'Bun', 'Architecture'],
    body: `<p>Full-stack Bun framework stopped deliberately. Premature abstraction is a tax operational businesses cannot pay.</p>
    <p>The retrospective documents judgment about what not to build — applied directly to Everest scoping.</p>`
  },
  greentec: {
    kicker: 'ERP · Shipped',
    title: 'Africa GreenTec accounting',
    meta: ['Odoo', 'High volume'],
    body: `<p>Accounting module processing high daily journal volume. Part of the ERP proof alongside ERGOBIT work.</p>`
  },
  purolator: {
    kicker: 'Logistics · Canada',
    title: 'Purolator Digital Lab',
    meta: ['Ottawa', 'COOP + contract'],
    body: `<p>Software engineering at Purolator's digital lab — Canada chapter of the career arc before Dakar consolidation.</p>`
  },
  asaaman: {
    kicker: 'Drone / AI',
    title: 'Asaaman',
    meta: ['Senegal', 'Video AI'],
    body: `<p>Semantic video search and surveillance workflow tooling for an intelligent-drone startup.</p>`
  }
};

const LOG = [
  { year: '2026', msg: '<strong>Everest Finance</strong> — CRM live, Sama Naffa hardening', domain: 'fintech', case: 'everest' },
  { year: '2024', msg: '<strong>Odoo kit</strong> — 39 tests / 9 suites shipped', domain: 'erp', case: 'odoo' },
  { year: '2024', msg: '<strong>Africa GreenTec</strong> — accounting module operational', domain: 'erp', case: 'greentec' },
  { year: '2023', msg: '<strong>BankingBook</strong> — open-banking APIs, UEMOA', domain: 'fintech', case: null },
  { year: '2023', msg: '<strong>Purolator</strong> — logistics software, Ottawa', domain: 'logistics', case: 'purolator' },
  { year: '2022', msg: '<strong>Orange</strong> — React Native, 1,000+ members', domain: 'mobile', case: null },
  { year: '2022', msg: '<strong>BocalBun</strong> — frozen. Lessons → Everest', domain: 'erp', case: 'bocalbun' }
];

/* ── DOM refs ── */
const bar = document.getElementById('maBar');
const btnAtlas = document.getElementById('btnOpenAtlas');
const btnRoom = document.getElementById('btnBackRoom');
const viewRoom = document.getElementById('viewRoom');
const viewAtlas = document.getElementById('viewAtlas');
const nodesEl = document.getElementById('mapNodes');
const svgEl = document.getElementById('mapSvg');
const logRoom = document.getElementById('logRoom');
const logRail = document.getElementById('logRail');
const drawer = document.getElementById('drawer');
const drawerScrim = document.getElementById('drawerScrim');

/* ── Build log ── */
function renderLog(container) {
  container.innerHTML = LOG.map((row) => `
    <div class="ma-log-line" data-domain="${row.domain}" ${row.case ? `data-case="${row.case}"` : ''}>
      <span class="ma-log-year">${row.year}</span>
      <span class="ma-log-msg">${row.msg}</span>
    </div>
  `).join('');
  container.querySelectorAll('.ma-log-line').forEach((line) => {
    line.addEventListener('click', () => {
      if (line.dataset.case && CASES[line.dataset.case]) openCase(line.dataset.case);
      else if (line.dataset.domain) openDomain(line.dataset.domain);
    });
  });
}
renderLog(logRoom);
renderLog(logRail);

/* ── Build map nodes ── */
Object.entries(DOMAINS).forEach(([key, d]) => {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'ma-node' + (d.spine ? ' ma-node--spine' : '');
  el.style.left = d.x + '%';
  el.style.top = d.y + '%';
  el.dataset.domain = key;
  el.innerHTML = `
    <div class="ma-node-code">${d.code}</div>
    <div class="ma-node-title">${d.title}</div>
    <div class="ma-node-count">${d.systems.length} system${d.systems.length > 1 ? 's' : ''}</div>
  `;
  el.addEventListener('click', () => openDomain(key));
  nodesEl.appendChild(el);
});

/* ── SVG edges (after layout) ── */
function drawEdges() {
  svgEl.innerHTML = '';
  const wrap = document.querySelector('.ma-map-wrap');
  const wr = wrap.getBoundingClientRect();
  EDGES.forEach(([a, b]) => {
    const na = nodesEl.querySelector(`[data-domain="${a}"]`);
    const nb = nodesEl.querySelector(`[data-domain="${b}"]`);
    if (!na || !nb) return;
    const ra = na.getBoundingClientRect(), rb = nb.getBoundingClientRect();
    const x1 = ra.left + ra.width / 2 - wr.left;
    const y1 = ra.top + ra.height / 2 - wr.top;
    const x2 = rb.left + rb.width / 2 - wr.left;
    const y2 = rb.top + rb.height / 2 - wr.top;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - 20;
    path.setAttribute('d', `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`);
    path.setAttribute('class', 'ma-map-edge');
    svgEl.appendChild(path);
    if (typeof gsap !== 'undefined' && !reduceMotion) {
      const len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      gsap.to(path, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut', delay: 0.15 });
    }
  });
}

/* ── Mode switch ── */
function openAtlas() {
  viewAtlas.classList.add('is-active');
  bar.classList.add('is-atlas');
  btnAtlas.hidden = true;
  btnRoom.hidden = false;
  requestAnimationFrame(() => {
    drawEdges();
    if (typeof gsap !== 'undefined' && !reduceMotion) {
      gsap.from('.ma-node', { scale: 0.85, opacity: 0, duration: 0.5, stagger: 0.05, ease: 'power3.out' });
    }
  });
}

function closeAtlas() {
  viewAtlas.classList.remove('is-active');
  bar.classList.remove('is-atlas');
  btnAtlas.hidden = false;
  btnRoom.hidden = true;
  closeDrawer();
}

document.getElementById('openAtlasCta').addEventListener('click', openAtlas);
btnAtlas?.addEventListener('click', openAtlas);
btnRoom?.addEventListener('click', closeAtlas);

/* ── Drawer ── */
let lastFocus = null;

function openDomain(key) {
  const d = DOMAINS[key];
  if (!d) return;
  nodesEl.querySelectorAll('.ma-node').forEach((n) => n.classList.toggle('is-active', n.dataset.domain === key));
  const systemsHtml = d.systems.map((s) => `
    <button type="button" class="ma-sys-row" data-case="${s.id}">
      <strong>${s.name}</strong>
      <span>${s.note}</span>
    </button>
  `).join('');
  drawer.innerHTML = `
    <button class="ma-drawer-x" type="button" id="drawerClose" aria-label="Close">✕</button>
    <div class="ma-drawer-body">
      <p class="ma-drawer-kicker">Territory · ${d.code}</p>
      <h2 class="ma-drawer-title">${d.title}</h2>
      <p>Operational systems shipped or led in this domain. Select a system for depth.</p>
      <div class="ma-drawer-systems">
        <h4>Systems in territory</h4>
        ${systemsHtml}
      </div>
    </div>
  `;
  bindDrawer();
  showDrawer();
  drawer.querySelectorAll('[data-case]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.case;
      if (CASES[id]) openCase(id);
    });
  });
}

function openCase(id) {
  const c = CASES[id];
  if (!c) return;
  drawer.innerHTML = `
    <button class="ma-drawer-x" type="button" id="drawerClose" aria-label="Close">✕</button>
    <div class="ma-drawer-body">
      <p class="ma-drawer-kicker">${c.kicker}</p>
      <h2 class="ma-drawer-title">${c.title}</h2>
      <div class="ma-drawer-meta">${c.meta.map((m) => `<span>${m}</span>`).join('')}</div>
      ${c.body}
    </div>
  `;
  bindDrawer();
  showDrawer();
}

function bindDrawer() {
  document.getElementById('drawerClose')?.addEventListener('click', closeDrawer);
}

function showDrawer() {
  lastFocus = document.activeElement;
  drawer.classList.add('open');
  drawerScrim.classList.add('open');
  document.body.classList.add('drawer-lock');
  if (typeof gsap !== 'undefined' && !reduceMotion) {
    gsap.fromTo(drawer, { x: '100%' }, { x: '0%', duration: 0.45, ease: 'power4.out' });
  } else drawer.style.transform = 'translateX(0)';
}

function closeDrawer() {
  drawer.classList.remove('open');
  drawerScrim.classList.remove('open');
  document.body.classList.remove('drawer-lock');
  nodesEl.querySelectorAll('.ma-node').forEach((n) => n.classList.remove('is-active'));
  if (typeof gsap !== 'undefined' && !reduceMotion) {
    gsap.to(drawer, { x: '100%', duration: 0.35, ease: 'power3.in', onComplete: () => { drawer.style.transform = ''; } });
  } else drawer.style.transform = '';
  if (lastFocus) lastFocus.focus();
}

drawerScrim.addEventListener('click', closeDrawer);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (drawer.classList.contains('open')) closeDrawer();
    else if (viewAtlas.classList.contains('is-active')) closeAtlas();
  }
});

document.querySelector('.ma-panel[data-case="everest"]')?.addEventListener('click', () => openCase('everest'));

window.addEventListener('resize', () => {
  if (viewAtlas.classList.contains('is-active')) drawEdges();
});

/* Pivot nav */
window.toggleNav = function () { document.getElementById('navMenu').classList.toggle('open'); };
document.addEventListener('click', (e) => {
  if (!e.target.closest('.pivot-nav')) document.getElementById('navMenu')?.classList.remove('open');
});
