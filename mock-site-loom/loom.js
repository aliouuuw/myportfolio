const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (typeof gsap !== 'undefined' && typeof CustomEase !== 'undefined') {
  gsap.registerPlugin(CustomEase);
  CustomEase.create('spring', 'M0,0 C0.32,0.72 0,1 1,1');
}
const SPRING = typeof CustomEase !== 'undefined' ? 'spring' : 'power2.out';
const DUR_PANEL = 0.4;
const DUR_EXIT = 0.25;
const DUR_MICRO = 0.25;
const FEATURED_RECORDS = 3;

const PROOFS = {
  everest: {
    claim: 'fintech',
    claimLabel: 'Ships fintech workflows',
    kicker: 'Fintech spine, 2025 to now',
    title: 'Everest Finance',
    summary: 'A West African finance company needed customer data, account opening, public content, and operations work to stop living in separate places. I consolidated the public site, CRM, and Sama Naffa foundations into one operational spine.',
    meta: ['Solo technical owner', 'CRM + public site', 'Sama Naffa foundations', 'TypeScript', 'PostgreSQL'],
    outcome: 'One system of work instead of spreadsheet reconciliation across teams.'
  },
  odoo: {
    claim: 'erp',
    claimLabel: 'Hardens ERP behavior',
    kicker: 'ERP acceptance, open source',
    title: 'Odoo 18 Acceptance Testing Kit',
    summary: 'Localization and ERP regressions often fail quietly. I built a repeatable acceptance suite shaped around Odoo 18 realities: selectors, journals, fiscal behavior, inventory, HR, and CRM workflows.',
    meta: ['Robot Framework', 'Playwright Browser', '39 tests', '9 suites', 'Selector guidelines'],
    outcome: 'Specific, repeatable migration checks where generic QA frameworks would be too vague.'
  },
  bocalbun: {
    claim: 'judgment',
    claimLabel: 'Stops wrong abstractions',
    kicker: 'Systems judgment, retrospective',
    title: 'BocalBun',
    summary: 'A full-stack Bun framework I stopped deliberately. It solved my desire to build a framework, not a customer operational problem. That became the useful lesson.',
    meta: ['Frozen deliberately', 'Architecture', 'Bun', 'Retrospective', 'Scoping discipline'],
    outcome: 'The asset is the judgment to stop, document, and redirect energy toward real operational software.'
  },
  record: {
    claim: 'systems',
    claimLabel: 'Builds operational systems',
    kicker: 'Execution ledger, 2021 to now',
    title: 'Shipped record',
    summary: 'The portfolio is not a gallery. It is a compressed record of operational domains: fintech, ERP, logistics, education, mobile, drone AI, and customer workflows.',
    meta: ['Everest Finance', 'Africa GreenTec', 'Purolator', 'BankingBook', 'Orange', 'Asaaman'],
    outcome: 'A multi-domain operating pattern: map the workflow, identify the narrow tool, ship, harden.'
  }
};

const CLAIM_TO_PROOF = {
  systems: 'record',
  fintech: 'everest',
  erp: 'odoo',
  judgment: 'bocalbun'
};

const PROOF_ORDER = ['everest', 'odoo', 'bocalbun', 'record'];

const RECORD = [
  { year: '2026', text: 'Everest Finance: CRM live, Sama Naffa in hardening', tag: 'Fintech' },
  { year: '2024', text: 'Odoo 18 kit: 39 acceptance tests across 9 suites', tag: 'ERP / QA' },
  { year: '2024', text: 'Africa GreenTec: accounting module in production', tag: 'ERP' },
  { year: '2023', text: 'Purolator: logistics software engineering, Ottawa', tag: 'Canada' },
  { year: '2023', text: 'BankingBook Analytics: open-banking APIs', tag: 'Fintech' },
  { year: '2022', text: 'Orange: React Native app, 1,000+ members', tag: 'Mobile' },
  { year: '2022', text: 'BocalBun: stopped; retrospective kept as judgment asset', tag: 'Systems' },
  { year: '2021', text: 'Asaaman: drone AI surveillance tooling', tag: 'AI' }
];

