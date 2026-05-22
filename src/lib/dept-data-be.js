// Data enrichissement pour les 6 provinces belges francophones.
// Format identique à dept-data.js (France) pour réutiliser DeptContextBlock
// et DeptOverviewBlock sans modification.

const PROVINCE_DATA_BE = {
  'BE-BRU': {
    population: '1,2 M',
    topCities: ['Bruxelles', 'Schaerbeek', 'Anderlecht'],
    density: 'ultra-dense urbain capitale',
    keySectors: ['Institutions européennes', 'Finance & assurance', 'Conseil'],
    economy: { tag: 'Capitale européenne', comment: 'Siège des institutions UE, Otan, Eurocontrol. 23 % du PIB belge sur 0,5 % du territoire.' },
    prospectingTip: 'Marché ultra-international : multi-langue (FR/NL/EN). Cibler les sièges sociaux et institutions, le tissu PME est plus restreint.',
    notableCompanies: ['Solvay HQ', 'AB InBev (Boulevard Saint-Lazare)', 'KBC Group', 'Engie Belgium'],
    economicNote: 'Bruxelles = 22 000 entreprises avec siège international, +700 000 emplois.',
  },
  'BE-WHT': {
    population: '1,35 M',
    topCities: ['Charleroi', 'Mons', 'La Louvière', 'Tournai'],
    density: 'mixte urbain-rural en reconversion',
    keySectors: ['Industrie reconvertie', 'Tertiaire', 'Aéronautique (Charleroi)'],
    economy: { tag: 'Hainaut en mutation', comment: 'Bassin industriel historique en reconversion vers le tertiaire et la tech. Charleroi accueille le 1er aéroport low-cost de Belgique.' },
    prospectingTip: 'Privilégier Charleroi (économie tech naissante) et Mons (BAM, IDETA). Marché en croissance après le pic industriel.',
    notableCompanies: ['Brussels South Charleroi Airport', 'Caterpillar', 'BAM Belgium', 'Sonaca Aerospace'],
    economicNote: 'Charleroi est la 3e ville économique belge après Bruxelles et Anvers.',
  },
  'BE-WLG': {
    population: '1,1 M',
    topCities: ['Liège', 'Verviers', 'Seraing', 'Herstal'],
    density: 'mixte urbain et zone industrielle',
    keySectors: ['Logistique (port de Liège)', 'Biotech', 'Métallurgie'],
    economy: { tag: 'Liège logistique', comment: '3e port intérieur d\'Europe + cluster biotech (GSK, Eurogentec, Mithra) + Liège Airport (1er cargo belge).' },
    prospectingTip: 'Liège = pôle biotech actif (recruteurs CRO, équipementiers pharma). Idéal pour B2B services scientifiques.',
    notableCompanies: ['GSK Vaccines', 'Eurogentec', 'Liège Airport Cargo', 'Mithra Pharmaceuticals'],
    economicNote: 'Liège accueille 1 600 entreprises tech + le campus universitaire le plus grand de Wallonie.',
  },
  'BE-WLX': {
    population: '290 k',
    topCities: ['Arlon', 'Bastogne', 'Marche-en-Famenne', 'Bouillon'],
    density: 'rural + frontalier Luxembourg',
    keySectors: ['Frontalier Luxembourg', 'Tourisme nature', 'Bois'],
    economy: { tag: 'Province de Luxembourg', comment: '50 000 frontaliers travaillent au Grand-Duché = pouvoir d\'achat important + besoin services. Tissu PME local + tourisme Ardennes.' },
    prospectingTip: 'Focus services aux frontaliers (mobilité, immobilier, conseil patrimonial) + tourisme Ardennes (hôtellerie, restauration).',
    notableCompanies: ['Cora Messancy', 'Brasserie d\'Achouffe', 'Spadel (eau Spa)', 'Idelux'],
    economicNote: 'Plus grande province belge en superficie mais la moins peuplée.',
  },
  'BE-WNA': {
    population: '500 k',
    topCities: ['Namur', 'Dinant', 'Andenne', 'Gembloux'],
    density: 'mixte chef-lieu wallon',
    keySectors: ['Administration (Parlement wallon)', 'Agriculture', 'Tourisme'],
    economy: { tag: 'Capitale de la Wallonie', comment: 'Siège du Gouvernement et du Parlement wallons + 60 000 fonctionnaires régionaux. Tissu PME + tourisme vallée de la Meuse.' },
    prospectingTip: 'B2G (services aux administrations wallonnes) + B2B PME locales. Cycle décisionnel plus long mais valeur contractuelle élevée.',
    notableCompanies: ['Gouvernement wallon', 'SPW (Service Public de Wallonie)', 'Citadelle de Namur'],
    economicNote: 'Namur concentre l\'administration wallonne + l\'Université de Gembloux (sciences agronomiques).',
  },
  'BE-WBR': {
    population: '410 k',
    topCities: ['Wavre', 'Nivelles', 'Braine-l\'Alleud', 'Louvain-la-Neuve'],
    density: 'résidentiel aisé',
    keySectors: ['Recherche (UCL, Louvain-la-Neuve)', 'Pharma', 'Tertiaire'],
    economy: { tag: 'Brabant wallon pro+', comment: 'Province la plus riche de Belgique (revenu médian le plus élevé). UCL = 2e université francophone d\'Europe. Hub pharma GSK + UCB.' },
    prospectingTip: 'Marché B2B premium : cibler R&D, biotech, services aux entreprises. Décideurs très éduqués, ICP CSP+.',
    notableCompanies: ['GSK Wavre', 'UCB Pharma', 'IBA (proton therapy)', 'UCL Université'],
    economicNote: 'Plus grand pôle pharma belge + écosystème start-ups Louvain-la-Neuve.',
  },
};

export function getProvinceData(code) {
  if (!code) return null;
  return PROVINCE_DATA_BE[code] || null;
}

export { PROVINCE_DATA_BE };
