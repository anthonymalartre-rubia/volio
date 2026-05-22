// Personas marketing : 6 landings ciblées par profil utilisateur.
// Format : { slug, title, h1, intro, badge, painPoints, useCases, idealPlan,
//            testimonialSector, ctaLabel, keyMetric }
//
// L'objectif : capter les recherches "outil de prospection pour [persona]"
// et convertir avec un message taillé sur les besoins du profil.

const PERSONAS = {
  'sdr': {
    slug: 'sdr',
    title: 'Outil de prospection pour SDR & commerciaux B2B — Prospectia',
    metaDescription: 'L\'outil le moins cher pour SDR : 19-99 €/mois. Découverte d\'entreprises Google Places + enrichissement email cascade. RGPD, export CSV pour HubSpot/Salesforce/Zoho. Multipliez vos meetings qualifiés.',
    badge: 'Pour les SDR & commerciaux B2B',
    h1: 'L\'outil de prospection que vos SDR vont adorer',
    intro: 'Vos SDR passent leur temps à chercher des contacts au lieu d\'envoyer des emails ? Prospectia leur livre 50 à 500 prospects qualifiés par jour, exportables direct dans votre CRM. À partir de 19 €/mois.',
    keyMetric: { value: '3×', label: 'plus de RDV qualifiés', sub: 'vs sourcing manuel' },
    painPoints: [
      'Apollo plafonne à 40 % de couverture en France — vos SDR se plaignent des emails périmés',
      'LinkedIn Sales Navigator coûte 99 €/SDR/mois et impose le sourcing manuel',
      'Vos SDR perdent 60 % de leur temps à chercher des contacts au lieu de prospecter',
    ],
    useCases: [
      { title: 'Sourcing par ICP', desc: 'Filtrez par secteur (150 cats) + zone géographique (101 dépts FR + 6 provinces BE) en 1 clic.' },
      { title: 'Export CRM-ready', desc: 'CSV format HubSpot / Salesforce / Zoho / Pipedrive sans transformation. Branchez et envoyez.' },
      { title: 'Cadence multicanal intégrée', desc: 'Envoi email Resend + SMS Twilio depuis Prospectia, sans repartir vers un outil de cadence.' },
      { title: 'Compliance RGPD native', desc: 'Filtre auto des emails personnels, opt-out 1-clic, pas de risque de mise en demeure CNIL.' },
    ],
    idealPlan: { name: 'Pro', price: '49', why: '5 000 prospects/mois + 2 000 enrichissements — idéal pour 2-3 SDR à temps plein.' },
    testimonialSector: 'Technologie & Digital',
    ctaLabel: 'Démarrer comme SDR',
  },

  'fondateurs': {
    slug: 'fondateurs',
    title: 'Outil de prospection pour fondateurs & solopreneurs — Prospectia',
    metaDescription: 'Outil de prospection pour fondateurs sans équipe sales. 19 €/mois, sans engagement, démarrez en 5 min. Trouvez 1 000 prospects qualifiés et lancez vos premières campagnes cold email + SMS.',
    badge: 'Pour les fondateurs early-stage',
    h1: 'La prospection pour les fondateurs qui n\'ont pas (encore) de SDR',
    intro: 'Avant d\'embaucher un SDR à 50 K€/an, prouvez votre product-market fit avec une vraie prospection. Prospectia vous donne 1 000 prospects qualifiés pour 19 €/mois, exportables ou contactables directement.',
    keyMetric: { value: '5 min', label: 'pour votre 1ère campagne', sub: 'sans onboarding chronophage' },
    painPoints: [
      'Vous devez prospecter MAIS aussi développer le produit, gérer la finance, recruter...',
      'Apollo à 99 $/mois pour un fondateur seul, ça pique',
      'Vous ne savez pas par où commencer ni quels secteurs cibler',
    ],
    useCases: [
      { title: 'Test rapide d\'hypothèses ICP', desc: 'Lancez 5 segments en parallèle (par secteur, par dept) pour identifier votre meilleur PMF.' },
      { title: 'Recherche en langage naturel', desc: '"Restaurants gastronomiques à Lyon avec > 4,5/5" — l\'IA Claude convertit en filtres.' },
      { title: 'Campagne cold email intégrée', desc: 'Pas besoin de Lemlist en plus : envoi via le module campagne avec templating et footer RGPD auto.' },
      { title: 'API publique pour automatisation', desc: 'Branchez via Zapier ou Make sur vos workflows (HubSpot, Notion, Airtable...).' },
    ],
    idealPlan: { name: 'Solo', price: '19', why: '1 000 prospects + 400 enrichissements/mois — parfait pour valider le marché.' },
    testimonialSector: 'Technologie & Digital',
    ctaLabel: 'Lancer comme fondateur',
  },

  'agences-web': {
    slug: 'agences-web',
    title: 'Outil de prospection pour agences web & digitales — Prospectia',
    metaDescription: 'Trouvez les prospects de votre agence web : entreprises avec site obsolète, sans site, ou en croissance. Filtres précis par secteur + dept. 19 €/mois, export CSV pour vos campagnes.',
    badge: 'Pour les agences web & digitales',
    h1: 'Votre prochaine cliente est ici — trouvez-la avant vos concurrents',
    intro: 'Les agences web qui durent sont celles qui prospectent en continu. Prospectia vous fournit des listes ciblées d\'entreprises locales avec leur email et téléphone, prêtes à recevoir votre proposition de refonte ou de SEO.',
    keyMetric: { value: '85 %', label: 'taux de couverture email', sub: 'sur les TPE/PME avec site web' },
    painPoints: [
      'Vous ciblez les PME du tertiaire mais vos outils US ne trouvent pas leurs emails',
      'Le bouche-à-oreille a ses limites — il faut sortir et prospecter',
      'LinkedIn Sales Navigator c\'est cher pour une agence < 5 freelances',
    ],
    useCases: [
      { title: 'Sourcing par secteur + ville', desc: 'Cabinets d\'avocats à Lyon, restaurants à Marseille, kinés à Bordeaux... votre cible est là.' },
      { title: 'Détection sites obsolètes', desc: 'Notre scraping identifie les entreprises avec un site mais sans HTTPS, sans mobile-friendly — opportunités refonte.' },
      { title: 'Campagne de pitch sur-mesure', desc: 'Templating {{first_name}} + {{company}} + {{custom.secteur}} = email contextualisé qui convertit.' },
      { title: 'Multi-canal pitch + relance', desc: 'Email D+0, SMS D+3, email D+7 — séquence intégrée dans Prospectia.' },
    ],
    idealPlan: { name: 'Pro', price: '49', why: '5 000 prospects/mois — vous pouvez cibler 3-4 secteurs/villes en parallèle.' },
    testimonialSector: 'Technologie & Digital',
    ctaLabel: 'Trouver mes clients agence',
  },

  'cabinets-rh': {
    slug: 'cabinets-rh',
    title: 'Outil de prospection pour cabinets de recrutement & RH — Prospectia',
    metaDescription: 'Trouvez les entreprises qui recrutent dans votre secteur. 150 catégories, 101 départements, contacts des DRH et fondateurs. À partir de 19 €/mois — export CSV pour vos campagnes recrutement.',
    badge: 'Pour les cabinets de recrutement',
    h1: 'Identifiez les entreprises qui ont besoin de recruter — avant vos concurrents',
    instructionFn: null,
    intro: 'Les cabinets de recrutement gagnent des mandats en prospectant les entreprises en croissance avant qu\'elles ne lancent leur appel d\'offres. Prospectia vous livre les bons contacts : DRH, fondateurs, responsables opérationnels par secteur et zone.',
    keyMetric: { value: '+40 %', label: 'de mandats signés', sub: 'vs sourcing LinkedIn seul' },
    painPoints: [
      'Vous prospectez les DRH mais l\'info contact n\'est pas publique sur LinkedIn',
      'Les entreprises qui recrutent activement ne se signalent pas — il faut sortir et prospecter',
      'Vos commerciaux passent 70 % de leur temps à chercher au lieu de pitcher',
    ],
    useCases: [
      { title: 'Cibler les entreprises en hyper-croissance', desc: 'Filtre par taille (PME, ETI) et secteur — celles qui recrutent le plus.' },
      { title: 'Contacts DRH + dirigeants', desc: 'Pas juste les standards : on récupère les emails directs des décideurs paie/RH.' },
      { title: 'Pitch automatisé contextualisé', desc: '"Bonjour {{first_name}}, je vois que {{company}} grandit dans {{secteur}}. On a 3 candidats parfaits pour vos profils [X]."' },
      { title: 'Multi-canal email + LinkedIn', desc: 'Coordonnez l\'envoi cold email + LinkedIn outreach depuis le même tableau.' },
    ],
    idealPlan: { name: 'Pro', price: '49', why: '5 000 prospects/mois — couvre 2-3 secteurs verticaux complets.' },
    testimonialSector: 'Services aux entreprises',
    ctaLabel: 'Trouver les entreprises qui recrutent',
  },

  'freelances': {
    slug: 'freelances',
    title: 'Outil de prospection pour freelances B2B — Prospectia',
    metaDescription: 'L\'outil de prospection B2B pour freelances : 19 €/mois, sans engagement. 1 000 prospects qualifiés par mois, contacts directs, email + téléphone. Adieu Malt, bonjour le client en direct.',
    badge: 'Pour les freelances B2B',
    h1: 'Trouvez vos clients freelance en direct — sans plateforme à 15 % de commission',
    intro: 'Malt, Upwork, Comet prennent 10 à 20 % de votre TJM. Avec Prospectia à 19 €/mois, vous prospectez en direct les entreprises qui ont besoin de vos compétences, et vous gardez 100 % de votre marge.',
    keyMetric: { value: '0 %', label: 'de commission', sub: 'vs 10-20 % sur les plateformes' },
    painPoints: [
      'Malt prend 15 % de commission sur chaque mission > 100 K€ HT cumulé',
      'Les plateformes vous mettent en concurrence sur le prix',
      'Vous voulez choisir vos clients, pas attendre les briefs entrants',
    ],
    useCases: [
      { title: 'Sourcing ciblé', desc: 'Cherchez les entreprises qui matchent votre expertise : agences (designers), e-commerce (devs), industries (consultants).' },
      { title: 'Cold email pro contextualisé', desc: 'Templating + 20 modèles de cold email testés sur 50 000 envois inclus dans le PDF gratuit.' },
      { title: 'Pas d\'engagement', desc: 'Annulez en 1 clic le mois où vous avez votre carnet plein.' },
      { title: 'Compatible CRM léger', desc: 'Export CSV pour Notion, Airtable, Trello, ou direct dans Prospectia.' },
    ],
    idealPlan: { name: 'Solo', price: '19', why: '1 000 prospects + 400 enrichissements/mois — largement suffisant pour un freelance.' },
    testimonialSector: 'Technologie & Digital',
    ctaLabel: 'Démarrer comme freelance',
  },

  'sales-managers': {
    slug: 'sales-managers',
    title: 'Outil de prospection pour Sales Managers & VP Sales — Prospectia',
    metaDescription: 'Sales Managers : équipez votre équipe avec l\'outil de prospection le moins cher du marché. Multi-utilisateurs, API publique, conforme RGPD. 99 €/mois pour 10 SDR équipés.',
    badge: 'Pour les Sales Managers',
    h1: 'Équipez votre équipe sales avec le meilleur ratio coût/résultats',
    intro: 'Vous dirigez 5 à 50 SDR. Vous voulez les équiper d\'un outil de prospection puissant SANS faire exploser le budget. Prospectia coûte 19-99 €/mois (vs 4 000 €/an chez Apollo pour 10 SDR).',
    keyMetric: { value: '90 %', label: 'd\'économie', sub: 'vs Apollo Pro Suite pour 10 SDR' },
    painPoints: [
      'Apollo + Outreach + ZoomInfo = 800-1 500 € par SDR par mois',
      'Vos SDR perdent du temps à jongler entre 4 outils non synchronisés',
      'Le ROI sur outils sales tier-1 est devenu impossible à justifier en 2026',
    ],
    useCases: [
      { title: 'Multi-utilisateurs en 1 abonnement', desc: 'Tous vos SDR accèdent à la même base et aux mêmes campagnes — pas de licence par siège.' },
      { title: 'API publique pour intégration CRM', desc: 'Auto-push dans HubSpot / Salesforce / Pipedrive via Zapier ou notre API REST.' },
      { title: 'Reporting consolidé', desc: 'Vue d\'équipe : campagnes envoyées, taux d\'ouverture, RDV générés.' },
      { title: 'Conformité légale auditée', desc: 'Filtre RGPD, opt-out tracé, registre des traitements — votre DPO vous remerciera.' },
    ],
    idealPlan: { name: 'Business', price: '99', why: '10 000 prospects + 4 000 enrichissements/mois — équipe sales complète couverte.' },
    testimonialSector: 'Services aux entreprises',
    ctaLabel: 'Équiper mon équipe sales',
  },
};

export function getPersona(slug) {
  return PERSONAS[slug] || null;
}

export function getAllPersonas() {
  return Object.values(PERSONAS);
}

export { PERSONAS };