const proofCard = document.getElementById('proofPanel');
const proofTabs = [...document.querySelectorAll('.proof-tab')];
const claimPills = [...document.querySelectorAll('.claim-pill')];
const claimActiveLabel = document.getElementById('claimActiveLabel');
const proofCrumb = document.getElementById('proofCrumb');
const recordTrack = document.getElementById('recordTrack');
const recordExpand = document.getElementById('recordExpand');
const threadPath = document.getElementById('threadPath');
const threadStart = document.getElementById('threadStart');
const threadEnd = document.getElementById('threadEnd');
const threadMobileHint = document.getElementById('threadMobileHint');

let activeProof = 'everest';
let proofTween = null;
let recordExpanded = false;
let threadRedrawTimer = null;

function parseProofFromUrl() {
  const hash = window.location.hash.replace(/^#/, '');
  if (hash.startsWith('proof-')) {
    const id = hash.slice('proof-'.length);
    if (PROOFS[id]) return id;
  }
  const params = new URLSearchParams(window.location.search);
  const queryProof = params.get('proof');
  if (queryProof && PROOFS[queryProof]) return queryProof;
  return 'everest';
}

function setHash(id) {
  const next = `#proof-${id}`;
  if (window.location.hash !== next) {
    history.replaceState(null, '', `${window.location.pathname}${window.location.search}${next}`);
  }
}

function updateCrumb(proof) {
  if (!proofCrumb) return;
  proofCrumb.textContent = `Claim: ${proof.claimLabel} · Proof: ${proof.title} · Outcome: ${proof.outcome}`;
}

function updateAria(id) {
  const proof = PROOFS[id];
  proofTabs.forEach((tab) => {
    const selected = tab.dataset.proof === id;
    tab.classList.toggle('is-active', selected);
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  claimPills.forEach((pill) => {
    const selected = pill.dataset.claim === proof.claim;
    pill.classList.toggle('is-active', selected);
    pill.setAttribute('aria-selected', String(selected));
    pill.tabIndex = selected ? 0 : -1;
  });
  if (claimActiveLabel) claimActiveLabel.textContent = proof.claimLabel;
  updateCrumb(proof);
}

function renderProof(id, { focus = false } = {}) {
  const proof = PROOFS[id];
  proofCard.innerHTML = `
    <div class="proof-inner">
      <p class="proof-kicker mono">${proof.kicker}</p>
      <h2 class="proof-title" id="proofTitle" tabindex="-1">${proof.title}</h2>
      <p class="proof-summary">${proof.summary}</p>
      <div class="proof-meta mono">${proof.meta.map((item) => `<span>${item}</span>`).join('')}</div>
      <div class="proof-outcome">
        <span class="mono">Outcome</span>
        <p>${proof.outcome}</p>
      </div>
      <div class="proof-actions">
        <button type="button" class="proof-btn proof-btn--primary" data-focus-record>
          View ledger
          <span class="btn-icon" aria-hidden="true">↗</span>
        </button>
      </div>
    </div>
  `;

  proofCard.querySelector('[data-focus-record]')?.addEventListener('click', () => {
    document.querySelector('.record-strip')?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start'
    });
  });

  if (focus) {
    const title = document.getElementById('proofTitle');
    proofCard.focus({ preventScroll: true });
    title?.focus({ preventScroll: true });
  }
}

function showMobileThreadHint() {
  if (!threadMobileHint || window.innerWidth > 768) return;
  threadMobileHint.hidden = false;
  window.setTimeout(() => {
    threadMobileHint.hidden = true;
  }, 2800);
}

function drawThread() {
  if (!threadPath || reduceMotion || window.innerWidth <= 768) {
    threadStart?.classList.remove('is-visible');
    threadEnd?.classList.remove('is-visible');
    return;
  }

  const proof = PROOFS[activeProof];
  const claimEl = document.querySelector(`.claim-pill[data-claim="${proof.claim}"]`);
  const proofEl = proofCard;
  if (!claimEl || !proofEl) return;

  const claimRect = claimEl.getBoundingClientRect();
  const proofRect = proofEl.getBoundingClientRect();
  const width = window.innerWidth;
  const height = window.innerHeight;

  const x1 = ((claimRect.left + claimRect.width * 0.08) / width) * 100;
  const y1 = ((claimRect.top + claimRect.height / 2) / height) * 100;
  const x2 = ((proofRect.left + proofRect.width * 0.52) / width) * 100;
  const y2 = ((proofRect.top + proofRect.height * 0.22) / height) * 100;
  const cx1 = x1 + 12;
  const cy1 = y1 + 5;
  const cx2 = x2 - 14;
  const cy2 = y2 - 8;

  threadPath.setAttribute('d', `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`);
  threadStart?.setAttribute('cx', String(x1));
  threadStart?.setAttribute('cy', String(y1));
  threadEnd?.setAttribute('cx', String(x2));
  threadEnd?.setAttribute('cy', String(y2));
  threadStart?.classList.add('is-visible');
  threadEnd?.classList.add('is-visible');

  if (typeof gsap !== 'undefined') {
    const length = threadPath.getTotalLength();
    gsap.killTweensOf(threadPath);
    gsap.set(threadPath, { strokeDasharray: length, strokeDashoffset: length });
    gsap.to(threadPath, {
      strokeDashoffset: 0,
      duration: 0.9,
      ease: SPRING
    });
  }
}

function scheduleThreadRedraw() {
  window.clearTimeout(threadRedrawTimer);
  threadRedrawTimer = window.setTimeout(() => {
    window.requestAnimationFrame(drawThread);
  }, 80);
}

function staggerProofContent() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  gsap.fromTo(
    proofCard.querySelectorAll('.proof-kicker, .proof-title, .proof-summary, .proof-meta, .proof-outcome, .proof-actions'),
    { opacity: 0, y: 10 },
    {
      opacity: 1,
      y: 0,
      duration: DUR_PANEL,
      stagger: 0.04,
      ease: SPRING,
      delay: 0.04
    }
  );
}

