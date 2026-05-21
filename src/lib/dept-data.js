// Data enrichissement par département français — 101 entrées.
//
// Champs :
//   population    — habitants (text formaté "1.5 M")
//   topCities     — 3 villes principales [string]
//   density       — text qualitatif ("très dense urbain", "rural", "mixte")
//   keySectors    — 3 secteurs économiques phares [string]
//   economy       — { tag, comment } 1 phrase courte sur la dynamique éco
//   prospectingTip — conseil prospection spécifique au territoire (1 phrase)
//
// Sources : INSEE, CCI, données 2024. Les chiffres sont arrondis pour
// rester lisibles et conserver leur valeur sémantique.
//
// Note : les DOM (971, 972, 973, 974, 976) sont inclus. Beaucoup d'autres
// départements ont moins de data fine et héritent d'une entrée minimale —
// l'objectif est de créer du contenu unique combiné avec la catégorie,
// pas d'écrire une encyclopédie économique.

const DEPT_DATA = {
  // ───── Île-de-France ─────────────────────────────────
  '75': {
    population: '2,1 M',
    topCities: ['Paris'],
    density: 'ultra-dense urbain',
    keySectors: ['Finance', 'Médias', 'Services aux entreprises'],
    economy: { tag: 'Capitale économique', comment: '1ère place financière française, sièges sociaux du CAC 40, écosystème startup Station F.' },
    prospectingTip: 'Le marché est très saturé : la différenciation se fait sur la verticalisation (par secteur) et le timing parfait (cycle décisionnel paris très court).',
  },
  '77': { population: '1,4 M', topCities: ['Melun', 'Meaux', 'Chelles'], density: 'mixte péri-urbain + rural', keySectors: ['Logistique', 'Agro-alimentaire', 'Tourisme (Disneyland)'], economy: { tag: 'Logistique Paris-Est', comment: 'Hub logistique majeur grâce au pôle de Roissy et à la proximité Paris.' }, prospectingTip: 'Cibler les zones d\'activité (Sénart, Marne-la-Vallée) qui concentrent 60 % des entreprises.' },
  '78': { population: '1,4 M', topCities: ['Versailles', 'Saint-Germain-en-Laye', 'Mantes-la-Jolie'], density: 'résidentiel aisé', keySectors: ['Aéronautique', 'Tech', 'Services financiers'], economy: { tag: 'CSP+ Ouest parisien', comment: 'Population la plus aisée d\'Île-de-France hors Paris, fort écosystème B2B haut de gamme.' }, prospectingTip: 'B2B premium fonctionne bien — ICP CSP+ et dirigeants de PME.' },
  '91': { population: '1,3 M', topCities: ['Évry', 'Massy', 'Corbeil'], density: 'péri-urbain dynamique', keySectors: ['Recherche (Saclay)', 'Industrie pharma', 'Tech'], economy: { tag: 'Pôle Saclay', comment: 'Cluster scientifique et technologique de référence — Sanofi, CEA, École Polytechnique.' }, prospectingTip: 'Verticales R&D, biotech et deep tech sont prioritaires.' },
  '92': { population: '1,6 M', topCities: ['Boulogne-Billancourt', 'Nanterre', 'Neuilly-sur-Seine'], density: 'ultra-dense tertiaire', keySectors: ['Sièges sociaux', 'Finance', 'Conseil'], economy: { tag: 'La Défense', comment: '1er quartier d\'affaires européen, 180 000 emplois tertiaires.' }, prospectingTip: 'B2B grands comptes : cycle long, multi-stakeholders, signature en fin Q2 ou Q4.' },
  '93': { population: '1,7 M', topCities: ['Saint-Denis', 'Aubervilliers', 'Montreuil'], density: 'urbain populaire en transformation', keySectors: ['Logistique', 'Audiovisuel', 'Tertiaire en expansion'], economy: { tag: 'Grand Paris en chantier', comment: 'JO 2024 + Grand Paris Express ont déclenché un boom infrastructurel.' }, prospectingTip: 'BTP, services associés et logistique sont en forte croissance.' },
  '94': { population: '1,4 M', topCities: ['Créteil', 'Vitry-sur-Seine', 'Champigny'], density: 'urbain mixte', keySectors: ['Santé', 'Logistique (Rungis)', 'Services'], economy: { tag: 'Rungis', comment: 'Plus grand marché de produits frais du monde, 200 000 visiteurs/jour.' }, prospectingTip: 'Pour l\'agro-alimentaire, le 94 est incontournable.' },
  '95': { population: '1,2 M', topCities: ['Cergy', 'Argenteuil', 'Sarcelles'], density: 'péri-urbain', keySectors: ['Logistique aéroportuaire', 'Industrie', 'Tertiaire'], economy: { tag: 'Roissy-CDG', comment: 'Hub aéroportuaire qui structure toute l\'économie locale.' }, prospectingTip: 'Logistique, aéronautique et services associés à l\'aéroport.' },

  // ───── Auvergne-Rhône-Alpes ──────────────────────────
  '69': { population: '1,9 M', topCities: ['Lyon', 'Villeurbanne', 'Vénissieux'], density: 'ultra-dense urbain', keySectors: ['Sciences de la vie', 'Banque', 'Numérique'], economy: { tag: '2e métropole française', comment: 'Hub économique majeur — biotechs Lyon Biopôle, Crédit Agricole, OL Group.' }, prospectingTip: 'Lyon attire des sièges régionaux : démarcher les directions régionales des grands groupes.' },
  '01': { population: '660 k', topCities: ['Bourg-en-Bresse', 'Oyonnax', 'Ambérieu'], density: 'mixte rural-industriel', keySectors: ['Plasturgie (Oyonnax)', 'Agro-alimentaire', 'Tourisme'], economy: { tag: 'Plastics Vallée', comment: 'Premier pôle français de la plasturgie autour d\'Oyonnax.' }, prospectingTip: 'Pour l\'industrie plastique, le 01 concentre 700 entreprises spécialisées.' },
  '03': { population: '337 k', topCities: ['Moulins', 'Vichy', 'Montluçon'], density: 'rural', keySectors: ['Agriculture', 'Tourisme thermal (Vichy)', 'Métallurgie'], economy: { tag: 'Allier industriel', comment: 'Tradition métallurgique avec Aubert & Duval (super-alliages).' }, prospectingTip: 'Marché plus petit, prospection doit être très ciblée et personnalisée.' },
  '07': { population: '326 k', topCities: ['Privas', 'Annonay', 'Aubenas'], density: 'rural', keySectors: ['Tourisme', 'Industrie textile', 'Agriculture'], economy: { tag: 'Tourisme nature', comment: 'Économie touristique forte (gorges de l\'Ardèche, châtaignes AOP).' }, prospectingTip: 'Le tourisme et l\'agroalimentaire fermier sont les meilleurs angles d\'entrée.' },
  '15': { population: '143 k', topCities: ['Aurillac', 'Saint-Flour', 'Mauriac'], density: 'rural enclavé', keySectors: ['Élevage', 'Tourisme (Auvergne)', 'Coutellerie'], economy: { tag: 'Cantal vert', comment: 'Élevage extensif + AOP fromagères (Cantal, Salers, Bleu d\'Auvergne).' }, prospectingTip: 'Marché de niche : viser les coopératives et producteurs AOP.' },
  '26': { population: '524 k', topCities: ['Valence', 'Romans', 'Montélimar'], density: 'mixte', keySectors: ['Agroalimentaire', 'Aéronautique', 'Logistique vallée du Rhône'], economy: { tag: 'Carrefour vallée du Rhône', comment: 'Axe Paris-Marseille traverse le département, hub logistique.' }, prospectingTip: 'Logistique et agro-alimentaire sont vos meilleurs angles.' },
  '38': { population: '1,3 M', topCities: ['Grenoble', 'Saint-Martin-d\'Hères', 'Échirolles'], density: 'urbain + montagne', keySectors: ['Semi-conducteurs (STMicro)', 'Recherche (CEA)', 'Tourisme alpin'], economy: { tag: 'Grenoble Tech', comment: 'Capitale française des nanotechnologies et des semi-conducteurs.' }, prospectingTip: 'Deep tech, semi-conducteurs et énergies nouvelles sont prioritaires.' },
  '42': { population: '763 k', topCities: ['Saint-Étienne', 'Roanne', 'Andrézieux'], density: 'urbain industriel', keySectors: ['Design (Cité du Design)', 'Optique-mécanique', 'Textile'], economy: { tag: 'Saint-Étienne en mutation', comment: 'Reconversion réussie d\'une ville post-industrielle vers le design.' }, prospectingTip: 'Industries créatives et design sont des niches porteuses.' },
  '43': { population: '227 k', topCities: ['Le Puy-en-Velay', 'Yssingeaux', 'Brioude'], density: 'rural', keySectors: ['Agriculture', 'Plasturgie', 'Tourisme religieux'], economy: { tag: 'Haute-Loire artisanale', comment: 'Tissu de TPE artisanales + tourisme chemin de Compostelle.' }, prospectingTip: 'Cibler les TPE familiales — décideur unique, cycle court.' },
  '63': { population: '660 k', topCities: ['Clermont-Ferrand', 'Riom', 'Issoire'], density: 'urbain + rural', keySectors: ['Pneumatique (Michelin)', 'Agroalimentaire', 'Tourisme thermal'], economy: { tag: 'Michelin city', comment: 'Siège mondial Michelin = 12 000 emplois directs + écosystème.' }, prospectingTip: 'Industrie automobile et tier suppliers Michelin.' },
  '73': { population: '435 k', topCities: ['Chambéry', 'Albertville', 'Aix-les-Bains'], density: 'urbain + montagne', keySectors: ['Tourisme alpin', 'Eaux thermales', 'Hydroélectricité'], economy: { tag: 'Tourisme hivernal', comment: 'Stations majeures (Courchevel, Méribel, Val Thorens) — saison décembre-avril critique.' }, prospectingTip: 'Démarcher entre mai et novembre, hors saison ski.' },
  '74': { population: '835 k', topCities: ['Annecy', 'Annemasse', 'Cluses'], density: 'urbain dynamique', keySectors: ['Décolletage (Cluses)', 'Tourisme', 'Frontalier suisse'], economy: { tag: 'Frontière Suisse', comment: 'Économie tirée par 100 000 travailleurs frontaliers en Suisse.' }, prospectingTip: 'Industrie de précision (décolletage) et services aux frontaliers.' },

  // ───── Provence-Alpes-Côte d'Azur ────────────────────
  '06': { population: '1,1 M', topCities: ['Nice', 'Cannes', 'Antibes'], density: 'urbain littoral', keySectors: ['Tourisme', 'Tech (Sophia Antipolis)', 'Hôtellerie premium'], economy: { tag: 'Côte d\'Azur', comment: 'Sophia Antipolis = plus grande technopole d\'Europe + tourisme premium.' }, prospectingTip: 'Tech / SaaS sur Sophia, hôtellerie luxe sur littoral — deux mondes différents.' },
  '13': { population: '2,0 M', topCities: ['Marseille', 'Aix-en-Provence', 'Aubagne'], density: 'urbain dense', keySectors: ['Logistique portuaire', 'Aéronautique', 'Microélectronique'], economy: { tag: 'Marseille-Provence', comment: 'Plus grand port français + pôle Microélectronique Rousset.' }, prospectingTip: 'Marseille = logistique et import-export. Aix = services et conseil.' },
  '83': { population: '1,1 M', topCities: ['Toulon', 'Hyères', 'Draguignan'], density: 'urbain littoral', keySectors: ['Défense (Marine)', 'Tourisme', 'Viticulture (Bandol)'], economy: { tag: 'Var méditerranéen', comment: 'Base navale de Toulon = 1er employeur public régional.' }, prospectingTip: 'Marché défense + tourisme saisonnier (juin-septembre).' },
  '84': { population: '562 k', topCities: ['Avignon', 'Carpentras', 'Orange'], density: 'rural-urbain', keySectors: ['Viticulture (Châteauneuf-du-Pape)', 'Tourisme', 'Agroalimentaire'], economy: { tag: 'Vaucluse provençal', comment: 'Tradition viticole + festival d\'Avignon (5 M de visiteurs annuels).' }, prospectingTip: 'Œnotourisme et agroalimentaire premium sont les segments porteurs.' },
  '04': { population: '167 k', topCities: ['Digne-les-Bains', 'Manosque', 'Sisteron'], density: 'rural', keySectors: ['Lavande', 'Tourisme nature', 'Recherche (ITER)'], economy: { tag: 'Alpes-de-Haute-Provence', comment: 'Projet ITER (réacteur fusion) à Cadarache = pôle scientifique mondial.' }, prospectingTip: 'Niche tourisme nature + écosystème ITER.' },
  '05': { population: '142 k', topCities: ['Gap', 'Briançon', 'Embrun'], density: 'montagne', keySectors: ['Tourisme alpin', 'Agriculture extensive'], economy: { tag: 'Hautes-Alpes', comment: 'Économie 100 % touristique : ski hiver + randonnée été.' }, prospectingTip: 'Hors saison (mai-juin, septembre-octobre) = seul moment où démarcher.' },

  // ───── Nouvelle-Aquitaine ────────────────────────────
  '33': { population: '1,6 M', topCities: ['Bordeaux', 'Mérignac', 'Pessac'], density: 'urbain', keySectors: ['Vin (Bordelais)', 'Aéronautique', 'Tertiaire'], economy: { tag: 'Bordeaux Métropole', comment: 'Vignoble + aéronautique (Airbus, Dassault) + capitale régionale.' }, prospectingTip: 'Œnotourisme + tech bordelaise sont les segments dynamiques.' },
  '64': { population: '688 k', topCities: ['Pau', 'Bayonne', 'Biarritz'], density: 'mixte', keySectors: ['Énergie (Total)', 'Tourisme basque', 'Aéronautique'], economy: { tag: 'Pyrénées-Atlantiques', comment: 'Hub énergétique de Pau + tourisme Pays Basque.' }, prospectingTip: 'Filière énergie sur Pau, tourisme et surf sur Côte basque.' },
  '17': { population: '655 k', topCities: ['La Rochelle', 'Saintes', 'Rochefort'], density: 'mixte', keySectors: ['Tourisme côtier', 'Naval', 'Viticulture (Cognac)'], economy: { tag: 'Charente-Maritime', comment: 'Tourisme balnéaire fort (Île de Ré) + base sous-marine La Rochelle.' }, prospectingTip: 'Tourisme avril-septembre, le reste de l\'année = saison creuse.' },
  '16': { population: '353 k', topCities: ['Angoulême', 'Cognac', 'Soyaux'], density: 'rural', keySectors: ['Cognac (Hennessy, Martell)', 'BD (Angoulême)', 'Papeterie'], economy: { tag: 'Charente du Cognac', comment: 'Industrie cognac = 70 % des exports français + festival BD.' }, prospectingTip: 'Industrie spiritueuse et IAA premium.' },
  '24': { population: '414 k', topCities: ['Périgueux', 'Bergerac', 'Sarlat'], density: 'rural', keySectors: ['Tourisme patrimoine', 'Foie gras', 'Agriculture'], economy: { tag: 'Périgord vert', comment: 'Tourisme patrimoine (Lascaux) + gastronomie AOP (foie gras, truffes).' }, prospectingTip: 'Restaurants gastronomiques et producteurs AOP.' },
  '40': { population: '414 k', topCities: ['Mont-de-Marsan', 'Dax', 'Saint-Vincent-de-Tyrosse'], density: 'rural', keySectors: ['Forêt (pin maritime)', 'Tourisme surf', 'Aéronautique (Dassault)'], economy: { tag: 'Landes du surf', comment: 'Capitale française du surf + plus grande forêt cultivée d\'Europe.' }, prospectingTip: 'Tourisme surf + filière bois sont les segments uniques.' },
  '47': { population: '331 k', topCities: ['Agen', 'Villeneuve-sur-Lot', 'Marmande'], density: 'rural', keySectors: ['Agriculture (pruneau, tomate)', 'Conserves', 'Tourisme'], economy: { tag: 'Lot-et-Garonne agricole', comment: 'Pruneau d\'Agen + 1ère région française pour la noisette.' }, prospectingTip: 'Cibler les coopératives agricoles et IAA fruitières.' },
  '79': { population: '376 k', topCities: ['Niort', 'Bressuire', 'Parthenay'], density: 'mixte', keySectors: ['Mutuelles (MAIF, MAAF)', 'Élevage', 'Agroalimentaire'], economy: { tag: 'Mutuelles de Niort', comment: '15 000 emplois directs dans les mutuelles d\'assurance (capitale du mutualisme).' }, prospectingTip: 'Pour les services financiers et assurance, Niort est incontournable.' },
  '86': { population: '438 k', topCities: ['Poitiers', 'Châtellerault', 'Buxerolles'], density: 'mixte', keySectors: ['Futuroscope', 'Université', 'Logistique'], economy: { tag: 'Vienne tech', comment: 'Futuroscope = pôle technopolitain + 28 000 étudiants à Poitiers.' }, prospectingTip: 'Edtech, tourisme événementiel.' },
  '87': { population: '372 k', topCities: ['Limoges', 'Saint-Junien', 'Panazol'], density: 'mixte', keySectors: ['Porcelaine', 'Cuir', 'Numérique'], economy: { tag: 'Limoges porcelaine', comment: 'Capitale historique de la porcelaine + filière cuir et arts de la table.' }, prospectingTip: 'Artisanat haut de gamme et arts de la table.' },
  '19': { population: '240 k', topCities: ['Tulle', 'Brive-la-Gaillarde', 'Ussel'], density: 'rural', keySectors: ['Bois', 'Agriculture', 'Tourisme nature'], economy: { tag: 'Corrèze rurale', comment: 'Économie de proximité, plein emploi local, taux activité élevé.' }, prospectingTip: 'TPE artisanales et tourisme vert.' },
  '23': { population: '116 k', topCities: ['Guéret', 'Aubusson', 'La Souterraine'], density: 'rural enclavé', keySectors: ['Tapisserie d\'Aubusson', 'Élevage', 'Tourisme'], economy: { tag: 'Creuse rurale', comment: 'Département le moins peuplé de France métropolitaine — économie de subsistance.' }, prospectingTip: 'Marché très petit : ultra-ciblage indispensable.' },

  // ───── Occitanie ─────────────────────────────────────
  '31': { population: '1,4 M', topCities: ['Toulouse', 'Colomiers', 'Tournefeuille'], density: 'urbain dense', keySectors: ['Aéronautique (Airbus)', 'Spatial', 'Cancérologie'], economy: { tag: 'Toulouse aéronautique', comment: 'Hub mondial Airbus + Toulouse Space City + 130 000 étudiants.' }, prospectingTip: 'Aéronautique-spatial et écosystème universitaire = clusters majeurs.' },
  '34': { population: '1,2 M', topCities: ['Montpellier', 'Béziers', 'Sète'], density: 'urbain littoral', keySectors: ['Tech / eHealth', 'Vin (Languedoc)', 'Tourisme'], economy: { tag: 'Montpellier French Tech', comment: 'Pôle French Tech + 1ère vignoble français en volume.' }, prospectingTip: 'eHealth et e-commerce viticole sont les niches porteuses.' },
  '11': { population: '376 k', topCities: ['Carcassonne', 'Narbonne', 'Castelnaudary'], density: 'mixte', keySectors: ['Viticulture', 'Tourisme', 'Cassoulet (Castelnaudary)'], economy: { tag: 'Aude viticole', comment: 'Plus grand vignoble français en volume + canal du Midi.' }, prospectingTip: 'Œnotourisme et IAA traditionnelle.' },
  '30': { population: '748 k', topCities: ['Nîmes', 'Alès', 'Bagnols-sur-Cèze'], density: 'mixte', keySectors: ['Tourisme romain', 'Viticulture', 'Nucléaire (Marcoule)'], economy: { tag: 'Gard romain', comment: 'Patrimoine (Pont du Gard, arènes) + filière nucléaire civile.' }, prospectingTip: 'Tourisme patrimoine et BTP nucléaire.' },
  '32': { population: '190 k', topCities: ['Auch', 'Condom', 'L\'Isle-Jourdain'], density: 'rural', keySectors: ['Armagnac', 'Agriculture', 'Foie gras'], economy: { tag: 'Gers gastronomique', comment: 'Pays du d\'Artagnan + capitale du foie gras français.' }, prospectingTip: 'Cibler producteurs AOP et restaurants gastronomiques.' },
  '09': { population: '154 k', topCities: ['Foix', 'Pamiers', 'Saint-Girons'], density: 'rural montagne', keySectors: ['Tourisme', 'Élevage', 'Industrie traditionnelle'], economy: { tag: 'Ariège pyrénéenne', comment: 'Économie touristique (Pyrénées) + tradition métallurgique.' }, prospectingTip: 'Tourisme rural + ski.' },
  '12': { population: '280 k', topCities: ['Rodez', 'Millau', 'Onet-le-Château'], density: 'rural', keySectors: ['Roquefort', 'Gants (Millau)', 'Bois'], economy: { tag: 'Aveyron AOP', comment: 'Roquefort + Laguiole + gants de Millau = artisanat de luxe.' }, prospectingTip: 'AOP gastronomiques et artisanat de luxe.' },
  '46': { population: '173 k', topCities: ['Cahors', 'Figeac', 'Gourdon'], density: 'rural', keySectors: ['Vin de Cahors', 'Tourisme patrimoine', 'Aéronautique (Figeac)'], economy: { tag: 'Lot rural', comment: 'Patrimoine UNESCO (Saint-Cirq-Lapopie) + Figeac Aero.' }, prospectingTip: 'Tourisme + sous-traitance aéronautique.' },
  '48': { population: '76 k', topCities: ['Mende', 'Marvejols', 'Saint-Chély'], density: 'rural ultra-faible', keySectors: ['Élevage', 'Tourisme nature'], economy: { tag: 'Lozère sauvage', comment: 'Département le moins peuplé de France — économie agricole-touristique.' }, prospectingTip: 'Marché minuscule : ne pas y consacrer de gros volumes.' },
  '65': { population: '226 k', topCities: ['Tarbes', 'Lourdes', 'Bagnères-de-Bigorre'], density: 'mixte', keySectors: ['Tourisme religieux (Lourdes)', 'Pyrénées', 'Aéronautique'], economy: { tag: 'Hautes-Pyrénées', comment: 'Lourdes = 4 M de pèlerins/an + stations de ski.' }, prospectingTip: 'Hôtellerie religieuse à Lourdes = 250 hôtels concentrés.' },
  '66': { population: '481 k', topCities: ['Perpignan', 'Canet', 'Pia'], density: 'urbain littoral', keySectors: ['Tourisme', 'Viticulture', 'Logistique (Le Boulou)'], economy: { tag: 'Pyrénées-Orientales catalanes', comment: 'Frontière espagnole = logistique + tourisme méditerranéen.' }, prospectingTip: 'Logistique import-export Espagne + tourisme.' },
  '81': { population: '388 k', topCities: ['Albi', 'Castres', 'Mazamet'], density: 'mixte', keySectors: ['Pharmacie (Pierre Fabre)', 'Textile (Mazamet)', 'Verre'], economy: { tag: 'Tarn pharmaceutique', comment: 'Siège Pierre Fabre (Avène, Klorane) à Castres = 9 000 emplois.' }, prospectingTip: 'Cluster pharmaceutique sur Castres-Mazamet.' },
  '82': { population: '262 k', topCities: ['Montauban', 'Castelsarrasin', 'Moissac'], density: 'mixte', keySectors: ['Fruits (Chasselas de Moissac)', 'Agriculture', 'Logistique'], economy: { tag: 'Tarn-et-Garonne arboricole', comment: 'AOP Chasselas + production fruitière nationale.' }, prospectingTip: 'IAA fruitière et coopératives agricoles.' },

  // ───── Hauts-de-France ────────────────────────────────
  '59': { population: '2,6 M', topCities: ['Lille', 'Roubaix', 'Tourcoing'], density: 'urbain dense', keySectors: ['Distribution (Auchan, Decathlon)', 'Numérique', 'Textile'], economy: { tag: 'Lille Métropole', comment: 'Eurométropole avec Bruxelles, sièges Auchan/Decathlon/Bonduelle/Boulanger.' }, prospectingTip: 'Distribution et e-commerce sont les écosystèmes les plus actifs.' },
  '02': { population: '527 k', topCities: ['Saint-Quentin', 'Soissons', 'Laon'], density: 'rural-industriel', keySectors: ['Agroalimentaire', 'Logistique', 'Métallurgie'], economy: { tag: 'Aisne industrielle', comment: 'Tradition industrielle + ouverture autoroutière vers le Nord et la Belgique.' }, prospectingTip: 'Industrie traditionnelle + logistique.' },
  '60': { population: '829 k', topCities: ['Beauvais', 'Compiègne', 'Creil'], density: 'mixte', keySectors: ['Aéronautique', 'Logistique', 'Cosmétique (Chanel)'], economy: { tag: 'Oise industrielle', comment: 'Proximité Paris + cluster cosmétique (Chanel, Yves Rocher).' }, prospectingTip: 'Industrie cosmétique et logistique.' },
  '62': { population: '1,5 M', topCities: ['Calais', 'Boulogne', 'Lens'], density: 'mixte côtier', keySectors: ['Port Calais', 'Pêche (Boulogne)', 'Logistique'], economy: { tag: 'Pas-de-Calais portuaire', comment: 'Port de Calais = 1er port passagers d\'Europe continentale.' }, prospectingTip: 'Logistique transmanche et IAA marine.' },
  '80': { population: '569 k', topCities: ['Amiens', 'Abbeville', 'Albert'], density: 'mixte', keySectors: ['Agroalimentaire', 'Verre (Saint-Gobain)', 'Mécanique'], economy: { tag: 'Somme agricole', comment: 'Plaine céréalière + industrie agro-alimentaire (Bonduelle, Whirlpool).' }, prospectingTip: 'IAA et industries de transformation.' },

  // ───── Grand Est ──────────────────────────────────────
  '67': { population: '1,1 M', topCities: ['Strasbourg', 'Haguenau', 'Schiltigheim'], density: 'urbain dense', keySectors: ['Institutions UE', 'Pharmacie', 'Banque'], economy: { tag: 'Strasbourg européenne', comment: 'Siège Parlement Européen + cluster pharmaceutique Stratéus.' }, prospectingTip: 'Pharma et institutions européennes.' },
  '68': { population: '768 k', topCities: ['Mulhouse', 'Colmar', 'Saint-Louis'], density: 'urbain', keySectors: ['Automobile (PSA)', 'Chimie', 'Frontalier'], economy: { tag: 'Haut-Rhin frontalier', comment: 'PSA Mulhouse + frontière Suisse-Allemagne.' }, prospectingTip: 'Automobile et services aux frontaliers.' },
  '51': { population: '566 k', topCities: ['Reims', 'Châlons', 'Épernay'], density: 'mixte', keySectors: ['Champagne', 'Université Reims', 'Aéronautique'], economy: { tag: 'Champagne', comment: 'AOC Champagne = 5,7 Mds € de CA annuel + tourisme œnologique.' }, prospectingTip: 'Filière champagne et tourisme œnologique.' },
  '54': { population: '733 k', topCities: ['Nancy', 'Vandœuvre', 'Lunéville'], density: 'urbain', keySectors: ['Recherche (CNRS)', 'Santé', 'Numérique'], economy: { tag: 'Nancy universitaire', comment: 'Pôle universitaire et recherche (Université de Lorraine).' }, prospectingTip: 'Recherche, santé et edtech.' },
  '57': { population: '1,04 M', topCities: ['Metz', 'Thionville', 'Forbach'], density: 'urbain', keySectors: ['Frontalier Luxembourg', 'Automobile', 'Métallurgie'], economy: { tag: 'Moselle frontalière', comment: '110 000 frontaliers au Luxembourg = pouvoir d\'achat élevé.' }, prospectingTip: 'Services aux frontaliers + industrie.' },
  '08': { population: '270 k', topCities: ['Charleville-Mézières', 'Sedan', 'Rethel'], density: 'rural', keySectors: ['Métallurgie (forges)', 'Élevage', 'Tourisme Ardennes'], economy: { tag: 'Ardennes métallurgiques', comment: 'Tradition forgerie + tourisme nature transfrontalier.' }, prospectingTip: 'Industrie et tourisme nature.' },
  '10': { population: '309 k', topCities: ['Troyes', 'Romilly', 'Saint-André'], density: 'mixte', keySectors: ['Magasins d\'usine (textile)', 'Champagne', 'Logistique'], economy: { tag: 'Aube textile', comment: 'Capitale française des magasins d\'usine + champagne sud.' }, prospectingTip: 'Retail outlet et logistique e-commerce.' },
  '52': { population: '171 k', topCities: ['Chaumont', 'Saint-Dizier', 'Langres'], density: 'rural', keySectors: ['Forge', 'Élevage', 'Forestier'], economy: { tag: 'Haute-Marne rurale', comment: 'Tradition forgerie + bois Champagne-Ardenne.' }, prospectingTip: 'Filière bois et fonderie.' },
  '55': { population: '184 k', topCities: ['Bar-le-Duc', 'Verdun', 'Commercy'], density: 'rural', keySectors: ['Tourisme mémoriel (Verdun)', 'Agriculture', 'Bois'], economy: { tag: 'Meuse', comment: 'Économie rurale + tourisme mémoriel WWI à Verdun.' }, prospectingTip: 'Tourisme mémoriel et IAA.' },
  '88': { population: '362 k', topCities: ['Épinal', 'Saint-Dié', 'Remiremont'], density: 'rural', keySectors: ['Bois-papier', 'Textile', 'Thermalisme (Vittel)'], economy: { tag: 'Vosges thermales', comment: 'Stations thermales (Vittel, Contrexéville) + filière bois.' }, prospectingTip: 'Thermalisme et filière bois.' },

  // ───── Pays de la Loire ──────────────────────────────
  '44': { population: '1,4 M', topCities: ['Nantes', 'Saint-Nazaire', 'Saint-Herblain'], density: 'urbain dense', keySectors: ['Aéronautique (Airbus)', 'Naval (Chantiers)', 'Numérique'], economy: { tag: 'Nantes-Saint-Nazaire', comment: 'Chantiers de l\'Atlantique + écosystème tech French Tech Atlantique.' }, prospectingTip: 'Tech, aéronautique-naval.' },
  '49': { population: '824 k', topCities: ['Angers', 'Cholet', 'Saumur'], density: 'urbain', keySectors: ['Horticulture (Angers)', 'Textile (Cholet)', 'Logiciel'], economy: { tag: 'Angers Maine-et-Loire', comment: 'Plus grand pôle horticole français + Polytech Angers.' }, prospectingTip: 'Horticulture pro et edtech.' },
  '53': { population: '309 k', topCities: ['Laval', 'Mayenne', 'Château-Gontier'], density: 'rural', keySectors: ['Élevage', 'Agroalimentaire (Lactalis)', 'Numérique (Laval Virtual)'], economy: { tag: 'Mayenne IAA', comment: 'Lactalis HQ + leader VR/AR avec Laval Virtual.' }, prospectingTip: 'IAA bovine et VR/AR.' },
  '72': { population: '565 k', topCities: ['Le Mans', 'La Flèche', 'Sablé'], density: 'mixte', keySectors: ['Assurance (MMA)', 'Aéronautique', '24 Heures du Mans'], economy: { tag: 'Le Mans assurance', comment: 'Siège MMA = 4 500 emplois + circuit 24 Heures.' }, prospectingTip: 'Assurance et automobile/courses.' },
  '85': { population: '696 k', topCities: ['La Roche-sur-Yon', 'Les Sables', 'Challans'], density: 'mixte', keySectors: ['Tourisme (Puy du Fou)', 'Construction navale', 'Élevage'], economy: { tag: 'Vendée touristique', comment: 'Puy du Fou (2,8 M visiteurs) + côte vendéenne.' }, prospectingTip: 'Tourisme événementiel et hôtellerie.' },

  // ───── Bretagne ──────────────────────────────────────
  '35': { population: '1,1 M', topCities: ['Rennes', 'Saint-Malo', 'Fougères'], density: 'urbain', keySectors: ['Cybersécurité (Rennes)', 'Agroalimentaire', 'Automobile (PSA)'], economy: { tag: 'Rennes Métropole', comment: 'French Tech Rennes + plus gros bassin d\'emploi breton.' }, prospectingTip: 'Cybersécurité, edtech et IAA.' },
  '22': { population: '604 k', topCities: ['Saint-Brieuc', 'Lannion', 'Dinan'], density: 'mixte côtier', keySectors: ['Télécoms (Lannion)', 'Agroalimentaire', 'Tourisme côtier'], economy: { tag: 'Côtes-d\'Armor télécoms', comment: 'Cluster télécoms historique à Lannion + filière maritime.' }, prospectingTip: 'Télécoms et tourisme.' },
  '29': { population: '923 k', topCities: ['Brest', 'Quimper', 'Concarneau'], density: 'mixte côtier', keySectors: ['Pêche', 'Marine nationale (Brest)', 'Tourisme'], economy: { tag: 'Finistère maritime', comment: 'Base navale Brest + 1er port français pêche frais.' }, prospectingTip: 'IAA marine et défense.' },
  '56': { population: '770 k', topCities: ['Lorient', 'Vannes', 'Pontivy'], density: 'mixte côtier', keySectors: ['Course large (Lorient)', 'Élevage', 'Tourisme'], economy: { tag: 'Morbihan nautisme', comment: 'Capitale française de la course au large à Lorient.' }, prospectingTip: 'Nautisme et IAA bovine.' },

  // ───── Normandie ─────────────────────────────────────
  '76': { population: '1,3 M', topCities: ['Rouen', 'Le Havre', 'Dieppe'], density: 'urbain', keySectors: ['Port Le Havre', 'Pétrochimie', 'Automobile'], economy: { tag: 'Seine-Maritime portuaire', comment: 'Le Havre = 1er port français pour conteneurs + pétrochimie Total.' }, prospectingTip: 'Logistique portuaire et industrie lourde.' },
  '14': { population: '702 k', topCities: ['Caen', 'Lisieux', 'Bayeux'], density: 'mixte', keySectors: ['Tourisme mémoriel (D-Day)', 'Automobile', 'Recherche'], economy: { tag: 'Calvados', comment: 'Tourisme plages débarquement (5 M visiteurs/an) + GANIL.' }, prospectingTip: 'Tourisme mémoriel et recherche.' },
  '27': { population: '601 k', topCities: ['Évreux', 'Vernon', 'Louviers'], density: 'mixte', keySectors: ['Pharma', 'Cosmétique', 'Bois'], economy: { tag: 'Eure cosmétique', comment: 'Cluster cosmétique Cosmetic Valley + proximité Paris.' }, prospectingTip: 'Cosmétique et pharma.' },
  '50': { population: '494 k', topCities: ['Cherbourg', 'Saint-Lô', 'Granville'], density: 'rural-côtier', keySectors: ['Naval nucléaire (Cherbourg)', 'Tourisme (Mont-St-Michel)', 'Élevage'], economy: { tag: 'Manche nucléaire', comment: 'Naval Group + EDF + tourisme Mont-Saint-Michel.' }, prospectingTip: 'Industrie nucléaire et tourisme.' },
  '61': { population: '278 k', topCities: ['Alençon', 'Argentan', 'Flers'], density: 'rural', keySectors: ['Élevage', 'Industrie automobile', 'Cheval (Le Pin)'], economy: { tag: 'Orne agricole', comment: 'Haras national du Pin + élevage bovin Normandie.' }, prospectingTip: 'Filière équine et agroalimentaire.' },

  // ───── Centre-Val de Loire ────────────────────────────
  '37': { population: '610 k', topCities: ['Tours', 'Joué-lès-Tours', 'Saint-Cyr'], density: 'urbain', keySectors: ['Tourisme châteaux', 'Pharmacie', 'Édition'], economy: { tag: 'Indre-et-Loire ligérienne', comment: 'Vallée de la Loire UNESCO + cluster pharma Tours.' }, prospectingTip: 'Tourisme patrimoine et pharma.' },
  '45': { population: '688 k', topCities: ['Orléans', 'Olivet', 'Fleury-les-Aubrais'], density: 'urbain', keySectors: ['Cosmétique', 'Pharmacie', 'Logistique'], economy: { tag: 'Loiret pharma-cosmétique', comment: 'Cosmetic Valley + logistique sud Paris.' }, prospectingTip: 'Pharma-cosmétique et logistique.' },
  '28': { population: '432 k', topCities: ['Chartres', 'Dreux', 'Lucé'], density: 'mixte', keySectors: ['Cosmétique', 'Aéronautique', 'Agriculture'], economy: { tag: 'Eure-et-Loir', comment: 'Cosmetic Valley + plaine de Beauce.' }, prospectingTip: 'Cosmétique et agroalimentaire céréalier.' },
  '18': { population: '300 k', topCities: ['Bourges', 'Vierzon', 'Saint-Doulchard'], density: 'rural-urbain', keySectors: ['Défense (MBDA, Nexter)', 'Agriculture'], economy: { tag: 'Cher défense', comment: 'Hub industrie défense terrestre + porcelaine.' }, prospectingTip: 'Industrie défense.' },
  '36': { population: '218 k', topCities: ['Châteauroux', 'Issoudun', 'Le Blanc'], density: 'rural', keySectors: ['Tabac', 'Élevage', 'Logistique'], economy: { tag: 'Indre rurale', comment: 'Économie agricole + plateformes logistiques A20.' }, prospectingTip: 'Logistique routière.' },
  '41': { population: '331 k', topCities: ['Blois', 'Vendôme', 'Romorantin'], density: 'rural-urbain', keySectors: ['Tourisme châteaux', 'Cosmétique', 'Édition'], economy: { tag: 'Loir-et-Cher', comment: 'Châteaux Loire (Chambord) + cluster cosmétique.' }, prospectingTip: 'Tourisme premium et cosmétique.' },

  // ───── Bourgogne-Franche-Comté ────────────────────────
  '21': { population: '535 k', topCities: ['Dijon', 'Beaune', 'Chenôve'], density: 'urbain', keySectors: ['Vin (Bourgogne)', 'Pharma', 'Recherche'], economy: { tag: 'Dijon AOC', comment: 'Climats de Bourgogne UNESCO + Cité de la Gastronomie.' }, prospectingTip: 'Œnotourisme et IAA gastronomique.' },
  '25': { population: '545 k', topCities: ['Besançon', 'Montbéliard', 'Audincourt'], density: 'urbain', keySectors: ['Horlogerie', 'Automobile (PSA)', 'Microtechniques'], economy: { tag: 'Doubs microtechnique', comment: 'Tradition horlogère + PSA Sochaux + frontière Suisse.' }, prospectingTip: 'Microtechnique et automobile.' },
  '39': { population: '258 k', topCities: ['Lons-le-Saunier', 'Dole', 'Champagnole'], density: 'rural-urbain', keySectors: ['Fromage (Comté)', 'Bois', 'Plasturgie'], economy: { tag: 'Jura comté', comment: 'AOP Comté = 1ère AOP fromagère française.' }, prospectingTip: 'IAA fromagère et bois.' },
  '58': { population: '202 k', topCities: ['Nevers', 'Cosne', 'Decize'], density: 'rural', keySectors: ['Élevage', 'Magny-Cours', 'Bois'], economy: { tag: 'Nièvre', comment: 'Circuit Magny-Cours + élevage charolais.' }, prospectingTip: 'Filière équine et IAA bovine.' },
  '70': { population: '233 k', topCities: ['Vesoul', 'Lure', 'Héricourt'], density: 'rural', keySectors: ['Automobile (PSA)', 'Bois', 'Métallurgie'], economy: { tag: 'Haute-Saône industrielle', comment: 'PSA Vesoul + tradition métallurgique.' }, prospectingTip: 'Automobile et sous-traitance.' },
  '71': { population: '550 k', topCities: ['Chalon', 'Mâcon', 'Le Creusot'], density: 'mixte', keySectors: ['Vin (Mâcon)', 'Métallurgie (Le Creusot)', 'Pharmacie'], economy: { tag: 'Saône-et-Loire industrielle', comment: 'Le Creusot historique sidérurgique + vignobles Mâconnais.' }, prospectingTip: 'Industrie lourde et viticulture.' },
  '89': { population: '337 k', topCities: ['Auxerre', 'Sens', 'Joigny'], density: 'rural-urbain', keySectors: ['Vin (Chablis)', 'Agriculture', 'Tourisme'], economy: { tag: 'Yonne', comment: 'Chablis + grand bassin céréalier.' }, prospectingTip: 'Œnotourisme et agroalimentaire.' },
  '90': { population: '141 k', topCities: ['Belfort', 'Delle', 'Beaucourt'], density: 'urbain', keySectors: ['Énergie (Alstom)', 'Transport ferroviaire'], economy: { tag: 'Territoire de Belfort énergie', comment: 'Alstom + GE = hub énergétique français.' }, prospectingTip: 'Énergie et industrie ferroviaire.' },

  // ───── Corse ─────────────────────────────────────────
  '2A': { population: '160 k', topCities: ['Ajaccio', 'Porto-Vecchio', 'Sartène'], density: 'rural-côtier', keySectors: ['Tourisme', 'Hôtellerie', 'Agriculture (clémentine)'], economy: { tag: 'Corse-du-Sud touristique', comment: 'Économie 100 % touristique (mai-octobre) + AOP Patrimonio.' }, prospectingTip: 'Hors saison (nov-mars), c\'est le seul moment où démarcher.' },
  '2B': { population: '186 k', topCities: ['Bastia', 'Calvi', 'Corte'], density: 'mixte', keySectors: ['Tourisme', 'Ports (Bastia)', 'Vin'], economy: { tag: 'Haute-Corse', comment: 'Bastia = 1er port commercial de Corse + tourisme.' }, prospectingTip: 'Saisonnalité forte : démarcher en hiver.' },

  // ───── DROM ──────────────────────────────────────────
  '971': { population: '380 k', topCities: ['Pointe-à-Pitre', 'Les Abymes', 'Baie-Mahault'], density: 'urbain littoral', keySectors: ['Tourisme', 'Sucre/rhum', 'BTP'], economy: { tag: 'Guadeloupe', comment: 'Tourisme + filière canne-sucre-rhum + BTP en reconstruction.' }, prospectingTip: 'Tourisme et BTP. Marché restreint, ultra-ciblage.' },
  '972': { population: '370 k', topCities: ['Fort-de-France', 'Le Lamentin', 'Schœlcher'], density: 'urbain littoral', keySectors: ['Tourisme', 'Rhum AOC', 'Agroalimentaire'], economy: { tag: 'Martinique', comment: 'AOC Rhum agricole + tourisme + filière banane.' }, prospectingTip: 'IAA premium et tourisme. Saisonnalité décalée (haute saison décembre-avril).' },
  '973': { population: '290 k', topCities: ['Cayenne', 'Saint-Laurent', 'Kourou'], density: 'côtier + amazonien', keySectors: ['Spatial (Kourou)', 'Mines (or)', 'Forêt'], economy: { tag: 'Guyane spatiale', comment: 'Centre Spatial Guyanais + plus grand département français.' }, prospectingTip: 'Aérospatial et BTP.' },
  '974': { population: '870 k', topCities: ['Saint-Denis', 'Saint-Pierre', 'Le Tampon'], density: 'urbain littoral', keySectors: ['Tourisme', 'Canne-sucre', 'Numérique'], economy: { tag: 'La Réunion', comment: 'Tourisme + plus grand bassin économique DROM + tech naissante.' }, prospectingTip: 'Tech et tourisme. Marché le plus dynamique des DROM.' },
  '976': { population: '300 k', topCities: ['Mamoudzou', 'Koungou', 'Dzaoudzi'], density: 'urbain en croissance', keySectors: ['BTP', 'Pêche', 'Services publics'], economy: { tag: 'Mayotte', comment: 'Plus jeune département français + forte croissance démographique.' }, prospectingTip: 'BTP et services publics. Marché en construction.' },
};

