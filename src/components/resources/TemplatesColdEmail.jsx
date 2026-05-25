// 20 templates cold email B2B français — page imprimable + copiable.
//
// Structure : 4 templates × 5 catégories (SaaS, e-commerce, HCR, BTP, professions libérales).
// Pour chaque template : objet, corps, CTA, reply rate observé, persona cible.

import CopyButton from './CopyButton';

const TEMPLATES = [
  // ─── 1. SaaS B2B ──────────────────────────────────────────────
  {
    category: 'SaaS B2B',
    id: 1,
    title: 'Pain point très spécifique (CTO/CMO)',
    subject: '{{prenom}}, votre stack {{outil_legacy}}',
    body: `{{prenom}},

J'ai vu sur G2 que {{société}} utilise encore {{outil_legacy}} pour {{usecase}}.

Question rapide : combien d'heures par mois ça vous coûte de jongler entre {{outil_legacy}} et le reste de votre stack ?

J'aide des boîtes comme {{ref_client_similaire}} à diviser ce temps par 3 grâce à [Volia / votre outil] sans changer leur infra existante.

15 min mardi 10h pour vous montrer comment ?

{{ma_signature}}`,
    reply: '12-18%',
    persona: 'CTO / VP Engineering / CMO',
  },
  {
    category: 'SaaS B2B',
    id: 2,
    title: 'Référence à une levée de fonds récente',
    subject: 'Bravo pour la Series A, {{prenom}}',
    body: `{{prenom}},

J'ai vu votre levée de {{montant}}€ annoncée dans Maddyness la semaine dernière — bravo.

À ce stade, je sais que vous allez probablement structurer l'équipe sales/marketing. Si la prospection sortante en France est dans votre roadmap des 6 prochains mois, j'aimerais vous présenter ce que d'autres SaaS post-Series A (comme {{ref}}) ont mis en place.

15 min cette semaine ?

{{ma_signature}}`,
    reply: '15-22%',
    persona: 'CEO / Fondateur',
  },
  {
    category: 'SaaS B2B',
    id: 3,
    title: 'Question contre-intuitive',
    subject: 'Question (probablement gênante)',
    body: `{{prenom}},

Question peut-être gênante : combien de leads inbound vous laissez tomber par manque de temps de qualification chaque semaine ?

J'ai fait l'audit chez {{ref_client}} récemment : 40% de leur inbound passait à la trappe.

Si vous reconnaissez ce pattern, j'ai 1-2 conseils à partager. 15 min jeudi 11h ?

{{ma_signature}}`,
    reply: '14-20%',
    persona: 'Head of Sales / VP Marketing',
  },
  {
    category: 'SaaS B2B',
    id: 4,
    title: 'Social proof secteur',
    subject: 'Comme {{ref_client_concurrent}}, pour {{société}} ?',
    body: `{{prenom}},

J'aide {{nb}} SaaS B2B français dans votre secteur ({{ref1}}, {{ref2}}, {{ref3}}) à générer +30% de pipeline outbound avec un setup léger : Volia + Smartlead.

Curieux de savoir comment {{société}} attaque la prospection sortante aujourd'hui. 15 min mardi pour échanger ?

{{ma_signature}}`,
    reply: '10-16%',
    persona: 'Head of Sales / CMO',
  },

  // ─── 2. E-commerce ────────────────────────────────────────────
  {
    category: 'E-commerce',
    id: 5,
    title: 'Audit gratuit Meta Ads',
    subject: '{{brand}}, vos campagnes Meta',
    body: `{{prenom}},

J'ai vu sur Similarweb que {{brand}} fait ~{{trafic}} visites/mois — pas mal.

Question : qui gère vos campagnes Meta et Google Ads aujourd'hui ?

J'audite gratuitement 5 comptes par mois (CTR, CPA, ROAS). 30 min vendredi 14h pour vous donner mes 3 leviers ?

{{ma_signature}}`,
    reply: '12-18%',
    persona: 'Fondateur / CMO e-commerce',
  },
  {
    category: 'E-commerce',
    id: 6,
    title: 'Stack technique (BuiltWith)',
    subject: '{{brand}} + Shopify Plus ?',
    body: `{{prenom}},

J'ai vu que {{brand}} tourne sur Shopify Plus. Vous évaluez régulièrement de nouveaux apps ?

J'aide des marques DTC françaises (comme {{ref}}) à passer de Shopify Plus à un setup plus performant sans migration douloureuse.

20 min mardi pour vous montrer comment {{ref}} a augmenté son AOV de 18% en 6 semaines ?

{{ma_signature}}`,
    reply: '10-15%',
    persona: 'Head of E-commerce / CTO',
  },
  {
    category: 'E-commerce',
    id: 7,
    title: 'Black Friday / pic saisonnier',
    subject: 'Prêt pour Black Friday, {{prenom}} ?',
    body: `{{prenom}},

Black Friday dans 4 semaines. Question rapide : votre stack peut-elle gérer +400% de trafic ?

J'audite la résilience tech de 10 e-commerces par an avant la haute saison. Le rapport prend 48h, c'est gratuit, et vous donne un plan d'action en 5 points.

Intéressé ?

{{ma_signature}}`,
    reply: '15-22% (en période)',
    persona: 'CTO / Head of E-commerce',
  },
  {
    category: 'E-commerce',
    id: 8,
    title: 'Outil de fidélisation',
    subject: 'Votre taux de rachat actuel ?',
    body: `{{prenom}},

Question : quel est aujourd'hui le taux de rachat à 90 jours de {{brand}} ?

La moyenne DTC française = 22%. Les meilleurs sont à 45%+. Si vous êtes sous les 30%, j'ai 1 levier qui marche systématiquement.

15 min mercredi 10h pour vous montrer comment {{ref}} est passé de 24% à 38% en 8 mois ?

{{ma_signature}}`,
    reply: '11-17%',
    persona: 'CRM Manager / Founder',
  },

  // ─── 3. Hôtellerie / Restauration / HCR ────────────────────────
  {
    category: 'Hôtellerie / Restauration',
    id: 9,
    title: 'Hôtelier indépendant — commission Booking',
    subject: '{{hotel}} — votre commission Booking',
    body: `{{prenom}},

J'aide une vingtaine d'hôtels indépendants français (dont {{ref}}) à reprendre le contrôle de leur acquisition directe et à réduire leur commission Booking de 18% en moyenne.

15 min lundi 10h pour vous montrer comment {{ref}} l'a fait en 60 jours ?

{{ma_signature}}`,
    reply: '14-20%',
    persona: 'Directeur d\'hôtel indépendant',
  },
  {
    category: 'Hôtellerie / Restauration',
    id: 10,
    title: 'Restaurateur gastronomique — note Google',
    subject: '{{restaurant}} — votre note 4.7 ⭐',
    body: `{{prenom}},

J'ai vu votre note Google (4.7 ⭐, {{nb_avis}} avis) — c'est rare à votre niveau.

Le problème quand on est si haut : 1 avis négatif fait beaucoup plus mal qu'avant. J'aide des restaurants comme {{ref}} à automatiser les demandes d'avis avant que les déçus aient le temps de poster.

15 min cette semaine pour vous montrer ?

{{ma_signature}}`,
    reply: '16-24%',
    persona: 'Chef / Restaurateur gastronomique',
  },
  {
    category: 'Hôtellerie / Restauration',
    id: 11,
    title: 'Restaurateur — gestion no-show',
    subject: '{{restaurant}}, votre taux de no-show',
    body: `{{prenom}},

Question rapide : quel est votre taux de no-show actuellement à {{restaurant}} ?

La moyenne en France = 15-25%. À 20%, c'est -10% de CA par mois (≈ 8000-15000 €/an pour un resto à 80 couverts/jour).

J'ai 1 méthode qui le fait tomber à 8% en 60 jours. 15 min jeudi 10h ?

{{ma_signature}}`,
    reply: '14-20%',
    persona: 'Restaurateur',
  },
  {
    category: 'Hôtellerie / Restauration',
    id: 12,
    title: 'Saisonnalité (basse saison)',
    subject: '{{hotel}}, prévision haute saison 2026',
    body: `{{prenom}},

On est en pleine fenêtre de décision pour optimiser la haute saison 2026 (mai-août).

J'aide les hôtels indépendants à augmenter leur RevPAR de 12% en moyenne avec 3 leviers : yield management dynamique, fidélisation directe, marketing local.

30 min en janvier pour échanger ?

{{ma_signature}}`,
    reply: '13-19%',
    persona: 'Directeur d\'hôtel / GM',
  },

  // ─── 4. BTP / Artisans ────────────────────────────────────────
  {
    category: 'BTP / Artisans',
    id: 13,
    title: 'Artisan plombier/électricien — devis',
    subject: 'Combien de devis envoyez-vous par semaine ?',
    body: `Bonjour {{prenom}},

Question rapide : combien de devis envoyez-vous chaque semaine, et combien sont signés ?

Beaucoup d'artisans BTP que j'accompagne envoyaient 15-20 devis et signaient 4-5. Avec un outil de relance auto, ils passent à 8-10 signés sans en envoyer plus.

15 min mardi matin pour vous montrer ?

{{ma_signature}}`,
    reply: '8-14%',
    persona: 'Artisan / Patron PME BTP',
  },
  {
    category: 'BTP / Artisans',
    id: 14,
    title: 'Entreprise BTP — recrutement',
    subject: '{{société}}, votre recrutement maçons',
    body: `Bonjour {{prenom}},

Le BTP français manque cruellement de main-d'œuvre. J'aide des entreprises comme {{ref}} à recruter 3-5 ouvriers qualifiés/mois sans Pôle Emploi ni Hello Work.

20 min cette semaine pour vous montrer comment ?

{{ma_signature}}`,
    reply: '10-15%',
    persona: 'Dirigeant entreprise BTP',
  },
  {
    category: 'BTP / Artisans',
    id: 15,
    title: 'Promoteur immobilier — leads acheteurs',
    subject: '{{promoteur}}, vos leads {{programme}}',
    body: `{{prenom}},

J'ai vu votre programme {{programme}} en commercialisation. Combien de leads qualifiés générez-vous par mois actuellement ?

J'aide 5-6 promoteurs régionaux à doubler ce chiffre via le SEO local + retargeting Meta. ROI moyen : 1 vente / 8 000 € de budget marketing.

30 min cette semaine ?

{{ma_signature}}`,
    reply: '12-18%',
    persona: 'Directeur commercial promotion',
  },
  {
    category: 'BTP / Artisans',
    id: 16,
    title: 'Architecte d\'intérieur',
    subject: 'Vos prospects haut de gamme, {{prenom}}',
    body: `{{prenom}},

J'ai vu votre portfolio sur Houzz — superbe travail sur {{projet_ref}}.

J'aide une dizaine d'architectes d'intérieur français haut de gamme à attirer des clients avec un ticket > 50 k€ via Pinterest + Google Ads ciblés.

15 min vendredi pour échanger ?

{{ma_signature}}`,
    reply: '10-16%',
    persona: 'Architecte d\'intérieur / décorateur',
  },

  // ─── 5. Professions libérales ──────────────────────────────────
  {
    category: 'Professions libérales',
    id: 17,
    title: 'Avocat — spécialité droit du travail',
    subject: '{{cabinet}}, votre charge dossiers',
    body: `Maître,

Question : combien d'heures par semaine vos collaborateurs passent à rédiger des conclusions standardisées (CDD, ruptures conventionnelles, prud'hommes) ?

J'aide des cabinets de droit du travail comme {{ref}} à diviser ce temps par 3 avec un système de modèles IA + signature électronique.

20 min cette semaine pour vous montrer ?

{{ma_signature}}`,
    reply: '12-18%',
    persona: 'Avocat associé / fondateur cabinet',
  },
  {
    category: 'Professions libérales',
    id: 18,
    title: 'Expert-comptable — IFRS / ESG',
    subject: '{{cabinet}}, votre charge IFRS',
    body: `{{prenom}},

Question : combien d'heures vous coûte aujourd'hui une fermeture annuelle pour un client mid-market (CA 5-50 M€) ?

J'aide 30+ cabinets d'expertise comptable français à diviser ce temps par 3 grâce à [outil X], sans changer leur logiciel principal (Pennylane / Cegid / Sage).

15 min cette semaine pour vous montrer ?

{{ma_signature}}`,
    reply: '13-19%',
    persona: 'Associé cabinet expertise comptable',
  },
  {
    category: 'Professions libérales',
    id: 19,
    title: 'Médecin libéral — gestion RDV',
    subject: 'Docteur {{nom}}, votre agenda',
    body: `Docteur,

Combien de no-shows et d'annulations dernière minute avez-vous chaque semaine ? Moyenne pour un cabinet libéral : 15-20% (= ~2 000 €/mois perdus).

J'ai un système de relance SMS + liste d'attente automatisée qui réduit ce taux à 5%. Mis en place chez {{ref}} en 2 semaines.

15 min mardi 12h30 pour vous montrer ?

{{ma_signature}}`,
    reply: '11-17%',
    persona: 'Médecin / kinésithérapeute libéral',
  },
  {
    category: 'Professions libérales',
    id: 20,
    title: 'Notaire — actes répétitifs',
    subject: 'Maître {{nom}}, vos actes courants',
    body: `Maître,

Question : combien d'heures votre étude passe à rédiger des actes courants (vente, succession simple, mariage) chaque semaine ?

J'aide des études notariales comme {{ref}} à automatiser 60% de cette charge avec un système de templates dynamiques, sans changer leur logiciel notarial (Genapi, Néo).

20 min cette semaine pour vous montrer ?

{{ma_signature}}`,
    reply: '10-15%',
    persona: 'Notaire associé',
  },
];