function updateState(id, { animate = true, focus = false, pushHash = true } = {}) {
  if (!PROOFS[id]) return;
  activeProof = id;
  if (pushHash) setHash(id);
  updateAria(id);

  const runRender = () => {
    renderProof(id, { focus });
    staggerProofContent();
    scheduleThreadRedraw();
    showMobileThreadHint();
  };

  if (animate && typeof gsap !== 'undefined' && !reduceMotion) {
    if (proofTween) proofTween.kill();
    proofTween = gsap.to(proofCard, {
      opacity: 0,
      y: 8,
      duration: DUR_EXIT,
      ease: SPRING,
      onComplete: () => {
        runRender();
        proofTween = gsap.fromTo(
          proofCard,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: DUR_PANEL, ease: SPRING }
        );
      }
    });
  } else {
    runRender();
  }
}

function renderRecord() {
  recordTrack.innerHTML = RECORD.map((item, index) => `
    <article class="record-row${index >= FEATURED_RECORDS && !recordExpanded ? ' is-collapsed' : ''}" data-index="${index}">
      <span class="record-year mono">${item.year}</span>
      <p>${item.text}</p>
      <span class="record-tag mono">${item.tag}</span>
    </article>
  `).join('');

  const hiddenCount = RECORD.length - FEATURED_RECORDS;
  if (recordExpand) {
    if (hiddenCount <= 0 || recordExpanded) {
      recordExpand.hidden = true;
    } else {
      recordExpand.hidden = false;
      recordExpand.textContent = `View full ledger (${RECORD.length})`;
      recordExpand.setAttribute('aria-expanded', 'false');
    }
  }
}

function toggleRecordExpand() {
  recordExpanded = true;
  recordTrack.querySelectorAll('.record-row.is-collapsed').forEach((row) => {
    row.classList.remove('is-collapsed');
  });
  if (recordExpand) {
    recordExpand.hidden = true;
    recordExpand.setAttribute('aria-expanded', 'true');
  }
}

function handleClaimKeydown(event, pill) {
  const index = claimPills.indexOf(pill);
  if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
    event.preventDefault();
    const next = claimPills[(index + 1) % claimPills.length];
    next.focus();
    updateState(CLAIM_TO_PROOF[next.dataset.claim], { focus: true });
  } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
    event.preventDefault();
    const prev = claimPills[(index - 1 + claimPills.length) % claimPills.length];
    prev.focus();
    updateState(CLAIM_TO_PROOF[prev.dataset.claim], { focus: true });
  }
}

