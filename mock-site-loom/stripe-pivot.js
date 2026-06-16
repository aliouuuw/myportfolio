/* ═══════════════════════════════════════════════════════════════
   GRADIENT LOOM — Stripe DNA × Soft Structuralism
   ═══════════════════════════════════════════════════════════════ */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typeof gsap !== 'undefined') {
  if (typeof CustomEase !== 'undefined') {
    gsap.registerPlugin(CustomEase);
    CustomEase.create('spring', 'M0,0 C0.32,0.72 0,1 1,1');
  }
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }
}

const SPRING = typeof CustomEase !== 'undefined' ? 'spring' : 'power2.out';
const DUR_MICRO = 0.2;
const DUR_BASE = 0.35;
const DUR_SLOW = 0.5;
const FEATURED_COUNT = 3;

/* ── Data ── */
const PROOFS = {
  everest: {
    claim: 'fintech',
    claimLabel: 'Ships fintech workflows',
    kicker: 'Fintech spine · 2025 → now',
    title: 'Everest Finance',
    summary: 'A West African finance company needed customer data, account opening, public content, and operations work to stop living in separate places. I consolidated the public site, CRM, and Sama Naffa foundations into one operational spine.',
    meta: ['Solo technical owner', 'CRM + public site', 'Sama Naffa', 'TypeScript', 'PostgreSQL'],
    outcome: 'One system of work instead of spreadsheet reconciliation across teams.'
  },
  odoo: {
    claim: 'erp',
    claimLabel: 'Hardens ERP behavior',
    kicker: 'ERP acceptance · Open source',
    title: 'Odoo 18 Acceptance Testing Kit',
    summary: 'Localization and ERP regressions often fail quietly. I built a repeatable acceptance suite shaped around Odoo 18 realities: selectors, journals, fiscal behavior, inventory, HR, and CRM workflows.',
    meta: ['Robot Framework', 'Playwright', '39 tests', '9 suites', 'Selector guidelines'],
    outcome: 'Specific, repeatable migration checks where generic QA frameworks would be too vague.'
  },
  bocalbun: {
    claim: 'judgment',
    claimLabel: 'Stops wrong abstractions',
    kicker: 'Systems judgment · Retrospective',
    title: 'BocalBun',
    summary: 'A full-stack Bun framework I stopped deliberately. It solved my desire to build a framework, not a customer\u2019s operational problem. That became the useful lesson.',
    meta: ['Frozen deliberately', 'Architecture', 'Bun', 'Retrospective', 'Scoping discipline'],
    outcome: 'The asset is the judgment to stop, document, and redirect energy toward real operational software.'
  },
  record: {
    claim: 'systems',
    claimLabel: 'Builds operational systems',
    kicker: 'Execution ledger · 2021 → now',
    title: 'Shipped record',
    summary: 'The portfolio is not a gallery. It is a compressed record of operational domains: fintech, ERP, logistics, education, mobile, drone AI, and customer workflows.',
    meta: ['Everest Finance', 'Africa GreenTec', 'Purolator', 'BankingBook', 'Orange', 'Asaaman'],
    outcome: 'A multi-domain operating pattern: map the workflow, identify the narrow tool, ship, harden.'
  }
};

const CLAIM_TO_PROOF = { systems: 'record', fintech: 'everest', erp: 'odoo', judgment: 'bocalbun' };
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

/* ── DOM ── */
const proofPanel = document.getElementById('proofPanel');
const proofTabs = [...document.querySelectorAll('.sidebar-tab')];
const claimChips = [...document.querySelectorAll('.claim-chip')];
const breadcrumb = document.getElementById('stageBreadcrumb');
const recordLedger = document.getElementById('recordLedger');
const recordExpand = document.getElementById('recordExpand');

let activeProof = 'everest';
let proofTween = null;
let recordExpanded = false;

/* ── Proof rendering ── */
function renderProof(id, { focus = false } = {}) {
  const proof = PROOFS[id];
  proofPanel.innerHTML = `
    <p class="proof-kicker mono">${proof.kicker}</p>
    <h2 class="proof-title" id="proofTitle" tabindex="-1">${proof.title}</h2>
    <p class="proof-summary">${proof.summary}</p>
    <div class="proof-meta mono">${proof.meta.map(m => `<span>${m}</span>`).join('')}</div>
    <div class="proof-outcome">
      <span class="proof-outcome-label mono">Outcome</span>
      <p class="proof-outcome-text">${proof.outcome}</p>
    </div>
    <div class="proof-actions">
      <button type="button" class="proof-btn proof-btn--primary" data-focus-record>
        View ledger
        <span class="btn-icon" aria-hidden="true">↗</span>
      </button>
      <a href="mailto:wadealiou00@gmail.com" class="proof-btn">
        Discuss similar work
        <span class="btn-icon" aria-hidden="true">↗</span>
      </a>
    </div>
  `;

  proofPanel.querySelector('[data-focus-record]')?.addEventListener('click', () => {
    document.querySelector('.record-section')?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth', block: 'start'
    });
  });

  if (focus) {
    proofPanel.focus({ preventScroll: true });
    document.getElementById('proofTitle')?.focus({ preventScroll: true });
  }
}

function updateAria(id) {
  const proof = PROOFS[id];
  proofTabs.forEach(tab => {
    const sel = tab.dataset.proof === id;
    tab.classList.toggle('is-active', sel);
    tab.setAttribute('aria-selected', String(sel));
    tab.tabIndex = sel ? 0 : -1;
  });
  claimChips.forEach(chip => {
    const sel = chip.dataset.claim === proof.claim;
    chip.classList.toggle('is-active', sel);
    chip.setAttribute('aria-selected', String(sel));
    chip.tabIndex = sel ? 0 : -1;
  });
  if (breadcrumb) breadcrumb.textContent = `${proof.claimLabel} → ${proof.title}`;
}

