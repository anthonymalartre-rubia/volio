// Data enrichissement pour les 6 cantons romands.
// Format compatible dept-data.js (réutilisation DeptContextBlock / DeptOverviewBlock).

const CANTON_DATA_CH = {
  'CH-GE': {
    population: '510 k',
    topCities: ['Genève', 'Carouge', 'Vernier', 'Lancy'],
    density: 'ultra-dense urbain international',
    keySectors: ['Banque privée', 'Organisations internationales (ONU, OMC, OMS)', 'Trading matières premières', 'Horlogerie'],
    economy: { tag: 'Hub international', comment: '~40 % d\'organisations internationales du monde (ONU Genève, OMS, OMC, CICR). Capitale mondiale du trading de matières premières.' },
    prospectingTip: 'Cycle décisionnel souvent multi-pays (HQ Genève + filiales mondiales). Ciblage CSP++ avec valeur contractuelle élevée mais cycle long.',
    notableCompanies: ['ONU Genève', 'PSA Group', 'JTI (Japan Tobacco)', 'Procter & Gamble HQ Europe', 'Mercuria Energy', 'Cargill International'],
    economicNote: 'PIB par habitant : 96 K CHF (3e canton suisse). Densité de millionnaires la plus élevée d\'Europe.',
  },
  'CH-VD': {
    population: '825 k',
    topCities: ['Lausanne', 'Yverdon-les-Bains', 'Montreux', 'Nyon', 'Vevey'],
    density: 'mixte urbain + Riviera lémanique',
    keySectors: ['Multinationales (HQ Europe)', 'Hôtellerie haut de gamme', 'Vin (Lavaux UNESCO)', 'Recherche (EPFL)'],
    economy: { tag: 'Vaud lémanique', comment: 'Plus grand canton romand. EPFL = top 20 mondial des unis. Nestlé HQ à Vevey, Logitech à Lausanne.' },
    prospectingTip: 'Lausanne pour la tech et la recherche, Riviera pour l\'hôtellerie premium, Nyon pour les multinationales (proximité Genève).',
    notableCompanies: ['Nestlé HQ (Vevey)', 'Logitech', 'EPFL', 'Cisco Lausanne', 'Tetra Pak', 'Philip Morris International'],
    economicNote: 'Logitech + Nestlé + EPFL = 50 000 emplois directs. Croissance démographique forte (+1,5 %/an).',
  },
  'CH-VS': {
    population: '350 k',
    topCities: ['Sion', 'Martigny', 'Sierre', 'Monthey'],
    density: 'rural montagne + vallée du Rhône',
    keySectors: ['Tourisme alpin (Verbier, Crans-Montana, Zermatt)', 'Hydroélectricité', 'Vin (Fendant, Petite Arvine)', 'Chimie (Lonza)'],
    economy: { tag: 'Valais alpin', comment: 'Top 5 mondial du tourisme ski. Vignoble suisse n°1. Lonza (Visp) = leader mondial de la chimie fine et biotech (Roche).' },
    prospectingTip: 'Tourisme premium hors saison (mai-juin, septembre-novembre). Lonza Visp pour la pharma/biotech.',
    notableCompanies: ['Lonza Group', 'Compagnie des Alpes (Verbier)', 'Téléverbier', 'Provins (vins)', 'Constellium Sierre'],
    economicNote: 'Plus grand vignoble suisse (5 200 ha). 30 % du PIB cantonal vient du tourisme.',
  },
  'CH-NE': {
    population: '175 k',
    topCities: ['Neuchâtel', 'La Chaux-de-Fonds', 'Le Locle'],
    density: 'mixte urbain horloger',
    keySectors: ['Horlogerie haut de gamme', 'Microtechnique', 'Tabac (Philip Morris)', 'Recherche (CSEM)'],
    economy: { tag: 'Neuchâtel horloger', comment: 'Berceau de l\'horlogerie suisse (La Chaux-de-Fonds UNESCO). CSEM = pôle de R&D microtechnique de référence mondiale.' },
    prospectingTip: 'Cluster horloger ultra-spécialisé : pour B2B services aux marques, cibler les fournisseurs et sous-traitants premium.',
    notableCompanies: ['Tag Heuer', 'Cartier Manufacture', 'Movado', 'CSEM', 'Philip Morris (Neuchâtel)', 'Métaux Précieux SA'],
    economicNote: 'La Chaux-de-Fonds = ville UNESCO planifiée pour l\'horlogerie. CSEM = 600 chercheurs.',
  },
  'CH-FR': {
    population: '330 k',
    topCities: ['Fribourg', 'Bulle', 'Estavayer-le-Lac'],
    density: 'mixte rural + universitaire',
    keySectors: ['Agroalimentaire (Cailler, Gruyère)', 'Industrie pharma', 'Université (UNIFR)'],
    economy: { tag: 'Fribourg bilingue', comment: 'Canton bilingue FR/DE (70 % francophone). Gruyère AOP, Cailler (Nestlé chocolat). Université de Fribourg trilingue.' },
    prospectingTip: 'Marché plus petit mais à fort pouvoir d\'achat. Cluster agroalimentaire haut de gamme (chocolat, fromage).',
    notableCompanies: ['Cailler Nestlé (chocolat)', 'Gruyère AOP', 'Vifor Pharma', 'Liebherr Suisse'],
    economicNote: 'Croissance démographique la plus forte de Suisse (+1,7 %/an). UNIFR = 10 000 étudiants.',
  },
  'CH-JU': {
    population: '74 k',
    topCities: ['Delémont', 'Porrentruy', 'Saignelégier'],
    density: 'rural',
    keySectors: ['Microtechnique (sous-traitance horlogère)', 'Élevage chevaux franches-montagnes', 'Frontalier France'],
    economy: { tag: 'Jura discret', comment: 'Plus petit et plus jeune canton suisse (créé en 1979). Tissu de PME microtechniques très spécialisées.' },
    prospectingTip: 'Marché de niche : ultra-ciblage indispensable. Cibler les sous-traitants horlogers et les PME industrielles.',
    notableCompanies: ['Cendres+Métaux (orfèvrerie médicale)', 'Schaublin Machines', 'Wermeille (boîtes montres)', 'Tornos'],
    economicNote: 'Plus petit canton romand mais densité de PME industrielles parmi les plus élevées d\'Europe.',
  },
};

export function getCantonData(code) {
  if (!code) return null;
  return CANTON_DATA_CH[code] || null;
}

export { CANTON_DATA_CH };