function handleProofKeydown(event, tab) {
  const index = proofTabs.indexOf(tab);
  if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
    event.preventDefault();
    const next = proofTabs[(index + 1) % proofTabs.length];
    next.focus();
    updateState(next.dataset.proof, { focus: true });
  } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
    event.preventDefault();
    const prev = proofTabs[(index - 1 + proofTabs.length) % proofTabs.length];
    prev.focus();
    updateState(prev.dataset.proof, { focus: true });
  }
}

proofTabs.forEach((tab) => {
  tab.addEventListener('click', () => updateState(tab.dataset.proof, { focus: true }));
  tab.addEventListener('keydown', (event) => handleProofKeydown(event, tab));
});

claimPills.forEach((pill) => {
  pill.addEventListener('click', () => updateState(CLAIM_TO_PROOF[pill.dataset.claim], { focus: true }));
  pill.addEventListener('keydown', (event) => handleClaimKeydown(event, pill));
});

recordExpand?.addEventListener('click', toggleRecordExpand);

document.addEventListener('keydown', (event) => {
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;
  const key = event.key;
  if (key === '1') updateState(CLAIM_TO_PROOF.systems, { focus: true });
  else if (key === '2') updateState(CLAIM_TO_PROOF.fintech, { focus: true });
  else if (key === '3') updateState(CLAIM_TO_PROOF.erp, { focus: true });
  else if (key === '4') updateState(CLAIM_TO_PROOF.judgment, { focus: true });
  else if (key === 'ArrowRight') {
    const currentIndex = PROOF_ORDER.indexOf(activeProof);
    updateState(PROOF_ORDER[(currentIndex + 1) % PROOF_ORDER.length], { focus: true });
  } else if (key === 'ArrowLeft') {
    const currentIndex = PROOF_ORDER.indexOf(activeProof);
    updateState(PROOF_ORDER[(currentIndex - 1 + PROOF_ORDER.length) % PROOF_ORDER.length], { focus: true });
  }
});

if ('ResizeObserver' in window) {
  const threadObserver = new ResizeObserver(scheduleThreadRedraw);
  threadObserver.observe(document.body);
  const loomStage = document.getElementById('loom-stage');
  if (loomStage) threadObserver.observe(loomStage);
  const heroPanel = document.querySelector('.hero-panel');
  if (heroPanel) threadObserver.observe(heroPanel);
} else {
  window.addEventListener('resize', scheduleThreadRedraw);
}

if (!reduceMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -5% 0px' }
  );
  document.querySelectorAll('.reveal-on-scroll').forEach((el) => revealObserver.observe(el));
} else {
  document.querySelectorAll('.reveal-on-scroll').forEach((el) => el.classList.add('is-visible'));
}

renderRecord();
updateState(parseProofFromUrl(), { animate: false, focus: false, pushHash: false });

if (typeof gsap !== 'undefined' && !reduceMotion) {
  gsap.from('.floating-nav', { y: -20, opacity: 0, duration: DUR_PANEL, ease: SPRING });
  gsap.from('.hero-copy > *', { y: 24, opacity: 0, duration: DUR_PANEL, stagger: 0.06, ease: SPRING, delay: 0.08 });
  gsap.from('.claim-board-shell', { y: 24, opacity: 0, duration: DUR_PANEL, ease: SPRING, delay: 0.16 });
  gsap.from('.proof-crumb', { opacity: 0, duration: DUR_MICRO, ease: SPRING, delay: 0.22 });
  gsap.from('.proof-index-shell, .proof-card-shell, .context-rail-shell', {
    y: 28,
    opacity: 0,
    duration: DUR_PANEL,
    stagger: 0.05,
    ease: SPRING,
    delay: 0.28
  });
  gsap.from('.record-strip', { y: 24, opacity: 0, duration: DUR_PANEL, ease: SPRING, delay: 0.42 });
  gsap.from('.closing-panel', { y: 24, opacity: 0, duration: DUR_PANEL, ease: SPRING, delay: 0.5 });
}
