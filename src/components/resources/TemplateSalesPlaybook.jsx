// Template de Sales Playbook pour TPE/PME B2B — page imprimable.

import { CoverPage, Toc } from './CoverAndToc';

const SECTIONS = [
  {
    n: 1,
    title: 'ICP — Ideal Customer Profile',
    purpose: 'Définir précisément qui est notre client idéal pour ne pas arroser large.',
    content: (
      <div>
        <h4 className="font-semibold mt-3 mb-2">Critères firmographiques</h4>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>Secteur :</strong> [SaaS B2B / E-commerce / HCR / etc.]</li>
          <li><strong>Taille :</strong> [10-50 salariés / CA 1-10 M€]</li>
          <li><strong>Géographie :</strong> [France métropolitaine / Île-de-France / etc.]</li>
          <li><strong>Maturité :</strong> [Série A à C / post-PMF]</li>
        </ul>

        <h4 className="font-semibold mt-3 mb-2">Critères technographiques</h4>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>Stack actuelle :</strong> [HubSpot / Salesforce / Pipedrive / Notion]</li>
          <li><strong>Signaux d&apos;achat :</strong> [Levée récente / Embauche RevOps / Migration CRM]</li>
        </ul>

        <h4 className="font-semibold mt-3 mb-2">Anti-ICP (qui exclure absolument)</h4>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Trop petit (&lt; X salariés)</li>
          <li>Secteur incompatible : [administration publique / médical / défense]</li>
          <li>Localisation : [hors France pour la v1]</li>
          <li>Historique négatif : [client perdu pour cause de churn rapide]</li>
        </ul>
      </div>
    ),
  },
  {
    n: 2,
    title: 'Personas — Décideurs cibles',
    purpose: 'Pour chaque persona, identifier douleurs, objections et canaux préférés.',
    content: (
      <div>
        <h4 className="font-semibold mt-3 mb-2">Persona 1 : [CMO / VP Marketing]</h4>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>Responsabilités :</strong> Croissance organique, brand, leads inbound</li>
          <li><strong>Douleurs principales :</strong> Manque de leads qualifiés, attribution complexe, équipe sous-staffée</li>
          <li><strong>Objections fréquentes :</strong> &quot;On a déjà X&quot;, &quot;Pas le budget cette année&quot;, &quot;Besoin de l&apos;accord du CFO&quot;</li>
          <li><strong>Métriques suivies :</strong> CAC, LTV, pipeline généré, NRR</li>
          <li><strong>Canaux préférés :</strong> Email (40% du temps) + LinkedIn (40%) + événements (20%)</li>
        </ul>

        <h4 className="font-semibold mt-3 mb-2">Persona 2 : [Head of Sales]</h4>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>Responsabilités :</strong> Quota, équipe SDR/AE, win rate</li>
          <li><strong>Douleurs principales :</strong> Pipeline insuffisant, win rate stagnant, ramp-up trop long</li>
          <li><strong>Objections fréquentes :</strong> &quot;Mon équipe sait déjà&quot;, &quot;On change de CRM bientôt&quot;</li>
          <li><strong>Canaux préférés :</strong> Téléphone (50%) + email (30%) + Slack (20%)</li>
        </ul>

        <p className="text-sm italic text-content-secondary mt-3">
          Reproduire ce template pour 3-5 personas max. Plus = dilution.
        </p>
      </div>
    ),
  },
  {
    n: 3,
    title: 'Méthodes d\'outbound',
    purpose: 'Standardiser les canaux, cadences et templates utilisés.',
    content: (
      <div>
        <h4 className="font-semibold mt-3 mb-2">Cadence type (multicanal 21 jours)</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>J+0 : Cold email personnalisé</li>
          <li>J+3 : Visite profil LinkedIn (signal social)</li>
          <li>J+5 : Cold call (si pas de réponse)</li>
          <li>J+10 : Email de relance courte</li>
          <li>J+14 : Message LinkedIn court</li>
          <li>J+21 : Email break-up</li>
        </ol>

        <h4 className="font-semibold mt-3 mb-2">Stack outils</h4>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>Sourcing :</strong> Prospectia (19 €/mois)</li>
          <li><strong>Cadenceur :</strong> Smartlead (29 $) ou Lemlist (59 €)</li>
          <li><strong>CRM :</strong> Pipedrive (29 €/user) ou HubSpot Free</li>
          <li><strong>Dialer :</strong> Aircall (30 €/user) ou Ringover</li>
        </ul>

        <h4 className="font-semibold mt-3 mb-2">Volumes cibles / SDR</h4>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>Emails :</strong> 50-100/jour</li>
          <li><strong>Calls :</strong> 30-50/jour</li>
          <li><strong>Meetings bookés :</strong> 15-25/mois</li>
        </ul>
      </div>
    ),
  },
  {
    n: 4,
    title: 'Qualification — BANT/MEDDIC',
    purpose: 'Critères pour passer un MQL en SQL et hand-off au AE.',
    content: (
      <div>
        <h4 className="font-semibold mt-3 mb-2">Grille de scoring SQL (passage SDR → AE)</h4>
        <table className="w-full text-sm border border-line rounded mt-2">
          <thead className="bg-surface-elevated">
            <tr>
              <th className="text-left p-2 font-semibold">Critère</th>
              <th className="text-left p-2 font-semibold">Question</th>
              <th className="text-left p-2 font-semibold">Score</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-line"><td className="p-2"><strong>B</strong>udget</td><td className="p-2">Budget alloué ou en cours d&apos;allocation ?</td><td className="p-2 text-center">0-25</td></tr>
            <tr className="border-t border-line"><td className="p-2"><strong>A</strong>uthority</td><td className="p-2">Décideur ou prescripteur ?</td><td className="p-2 text-center">0-25</td></tr>
            <tr className="border-t border-line"><td className="p-2"><strong>N</strong>eed</td><td className="p-2">Douleur exprimée et urgente ?</td><td className="p-2 text-center">0-25</td></tr>
            <tr className="border-t border-line"><td className="p-2"><strong>T</strong>iming</td><td className="p-2">Décision dans les 3 prochains mois ?</td><td className="p-2 text-center">0-25</td></tr>
          </tbody>
        </table>
        <p className="text-sm mt-3">
          <strong>Score &gt; 70/100</strong> = SQL, hand-off au AE sous 24h.<br/>
          <strong>Score 40-70</strong> = MQL, nurturing 4-6 semaines.<br/>
          <strong>Score &lt; 40</strong> = disqualifier, ne pas insister.
        </p>
      </div>
    ),
  },
  {
    n: 5,
    title: 'Demo — Structure 30 minutes',
    purpose: 'Personnaliser la démo sur les pain points identifiés en discovery.',
    content: (
      <div>
        <h4 className="font-semibold mt-3 mb-2">Storyboard type</h4>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li><strong>Recap (3 min)</strong> — Rappeler ce qui a été discuté en discovery, vérifier que rien n&apos;a changé.</li>
          <li><strong>Pain → Solution (15 min)</strong> — Montrer comment l&apos;outil résout les 2-3 problèmes prioritaires identifiés. Pas plus.</li>
          <li><strong>Différentiateurs (5 min)</strong> — Pourquoi vous vs concurrents (1 slide max).</li>
          <li><strong>Pricing (2 min)</strong> — Transparent, simple. Pas de PowerPoint marketing.</li>
          <li><strong>Next steps (5 min)</strong> — Trial / POC / devis. Qui décide ? Quand ?</li>
        </ol>

        <h4 className="font-semibold mt-3 mb-2">Règle d&apos;or</h4>
        <p className="text-sm">Le commercial parle <strong>40% du temps</strong>, le prospect <strong>60%</strong>.
        Si c&apos;est l&apos;inverse, vous avez raté la phase discovery en amont.</p>
      </div>
    ),
  },
  {
    n: 6,
    title: 'Closing — Techniques + objections',
    purpose: 'Transformer une opportunité en client signé. Gérer les 15 objections les plus fréquentes.',
    content: (
      <div>
        <h4 className="font-semibold mt-3 mb-2">Top 15 objections + réponses</h4>
        <table className="w-full text-xs border border-line rounded mt-2">
          <thead className="bg-surface-elevated">
            <tr>
              <th className="text-left p-2 font-semibold">Objection</th>
              <th className="text-left p-2 font-semibold">Réponse type</th>
            </tr>
          </thead>
          <tbody className="[&>tr]:border-t [&>tr]:border-line [&_td]:p-2">
            <tr><td>&quot;C&apos;est trop cher&quot;</td><td>&quot;Comparé à quoi ?&quot; → reframe vers le coût de l&apos;inaction</td></tr>
            <tr><td>&quot;On a déjà X&quot;</td><td>&quot;Qu&apos;est-ce qui marche bien avec X ? Qu&apos;est-ce qui pourrait être mieux ?&quot;</td></tr>
            <tr><td>&quot;Pas le bon timing&quot;</td><td>&quot;Quand serait le bon ? Qu&apos;est-ce qui doit se passer d&apos;ici là ?&quot;</td></tr>
            <tr><td>&quot;Je dois en parler à mon associé&quot;</td><td>&quot;Bien sûr. On peut faire une démo à 3 la semaine prochaine ?&quot;</td></tr>
            <tr><td>&quot;Pas de budget&quot;</td><td>&quot;C&apos;est une question de budget actuel ou de priorité ?&quot;</td></tr>
            <tr><td>&quot;On gère en interne&quot;</td><td>&quot;Combien d&apos;heures/mois ça vous coûte ? À quel coût horaire ?&quot;</td></tr>
            <tr><td>&quot;Pas le temps d&apos;onboarder&quot;</td><td>&quot;Notre onboarding prend 2h max. On peut le faire un vendredi PM ?&quot;</td></tr>
            <tr><td>&quot;Envoyez-moi de la doc&quot;</td><td>&quot;Bien sûr. Quel est votre principal critère pour décider ?&quot;</td></tr>
            <tr><td>&quot;On va attendre Q2&quot;</td><td>&quot;Qu&apos;est-ce qui change en Q2 spécifiquement ?&quot;</td></tr>
            <tr><td>&quot;Pas convaincu par la démo&quot;</td><td>&quot;Quel aspect précisément ? Je peux vous montrer plus en détail.&quot;</td></tr>
            <tr><td>&quot;Je vous rappelle&quot;</td><td>&quot;Avec plaisir. Mardi 14h ou jeudi 10h ?&quot; (toujours proposer 2 créneaux)</td></tr>
            <tr><td>&quot;On gère en interne avec un junior&quot;</td><td>&quot;Combien de temps avant qu&apos;il soit autonome ? Et son coût total ?&quot;</td></tr>
            <tr><td>&quot;Plus tard&quot;</td><td>&quot;Quand exactement ? Je vous note dans mon CRM pour reprendre contact.&quot;</td></tr>
            <tr><td>&quot;Mon CFO ne va pas valider&quot;</td><td>&quot;On peut faire un call à 3 avec lui ? J&apos;ai un ROI calculator pour ce type de cas.&quot;</td></tr>
            <tr><td>&quot;Pas convaincu par les références&quot;</td><td>&quot;Lesquelles aimeriez-vous voir ? Je peux organiser un call avec un client.&quot;</td></tr>
          </tbody>
        </table>
      </div>
    ),
  },
  {
    n: 7,
    title: 'Post-vente — Hand-off au CSM + onboarding',
    purpose: 'Transformer un nouveau client en client fidèle qui ne churn pas.',
    content: (
      <div>
        <h4 className="font-semibold mt-3 mb-2">Hand-off Sales → CSM (sous 24h)</h4>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Email récap au CSM avec tous les notes du sales cycle</li>
          <li>Call de présentation à 3 (CSM + AE + client)</li>
          <li>Calendrier onboarding partagé (4 sessions de 30 min sur 2 semaines)</li>
          <li>Définir ensemble les 3 success metrics que le client veut atteindre dans 90 jours</li>
        </ul>

        <h4 className="font-semibold mt-3 mb-2">Onboarding (premiers 30 jours)</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li><strong>J+1</strong> : kick-off call (30 min)</li>
          <li><strong>J+3</strong> : configuration produit (1h)</li>
          <li><strong>J+7</strong> : formation utilisateurs (1h)</li>
          <li><strong>J+15</strong> : 1er checkpoint (30 min)</li>
          <li><strong>J+30</strong> : QBR mensuel (45 min) — première success metric mesurée</li>
        </ol>

        <h4 className="font-semibold mt-3 mb-2">Alertes anti-churn</h4>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Pas de connexion 14 jours = alerte CSM</li>
          <li>NPS &lt; 6 = alerte CSM</li>
          <li>Baisse d&apos;usage de 50% sur 30 jours = call urgent</li>
          <li>Demande de support &gt; 5/mois = call urgent (signe de friction)</li>
        </ul>
      </div>
    ),
  },
];

