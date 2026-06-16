/* The Leak — diagnostic flow */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const DIAGNOSTICS = {
    'scattered-ops': {
        query: 'CRM and follow-up live in WhatsApp and spreadsheets',
        symptom: 'Staff chase customers across messages, spreadsheets, and a public site that does not share data.',
        bottleneck: 'No source of truth. Account opening and internal follow-up cannot be seen in one place.',
        fix: 'One internal CRM and ops dashboard tied to the same Postgres layer as the public site and customer app.',
        record: 'everest'
    },
    'odoo-risk': {
        query: 'Odoo migration might break localization silently',
        symptom: 'Manual click-through QA after migration. A tax rule or workflow change fails quietly in production.',
        bottleneck: 'No repeatable acceptance suite per localization. Combinatorics exceed what humans can verify.',
        fix: 'Robot + Playwright starter with 39 tests across 9 Odoo 18 suites, smoke and full validation paths.',
        record: 'odoo'
    },
    'platform-trap': {
        query: 'We keep funding platforms nobody adopts',
        symptom: 'Large abstractions ship before the operational bottleneck is clear. Teams inherit tools they avoid.',
        bottleneck: 'Building infrastructure for a product that does not exist yet. Framework theater instead of narrow ROI.',
        fix: 'Stop, document, and ship judgment. Freeze the wrong bet. Retrospective becomes the deliverable.',
        record: 'bocalbun'
    },
    'commerce-manual': {
        query: 'Catalog and admin updates are manual and fragile',
        symptom: 'Inventory and media live in disconnected places. Non-technical staff cannot run the catalog safely.',
        bottleneck: 'No admin path that matches how the business actually uploads and sells.',
        fix: 'E-commerce with R2 media pipeline and Excel-based admin upload the retailer can run weekly.',
        record: 'dakar-sport'
    },
    'school-paper': {
        query: 'School ops still run on paper and messages',
        symptom: 'Admin workflows on paper. Public site disconnected from how staff operate day to day.',
        bottleneck: 'No lightweight ops tool. CMS options are too heavy or absent for the school context.',
        fix: 'School ops pilot plus a lightweight CMS the staff can run without a developer on call.',
        record: 'eduplan'
    }
};

const RECORDS = {
    everest: {
        title: 'Everest Finance',
        meta: 'Fintech · Solo owner · 2025 → now',
        status: 'live',
        statusLabel: 'active',
        summary: 'West African finance company consolidating internal CRM, public site, and Sama Naffa customer app foundations.',
        shipped: [
            'Unified internal CRM and operations dashboard',
            'Public website on the same data layer',
            'Customer app foundations (Sama Naffa)'
        ],
        quote: 'The team now operates from one system instead of reconciling several.',
        detail: `
            <p class="mono drawer-kicker">Case · Fintech operations</p>
            <h2>Everest Finance</h2>
            <h3>Context</h3>
            <p>A West African finance company running operations across disconnected tools and manual processes.</p>
            <h3>Problem</h3>
            <p>Customer data, account opening, and follow-up lived in spreadsheets and messages. Nothing reconciled.</p>
            <h3>Shipped</h3>
            <ul>
                <li>Unified internal CRM and operations dashboard</li>
                <li>Rebuilt public website tied to the same data layer</li>
                <li>Sama Naffa customer app foundations</li>
            </ul>
            <p class="drawer-quote">Consolidation ongoing. Architecture favors one source of truth.</p>
        `
    },
    odoo: {
        title: 'Odoo 18 Acceptance Testing Kit',
        meta: 'ERP / QA · Open source · ERGOBIT',
        status: 'ship',
        statusLabel: 'shipped',
        summary: 'Acceptance-testing starter for Odoo 18 migrations. Specificity over generic test frameworks.',
        shipped: [
            'Robot Framework + Playwright Browser structure',
            'Odoo 18 selector guidelines and profile config',
            '39 tests across 9 localization suites'
        ],
        quote: '39 tests across 9 suites. That number is the proof, not the pitch.',
        detail: `
            <p class="mono drawer-kicker">Case · ERP / QA</p>
            <h2>Odoo 18 Acceptance Testing Kit</h2>
            <h3>Context</h3>
            <p>Odoo 18 migrations risk subtle localization and accounting regressions.</p>
            <h3>Shipped</h3>
            <ul>
                <li>Robot + Playwright project structure</li>
                <li>Profile-based environment configuration</li>
                <li>CI-friendly report output</li>
            </ul>
            <p class="drawer-quote">Publication path pending ERGOBIT attribution conversation.</p>
        `
    },
    bocalbun: {
        title: 'BocalBun retrospective',
        meta: 'Systems judgment · Frozen',
        status: 'frozen',
        statusLabel: 'frozen',
        summary: 'Full-stack Bun framework stopped. Premature abstraction documented as the asset.',
        shipped: [
            'Entity engine, RLS, hooks, audit layer (frozen)',
            'Public retrospective on when to stop',
            'Judgment: narrow tools beat giant platforms'
        ],
        quote: 'The retrospective is the asset now. Stopping is a deliverable when direction is wrong.',
        detail: `
            <p class="mono drawer-kicker">Case · Judgment</p>
            <h2>BocalBun, a framework retrospective</h2>
            <h3>Why stopped</h3>
            <p>It solved a desire to build a framework, not a customer operational problem.</p>
            <p class="drawer-quote">Judgment about what not to build is a senior skill.</p>
        `
    },
    'dakar-sport': {
        title: 'Dakar Sport Shop',
        meta: 'Commerce · Shipped · Local build',
        status: 'ship',
        statusLabel: 'shipped',
        summary: 'E-commerce for a Dakar retailer with R2 media and Excel admin upload.',
        shipped: ['E-commerce storefront', 'R2 media pipeline', 'Excel-based catalog admin'],
        quote: 'Narrow commerce stack the business can run without a dev on call.',
        detail: `<p class="mono drawer-kicker">Case · Commerce</p><h2>Dakar Sport Shop</h2><p>E-commerce with admin paths matched to how the retailer actually works.</p>`
    },
    eduplan: {
        title: 'EduPlan',
        meta: 'Education · School ops pilot',
        status: 'ship',
        statusLabel: 'shipped',
        summary: 'School operations software pilot plus lightweight CMS for Les Hirondelles.',
        shipped: ['EduPlan ops pilot', 'Les Hirondelles CMS and site'],
        quote: 'Lightweight tools school staff can run.',
        detail: `<p class="mono drawer-kicker">Case · Education</p><h2>EduPlan + Les Hirondelles</h2><p>School ops pilot and CMS without enterprise bloat.</p>`
    }
};