function staggerProofContent() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  gsap.fromTo(
    proofPanel.querySelectorAll('.proof-kicker, .proof-title, .proof-summary, .proof-meta, .proof-outcome, .proof-actions'),
    { opacity: 0, y: 8 },
    { opacity: 1, y: 0, duration: DUR_BASE, stagger: 0.04, ease: SPRING, delay: 0.04 }
  );
}

function updateState(id, { animate = true, focus = false } = {}) {
  if (!PROOFS[id]) return;
  activeProof = id;
  updateAria(id);

  const runRender = () => {
    renderProof(id, { focus });
    staggerProofContent();
  };

  if (animate && typeof gsap !== 'undefined' && !reduceMotion) {
    if (proofTween) proofTween.kill();
    proofTween = gsap.to(proofPanel, {
      opacity: 0, y: 6, duration: DUR_MICRO, ease: SPRING,
      onComplete: () => {
        runRender();
        proofTween = gsap.fromTo(proofPanel,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: DUR_BASE, ease: SPRING }
        );
      }
    });
  } else {
    runRender();
  }
}

/* ── Record ── */
function renderRecord() {
  recordLedger.innerHTML = RECORD.map((item, i) => `
    <article class="record-row${i >= FEATURED_COUNT && !recordExpanded ? ' is-collapsed' : ''}" data-index="${i}">
      <span class="record-year mono">${item.year}</span>
      <p>${item.text}</p>
      <span class="record-tag mono">${item.tag}</span>
    </article>
  `).join('');

  const hidden = RECORD.length - FEATURED_COUNT;
  if (recordExpand) {
    if (hidden <= 0 || recordExpanded) {
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
  recordLedger.querySelectorAll('.record-row.is-collapsed').forEach(row => row.classList.remove('is-collapsed'));
  if (recordExpand) {
    recordExpand.hidden = true;
    recordExpand.setAttribute('aria-expanded', 'true');
  }
}

/* ── Event wiring ── */
proofTabs.forEach(tab => {
  tab.addEventListener('click', () => updateState(tab.dataset.proof, { focus: true }));
  tab.addEventListener('keydown', e => {
    const idx = proofTabs.indexOf(tab);
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      const next = proofTabs[(idx + 1) % proofTabs.length];
      next.focus(); updateState(next.dataset.proof, { focus: true });
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = proofTabs[(idx - 1 + proofTabs.length) % proofTabs.length];
      prev.focus(); updateState(prev.dataset.proof, { focus: true });
    }
  });
});

claimChips.forEach(chip => {
  chip.addEventListener('click', () => updateState(CLAIM_TO_PROOF[chip.dataset.claim], { focus: true }));
});

recordExpand?.addEventListener('click', toggleRecordExpand);

document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (e.key === '1') updateState(CLAIM_TO_PROOF.systems, { focus: true });
  else if (e.key === '2') updateState(CLAIM_TO_PROOF.fintech, { focus: true });
  else if (e.key === '3') updateState(CLAIM_TO_PROOF.erp, { focus: true });
  else if (e.key === '4') updateState(CLAIM_TO_PROOF.judgment, { focus: true });
  else if (e.key === 'ArrowRight') {
    const ci = PROOF_ORDER.indexOf(activeProof);
    updateState(PROOF_ORDER[(ci + 1) % PROOF_ORDER.length], { focus: true });
  } else if (e.key === 'ArrowLeft') {
    const ci = PROOF_ORDER.indexOf(activeProof);
    updateState(PROOF_ORDER[(ci - 1 + PROOF_ORDER.length) % PROOF_ORDER.length], { focus: true });
  }
});

/* ── Scroll reveal ── */
if (!reduceMotion) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
  document.querySelectorAll('.reveal-section').forEach(el => revealObserver.observe(el));
} else {
  document.querySelectorAll('.reveal-section').forEach(el => el.classList.add('is-visible'));
}

/* ── Gradient orb parallax ── */
if (typeof gsap !== 'undefined' && !reduceMotion) {
  const orbs = document.querySelectorAll('.gradient-orb');
  if (orbs.length && typeof ScrollTrigger !== 'undefined') {
    gsap.to(orbs[0], { y: -120, scrollTrigger: { trigger: '.hero-surface', start: 'top top', end: 'bottom top', scrub: 1.5 } });
    gsap.to(orbs[1], { y: -80, scrollTrigger: { trigger: '.hero-surface', start: 'top top', end: 'bottom top', scrub: 2 } });
    gsap.to(orbs[2], { y: -60, scrollTrigger: { trigger: '.hero-surface', start: 'top top', end: 'bottom top', scrub: 1 } });
  }
}

/* ── Load choreography ── */
if (typeof gsap !== 'undefined' && !reduceMotion) {
  const tl = gsap.timeline({ delay: 0.15 });

  tl.from('.rail-inner', { y: -16, opacity: 0, duration: DUR_BASE, ease: SPRING })
    .from('.hero-headline', { y: 32, opacity: 0, duration: DUR_SLOW, ease: SPRING }, '-=0.15')
    .from('.hero-lede', { y: 20, opacity: 0, duration: DUR_BASE, ease: SPRING }, '-=0.25')
    .from('.claim-chip', { y: 12, opacity: 0, duration: DUR_BASE, stagger: 0.06, ease: SPRING }, '-=0.15')
    .from('.hero-scroll-indicator', { opacity: 0, duration: DUR_SLOW, ease: SPRING }, '-=0.1');
}

/* ── Init ── */
renderRecord();
renderProof(activeProof);
