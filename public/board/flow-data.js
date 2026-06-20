/* Flow content — MDX, messages/en.json, strategic + portfolio plans */

window.FLOW_DATA = {
  locale: 'en',

  paths: {
    work: '/work',
    writing: '/writing',
    homeEn: '/',
    homeFr: '/fr'
  },

  ui: {
    bootLines: ['Establishing session', 'Indexing work record', 'Proof surface ready'],
    greetings: {
      late: 'Working late',
      morning: 'Good morning',
      afternoon: 'Good afternoon',
      evening: 'Good evening'
    },
    copyFailed: 'Copy failed',
    copied: 'Copied',
    copiedWithLabel: '{label} copied',
    openPrefix: 'Open',
    proofTypes: {
      report: 'Report',
      case: 'Case study',
      link: 'Live site',
      project: 'Project'
    },
    openCaseStudy: 'Open case study',
    visitLiveProject: 'Visit live project',
    anchorCase: 'Anchor case',
    judgmentCase: 'Judgment case',
    fullRecord: 'Full record',
    expandFullRecord: 'Expand full work record',
    expandFullRecordMore: 'Expand full work record, includes {count} more client builds',
    ledgerMore: '+{count} more',
    ledgerSubtitle: '{employers} employers · {clients} client builds',
    essayKicker: 'Essay',
    readEssay: 'Read essay',
    collapseComms: 'Collapse contact panel',
    expandComms: 'Expand contact panel',
    themeLight: 'Switch to light mode',
    themeDark: 'Switch to dark mode',
    localeSwitchToFr: 'Switch to French',
    localeSwitchToEn: 'Switch to English',
    localeTitleFr: 'Version française',
    localeTitleEn: 'English version'
  },

  profile: {
    name: 'Aliou Wade',
    role: 'Product Systems Engineer',
    currentRole: 'Senior Technical Operator · Everest Finance',
    location: 'Dakar, Senegal',
    arc: 'Ottawa → Dakar',
    languages: 'FR / EN',
    timezone: 'WAT',
    email: 'wadealiou00@gmail.com',
    whatsapp: 'https://wa.me/221777228845',
    whatsappDisplay: '+221 777 228 845',
    linkedin: 'https://www.linkedin.com/in/aliouuuw',
    github: 'https://github.com/aliouuuw',
    availability: 'Two client slots · Q3 2026',
    availabilityNote:
      'Best fit: founders and teams replacing spreadsheet operations with focused internal software. Replies within 48h, Mon–Fri.',
    openLabel: 'Open to new work',
    intro:
      "Hi, I'm Aliou. I build the software that quietly runs a business: the internal tools, dashboards, and CRMs your team leans on every day but customers never see.",
    repliesNote: 'I read every message and reply within a day, Monday to Friday.',
    offClock:
      'Off the clock, I play competitive chess (2043 bullet). Same muscle as shipping on a deadline: read fast, commit, stay calm.',
    initials: 'AW',
    photo: 'Aliou.png',
    photoAlt: 'Aliou Wade, Product Systems Engineer',
    heroLabel: 'Product Systems Engineer · Dakar · FR / EN',
    heroTitle: 'I build the systems',
    heroTitleLine2: 'that make operations',
    heroTitleAccent: 'actually work.',
    heroDesc:
      'Operational software for fintechs and operations-heavy businesses: internal tools, CRM consolidation, ERP modules, and domain-specific workflows. From Dakar, bilingual FR/EN.',
    heroSecondary:
      'Currently consolidating Everest Finance (public site, CRM, Sama Naffa). Previously ERGOBIT Odoo 18 localization and acceptance testing.',
    domains: [
      { label: 'Fintech', sectionId: 'fintech' },
      { label: 'ERP / QA', sectionId: 'erp' },
      { label: 'Systems', sectionId: 'systems' },
      { label: 'Logistics', sectionId: 'record' },
      { label: 'Education', sectionId: 'record' },
      { label: 'Mobile', sectionId: 'record' }
    ]
  },

  principles: [
    {
      label: 'Workflow first',
      body: 'I learn the process before I pick the stack. People, constraints, and handoffs decide the architecture.'
    },
    {
      label: 'Ship small, ship real',
      body: 'A working increment in production beats a big plan on a whiteboard. Founders need signal, not slides.'
    },
    {
      label: 'Leave it runnable',
      body: 'Docs, admin tools, logs, edge cases. Software outlives the launch.'
    }
  ],

  credentials: {
    experience:
      'Six years shipping production software across fintech, ERP, logistics, mobile, IoT, and education.',
    education: [
      'B.Sc. Software Engineering, University of Ottawa',
      'B.Sc. Computer Science, DAUST'
    ],
    certifications: [
      'Odoo 18 Functional',
      'Meta Front-End Developer Professional',
      'Datacamp Python Data Science'
    ]
  },

  stack: [
    'TypeScript',
    'Python',
    'Next.js',
    'PostgreSQL',
    'Odoo 18',
    'Robot Framework',
    'Playwright',
    'Azure DevOps',
    'React Native'
  ],

  employers: [
    {
      period: '2025 → now',
      name: 'Everest Finance',
      web: 'everestfinance.sn',
      logo: 'logos/everest-finance.png',
      role: 'Contractor → full-time · solo technical operator',
      proof: 'Public site, CRM, and Sama Naffa toward one operating model.',
      proofPreview: {
        type: 'case',
        slug: 'everest-finance',
        label: 'Open case study',
        title: 'Everest Finance',
        excerpt: 'Three products unified on one PostgreSQL schema — public site, CRM, and Sama Naffa.',
        meta: 'Anchor case · Fintech'
      }
    },
    {
      period: '2024 → Q1 2026',
      name: 'ERGOBIT',
      web: 'ergobit.com',
      logo: 'logos/ergobit.png',
      role: 'Software engineering · ERP & infra',
      proof: 'Custom ERP/BI modules, Azure DevOps CI/CD, Odoo 18 acceptance kit.',
      proofPreview: {
        type: 'case',
        slug: 'odoo-testing-toolkit',
        label: 'Open case study',
        title: 'Odoo 18 Acceptance Testing Kit',
        excerpt: 'Robot + Playwright acceptance discipline integrators can run on every branch.',
        meta: '39 tests · 9 suites'
      }
    },
    {
      period: '2023 → Q2 2024',
      name: 'BankingBook Analytics',
      web: 'bbafintech.com',
      logo: 'logos/bbafintech.png',
      role: 'Software engineer · contract',
      proof: 'Open-banking APIs, UEMOA i18n, web and mail migration to bbafintech.com.',
      proofPreview: {
        type: 'link',
        href: 'https://bbafintech.com',
        label: 'Visit live site',
        title: 'BankingBook Analytics',
        excerpt: 'Open-banking APIs and bilingual surfaces for UEMOA cloud-native ALM.',
        meta: 'bbafintech.com'
      }
    },
    {
      period: '2023',
      name: 'Purolator Digital Lab',
      web: 'purolator.com',
      logo: 'logos/purolator.png',
      role: 'COOP + part-time contractor · Ottawa',
      proof: 'CI/CD across three projects, Power Automate tooling, package-sorter SDK.',
      proofPreview: {
        type: 'report',
        href: '#purolator-coop-report',
        label: 'Open COOP report',
        title: 'Purolator Digital Lab — COOP dossier',
        excerpt: 'CI/CD rollout, Power Automate tooling, and package-sorter SDK integration notes.',
        meta: 'PDF · 18 pages · EN'
      }
    },
    {
      period: '2022',
      name: 'Orange Digital Lab',
      web: 'orange.com',
      logo: 'logos/orange-dc.jpg',
      role: 'Mobile development · COOP',
      proof: 'React Native fitness community app, 1,000+ members.',
      proofPreview: {
        type: 'report',
        href: '#orange-coop-report',
        label: 'Open internship report',
        title: 'Orange Digital Lab — Mobile COOP',
        excerpt: 'React Native fitness community app shipped to 1,000+ members.',
        meta: 'PDF · 22 pages · FR / EN'
      }
    },
    {
      period: '2019',
      name: 'ITech Solutions Afrique',
      logo: 'logos/itech-solutions.png',
      role: 'IoT internship',
      proof: 'Geolocation on Azure; planning rework cut system costs ~20%.',
      proofPreview: {
        type: 'report',
        href: '#itech-internship-report',
        title: 'ITech Solutions — IoT internship',
        excerpt: 'Azure geolocation stack and planning rework that cut system costs ~20%.',
        meta: 'PDF · 14 pages · FR'
      }
    }
  ],

  clients: [
    {
      name: 'Ndouckmane Transit',
      domain: 'Logistics',
      logo: 'logos/ndouckmane.svg',
      scope: 'Freight forwarder ops: shipments, customs, dashboards.',
      proofPreview: {
        type: 'link',
        href: '#ndouckmane-transit',
        label: 'Open project dossier',
        title: 'Ndouckmane Transit',
        excerpt: 'Shipment tracking, customs workflows, and operator dashboards.',
        meta: 'Internal ops platform'
      }
    },
    {
      name: 'EduPlan',
      domain: 'Education',
      logo: 'logos/eduplan.svg',
      scope: 'K-12 school operations: courses, schedule, grading.',
      proofPreview: {
        type: 'link',
        href: '#eduplan',
        label: 'Open project dossier',
        title: 'EduPlan',
        excerpt: 'Courses, schedule, and grading for K-12 school operations.',
        meta: 'School operations suite'
      }
    },
    {
      name: 'Gerpain',
      domain: 'Operations',
      logo: 'logos/gerpain.svg',
      scope: 'Multi-bakery platform: inventory, deliveries, employees, RBAC.',
      proofPreview: {
        type: 'link',
        href: '#gerpain',
        label: 'Open project dossier',
        title: 'Gerpain',
        excerpt: 'Multi-bakery inventory, deliveries, employees, and RBAC.',
        meta: 'Multi-site operations'
      }
    },
    {
      name: 'Mansour Motors',
      domain: 'Automotive',
      web: 'mansourmotors.sn',
      logo: 'logos/mansour.png',
      scope: 'Dealership public site and internal vehicle inventory.',
      proofPreview: {
        type: 'link',
        href: 'https://mansourmotors.sn',
        label: 'Visit live project',
        title: 'Mansour Motors',
        excerpt: 'Dealership public site and internal vehicle inventory.',
        meta: 'mansourmotors.sn'
      }
    },
    {
      name: 'Mamebimo',
      domain: 'Marketplace',
      web: 'mamebimo.com',
      logo: 'logos/mamebimo.png',
      scope: 'Home-services booking, messaging, payouts (Everest product).',
      proofPreview: {
        type: 'link',
        href: 'https://mamebimo.com',
        label: 'Visit live project',
        title: 'Mamebimo',
        excerpt: 'Home-services booking, messaging, and payouts.',
        meta: 'mamebimo.com'
      }
    },
    {
      name: 'Asaaman',
      domain: 'Drone / AI',
      web: 'asaaman.com',
      logo: 'logos/asaaman.svg',
      scope: 'Semantic video search and surveillance workflows.',
      proofPreview: {
        type: 'link',
        href: 'https://asaaman.com',
        label: 'Visit live project',
        title: 'Asaaman',
        excerpt: 'Semantic video search and surveillance workflows.',
        meta: 'asaaman.com'
      }
    },
    {
      name: 'Les Hirondelles',
      domain: 'Institution',
      logo: 'logos/les-hirondelles.svg',
      scope: 'School site with Convex-backed editorial CMS.',
      proofPreview: {
        type: 'link',
        href: '#les-hirondelles',
        label: 'Open project dossier',
        title: 'Les Hirondelles',
        excerpt: 'School site with Convex-backed editorial CMS.',
        meta: 'Institutional web + CMS'
      }
    },
    {
      name: 'Dakar Sport',
      domain: 'Retail',
      logo: 'logos/dakar-sport.jpg',
      scope: 'Retail and community surfaces for a local sports brand.',
      proofPreview: {
        type: 'link',
        href: '#dakar-sport',
        label: 'Open project dossier',
        title: 'Dakar Sport',
        excerpt: 'Retail and community surfaces for a local sports brand.',
        meta: 'Retail + community'
      }
    }
  ],

  recordFeaturedClients: 4,

  writing: {
    title: 'Why I stopped building frameworks and started shipping systems',
    summary:
      'On the shift from abstract infrastructure to operational software businesses actually depend on.',
    slug: 'why-systems-over-frameworks',
    relatedCase: 'bocalbun-retrospective'
  },

  githubRepos: [
    { name: 'myportfolio', note: 'This site', lang: 'TypeScript' },
    { name: 'odoo18-acceptance-testing-kit', note: 'Robot + Playwright', lang: 'Python' },
    { name: 'agent-ready-repo', note: 'AI-collab conventions', lang: 'Markdown' },
    { name: 'bocalbun', note: 'Frozen retrospective', lang: 'TypeScript' }
  ],

  chess: {
    bullet: '2043',
    blitz: '1856',
    note: 'Competitive online. Same skills as shipping under deadline: read fast, pick a move, stay calm.'
  },

  caseStudySlugs: {
    'Everest Finance': 'everest-finance',
    'Odoo 18 Acceptance Testing Kit': 'odoo-testing-toolkit',
    'BocalBun': 'bocalbun-retrospective'
  },

  /* Original order — flow-pivot (dark) */
  sections: [
    {
      id: 'operate',
      marker: '01',
      domain: 'Operate',
      type: 'operate',
      title: 'Start from the workflow,\nnot the framework.',
      desc:
        'The useful work is often less glamorous than the architecture: a CRM state transition, a migration test that catches regressions, a CI pipeline that saves a team from manual checking.'
    },
    {
      id: 'fintech',
      marker: '02',
      domain: 'Fintech',
      type: 'domain',
      title: 'Money moves.\nSystems should keep up.',
      desc:
        'Senegalese fintech in the UEMOA zone cannot afford three disconnected surfaces. Public site, internal CRM, and customer app each need the same account model.',
      cases: [
        {
          primary: true,
          label: 'Anchor case',
          title: 'Everest Finance',
          caseStudySlug: 'everest-finance',
          period: '2024 → present',
          role: 'Solo technical operator',
          summary:
            'Three products, no engineering team. I unified the public website, internal CRM, and Sama Naffa customer app on one PostgreSQL schema and shared TypeScript types.',
          outcome: 'Public site live. CRM in daily use. Sama Naffa in hardening before wider rollout.',
          meta: ['Next.js', 'React Native', 'PostgreSQL', 'Zod', 'Solo owner'],
          metric: { value: '3', label: 'unified products' }
        },
        {
          primary: false,
          title: 'BankingBook Analytics',
          period: '2023 → Q2 2024',
          role: 'Software engineer · contract',
          summary:
            'Open-banking APIs for cloud-native ALM in UEMOA markets, bilingual surfaces, migration of web and mail to bbafintech.com.',
          outcome: 'Regulatory-grade API layer that shaped how I approached Everest consolidation.',
          meta: ['Open banking', 'UEMOA', 'APIs']
        }
      ]
    },
    {
      id: 'erp',
      marker: '03',
      domain: 'ERP / QA',
      type: 'domain',
      title: 'ERP behavior\nshould be testable.',
      desc:
        'Odoo migrations move entire business operations. Manual validation fails quietly. I built acceptance discipline integrators can run: keyword-readable tests, CI on every branch, selector rules that survive UI drift.',
      cases: [
        {
          primary: true,
          label: 'Anchor case',
          title: 'Odoo 18 Acceptance Testing Kit',
          caseStudySlug: 'odoo-testing-toolkit',
          period: '2024',
          role: 'Software engineer · ERGOBIT',
          summary:
            'Robot Framework keywords functional consultants can read. Playwright drives Odoo\'s OWL client. Smoke suites under two minutes; full validation across sales, purchase, inventory, HR, and accounting.',
          outcome: '39 tests in 9 suites. Validation cycle dropped from a full day to under fifteen minutes.',
          meta: ['Robot Framework', 'Playwright', 'Azure DevOps', '39 tests', '9 suites'],
          metric: { value: '15m', label: 'validation cycle' }
        },
        {
          primary: false,
          title: 'Africa GreenTec accounting',
          period: '2024',
          role: 'Contract · Odoo module',
          summary:
            'Accounting automation for production ERP: recurring journal patterns encoded, operational checks, audit trail without spreadsheet bridges.',
          outcome: '~80% less manual entry. 10,000+ records processed daily in production.',
          meta: ['Odoo', 'Python', 'BI']
        }
      ]
    },
    {
      id: 'systems',
      marker: '04',
      domain: 'Systems',
      type: 'domain',
      title: 'Sometimes the asset\nis knowing when to stop.',
      desc:
        'Founders need judgment, not only velocity. I built a Bun toolkit with entity engine, RLS, and audit trails, then froze it when the abstractions served me, not a customer waiting on outcomes.',
      cases: [
        {
          primary: true,
          label: 'Judgment case',
          title: 'BocalBun',
          caseStudySlug: 'bocalbun-retrospective',
          period: '2022 → stopped',
          role: 'Solo builder',
          summary:
            'Bun-native scaffolding, typed entity layer, row-level security, CLI conventions. Clean architecture, zero external adoption. The retrospective documents when to redirect energy.',
          outcome: 'Frozen codebase. Lessons applied to Everest repo structure and agent-ready conventions.',
          meta: ['Bun', 'TypeScript', 'PostgreSQL', 'RLS'],
          metric: { value: '0', label: 'external users' },
          essaySlug: 'why-systems-over-frameworks'
        },
        {
          primary: false,
          title: 'Purolator Digital Lab',
          period: '2023 · Ottawa',
          role: 'COOP + part-time contractor',
          summary:
            'CI/CD migration across three logistics projects, Power Automate and Azure DevOps tooling, package-sorter SDK for warehouse operations.',
          outcome: 'Enterprise delivery rhythm before West Africa fintech and ERP contracts.',
          meta: ['Azure DevOps', 'CI/CD', 'Logistics']
        }
      ]
    },
    {
      id: 'record',
      marker: '05',
      domain: 'Record',
      type: 'record',
      title: 'Where the work\nactually happened.',
      desc: 'Employers and contracts from Ottawa to Dakar. Featured client builds below.'
    },
    {
      id: 'connect',
      marker: '06',
      domain: 'Connect',
      type: 'contact',
      title: 'Tell me what\nyou\'re building.',
      desc:
        'Send context, constraint, and deadline. I will tell you quickly if I am the right fit.'
    }
  ],

  /* Proof-first order — flow-soft */
  sectionsSoft: [
    {
      id: 'fintech',
      marker: '01',
      domain: 'Fintech',
      type: 'domain',
      title: 'Money moves.\nSystems should keep up.',
      desc:
        'Senegalese fintech in the UEMOA zone cannot afford three disconnected surfaces. Public site, internal CRM, and customer app each need the same account model.',
      cases: [
        {
          primary: true,
          label: 'Anchor case',
          title: 'Everest Finance',
          web: 'everestfinance.sn',
          logo: 'logos/everest-finance.png',
          caseStudySlug: 'everest-finance',
          period: '2024 → present',
          role: 'Solo technical operator',
          summary:
            'Three products, no engineering team. I unified the public website, internal CRM, and Sama Naffa customer app on one PostgreSQL schema and shared TypeScript types.',
          outcome: 'Public site live. CRM in daily use. Sama Naffa in hardening before wider rollout.',
          meta: ['Next.js', 'React Native', 'PostgreSQL', 'Zod', 'Solo owner'],
          metric: { value: '3', label: 'unified products' }
        },
        {
          primary: false,
          title: 'BankingBook Analytics',
          web: 'bbafintech.com',
          logo: 'logos/bbafintech.png',
          period: '2023 → Q2 2024',
          role: 'Software engineer · contract',
          summary:
            'Open-banking APIs for cloud-native ALM in UEMOA markets, bilingual surfaces, migration of web and mail to bbafintech.com.',
          outcome: 'Regulatory-grade API layer that shaped how I approached Everest consolidation.',
          meta: ['Open banking', 'UEMOA', 'APIs']
        }
      ]
    },
    {
      id: 'erp',
      marker: '02',
      domain: 'ERP / QA',
      type: 'domain',
      title: 'ERP behavior\nshould be testable.',
      desc:
        'Odoo migrations move entire business operations. Manual validation fails quietly. I built acceptance discipline integrators can run: keyword-readable tests, CI on every branch, selector rules that survive UI drift.',
      cases: [
        {
          primary: true,
          label: 'Anchor case',
          title: 'Odoo 18 Acceptance Testing Kit',
          web: 'ergobit.com',
          logo: 'logos/ergobit.png',
          caseStudySlug: 'odoo-testing-toolkit',
          period: '2024',
          role: 'Software engineer · ERGOBIT',
          summary:
            'Robot Framework keywords functional consultants can read. Playwright drives Odoo\'s OWL client. Smoke suites under two minutes; full validation across sales, purchase, inventory, HR, and accounting.',
          outcome: '39 tests in 9 suites. Validation cycle dropped from a full day to under fifteen minutes.',
          meta: ['Robot Framework', 'Playwright', 'Azure DevOps', '39 tests', '9 suites'],
          metric: { value: '15m', label: 'validation cycle' }
        },
        {
          primary: false,
          title: 'Africa GreenTec accounting',
          web: 'africagreentec.com',
          logo: 'logos/africagreentec.png',
          period: '2024',
          role: 'Contract · Odoo module',
          summary:
            'Accounting automation for production ERP: recurring journal patterns encoded, operational checks, audit trail without spreadsheet bridges.',
          outcome: '~80% less manual entry. 10,000+ records processed daily in production.',
          meta: ['Odoo', 'Python', 'BI']
        }
      ]
    },
    {
      id: 'systems',
      marker: '03',
      domain: 'Systems',
      type: 'domain',
      title: 'Sometimes the asset\nis knowing when to stop.',
      desc:
        'Founders need judgment, not only velocity. I built a Bun toolkit with entity engine, RLS, and audit trails, then froze it when the abstractions served me, not a customer waiting on outcomes.',
      cases: [
        {
          primary: true,
          label: 'Judgment case',
          title: 'BocalBun',
          caseStudySlug: 'bocalbun-retrospective',
          period: '2022 → stopped',
          role: 'Solo builder',
          summary:
            'Bun-native scaffolding, typed entity layer, row-level security, CLI conventions. Clean architecture, zero external adoption. The retrospective documents when to redirect energy.',
          outcome: 'Frozen codebase. Lessons applied to Everest repo structure and agent-ready conventions.',
          meta: ['Bun', 'TypeScript', 'PostgreSQL', 'RLS'],
          metric: { value: '0', label: 'external users' },
          essaySlug: 'why-systems-over-frameworks'
        },
        {
          primary: false,
          title: 'Purolator Digital Lab',
          web: 'purolator.com',
          logo: 'logos/purolator.png',
          period: '2023 · Ottawa',
          role: 'COOP + part-time contractor',
          summary:
            'CI/CD migration across three logistics projects, Power Automate and Azure DevOps tooling, package-sorter SDK for warehouse operations.',
          outcome: 'Enterprise delivery rhythm before West Africa fintech and ERP contracts.',
          meta: ['Azure DevOps', 'CI/CD', 'Logistics']
        }
      ]
    },
    {
      id: 'connect',
      marker: '04',
      domain: 'Connect',
      type: 'contact',
      title: 'Tell me what\nyou\'re building.',
      desc:
        'Send context, constraint, and deadline. I will tell you quickly if I am the right fit.'
    },
    {
      id: 'operate',
      marker: '05',
      domain: 'Operate',
      type: 'operate',
      title: 'Start from the workflow,\nnot the framework.',
      desc:
        'How I work when the architecture is not the headline: principles, credentials, and stack.'
    },
    {
      id: 'record',
      marker: '06',
      domain: 'Record',
      type: 'record',
      title: 'Full work record.',
      desc:
        'Employer timeline and Dakar client builds. Anchor cases above are the proof; this is the compressed ledger.'
    }
  ]
};