const CUSTOM_KEYWORDS = [
    { words: ['odoo', 'erp', 'migration', 'test', 'qa'], pain: 'odoo-risk' },
    { words: ['framework', 'platform', 'abstract', 'adopt'], pain: 'platform-trap' },
    { words: ['shop', 'commerce', 'catalog', 'inventory', 'retail'], pain: 'commerce-manual' },
    { words: ['school', 'education', 'student'], pain: 'school-paper' },
    { words: ['crm', 'whatsapp', 'spreadsheet', 'fintech', 'finance'], pain: 'scattered-ops' }
];

let activePain = null;
let activeDiagnostic = null;
let diagnosisST = null;

const els = {
    intake: document.getElementById('stage-intake'),
    diagnosis: document.getElementById('stage-diagnosis'),
    proof: document.getElementById('stage-proof'),
    painGrid: document.getElementById('pain-grid'),
    customForm: document.getElementById('intake-custom'),
    customInput: document.getElementById('custom-pain'),
    diagnosisQuery: document.getElementById('diagnosis-query'),
    beatSymptom: document.getElementById('beat-symptom'),
    beatBottleneck: document.getElementById('beat-bottleneck'),
    beatFix: document.getElementById('beat-fix'),
    stepRailFill: document.getElementById('step-rail-fill'),
    beats: document.querySelectorAll('.beat'),
    visMess: document.getElementById('vis-mess'),
    visBottle: document.getElementById('vis-bottle'),
    visShip: document.getElementById('vis-ship'),
    proofTitle: document.getElementById('proof-title'),
    proofMeta: document.getElementById('proof-meta'),
    proofStatus: document.getElementById('proof-status'),
    proofSummary: document.getElementById('proof-summary'),
    proofShipped: document.getElementById('proof-shipped'),
    proofQuote: document.getElementById('proof-quote'),
    ticketSubject: document.getElementById('ticket-subject'),
    ticketBody: document.getElementById('ticket-body'),
    ticketMailto: document.getElementById('ticket-mailto'),
    drawerBody: document.getElementById('drawer-body'),
    overlay: document.getElementById('overlay'),
    browseOverlay: document.getElementById('browse-overlay'),
    aboutOverlay: document.getElementById('about-overlay'),
    browseList: document.getElementById('browse-list')
};

/* -----------------------------------------------------------
   Run diagnostic
----------------------------------------------------------- */
function matchCustomPain(text) {
    const t = text.toLowerCase();
    for (const { words, pain } of CUSTOM_KEYWORDS) {
        if (words.some((w) => t.includes(w))) return pain;
    }
    return 'scattered-ops';
}

