/* ═══════════════════════════════════════════════════════════════
   APP.JS — GSAP Motion Choreography & Data
   ═══════════════════════════════════════════════════════════════ */

const CASES = {
  everest: {
    kicker: 'Fintech · Operational Spine',
    title: 'Everest Finance',
    meta: ['Solo technical owner', 'Next.js 15', 'TypeScript', 'PostgreSQL'],
    body: `
      <p>West African finance company. Customer data and account opening lived in spreadsheets. I mapped the real workflow first — three teams, four friction points — before writing a line of code.</p>
      <p>I consolidated a public website, an internal CRM, and the Sama Naffa customer app into one unified operational spine.</p>
      <ul>
        <li>Internal CRM and operations dashboard to replace spreadsheet triage.</li>
        <li>Public site built on a shared data layer to prevent duplicate content management.</li>
        <li>Sama Naffa customer app foundations for account views and transaction history.</li>
      </ul>
    `,
    quote: "The team now operates from one system instead of reconciling three."
  },
  odoo: {
    kicker: 'ERP · Quality Assurance',
    title: 'Odoo 18 Acceptance Testing Kit',
    meta: ['Robot Framework', 'Playwright', 'Python', '39 tests'],
    body: `
      <p>Repeatable acceptance validation for Odoo 18 migrations. Localization behavior — fiscal year, journal sequences, multi-currency — fails quietly without suite-level discipline.</p>
      <p>Built selector guidelines specific to Odoo 18's DOM after the framework's own test conventions diverged from the UI in v17+.</p>
      <ul>
        <li>Robot Framework + Playwright Browser structure for readability and execution speed.</li>
        <li>Odoo 18-specific selector reference to avoid brittle XPath chains.</li>
        <li>39 acceptance tests across 9 domain suites covering accounting, HR, and CRM.</li>
      </ul>
    `,
    quote: "Specificity is the product. Generic test frameworks are already abundant."
  },
  bocalbun: {
    kicker: 'Systems Judgment',
    title: 'BocalBun Retrospective',
    meta: ['Frozen deliberately', 'Architecture', 'Bun'],
    body: `
      <p>A full-stack Bun framework I stopped deliberately. It solved my desire to build a framework, not a customer's operational problem.</p>
      <p>Premature abstraction is a tax operations teams cannot pay. The gap between framework elegance and real operational friction is where most technical projects quietly fail.</p>
      <ul>
        <li>Stopping is a deliverable when the direction is wrong.</li>
        <li>Lessons applied directly to scoping Everest Finance and other client engagements.</li>
        <li>The retrospective is the asset now, not the repository.</li>
      </ul>
    `,
    quote: "The discipline to stop is the same discipline that ships clean operational software."
  }
};

const RECORD = [
  { year: '2026', msg: '<strong>Everest Finance</strong> — CRM live, Sama Naffa in hardening', tag: 'Fintech' },
  { year: '2025', msg: '<strong>EduPlan</strong> — academic scheduling tool deployed', tag: 'Education' },
  { year: '2024', msg: '<strong>Odoo 18 kit</strong> — 39 acceptance tests passing', tag: 'QA' },
  { year: '2024', msg: '<strong>Africa GreenTec</strong> — accounting module in production', tag: 'ERP' },
  { year: '2023', msg: '<strong>BankingBook Analytics</strong> — open-banking APIs', tag: 'Fintech' },
  { year: '2023', msg: '<strong>Purolator</strong> — logistics software engineering', tag: 'Logistics' },
  { year: '2022', msg: '<strong>Orange</strong> — React Native app, 1,000+ members', tag: 'Mobile' },
  { year: '2021', msg: '<strong>Asaaman</strong> — drone AI surveillance tooling', tag: 'AI' }
];

/* ── DOM Elements ── */
const diagnosticView = document.getElementById('diagnosticView');
const blueprintView = document.getElementById('blueprintView');
const blueprintContent = document.getElementById('blueprintContent');
const closeBlueprintBtn = document.getElementById('closeBlueprint');
const cards = document.querySelectorAll('.bottleneck-card');

const recordOverlay = document.getElementById('recordOverlay');
const recordPanel = document.querySelector('.record-panel');
const recordTrigger = document.getElementById('recordTrigger');
const closeRecordBtn = document.getElementById('closeRecord');
const recordList = document.getElementById('recordList');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Init Record Data ── */
recordList.innerHTML = RECORD.map(r => `
  <div class="record-item">
    <div class="r-year mono">${r.year}</div>
    <div class="r-msg">${r.msg}</div>
    <div class="r-tag mono">${r.tag}</div>
  </div>
`).join('');

