/* French locale overlay for the operator board. Loaded after flow-data.js on /fr. */
window.applyFlowLocale({
  locale: 'fr',

  paths: {
    work: '/fr/work',
    writing: '/fr/writing',
    homeEn: '/',
    homeFr: '/fr'
  },

  ui: {
    bootLines: ['Ouverture de la session', 'Indexation du registre', 'Surface de preuve prête'],
    greetings: {
      late: 'Encore au travail',
      morning: 'Bonjour',
      afternoon: 'Bon après-midi',
      evening: 'Bonsoir'
    },
    copyFailed: 'Copie impossible',
    copied: 'Copié',
    copiedWithLabel: '{label} copié',
    openPrefix: 'Ouvrir',
    proofTypes: {
      report: 'Rapport',
      case: 'Étude de cas',
      link: 'Site en ligne',
      project: 'Projet'
    },
    openCaseStudy: 'Ouvrir l\'étude de cas',
    visitLiveProject: 'Voir le projet en ligne',
    anchorCase: 'Cas principal',
    judgmentCase: 'Cas de jugement',
    fullRecord: 'Registre complet',
    expandFullRecord: 'Ouvrir le registre complet',
    expandFullRecordMore: 'Ouvrir le registre complet, inclut {count} projets clients de plus',
    ledgerMore: '+{count} de plus',
    ledgerSubtitle: '{employers} employeurs · {clients} projets clients',
    essayKicker: 'Essai',
    readEssay: 'Lire l\'essai',
    collapseComms: 'Réduire le panneau contact',
    expandComms: 'Développer le panneau contact',
    themeLight: 'Passer en mode clair',
    themeDark: 'Passer en mode sombre',
    localeSwitchToFr: 'Passer en français',
    localeSwitchToEn: 'Passer en anglais',
    localeTitleFr: 'Version française',
    localeTitleEn: 'English version'
  },

  profile: {
    role: 'Ingénieur systèmes produit',
    currentRole: 'Opérateur technique senior · Everest Finance',
    availability: 'Deux créneaux clients · T3 2026',
    availabilityNote:
      'Meilleur fit : fondateurs et équipes qui remplacent des opérations tableur par un logiciel interne ciblé. Réponse sous 48 h, lun–ven.',
    openLabel: 'Disponible pour de nouveaux mandats',
    intro:
      'Bonjour, je suis Aliou. Je construis le logiciel qui fait tourner une entreprise en silence : outils internes, tableaux de bord et CRM sur lesquels votre équipe s\'appuie chaque jour, sans que les clients ne les voient.',
    repliesNote: 'Je lis chaque message et réponds sous un jour ouvré, du lundi au vendredi.',
    offClock:
      'Hors horaires, je joue aux échecs en compétition (2043 bullet). Même réflexe que livrer sous deadline : lire vite, trancher, rester calme.',
    photoAlt: 'Aliou Wade, ingénieur systèmes produit',
    heroLabel: 'Ingénieur systèmes produit · Dakar · FR / EN',
    heroTitle: 'Je construis les systèmes',
    heroTitleLine2: 'qui font tourner',
    heroTitleAccent: 'les opérations.',
    heroDesc:
      'Logiciels opérationnels pour fintechs et entreprises à forte charge opérationnelle : outils internes, consolidation CRM, modules ERP et workflows métier. Depuis Dakar, bilingue FR/EN.',
    heroSecondary:
      'Consolidation en cours chez Everest Finance (site public, CRM, Sama Naffa). Auparavant localisation Odoo 18 et tests d\'acceptation chez ERGOBIT.',
    domains: [
      { label: 'Fintech', sectionId: 'fintech' },
      { label: 'ERP / QA', sectionId: 'erp' },
      { label: 'Systèmes', sectionId: 'systems' },
      { label: 'Logistique', sectionId: 'record' },
      { label: 'Éducation', sectionId: 'record' },
      { label: 'Mobile', sectionId: 'record' }
    ]
  },

  principles: [
    {
      label: 'Workflow d\'abord',
      body: 'J\'apprends le processus avant de choisir la stack. Les personnes, contraintes et handoffs décident de l\'architecture.'
    },
    {
      label: 'Livrer petit, livrer réel',
      body: 'Un incrément en production bat un grand plan au tableau. Les fondateurs ont besoin de signal, pas de slides.'
    },
    {
      label: 'Laisser runnable',
      body: 'Docs, outils admin, logs, cas limites. Le logiciel survit au lancement.'
    }
  ],

  writing: {
    title: 'Pourquoi j\'ai arrêté de construire des frameworks pour livrer des systèmes',
    summary:
      'Sur le passage de l\'infrastructure abstraite aux logiciels opérationnels dont les entreprises dépendent réellement.',
    slug: 'why-systems-over-frameworks',
    relatedCase: 'bocalbun-retrospective'
  },

  chess: {
    bullet: '2043',
    blitz: '1856',
    note: 'En ligne compétitif. Même compétences que livrer sous deadline : lire vite, choisir, rester calme.'
  },

  employers: [
    {
      period: '2025 → maintenant',
      name: 'Everest Finance',
      web: 'everestfinance.sn',
      logo: 'logos/everest-finance.png',
      role: 'Contractuel → CDI · opérateur technique solo',
      proof: 'Site public, CRM et Sama Naffa vers un seul modèle opérationnel.',
      proofPreview: {
        type: 'case',
        slug: 'everest-finance',
        label: 'Ouvrir l\'étude de cas',
        title: 'Everest Finance',
        excerpt: 'Trois produits unifiés sur un schéma PostgreSQL — site public, CRM et Sama Naffa.',
        meta: 'Cas principal · Fintech'
      }
    },
    {
      period: '2024 → T1 2026',
      name: 'ERGOBIT',
      web: 'ergobit.com',
      logo: 'logos/ergobit.png',
      role: 'Ingénierie logicielle · ERP et infra',
      proof: 'Modules ERP/BI sur mesure, CI/CD Azure DevOps, kit d\'acceptation Odoo 18.',
      proofPreview: {
        type: 'case',
        slug: 'odoo-testing-toolkit',
        label: 'Ouvrir l\'étude de cas',
        title: 'Kit de tests d\'acceptation Odoo 18',
        excerpt: 'Discipline d\'acceptation Robot + Playwright que les intégrateurs peuvent lancer à chaque branche.',
        meta: '39 tests · 9 suites'
      }
    },
    {
      period: '2023 → T2 2024',
      name: 'BankingBook Analytics',
      web: 'bbafintech.com',
      logo: 'logos/bbafintech.png',
      role: 'Ingénieur logiciel · contrat',
      proof: 'APIs open banking, i18n UEMOA, migration web et mail vers bbafintech.com.',
      proofPreview: {
        type: 'link',
        href: 'https://bbafintech.com',
        label: 'Voir le site en ligne',
        title: 'BankingBook Analytics',
        excerpt: 'APIs open banking et surfaces bilingues pour l\'ALM cloud-native UEMOA.',
        meta: 'bbafintech.com'
      }
    },
    {
      period: '2023',
      name: 'Purolator Digital Lab',
      web: 'purolator.com',
      logo: 'logos/purolator.png',
      role: 'COOP + contractuel à temps partiel · Ottawa',
      proof: 'CI/CD sur trois projets, outillage Power Automate, SDK tri de colis.',
      proofPreview: {
        type: 'report',
        href: '#purolator-coop-report',
        label: 'Ouvrir le rapport COOP',
        title: 'Purolator Digital Lab — dossier COOP',
        excerpt: 'Déploiement CI/CD, outillage Power Automate et notes d\'intégration SDK tri de colis.',
        meta: 'PDF · 18 pages · EN'
      }
    },
    {
      period: '2022',
      name: 'Orange Digital Lab',
      web: 'orange.com',
      logo: 'logos/orange-dc.jpg',
      role: 'Développement mobile · COOP',
      proof: 'App communauté fitness React Native, 1 000+ membres.',
      proofPreview: {
        type: 'report',
        href: '#orange-coop-report',
        label: 'Ouvrir le rapport de stage',
        title: 'Orange Digital Lab — COOP mobile',
        excerpt: 'App communauté fitness React Native livrée à plus de 1 000 membres.',
        meta: 'PDF · 22 pages · FR / EN'
      }
    },
    {
      period: '2019',
      name: 'ITech Solutions Afrique',
      logo: 'logos/itech-solutions.png',
      role: 'Stage IoT',
      proof: 'Géolocalisation sur Azure ; refonte planning réduisant les coûts système d\'environ 20 %.',
      proofPreview: {
        type: 'report',
        href: '#itech-internship-report',
        title: 'ITech Solutions — stage IoT',
        excerpt: 'Stack géolocalisation Azure et refonte planning réduisant les coûts d\'environ 20 %.',
        meta: 'PDF · 14 pages · FR'
      }
    }
  ],

  clients: [
    {
      name: 'Ndouckmane Transit',
      domain: 'Logistique',
      logo: 'logos/ndouckmane.svg',
      scope: 'Ops transitaire : expéditions, douane, tableaux de bord.',
      proofPreview: {
        type: 'link',
        href: '#ndouckmane-transit',
        label: 'Ouvrir le dossier projet',
        title: 'Ndouckmane Transit',
        excerpt: 'Suivi expéditions, workflows douane et tableaux de bord opérateurs.',
        meta: 'Plateforme ops interne'
      }
    },
    {
      name: 'EduPlan',
      domain: 'Éducation',
      logo: 'logos/eduplan.svg',
      scope: 'Ops scolaires K-12 : cours, emploi du temps, notes.',
      proofPreview: {
        type: 'link',
        href: '#eduplan',
        label: 'Ouvrir le dossier projet',
        title: 'EduPlan',
        excerpt: 'Cours, emploi du temps et notation pour les opérations scolaires K-12.',
        meta: 'Suite ops scolaire'
      }
    },
    {
      name: 'Gerpain',
      domain: 'Opérations',
      logo: 'logos/gerpain.svg',
      scope: 'Plateforme multi-boulangerie : stock, livraisons, employés, RBAC.',
      proofPreview: {
        type: 'link',
        href: '#gerpain',
        label: 'Ouvrir le dossier projet',
        title: 'Gerpain',
        excerpt: 'Stock multi-site, livraisons, employés et RBAC.',
        meta: 'Ops multi-sites'
      }
    },
    {
      name: 'Mansour Motors',
      domain: 'Automobile',
      web: 'mansourmotors.sn',
      logo: 'logos/mansour.png',
      scope: 'Site public concession et inventaire véhicules interne.',
      proofPreview: {
        type: 'link',
        href: 'https://mansourmotors.sn',
        label: 'Voir le projet en ligne',
        title: 'Mansour Motors',
        excerpt: 'Site public concession et inventaire véhicules interne.',
        meta: 'mansourmotors.sn'
      }
    },
    {
      name: 'Mamebimo',
      domain: 'Marketplace',
      web: 'mamebimo.com',
      logo: 'logos/mamebimo.png',
      scope: 'Réservation services à domicile, messagerie, paiements (produit Everest).',
      proofPreview: {
        type: 'link',
        href: 'https://mamebimo.com',
        label: 'Voir le projet en ligne',
        title: 'Mamebimo',
        excerpt: 'Réservation services à domicile, messagerie et paiements.',
        meta: 'mamebimo.com'
      }
    },
    {
      name: 'Asaaman',
      domain: 'Drone / IA',
      web: 'asaaman.com',
      logo: 'logos/asaaman.svg',
      scope: 'Recherche vidéo sémantique et workflows de surveillance.',
      proofPreview: {
        type: 'link',
        href: 'https://asaaman.com',
        label: 'Voir le projet en ligne',
        title: 'Asaaman',
        excerpt: 'Recherche vidéo sémantique et workflows de surveillance.',
        meta: 'asaaman.com'
      }
    },
    {
      name: 'Les Hirondelles',
      domain: 'Institution',
      logo: 'logos/les-hirondelles.svg',
      scope: 'Site scolaire avec CMS éditorial sur Convex.',
      proofPreview: {
        type: 'link',
        href: '#les-hirondelles',
        label: 'Ouvrir le dossier projet',
        title: 'Les Hirondelles',
        excerpt: 'Site scolaire avec CMS éditorial sur Convex.',
        meta: 'Web institutionnel + CMS'
      }
    },
    {
      name: 'Dakar Sport',
      domain: 'Retail',
      logo: 'logos/dakar-sport.jpg',
      scope: 'Surfaces retail et communauté pour une marque sport locale.',
      proofPreview: {
        type: 'link',
        href: '#dakar-sport',
        label: 'Ouvrir le dossier projet',
        title: 'Dakar Sport',
        excerpt: 'Surfaces retail et communauté pour une marque sport locale.',
        meta: 'Retail + communauté'
      }
    }
  ],

  sectionsSoft: [
    {
      id: 'fintech',
      marker: '01',
      domain: 'Fintech',
      type: 'domain',
      title: 'L\'argent bouge.\nLes systèmes doivent suivre.',
      desc:
        'Une fintech sénégalaise en zone UEMOA ne peut pas se permettre trois surfaces déconnectées. Site public, CRM interne et app client doivent partager le même modèle de compte.',
      cases: [
        {
          primary: true,
          label: 'Cas principal',
          title: 'Everest Finance',
          web: 'everestfinance.sn',
          logo: 'logos/everest-finance.png',
          caseStudySlug: 'everest-finance',
          period: '2024 → présent',
          role: 'Opérateur technique solo',
          summary:
            'Trois produits, aucune équipe d\'ingénierie. J\'ai unifié le site public, le CRM interne et l\'app client Sama Naffa sur un schéma PostgreSQL et des types TypeScript partagés.',
          outcome: 'Site public en ligne. CRM utilisé au quotidien. Sama Naffa en durcissement avant déploiement plus large.',
          meta: ['Next.js', 'React Native', 'PostgreSQL', 'Zod', 'Propriétaire solo'],
          metric: { value: '3', label: 'produits unifiés' }
        },
        {
          primary: false,
          title: 'BankingBook Analytics',
          web: 'bbafintech.com',
          logo: 'logos/bbafintech.png',
          period: '2023 → T2 2024',
          role: 'Ingénieur logiciel · contrat',
          summary:
            'APIs open banking pour ALM cloud-native en UEMOA, surfaces bilingues, migration web et mail vers bbafintech.com.',
          outcome: 'Couche API de niveau réglementaire qui a façonné mon approche de la consolidation Everest.',
          meta: ['Open banking', 'UEMOA', 'APIs']
        }
      ]
    },
    {
      id: 'erp',
      marker: '02',
      domain: 'ERP / QA',
      type: 'domain',
      title: 'Le comportement ERP\ndoit être testable.',
      desc:
        'Les migrations Odoo déplacent des opérations entières. La validation manuelle échoue en silence. J\'ai construit une discipline d\'acceptation que les intégrateurs peuvent lancer : tests lisibles, CI à chaque branche, sélecteurs qui survivent au drift UI.',
      cases: [
        {
          primary: true,
          label: 'Cas principal',
          title: 'Kit de tests d\'acceptation Odoo 18',
          web: 'ergobit.com',
          logo: 'logos/ergobit.png',
          caseStudySlug: 'odoo-testing-toolkit',
          period: '2024',
          role: 'Ingénieur logiciel · ERGOBIT',
          summary:
            'Mots-clés Robot Framework lisibles par les consultants fonctionnels. Playwright pilote le client OWL d\'Odoo. Suites smoke sous deux minutes ; validation complète ventes, achats, stock, RH et compta.',
          outcome: '39 tests en 9 suites. Cycle de validation passé d\'une journée entière à moins de quinze minutes.',
          meta: ['Robot Framework', 'Playwright', 'Azure DevOps', '39 tests', '9 suites'],
          metric: { value: '15m', label: 'cycle de validation' }
        },
        {
          primary: false,
          title: 'Comptabilité Africa GreenTec',
          web: 'africagreentec.com',
          logo: 'logos/africagreentec.png',
          period: '2024',
          role: 'Contrat · module Odoo',
          summary:
            'Automatisation comptable pour ERP de production : écritures récurrentes encodées, contrôles opérationnels, piste d\'audit sans ponts tableur.',
          outcome: 'Environ 80 % de saisie manuelle en moins. Plus de 10 000 enregistrements traités par jour en production.',
          meta: ['Odoo', 'Python', 'BI']
        }
      ]
    },
    {
      id: 'systems',
      marker: '03',
      domain: 'Systèmes',
      type: 'domain',
      title: 'Parfois l\'atout,\nc\'est de savoir s\'arrêter.',
      desc:
        'Les fondateurs ont besoin de jugement, pas seulement de vélocité. J\'ai construit un toolkit Bun avec moteur d\'entités, RLS et pistes d\'audit, puis l\'ai gelé quand les abstractions me servaient, pas un client en attente de résultats.',
      cases: [
        {
          primary: true,
          label: 'Cas de jugement',
          title: 'BocalBun',
          caseStudySlug: 'bocalbun-retrospective',
          period: '2022 → arrêt',
          role: 'Constructeur solo',
          summary:
            'Scaffolding Bun natif, couche entités typée, sécurité au niveau ligne, conventions CLI. Architecture propre, zéro adoption externe. La rétrospective documente quand rediriger l\'énergie.',
          outcome: 'Codebase gelée. Leçons appliquées à la structure repo Everest et aux conventions agent-ready.',
          meta: ['Bun', 'TypeScript', 'PostgreSQL', 'RLS'],
          metric: { value: '0', label: 'utilisateurs externes' },
          essaySlug: 'why-systems-over-frameworks'
        },
        {
          primary: false,
          title: 'Purolator Digital Lab',
          web: 'purolator.com',
          logo: 'logos/purolator.png',
          period: '2023 · Ottawa',
          role: 'COOP + contractuel à temps partiel',
          summary:
            'Migration CI/CD sur trois projets logistiques, outillage Power Automate et Azure DevOps, SDK tri de colis pour entrepôts.',
          outcome: 'Rythme de livraison enterprise avant les contrats fintech et ERP en Afrique de l\'Ouest.',
          meta: ['Azure DevOps', 'CI/CD', 'Logistique']
        }
      ]
    },
    {
      id: 'connect',
      marker: '04',
      domain: 'Contact',
      type: 'contact',
      title: 'Dites-moi ce que\nvous construisez.',
      desc:
        'Envoyez le contexte, la contrainte et la deadline. Je vous dirai vite si je suis le bon fit.'
    },
    {
      id: 'operate',
      marker: '05',
      domain: 'Méthode',
      type: 'operate',
      title: 'Partir du workflow,\npas du framework.',
      desc:
        'Comment je travaille quand l\'architecture n\'est pas le titre : principes, credentials et stack.'
    },
    {
      id: 'record',
      marker: '06',
      domain: 'Registre',
      type: 'record',
      title: 'Registre complet.',
      desc:
        'Timeline employeurs et projets clients à Dakar. Les cas principaux ci-dessus sont la preuve ; ceci est le registre compressé.'
    }
  ]
});