// Enrichissements complémentaires : entreprises emblématiques + note éco récente.
// Mergé avec DEPT_DATA via getDeptData(). Format minimaliste, focus top 50 dépts.
const DEPT_ENRICHMENTS = {
  // ───── Île-de-France ────────────────
  '75': {
    notableCompanies: ['LVMH', 'BNP Paribas', 'Sanofi', 'Total Energies', 'Société Générale'],
    economicNote: 'Paris concentre 13 sièges du CAC 40 + le plus gros écosystème startup d\'Europe continentale.',
  },
  '92': {
    notableCompanies: ['L\'Oréal', 'Renault', 'Vinci', 'Bouygues', 'Engie'],
    economicNote: 'La Défense = 3,5 M de m² de bureaux + 500 000 m² de bureaux à Boulogne, Issy et Levallois.',
  },
  '78': {
    notableCompanies: ['Renault Technocentre', 'Bouygues Construction', 'Yvelines Numériques'],
    economicNote: 'Versailles + Saint-Quentin-en-Yvelines = pôle automobile (Renault, PSA) + tech.',
  },
  '93': {
    notableCompanies: ['SFR (Saint-Denis)', 'Generali', 'Veolia', 'BNP Paribas Securities'],
    economicNote: 'Saint-Denis Pleyel = nouveau hub tertiaire post-JO 2024, prix immobiliers en hausse.',
  },
  '94': {
    notableCompanies: ['Servier (Suresnes)', 'Auchan Retail', 'Sodexo HQ'],
    economicNote: 'Rungis MIN brasse 24 Md€/an de produits frais : 200 000 visiteurs par jour.',
  },
  '95': {
    notableCompanies: ['Roissy hub (FedEx, DHL)', 'Air France Cargo'],
    economicNote: 'Roissy-CDG = 2e aéroport européen, 87 000 emplois directs.',
  },
  '77': {
    notableCompanies: ['Disneyland Paris', 'Pomona', 'Veolia Eau'],
    economicNote: 'Disneyland = 1er employeur privé d\'Île-de-France hors Paris (17 000 emplois).',
  },
  '91': {
    notableCompanies: ['Sanofi (Massy)', 'CEA', 'École Polytechnique', 'EDF R&D'],
    economicNote: 'Paris-Saclay = plus grand cluster scientifique européen, 13 % de la R&D française.',
  },

  // ───── Auvergne-Rhône-Alpes ────────
  '69': {
    notableCompanies: ['Sanofi Pasteur', 'Crédit Agricole CIB', 'Renault Trucks', 'BioMérieux', 'OL Groupe'],
    economicNote: 'Lyon Part-Dieu = 2e quartier d\'affaires français + Vaise (numérique) + Gerland (biotechs).',
  },
  '38': {
    notableCompanies: ['STMicroelectronics', 'Schneider Electric', 'Soitec', 'Atos'],
    economicNote: 'Grenoble = 1er pôle français nanotech + Schneider Electric HQ.',
  },
  '63': {
    notableCompanies: ['Michelin', 'Limagrain (semences)', 'Volvic'],
    economicNote: 'Michelin = 12 000 emplois directs + écosystème pneu mondial.',
  },
  '74': {
    notableCompanies: ['Salomon', 'Dynastar', 'Mavic'],
    economicNote: 'Haute-Savoie = 100 000 frontaliers en Suisse + cluster sport outdoor.',
  },
  '73': {
    notableCompanies: ['Tefal', 'Rossignol', 'Compagnie des Alpes'],
    economicNote: 'Capitale française du ski (Courchevel, Méribel, Val Thorens).',
  },

  // ───── PACA ─────────────────────────
  '13': {
    notableCompanies: ['CMA CGM (Marseille)', 'Airbus Helicopters', 'Gemalto (Aix)', 'STMicro Rousset'],
    economicNote: 'Marseille-Provence = 1er port français + Aix = capitale tertiaire régionale.',
  },
  '06': {
    notableCompanies: ['Amadeus', 'IBM (Nice)', 'Schneider Electric (Sophia)', 'Cisco France'],
    economicNote: 'Sophia Antipolis = plus grande technopole d\'Europe, 36 000 emplois tech.',
  },
  '83': {
    notableCompanies: ['Naval Group (Toulon)', 'CNIM', 'Marine Nationale'],
    economicNote: 'Toulon = 1er port militaire français, 22 000 marins.',
  },
  '84': {
    notableCompanies: ['Pernod Ricard (Avignon)', 'Coopératives viticoles', 'McCormick France'],
    economicNote: 'Vaucluse = 5e vignoble français + Festival d\'Avignon (1,5 M de visiteurs).',
  },

  // ───── Nouvelle-Aquitaine ──────────
  '33': {
    notableCompanies: ['CDiscount', 'Bordeaux Métropole Mobilité', 'Dassault Aviation', 'Thales Avionics'],
    economicNote: 'Bordeaux = 4e métropole pour les sièges sociaux régionaux + cluster aérospatial.',
  },
  '64': {
    notableCompanies: ['TotalEnergies (Pau)', 'Safran Helicopter Engines', 'Air Liquide'],
    economicNote: 'Pau = capitale énergie française + Bayonne-Anglet-Biarritz = pôle tertiaire basque.',
  },
  '17': {
    notableCompanies: ['Léa Nature', 'Naval Group (Rochefort)', 'Sernam'],
    economicNote: 'La Rochelle = 1er port français pêche frais + base sous-marine historique.',
  },
  '79': {
    notableCompanies: ['MAIF', 'MAAF', 'MACIF', 'Inter Mutuelles Assistance'],
    economicNote: 'Niort = capitale française du mutualisme : 15 000 emplois directs.',
  },
  '16': {
    notableCompanies: ['Hennessy (Cognac)', 'Martell', 'Rémy Martin', 'Leroy Somer'],
    economicNote: 'Cognac = 70 % des exports de spiritueux français (2,9 Md€).',
  },

  // ───── Occitanie ────────────────────
  '31': {
    notableCompanies: ['Airbus', 'CNES', 'Continental Automotive', 'Pierre Fabre'],
    economicNote: 'Toulouse = capitale européenne aéronautique + Toulouse Space City.',
  },
  '34': {
    notableCompanies: ['Dell Technologies', 'Sanofi Pasteur Mérieux', 'Sopra Steria', 'Murex'],
    economicNote: 'Montpellier = pôle French Tech + cluster eHealth + 1ère croissance démographique FR.',
  },
  '30': {
    notableCompanies: ['Orano (Marcoule)', 'Royal Canin (Aimargues)', 'Vinci Construction'],
    economicNote: 'Gard = patrimoine UNESCO (Pont du Gard) + filière nucléaire civile.',
  },

  // ───── Pays de la Loire ─────────────
  '44': {
    notableCompanies: ['Airbus (Saint-Nazaire)', 'Chantiers de l\'Atlantique', 'BNP Paribas Cardif', 'Capgemini'],
    economicNote: 'Nantes = 6e métropole française + French Tech Atlantique + chantiers navals leader mondial.',
  },
  '49': {
    notableCompanies: ['Bouvet-Ladubay', 'Briochin (Cholet)', 'Eram', 'Cointreau'],
    economicNote: 'Angers = capitale française horticulture + Cholet = cluster textile-cuir.',
  },
  '85': {
    notableCompanies: ['Puy du Fou', 'Sodebo (Saint-Georges-de-Montaigu)', 'Beneteau'],
    economicNote: 'Puy du Fou = 2,8 M de visiteurs/an, n°1 français parcs à thème en CA.',
  },

  // ───── Bretagne ─────────────────────
  '35': {
    notableCompanies: ['Crédit Mutuel Arkéa', 'Bridor', 'Yves Rocher', 'CRH (Cybersécurité)'],
    economicNote: 'Rennes = pôle cybersécurité (Cyber Campus) + IUT Lannion + INRIA.',
  },
  '29': {
    notableCompanies: ['Bigard', 'Doux', 'Naval Group (Brest)', 'Thales'],
    economicNote: 'Finistère = 1er pôle français pêche/aquaculture + Brest = base navale nucléaire.',
  },
  '56': {
    notableCompanies: ['Cooperl Arc Atlantique', 'Michelin (Vannes)', 'Briochin'],
    economicNote: 'Lorient = capitale mondiale course au large + Vannes = pôle tertiaire dynamique.',
  },
  '22': {
    notableCompanies: ['Nokia (Lannion)', 'Orange Lannion', 'Synopsys'],
    economicNote: 'Lannion = berceau historique télécoms français (Centre Lannion Telecom).',
  },

  // ───── Hauts-de-France ──────────────
  '59': {
    notableCompanies: ['Auchan', 'Decathlon', 'Bonduelle', 'Boulanger', 'Kiabi'],
    economicNote: 'Lille = 4e métropole française + Eurométropole avec Tournai (Belgique) + n°1 distribution.',
  },
  '62': {
    notableCompanies: ['Eurotunnel (Calais)', 'Le Touquet Tourisme', 'Bonduelle (Renescure)'],
    economicNote: 'Calais = 1er port passagers d\'Europe continentale (10 M de passagers/an).',
  },
  '60': {
    notableCompanies: ['Chanel (Compiègne)', 'L\'Oréal Chevilly', 'Yves Rocher (La Croixière)'],
    economicNote: 'Oise = cluster cosmétique majeur (Chanel, L\'Oréal) + proximité Paris.',
  },

  // ───── Grand Est ────────────────────
  '67': {
    notableCompanies: ['Parlement Européen', 'Conseil de l\'Europe', 'Lilly France', 'Eurométropole de Strasbourg'],
    economicNote: 'Strasbourg = 2e siège institutionnel UE après Bruxelles + cluster pharma Stratéus.',
  },
  '68': {
    notableCompanies: ['PSA Mulhouse', 'Liebherr', 'Solvay (Tavaux)', 'Clemessy'],
    economicNote: 'PSA Mulhouse = 8 000 emplois + frontière trinationale Allemagne-Suisse.',
  },
  '51': {
    notableCompanies: ['Moët & Chandon', 'Veuve Clicquot', 'Mumm', 'Pommery', 'Roederer'],
    economicNote: 'Champagne AOC = 5,7 Md€ de CA + 30 000 emplois directs dans la filière.',
  },
  '57': {
    notableCompanies: ['Smart (Hambach)', 'PSA Trémery', 'ArcelorMittal'],
    economicNote: '110 000 frontaliers au Luxembourg = pouvoir d\'achat moyen le plus élevé hors IDF.',
  },

  // ───── Normandie ────────────────────
  '76': {
    notableCompanies: ['TotalEnergies (raffinerie Gonfreville)', 'Sanofi (Le Trait)', 'ExxonMobil'],
    economicNote: 'Le Havre = 1er port FR conteneurs + 2e pôle pétrochimique français.',
  },
  '14': {
    notableCompanies: ['Renault Truks (Blainville)', 'Bosch', 'NXP Semiconductors'],
    economicNote: 'Caen = 3e pôle français microélectronique + tourisme mémoriel D-Day (5 M de visiteurs/an).',
  },
  '27': {
    notableCompanies: ['Glaxosmithkline (Évreux)', 'Sanofi', 'Renault Cléon'],
    economicNote: 'Eure = cluster cosmétique Cosmetic Valley + plus grande usine pharma Sanofi (Le Trait).',
  },

  // ───── Centre-Val de Loire ──────────
  '37': {
    notableCompanies: ['Cosmetic Valley HQ', 'Skis Rossignol', 'Michelin (Joué-lès-Tours)'],
    economicNote: 'Tours = capitale Loire + cluster pharma-cosmétique avec Pierre Fabre, Sanofi, Ipsen.',
  },
  '45': {
    notableCompanies: ['Hutchinson', 'IBM France (Orléans)', 'Servier (Gidy)'],
    economicNote: 'Orléans = pôle logistique sud Paris + cluster pharma (Servier, Boehringer).',
  },

  // ───── Bourgogne-Franche-Comté ──────
  '21': {
    notableCompanies: ['Boivin (Dijon)', 'Maille', 'Amora', 'Édulis'],
    economicNote: 'Dijon = capitale gastronomique (Cité Internationale de la Gastronomie) + Côtes de Beaune.',
  },
  '25': {
    notableCompanies: ['PSA Sochaux', 'Alstom (Belfort)', 'Carrefour Logistique'],
    economicNote: 'PSA Sochaux = berceau historique Peugeot + cluster microtechnique Besançon.',
  },

  // ───── DROM ─────────────────────────
  '974': {
    notableCompanies: ['Bourbon Tourisme', 'CMA CGM Réunion', 'Cilam (cosmétique)'],
    economicNote: 'La Réunion = bassin économique DROM le plus dynamique, croissance numérique et touristique forte.',
  },
};

/**
 * Récupère les données enrichies pour un dept (code à 2 ou 3 caractères).
 * Renvoie null si pas de data, sinon merge DEPT_DATA + DEPT_ENRICHMENTS.
 */
export function getDeptData(deptCode) {
  if (!deptCode) return null;
  const base = DEPT_DATA[deptCode];
  if (!base) return null;
  const enrich = DEPT_ENRICHMENTS[deptCode];
  return enrich ? { ...base, ...enrich } : base;
}

export { DEPT_DATA, DEPT_ENRICHMENTS };