/* ── GSAP Motion Choreography ── */
const spring = "cubic-bezier(0.32, 0.72, 0, 1)";
const smooth = "cubic-bezier(0.16, 1, 0.3, 1)";

// Initial Load Animation
if (typeof gsap !== 'undefined' && !reduceMotion) {
  gsap.from('.diagnostic-header > *', {
    y: 30, opacity: 0, duration: 1, stagger: 0.15, ease: spring, delay: 0.2
  });
  gsap.from('.bottleneck-card', {
    y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: spring, delay: 0.4
  });
  gsap.from('.nav-shell', {
    y: -20, opacity: 0, duration: 1, ease: spring
  });
}

// Open Blueprint
cards.forEach(card => {
  card.addEventListener('click', () => {
    const caseId = card.dataset.case;
    const data = CASES[caseId];
    if (!data) return;

    // Build Content
    blueprintContent.innerHTML = `
      <span class="bp-eyebrow mono">${data.kicker}</span>
      <h2 class="bp-title">${data.title}</h2>
      <div class="bp-meta mono">
        ${data.meta.map(m => `<span class="bp-tag">${m}</span>`).join('')}
      </div>
      <div class="bp-body">${data.body}</div>
      <div class="bp-quote">"${data.quote}"</div>
      <div style="margin-top: 80px; text-align: center;">
        <a href="mailto:wadealiou00@gmail.com" style="background:#111;color:#fff;padding:16px 32px;border-radius:100px;font-weight:500;">Email Aliou to build this →</a>
      </div>
    `;

    blueprintView.style.visibility = 'visible';
    document.body.style.overflow = 'hidden'; // lock scroll

    if (typeof gsap !== 'undefined' && !reduceMotion) {
      // Fade out diagnostic view
      gsap.to(diagnosticView, { opacity: 0, scale: 0.98, duration: 0.6, ease: spring });
      
      // Fade in blueprint
      gsap.fromTo(blueprintView, 
        { opacity: 0, y: 40 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: spring }
      );
      
      // Stagger content inner
      gsap.fromTo(blueprintContent.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.05, ease: spring, delay: 0.1 }
      );
    } else {
      diagnosticView.style.opacity = 0;
      blueprintView.style.opacity = 1;
    }
  });
});

// Close Blueprint
closeBlueprintBtn.addEventListener('click', () => {
  if (typeof gsap !== 'undefined' && !reduceMotion) {
    gsap.to(blueprintView, {
      opacity: 0, y: 20, duration: 0.4, ease: smooth,
      onComplete: () => {
        blueprintView.style.visibility = 'hidden';
        document.body.style.overflow = '';
      }
    });
    gsap.to(diagnosticView, { opacity: 1, scale: 1, duration: 0.6, ease: spring, delay: 0.1 });
  } else {
    blueprintView.style.visibility = 'hidden';
    blueprintView.style.opacity = 0;
    diagnosticView.style.opacity = 1;
    document.body.style.overflow = '';
  }
});

// Open Record Drawer
recordTrigger.addEventListener('click', () => {
  recordOverlay.style.visibility = 'visible';
  document.body.style.overflow = 'hidden';
  
  if (typeof gsap !== 'undefined' && !reduceMotion) {
    gsap.to(recordOverlay, { opacity: 1, duration: 0.4, ease: smooth });
    gsap.to(recordPanel, { y: 0, duration: 0.6, ease: spring });
  } else {
    recordOverlay.style.opacity = 1;
    recordPanel.style.transform = 'translateY(0)';
  }
});

// Close Record Drawer
closeRecordBtn.addEventListener('click', closeRecord);
recordOverlay.addEventListener('click', (e) => {
  if (e.target === recordOverlay) closeRecord();
});

function closeRecord() {
  if (typeof gsap !== 'undefined' && !reduceMotion) {
    gsap.to(recordPanel, { y: '100%', duration: 0.5, ease: smooth });
    gsap.to(recordOverlay, {
      opacity: 0, duration: 0.4, delay: 0.1, ease: smooth,
      onComplete: () => {
        recordOverlay.style.visibility = 'hidden';
        document.body.style.overflow = '';
      }
    });
  } else {
    recordOverlay.style.opacity = 0;
    recordPanel.style.transform = 'translateY(100%)';
    recordOverlay.style.visibility = 'hidden';
    document.body.style.overflow = '';
  }
}

// Escape key to close overlays
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (blueprintView.style.visibility === 'visible') closeBlueprintBtn.click();
    if (recordOverlay.style.visibility === 'visible') closeRecord();
  }
});
