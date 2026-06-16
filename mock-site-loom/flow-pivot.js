/* Flow engine — horizontal scroll journey (flow-pivot + flow-soft) */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isSoftTheme = window.FLOW_THEME === 'soft';
const data = window.FLOW_DATA;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const DUR_BASE = 0.35;
const DUR_SLOW = 0.5;
const SPRING = 'power2.out';

const flowTrack = document.getElementById('flowTrack');
const progressFill = document.getElementById('progressFill');
const progressDots = document.getElementById('progressDots');
const progressKeys = document.getElementById('progressKeys');
const progressLabel = document.getElementById('progressLabel');
const flowMobileHint = document.getElementById('flowMobileHint');
const dots = () => [...document.querySelectorAll('.dot')];
const sections = () => [...document.querySelectorAll('.flow-section')];

let flowScrollTrigger = null;
let sectionCount = 6;
let horizontalTween = null;
let sectionDataCache = [];
let recordClientsExpanded = false;

function getSectionData() {
  if (!data) return [];
  if (isSoftTheme && data.sectionsSoft) return data.sectionsSoft;
  return data.sections;
}

function workUrl(slug) {
  return `${data.paths?.work ?? '/en/work'}/${slug}`;
}

function writingUrl(slug) {
  return `${data.paths?.writing ?? '/en/writing'}/${slug}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderTitle(text) {
  return escapeHtml(text).replace(/\n/g, '<br>');
}

function renderCaseCard(caseItem) {
  const meta = caseItem.meta?.map((item) => `<span>${escapeHtml(item)}</span>`).join('') ?? '';
  const headerLabel = caseItem.label
    ? `<span class="case-label mono">${escapeHtml(caseItem.label)}</span>`
    : '';
  const caseStudyLink = caseItem.primary && caseItem.caseStudySlug
    ? `<a class="case-study-link" href="${escapeHtml(workUrl(caseItem.caseStudySlug))}">Read case study <span class="btn-icon" aria-hidden="true">↗</span></a>`
    : '';
  const essayLink = caseItem.essaySlug
    ? `<a class="case-link mono" href="${escapeHtml(writingUrl(caseItem.essaySlug))}">Essay: why I stopped building frameworks →</a>`
    : '';

  const core = `
      <div class="case-header">
        ${headerLabel}
        <h3 class="case-title">${escapeHtml(caseItem.title)}</h3>
      </div>
      ${caseItem.period ? `<p class="case-period mono">${escapeHtml(caseItem.period)} · ${escapeHtml(caseItem.role)}</p>` : ''}
      <p class="case-summary">${escapeHtml(caseItem.summary)}</p>
      ${caseItem.outcome ? `
        <div class="case-outcome">
          <span class="mono">Outcome</span>
          <p>${escapeHtml(caseItem.outcome)}</p>
        </div>
      ` : ''}
      ${meta ? `<div class="case-meta mono">${meta}</div>` : ''}
      ${caseStudyLink}
      ${essayLink}
  `;

  if (isSoftTheme) {
    return `
    <div class="section-case${caseItem.primary ? '' : ' case--secondary'}">
      <div class="case-tray">
        <div class="case-core">${core}</div>
      </div>
    </div>
  `;
  }

  return `<div class="section-case${caseItem.primary ? '' : ' case--secondary'}">${core}</div>`;
}

function renderOperateSection(section) {
  const principles = data.principles
    .map(
      (item, index) => `
        <li class="principle-row">
          <span class="principle-index mono">${String(index + 1).padStart(2, '0')}</span>
          <div class="principle-copy">
            <strong>${escapeHtml(item.label)}</strong>
            <p>${escapeHtml(item.body)}</p>
          </div>
        </li>
      `
    )
    .join('');

  const education = data.credentials.education
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('');
  const certs = data.credentials.certifications
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('');
  const stack = data.stack.map((item) => `<span>${escapeHtml(item)}</span>`).join('');

  return `
    <section class="flow-section flow-section--operate" id="section-${section.id}" data-section="${section.id}" aria-labelledby="title-${section.id}">
      <div class="section-inner">
        <span class="section-marker mono">${escapeHtml(section.marker)}</span>
        <span class="section-domain mono">${escapeHtml(section.domain)}</span>
        <h2 class="section-title" id="title-${section.id}">${renderTitle(section.title)}</h2>
        <p class="section-desc">${escapeHtml(section.desc)}</p>

        <ol class="principle-list" aria-label="Working principles">
          ${principles}
        </ol>

        <dl class="credential-grid">
          <div class="credential-block">
            <dt class="mono">Experience</dt>
            <dd>${escapeHtml(data.credentials.experience)}</dd>
          </div>
          <div class="credential-block">
            <dt class="mono">Education</dt>
            <dd><ul>${education}</ul></dd>
          </div>
          <div class="credential-block">
            <dt class="mono">Certifications</dt>
            <dd><ul>${certs}</ul></dd>
          </div>
        </dl>

        <div class="stack-strip mono" aria-label="Stack">
          ${stack}
        </div>
      </div>
    </section>
  `;
}

function renderRecordSection(section) {
  const featuredCount = data.recordFeaturedClients ?? 4;
  const employers = data.employers
    .map(
      (item) => `
        <li class="record-row">
          <span class="record-period mono">${escapeHtml(item.period)}</span>
          <div class="record-body">
            <strong>${escapeHtml(item.name)}</strong>
            <span class="record-role">${escapeHtml(item.role)}</span>
            <p>${escapeHtml(item.proof)}</p>
          </div>
        </li>
      `
    )
    .join('');

  const clients = data.clients
    .map(
      (item, index) => `
        <li class="client-row${index >= featuredCount && !recordClientsExpanded ? ' is-collapsed' : ''}" data-client-index="${index}">
          <div class="client-head">
            <strong>${escapeHtml(item.name)}</strong>
            <span class="client-domain mono">${escapeHtml(item.domain)}</span>
          </div>
          <p>${escapeHtml(item.scope)}</p>
        </li>
      `
    )
    .join('');

  const hiddenClientCount = Math.max(0, data.clients.length - featuredCount);
  const expandBtn =
    hiddenClientCount > 0 && !recordClientsExpanded
      ? `<button type="button" class="record-expand mono" id="recordExpand" aria-expanded="false">View ${hiddenClientCount} more client builds</button>`
      : '';

  const workIndexUrl = data.paths?.work ?? '/en/work';
  const recordLayout = isSoftTheme
    ? `
        <div class="record-stack">
          <div class="record-panel record-panel--full">
            <h3 class="panel-label mono">Employers</h3>
            <ul class="record-list">${employers}</ul>
          </div>
          <div class="record-panel record-panel--full">
            <h3 class="panel-label mono">Client builds · Dakar</h3>
            <ul class="client-list" id="clientList">${clients}</ul>
            ${expandBtn}
            <p class="record-footnote mono"><a href="${escapeHtml(workIndexUrl)}">Full work index</a> on production.</p>
          </div>
        </div>
      `
    : `
        <div class="record-split">
          <div class="record-panel">
            <h3 class="panel-label mono">Employers</h3>
            <ul class="record-list">${employers}</ul>
          </div>
          <div class="record-panel">
            <h3 class="panel-label mono">Client builds · Dakar</h3>
            <ul class="client-list" id="clientList">${clients}</ul>
            ${expandBtn}
            <p class="record-footnote mono">Supporting case studies on /work when published.</p>
          </div>
        </div>
      `;

  return `
    <section class="flow-section flow-section--record" id="section-${section.id}" data-section="${section.id}" aria-labelledby="title-${section.id}">
      <div class="section-inner section-inner--wide">
        <span class="section-marker mono">${escapeHtml(section.marker)}</span>
        <span class="section-domain mono">${escapeHtml(section.domain)}</span>
        <h2 class="section-title" id="title-${section.id}">${renderTitle(section.title)}</h2>
        <p class="section-desc">${escapeHtml(section.desc)}</p>
        ${recordLayout}
      </div>
    </section>
  `;
}

function renderContactSection(section, profile) {
  const repos = data.githubRepos
    .map(
      (repo) => `
        <li>
          <a href="${escapeHtml(profile.github)}/${escapeHtml(repo.name)}" target="_blank" rel="noopener noreferrer">
            <span class="repo-name">${escapeHtml(repo.name)}</span>
            <span class="repo-note">${escapeHtml(repo.note)}</span>
          </a>
          <span class="repo-lang mono">${escapeHtml(repo.lang)}</span>
        </li>
      `
    )
    .join('');

  const contactBody = `
        <p class="contact-current mono">${escapeHtml(profile.currentRole)}</p>

        <div class="contact-options">
          <a href="mailto:${escapeHtml(profile.email)}" class="contact-card">
            <span class="contact-icon" aria-hidden="true">✉</span>
            <div class="contact-info">
              <span class="contact-label mono">Email</span>
              <span class="contact-value">${escapeHtml(profile.email)}</span>
            </div>
            <span class="contact-arrow" aria-hidden="true">→</span>
          </a>
          <a href="${escapeHtml(profile.whatsapp)}" target="_blank" rel="noopener noreferrer" class="contact-card">
            <span class="contact-icon" aria-hidden="true">◉</span>
            <div class="contact-info">
              <span class="contact-label mono">WhatsApp</span>
              <span class="contact-value">${escapeHtml(profile.whatsappDisplay)}</span>
            </div>
            <span class="contact-arrow" aria-hidden="true">→</span>
          </a>
        </div>

        <div class="connect-grid">
          <article class="field-note">
            <span class="panel-label mono">Field note</span>
            <h3 class="field-note-title">${escapeHtml(data.writing.title)}</h3>
            <p>${escapeHtml(data.writing.summary)}</p>
            <a class="field-note-link mono" href="${escapeHtml(writingUrl(data.writing.slug))}">Read essay →</a>
          </article>

          <div class="github-panel">
            <span class="panel-label mono">GitHub</span>
            <ul class="repo-list">${repos}</ul>
            <p class="github-scope mono">Chart is this profile only. Much work ships on employer GitHub and Azure DevOps.</p>
          </div>
        </div>

        <div class="contact-context">
          <div class="context-item">
            <span class="context-label mono">Arc</span>
            <span class="context-value">${escapeHtml(profile.arc)}</span>
          </div>
          <div class="context-item">
            <span class="context-label mono">Availability</span>
            <span class="context-value">${escapeHtml(profile.availability)}</span>
          </div>
          <div class="context-item">
            <span class="context-label mono">Also on</span>
            <span class="context-value context-links">
              <a href="${escapeHtml(profile.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="${escapeHtml(profile.github)}" target="_blank" rel="noopener noreferrer">GitHub</a>
            </span>
          </div>
        </div>

        <p class="contact-note">${escapeHtml(profile.availabilityNote)}</p>
        <p class="chess-note mono">Chess · ${escapeHtml(data.chess.bullet)} bullet · ${escapeHtml(data.chess.blitz)} blitz. ${escapeHtml(data.chess.note)}</p>
  `;

  const header = `
        <span class="section-marker mono">${escapeHtml(section.marker)}</span>
        <span class="section-domain mono">${escapeHtml(section.domain)}</span>
        <h2 class="section-title" id="title-${section.id}">${renderTitle(section.title)}</h2>
        <p class="section-desc">${escapeHtml(section.desc)}</p>
  `;

  const contactInner = isSoftTheme
    ? `${header}<div class="contact-shell"><div class="contact-core">${contactBody}</div></div>`
    : `${header}${contactBody}`;

  return `
    <section class="flow-section flow-section--contact" id="section-${section.id}" data-section="${section.id}" aria-labelledby="title-${section.id}">
      <div class="section-inner">
        ${contactInner}
      </div>
    </section>
  `;
}

function renderDomainSection(section) {
  const cases = section.cases.map(renderCaseCard).join('');
  return `
    <section class="flow-section" id="section-${section.id}" data-section="${section.id}" aria-labelledby="title-${section.id}">
      <div class="section-inner">
        <span class="section-marker mono">${escapeHtml(section.marker)}</span>
        <span class="section-domain mono">${escapeHtml(section.domain)}</span>
        <h2 class="section-title" id="title-${section.id}">${renderTitle(section.title)}</h2>
        <p class="section-desc">${escapeHtml(section.desc)}</p>
        ${cases}
      </div>
    </section>
  `;
}

function renderSection(section, profile) {
  switch (section.type) {
    case 'operate':
      return renderOperateSection(section);
    case 'record':
      return renderRecordSection(section);
    case 'contact':
      return renderContactSection(section, profile);
    default:
      return renderDomainSection(section);
  }
}

function renderPage() {
  if (!data || !flowTrack) return;

  const { profile } = data;
  const sectionData = getSectionData();
  sectionDataCache = sectionData;
  sectionCount = sectionData.length;

  const heroLabel = document.querySelector('.hero-label');
  const heroTitle = document.querySelector('.hero-title');
  const heroDesc = document.querySelector('.hero-desc');
  const heroSecondary = document.querySelector('.hero-secondary');
  const heroDomains = document.querySelector('.hero-domains');
  const heroProof = document.querySelector('.hero-proof');
  const navName = document.querySelector('.nav-name');
  const navRole = document.querySelector('.nav-role');
  const navCta = document.querySelector('.nav-cta');

  if (navName) navName.textContent = profile.name;
  if (navRole) navRole.textContent = profile.role;
  if (navCta) navCta.href = `mailto:${profile.email}`;
  if (heroLabel) heroLabel.textContent = profile.heroLabel;
  if (heroTitle) {
    heroTitle.innerHTML = `${escapeHtml(profile.heroTitle)}<br>${escapeHtml(profile.heroTitleLine2)}<br><span class="title-accent">${escapeHtml(profile.heroTitleAccent)}</span>`;
  }
  if (heroDesc) heroDesc.textContent = profile.heroDesc;
  if (heroSecondary) heroSecondary.textContent = profile.heroSecondary;
  if (heroProof) heroProof.textContent = `${profile.currentRole} · ${profile.availability}`;
  if (heroDomains) {
    const domains = profile.domains;
    const isRich = domains.length > 0 && typeof domains[0] === 'object';
    const domainItems = isRich ? domains : domains.map((label) => ({ label, sectionId: 'fintech' }));
    heroDomains.innerHTML = domainItems
      .map((domain) => {
        if (isSoftTheme) {
          return `
            <button type="button" class="domain-chip" data-goto="${escapeHtml(domain.sectionId)}">
              ${escapeHtml(domain.label)}
            </button>
          `;
        }
        return `<span>${escapeHtml(domain.label)}</span>`;
      })
      .join('');
  }

  flowTrack.innerHTML = sectionData.map((section) => renderSection(section, profile)).join('');

  document.getElementById('recordExpand')?.addEventListener('click', expandRecordClients);

  if (progressDots) {
    progressDots.innerHTML = sectionData
      .map(
        (section, index) => `
          <button
            type="button"
            class="dot${index === 0 ? ' dot--active' : ''}"
            data-section="${section.id}"
            data-index="${index}"
            aria-label="Go to ${escapeHtml(section.domain)}"
          ></button>
        `
      )
      .join('');
  }

  if (progressKeys) {
    progressKeys.textContent = `Keys 1–${sectionCount}`;
  }

  if (progressFill) {
    progressFill.style.width = `${100 / sectionCount}%`;
  }

  flowTrack.style.width = `${sectionCount * 100}vw`;
}

function updateProgressUI(sectionIndex) {
  const clamped = Math.max(0, Math.min(sectionCount - 1, sectionIndex));
  const progress = sectionCount > 1 ? clamped / (sectionCount - 1) : 0;
  const current = sectionDataCache[clamped];

  if (progressFill) {
    progressFill.style.transform = `translateX(${progress * (sectionCount - 1) * 100}%)`;
  }

  if (progressLabel && current) {
    progressLabel.textContent = `${current.marker} · ${current.domain}`;
  }

  dots().forEach((dot, i) => {
    dot.classList.toggle('dot--active', i === clamped);
    dot.setAttribute('aria-current', i === clamped ? 'step' : 'false');
  });

  document.body.dataset.flowSection = sections()[clamped]?.dataset.section ?? '';
}

function expandRecordClients() {
  recordClientsExpanded = true;
  document.querySelectorAll('.client-row.is-collapsed').forEach((row) => {
    row.classList.remove('is-collapsed');
  });
  const btn = document.getElementById('recordExpand');
  if (btn) btn.hidden = true;
}

function getFlowScrollTrigger() {
  return flowScrollTrigger || ScrollTrigger.getAll().find((trigger) => trigger.vars?.id === 'flowScroll');
}

function goToSection(index) {
  const clamped = Math.max(0, Math.min(sectionCount - 1, index));
  const trigger = getFlowScrollTrigger();

  if (trigger) {
    const progress = sectionCount > 1 ? clamped / (sectionCount - 1) : 0;
    const targetY = trigger.start + progress * (trigger.end - trigger.start);
    window.scrollTo({ top: targetY, behavior: reduceMotion ? 'auto' : 'smooth' });
    updateProgressUI(clamped);
    return;
  }

  const sectionWidth = flowTrack.clientWidth / sectionCount;
  flowTrack.scrollTo({
    left: clamped * sectionWidth,
    behavior: reduceMotion ? 'auto' : 'smooth'
  });
  updateProgressUI(clamped);
}

function goToSectionById(sectionId) {
  const index = sectionDataCache.findIndex((section) => section.id === sectionId);
  if (index >= 0) goToSection(index);
}

function parseDeepLink() {
  const hash = window.location.hash.replace(/^#/, '');
  const params = new URLSearchParams(window.location.search);
  const panel = params.get('panel') || hash;
  if (!panel) return;

  const index = sectionDataCache.findIndex((section) => section.id === panel);
  if (index < 0) return;

  const stage = document.getElementById('flowStage');
  if (stage && window.scrollY < stage.offsetTop - 40) {
    window.scrollTo({ top: stage.offsetTop, behavior: 'auto' });
    window.requestAnimationFrame(() => {
      ScrollTrigger?.refresh();
      goToSection(index);
    });
    return;
  }

  goToSection(index);
}

function bindGotoControls() {
  document.addEventListener('click', (event) => {
    const goto = event.target.closest('[data-goto]');
    if (!goto) return;
    event.preventDefault();
    const sectionId = goto.dataset.goto;
    const stage = document.getElementById('flowStage');
    if (stage && window.scrollY < stage.offsetTop - 40) {
      stage.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      window.setTimeout(() => goToSectionById(sectionId), reduceMotion ? 0 : 450);
    } else {
      goToSectionById(sectionId);
    }
  });
}

function showFlowMobileHint() {
  if (!flowMobileHint || reduceMotion) return;
  if (window.sessionStorage.getItem('flow-soft-hint-v1')) return;
  window.sessionStorage.setItem('flow-soft-hint-v1', '1');
  flowMobileHint.hidden = false;
  window.setTimeout(() => {
    flowMobileHint.hidden = true;
  }, 4200);
}

function initFlowStageHint() {
  const stage = document.getElementById('flowStage');
  if (!stage || !flowMobileHint) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          showFlowMobileHint();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.35 }
  );
  observer.observe(stage);
}

function bindDotNavigation() {
  progressDots?.addEventListener('click', (event) => {
    const dot = event.target.closest('.dot');
    if (!dot) return;
    goToSection(Number(dot.dataset.index));
  });
}

function bindKeyboardNavigation() {
  document.addEventListener('keydown', (event) => {
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;

    const trigger = getFlowScrollTrigger();
    let currentSection = 0;

    if (trigger) {
      const progress = trigger.progress;
      currentSection = Math.min(sectionCount - 1, Math.round(progress * (sectionCount - 1)));
    } else {
      const sectionWidth = flowTrack.clientWidth / sectionCount;
      currentSection = Math.round(flowTrack.scrollLeft / sectionWidth);
    }

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      goToSection(currentSection + 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      goToSection(currentSection - 1);
    } else if (event.key >= '1' && event.key <= String(sectionCount)) {
      goToSection(Number(event.key) - 1);
    }
  });
}

function initHorizontalScroll() {
  if (!flowTrack || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const getScrollDistance = () => flowTrack.scrollWidth - window.innerWidth;

  if (!reduceMotion) {
    horizontalTween = gsap.to(flowTrack, {
      x: () => -getScrollDistance(),
      ease: 'none',
      scrollTrigger: {
        id: 'flowScroll',
        trigger: '.flow-stage',
        start: 'top top',
        end: () => `+=${getScrollDistance()}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const sectionIndex = Math.min(
            sectionCount - 1,
            Math.round(self.progress * (sectionCount - 1))
          );
          updateProgressUI(sectionIndex);
        }
      }
    });

    flowScrollTrigger = horizontalTween.scrollTrigger;

    const orbs = document.querySelectorAll('.grad-orb');
    if (orbs.length >= 3) {
      gsap.to(orbs[0], {
        y: -100,
        scrollTrigger: { trigger: '.flow-hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
      });
      gsap.to(orbs[1], {
        y: -60,
        scrollTrigger: { trigger: '.flow-hero', start: 'top top', end: 'bottom top', scrub: 2 }
      });
      gsap.to(orbs[2], {
        y: -40,
        scrollTrigger: { trigger: '.flow-hero', start: 'top top', end: 'bottom top', scrub: 1 }
      });
    }

    const revealSelector =
      '.section-marker, .section-domain, .section-title, .section-desc, .section-case, ' +
      '.principle-row, .credential-block, .stack-strip, .record-panel, .field-note, ' +
      '.github-panel, .contact-options, .contact-context, .contact-current, .contact-note, .chess-note';

    sections().forEach((section) => {
      const content = section.querySelectorAll(revealSelector);
      if (!content.length) return;

      gsap.fromTo(
        content,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: DUR_BASE,
          stagger: 0.06,
          ease: SPRING,
          scrollTrigger: {
            trigger: section,
            containerAnimation: horizontalTween,
            start: 'left 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  } else {
    flowTrack.style.overflowX = 'auto';

    const updateProgress = () => {
      const sectionWidth = flowTrack.clientWidth / sectionCount;
      const sectionIndex = Math.min(
        sectionCount - 1,
        Math.round(flowTrack.scrollLeft / sectionWidth)
      );
      updateProgressUI(sectionIndex);
    };

    flowTrack.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }
}

function initLoadChoreography() {
  if (typeof gsap === 'undefined' || reduceMotion) return;

  const tl = gsap.timeline({ delay: 0.1 });
  tl.from('.hero-nav', { y: -16, opacity: 0, duration: DUR_BASE, ease: SPRING })
    .from('.hero-label', { y: 12, opacity: 0, duration: DUR_BASE, ease: SPRING }, '-=0.1')
    .from('.hero-title', { y: 28, opacity: 0, duration: DUR_SLOW, ease: SPRING }, '-=0.1')
    .from('.hero-desc', { y: 18, opacity: 0, duration: DUR_BASE, ease: SPRING }, '-=0.2');

  if (isSoftTheme || document.querySelector('.hero-secondary')) {
    tl.from('.hero-secondary', { y: 14, opacity: 0, duration: DUR_BASE, ease: SPRING }, '-=0.18')
      .from('.hero-proof', { y: 12, opacity: 0, duration: DUR_BASE, ease: SPRING }, '-=0.15')
      .from('.hero-ctas .hero-cta', { y: 10, opacity: 0, duration: DUR_BASE, stagger: 0.06, ease: SPRING }, '-=0.14')
      .from('.hero-domains .domain-chip', { y: 10, opacity: 0, duration: DUR_BASE, stagger: 0.04, ease: SPRING }, '-=0.12');
  } else {
    tl.from('.hero-stats .stat', { y: 16, opacity: 0, duration: DUR_BASE, stagger: 0.1, ease: SPRING }, '-=0.15')
      .from('.hero-domains span', { y: 10, opacity: 0, duration: DUR_BASE, stagger: 0.04, ease: SPRING }, '-=0.12');
  }

  tl.from('.scroll-hint', { opacity: 0, duration: DUR_BASE, ease: SPRING }, '-=0.1');
}

renderPage();
bindDotNavigation();
bindKeyboardNavigation();
bindGotoControls();
initHorizontalScroll();
initLoadChoreography();
initFlowStageHint();
updateProgressUI(0);

window.requestAnimationFrame(() => {
  ScrollTrigger?.refresh();
  parseDeepLink();
});

window.addEventListener('resize', () => {
  ScrollTrigger?.refresh();
});

window.addEventListener('hashchange', parseDeepLink);