export default function TemplateSalesPlaybook() {
  const tocItems = SECTIONS.map((s) => ({
    id: `section-${s.n}`,
    label: s.title,
    meta: `Section ${s.n}/7`,
  }));

  return (
    <div>
      <CoverPage
        title="Sales Playbook TPE/PME B2B"
        subtitle="Bible commerciale écrite de votre boîte. 7 sections pré-remplies avec exemples concrets, objections types et grille de scoring BANT."
        tagline="📘 Template à adapter en 2-3 heures"
      />

      <div className="mb-8 rounded-2xl border border-violet-500/30 bg-violet-500/[0.04] p-4 text-sm text-content-secondary keep-together">
        <strong className="text-content-primary">Comment utiliser :</strong>{' '}
        remplacez les sections entre crochets <code>[...]</code> par les informations spécifiques à votre boîte.
        Faites une mise à jour trimestrielle pour intégrer les retours sales + les évolutions produit/marché.
      </div>

      <Toc items={tocItems} />

      {SECTIONS.map((s) => (
        <section key={s.n} id={`section-${s.n}`} className="mb-10 keep-together scroll-mt-24">
          <div className="border-l-4 border-violet-500 pl-4 mb-4">
            <div className="text-xs text-content-tertiary uppercase tracking-wider mb-1">Section {s.n}/7</div>
            <h2 className="text-2xl font-bold text-content-primary">{s.title}</h2>
            <p className="text-sm text-content-secondary italic mt-1">{s.purpose}</p>
          </div>
          <div className="text-content-primary">{s.content}</div>
        </section>
      ))}

      <footer className="mt-12 pt-6 border-t border-line text-sm text-content-tertiary keep-together">
        <p className="mb-2">
          <strong className="text-content-primary">À garder en tête :</strong>{' '}
          un playbook n&apos;est pas un document figé. Mise à jour trimestrielle minimum.
          Format Notion ou Google Doc partagé recommandé (jamais PDF figé).
        </p>
        <p>
          © Prospectia 2026 · Licence Creative Commons BY 4.0 · Libre de reproduction avec mention de la source.
          Source : <a href="https://prospectia.cloud/ressources/template-sales-playbook-tpe-pme" className="text-violet-500 hover:underline">prospectia.cloud/ressources/template-sales-playbook-tpe-pme</a>
        </p>
      </footer>
    </div>
  );
}