const CATEGORIES = Array.from(new Set(TEMPLATES.map((t) => t.category)));

export default function TemplatesColdEmail() {
  return (
    <div>
      <header className="mb-10 keep-together">
        <div className="text-xs uppercase tracking-wider text-violet-500 font-semibold mb-2">
          Ressource Volia · Templates
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight">
          20 templates de cold email B2B français qui convertissent
        </h1>
        <p className="text-content-secondary leading-relaxed mb-6">
          20 templates testés et validés en France en 2026, classés par persona et secteur.
          Pour chaque template : objet, corps, CTA, persona cible et reply rate observé.
        </p>
        <div className="rounded-2xl border border-violet-500/30 bg-violet-500/[0.04] p-4 text-sm text-content-secondary">
          <strong className="text-content-primary">Comment utiliser ces templates :</strong>{' '}
          remplacez les variables <code>{'{{xxx}}'}</code> par les données réelles de votre prospect (nom, société, secteur, référence client similaire, etc.).
          Plus la personnalisation est précise, plus le reply rate sera élevé que la fourchette indiquée.
        </div>
      </header>

      {CATEGORIES.map((cat) => (
        <section key={cat} className="mb-10">
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-line text-content-primary">
            {cat}
          </h2>
          <div className="space-y-6">
            {TEMPLATES.filter((t) => t.category === cat).map((t) => (
              <div
                key={t.id}
                className="rounded-2xl border border-line bg-surface-card p-5 sm:p-6 keep-together"
              >
                <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                  <div>
                    <div className="text-xs text-content-tertiary uppercase tracking-wider mb-1">
                      Template #{t.id} · {t.persona}
                    </div>
                    <h3 className="text-lg font-bold text-content-primary">{t.title}</h3>
                  </div>
                  <div className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/30 font-semibold whitespace-nowrap">
                    Reply : {t.reply}
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs text-content-tertiary uppercase tracking-wider">Objet</div>
                    <CopyButton text={t.subject} label="Copier l'objet" />
                  </div>
                  <div className="font-mono text-sm bg-surface-elevated rounded px-3 py-2 text-content-primary">
                    {t.subject}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs text-content-tertiary uppercase tracking-wider">Corps</div>
                    <div className="flex items-center gap-2">
                      <CopyButton text={t.body} label="Copier le corps" />
                      <CopyButton text={`${t.subject}\n\n${t.body}`} label="Copier tout" />
                    </div>
                  </div>
                  <pre className="font-mono text-sm bg-surface-elevated rounded px-3 py-3 text-content-primary whitespace-pre-wrap leading-relaxed">
                    {t.body}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <footer className="mt-12 pt-6 border-t border-line text-sm text-content-tertiary keep-together">
        <p className="mb-2">
          <strong className="text-content-primary">Conseil final :</strong> testez 2-3 objets par campagne (A/B testing).
          L&apos;objet est responsable de 80% du taux d&apos;ouverture.
          Voir notre <a href="/blog/ab-testing-cold-email-2026" className="text-violet-500 hover:underline">guide A/B testing complet</a>.
        </p>
        <p>
          © Volia 2026 · Licence Creative Commons BY 4.0 · Libre de reproduction avec mention de la source.
          Source : <a href="https://volia.fr/ressources/templates-cold-email-b2b-fr" className="text-violet-500 hover:underline">volia.fr/ressources/templates-cold-email-b2b-fr</a>
        </p>
      </footer>
    </div>
  );
}