function runDiagnostic(painKey, customQuery) {
    const diag = DIAGNOSTICS[painKey];
    if (!diag) return;

    activePain = painKey;
    activeDiagnostic = diag;

    els.diagnosisQuery.textContent = customQuery || diag.query;
    els.beatSymptom.textContent = diag.symptom;
    els.beatBottleneck.textContent = diag.bottleneck;
    els.beatFix.textContent = diag.fix;

    els.ticketSubject.value = `Operations leak: ${(customQuery || diag.query).slice(0, 60)}`;
    els.ticketBody.value = `Symptom: ${diag.symptom}\n\nBottleneck: ${diag.bottleneck}\n\nLooking for help with a narrow fix.`;

    updateMailto();

    const goDiagnosis = () => {
        els.intake.hidden = true;
        els.intake.classList.remove('is-active');
        els.diagnosis.hidden = false;
        els.proof.hidden = true;
        setupDiagnosisScroll();
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    };

    if (reduceMotion || typeof gsap === 'undefined') {
        goDiagnosis();
        setBeat(2);
        showProof(false);
        return;
    }

    gsap.to(els.intake, {
        opacity: 0, y: -24, duration: 0.45, ease: 'power2.in',
        onComplete: () => {
            goDiagnosis();
            gsap.fromTo(els.diagnosis, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
        }
    });
}

function setBeat(index) {
    const visuals = [els.visMess, els.visBottle, els.visShip];
    els.beats.forEach((beat, i) => {
        beat.classList.toggle('is-active', i === index);
        beat.classList.toggle('is-done', i < index);
    });
    visuals.forEach((v, i) => v.classList.toggle('is-visible', i === index));
    if (els.stepRailFill) {
        els.stepRailFill.style.width = `${((index + 1) / 3) * 100}%`;
    }
}

function setupDiagnosisScroll() {
    if (diagnosisST) {
        diagnosisST.kill();
        diagnosisST = null;
    }
    ScrollTrigger.getAll().forEach((st) => {
        if (st.vars?.id === 'diagnosis') st.kill();
    });

    setBeat(0);

    if (reduceMotion || typeof gsap === 'undefined') {
        setBeat(2);
        showProof(false);
        return;
    }

    const pin = document.getElementById('diagnosis-pin');
    const scrollSpacer = document.getElementById('diagnosis-scroll');

    diagnosisST = ScrollTrigger.create({
        id: 'diagnosis',
        trigger: els.diagnosis,
        start: 'top top',
        end: () => `+=${window.innerHeight * 2.2}`,
        pin: pin,
        pinSpacing: true,
        scrub: 0.4,
        onUpdate: (self) => {
            const p = self.progress;
            const idx = p < 0.33 ? 0 : p < 0.66 ? 1 : 2;
            setBeat(idx);
            if (p > 0.92 && els.proof.hidden) {
                showProof(true);
                els.proof.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
}

function showProof(animate) {
    const rec = RECORDS[activeDiagnostic.record];
    if (!rec) return;

    els.proofTitle.textContent = rec.title;
    els.proofMeta.textContent = rec.meta;
    els.proofStatus.textContent = rec.statusLabel;
    els.proofStatus.className = `proof-status proof-status--${rec.status}`;
    els.proofSummary.textContent = rec.summary;
    els.proofShipped.innerHTML = rec.shipped.map((s) => `<li>${s}</li>`).join('');
    els.proofQuote.textContent = rec.quote;

    els.proof.hidden = false;
    const ticket = document.getElementById('stage-ticket');
    if (ticket) ticket.hidden = false;

    if (!animate || reduceMotion || typeof gsap === 'undefined') return;

    gsap.from('#proof-card', {
        y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: els.proof, start: 'top 85%' }
    });
}

/* -----------------------------------------------------------
   Events: intake
----------------------------------------------------------- */
els.painGrid?.addEventListener('click', (e) => {
    const card = e.target.closest('.pain-card');
    if (!card) return;
    document.querySelectorAll('.pain-card').forEach((c) => c.classList.remove('is-selected'));
    card.classList.add('is-selected');
    runDiagnostic(card.dataset.pain);
});

els.customForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = els.customInput.value.trim();
    if (!text) return;
    const pain = matchCustomPain(text);
    runDiagnostic(pain, text);
});

document.getElementById('back-intake')?.addEventListener('click', resetFlow);
document.getElementById('restart')?.addEventListener('click', (e) => {
    e.preventDefault();
    resetFlow();
});
document.getElementById('proof-another')?.addEventListener('click', resetFlow);

function resetFlow() {
    if (diagnosisST) { diagnosisST.kill(); diagnosisST = null; }
    ScrollTrigger.getAll().forEach((st) => { if (st.vars?.id === 'diagnosis') st.kill(); });

    activePain = null;
    activeDiagnostic = null;
    els.intake.hidden = false;
    els.intake.style.opacity = '1';
    els.intake.classList.add('is-active');
    els.diagnosis.hidden = true;
    els.proof.hidden = true;
    const ticket = document.getElementById('stage-ticket');
    if (ticket) ticket.hidden = true;
    document.querySelectorAll('.pain-card').forEach((c) => c.classList.remove('is-selected'));
    els.customInput.value = '';
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
}

/* -----------------------------------------------------------
   Proof detail drawer
----------------------------------------------------------- */
document.getElementById('proof-detail')?.addEventListener('click', () => {
    if (!activeDiagnostic) return;
    const rec = RECORDS[activeDiagnostic.record];
    if (rec) openOverlay(els.overlay, rec.detail);
});

function openOverlay(overlay, html) {
    if (html) els.drawerBody.innerHTML = html;
    overlay.hidden = false;
    document.body.classList.add('overlay-open');
    if (!reduceMotion && typeof gsap !== 'undefined') {
        gsap.fromTo(overlay.querySelector('.overlay-scrim'), { opacity: 0 }, { opacity: 1, duration: 0.25 });
        gsap.fromTo(overlay.querySelector('.drawer, .browse-panel'), { x: '100%' }, { x: '0%', duration: 0.45, ease: 'power3.out' });
    }
}

function closeOverlay(overlay) {
    const finish = () => {
        overlay.hidden = true;
        if (!document.querySelector('.overlay:not([hidden])')) {
            document.body.classList.remove('overlay-open');
        }
    };
    if (reduceMotion || typeof gsap === 'undefined') { finish(); return; }
    gsap.to(overlay.querySelector('.drawer, .browse-panel'), {
        x: '100%', duration: 0.35, ease: 'power2.in', onComplete: finish
    });
}

els.overlay?.querySelectorAll('[data-close]').forEach((el) => {
    el.addEventListener('click', () => closeOverlay(els.overlay));
});

/* Browse all */
function renderBrowseList() {
    els.browseList.innerHTML = Object.entries(RECORDS).map(([key, r]) => `
        <li><button type="button" data-record="${key}">
            <strong>${r.title}</strong>
            <span class="mono">${r.statusLabel}</span>
        </button></li>
    `).join('');
    els.browseList.querySelectorAll('[data-record]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const rec = RECORDS[btn.dataset.record];
            closeOverlay(els.browseOverlay);
            openOverlay(els.overlay, rec.detail);
        });
    });
}
renderBrowseList();

document.getElementById('browse-trigger')?.addEventListener('click', () => openOverlay(els.browseOverlay));
els.browseOverlay?.querySelectorAll('[data-close-browse]').forEach((el) => {
    el.addEventListener('click', () => closeOverlay(els.browseOverlay));
});

document.getElementById('about-trigger')?.addEventListener('click', () => openOverlay(els.aboutOverlay));
els.aboutOverlay?.querySelectorAll('[data-close-about]').forEach((el) => {
    el.addEventListener('click', () => closeOverlay(els.aboutOverlay));
});

document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    [els.overlay, els.browseOverlay, els.aboutOverlay].forEach((o) => {
        if (!o.hidden) closeOverlay(o);
    });
});

/* Ticket mailto */
function updateMailto() {
    const sub = encodeURIComponent(els.ticketSubject?.value || 'Operations ticket');
    const body = encodeURIComponent(els.ticketBody?.value || '');
    if (els.ticketMailto) els.ticketMailto.href = `mailto:wadealiou00@gmail.com?subject=${sub}&body=${body}`;
}

document.getElementById('ticket-form')?.addEventListener('input', updateMailto);
updateMailto();

document.querySelector('.bar-cta')?.addEventListener('click', (e) => {
    const ticket = document.getElementById('stage-ticket');
    if (ticket?.hidden) {
        e.preventDefault();
        ticket.hidden = false;
        ticket.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    }
});

/* Init */
window.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap !== 'undefined') gsap.registerPlugin(ScrollTrigger);

    if (!reduceMotion && typeof gsap !== 'undefined') {
        gsap.from('.intake-title', {
            y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.1
        });
        gsap.from('.intake-lead', { y: 20, opacity: 0, duration: 0.7, delay: 0.25, ease: 'power3.out' });
        gsap.from('.pain-card', { y: 24, opacity: 0, duration: 0.6, stagger: 0.06, delay: 0.35, ease: 'power3.out' });
    }
});

/* Split intake title lines if needed - title doesn't have .l spans, that's ok */
