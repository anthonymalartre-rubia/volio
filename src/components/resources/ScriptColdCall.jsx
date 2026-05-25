// 5 scripts de cold call B2B français — page imprimable + copiable.

import CopyButton from './CopyButton';

const SCRIPTS = [
  {
    id: 1,
    title: 'Cold call à un dirigeant TPE/PME (5-50 salariés)',
    context: 'Vous appelez le dirigeant directement. Cible : décision en 1-2 RDV maximum.',
    duration: '5-7 minutes max',
    sections: [
      {
        title: 'Ouverture (15 secondes)',
        content: `"Bonjour {{prenom}}, c'est {{moi}} chez {{ma_société}}.

Je vous appelle parce que j'ai vu que vous êtes {{poste}} chez {{leur_société}} et j'ai une question rapide qui peut vous intéresser.

Vous avez 30 secondes ?"

[Attendre la réponse — si "non", proposer un rappel : "Je peux vous rappeler à quelle heure ? 14h ou 16h ?"]
[Si "oui", continuer]`,
      },
      {
        title: 'Question qualifiante (30 secondes)',
        content: `"Comment gérez-vous aujourd'hui {{problème_spécifique}} chez {{leur_société}} ?"

[ÉCOUTER 80% du temps. Reformuler ce qu'ils disent.]
[Prendre des notes mentales : volume, fréquence, douleur exprimée, vocabulaire qu'ils utilisent.]`,
      },
      {
        title: 'Reframe (30 secondes)',
        content: `"Intéressant. La plupart des {{dirigeants_secteur}} que j'accompagne en France me disent {{douleur_pattern}}.

C'est aussi votre cas ?"

[Si "oui", continuer vers le pitch.]
[Si "non, ça va", recadrer : "OK, alors juste par curiosité — qu'est-ce qui marche bien pour vous ? Je suis toujours curieux d'apprendre des dirigeants comme vous."]`,
      },
      {
        title: 'Pitch (60 secondes max)',
        content: `"J'aide une vingtaine de {{dirigeants_secteur}} français comme vous (dont {{ref_locale}}) à {{bénéfice_chiffré}}.

Concrètement, voilà comment ça marche : [3 phrases max sur le produit].

Le résultat moyen : {{stat_concrète_chiffrée}}.

Est-ce que ça vaut la peine d'en parler 15 min cette semaine, pour voir si c'est pertinent pour {{leur_société}} ?"`,
      },
      {
        title: 'Closing (30 secondes)',
        content: `"Je vous propose mardi 10h30 ou jeudi 14h. Quelle créneau marche mieux pour vous ?"

[NE JAMAIS dire "Quand seriez-vous disponible ?" — toujours proposer 2 créneaux concrets.]

[Si "OK mardi 10h30" → envoyer un Calendly dans la foulée par SMS + email]
[Si "Pas dispo cette semaine" → "OK, je vous renvoie un mail demain avec mon agenda, vous choisissez ?"]`,
      },
    ],
  },

  {
    id: 2,
    title: 'Cold call à un cadre mid-market (50-500 salariés)',
    context: 'Vous appelez un Head of Sales / VP Marketing / DSI. Vous devrez passer un assistant (gatekeeper).',
    duration: '7-10 minutes max',
    sections: [
      {
        title: 'Gatekeeper (10 secondes)',
        content: `"Bonjour, c'est {{moi}}, vous pouvez me passer {{prenom}} {{nom}} ?"

[Direct, sans hésitation. Ne JAMAIS demander "est-ce que je peux parler à...".]

[Si demande "C'est de la part de qui ?" : répondre confiant "C'est {{moi}}, je le rappelle à propos de {{sujet}}". JAMAIS donner le nom de l'entreprise complète si pas demandé.]`,
      },
      {
        title: 'Ouverture (15 secondes)',
        content: `"Bonjour {{prenom}}, c'est {{moi}}, je sais que vous êtes occupé donc je vais être bref.

J'ai vu sur LinkedIn que {{actu_récente_société}}, et j'avais une idée qui peut vous intéresser dans ce contexte.

J'ai 30 secondes ?"`,
      },
      {
        title: 'Question qualifiante (60 secondes)',
        content: `"Question : aujourd'hui, comment {{leur_société}} {{action_actuelle}} ?"

[Vraie question ouverte, pas rhétorique. Laisser parler 60-90 secondes.]
[Si la réponse est superficielle : "Pourquoi avez-vous choisi cette approche ?"]
[Reformuler : "Donc si je comprends bien, vous {{paraphraser}}, c'est ça ?"]`,
      },
      {
        title: 'Insight challenger (30 secondes)',
        content: `"Ce que je vois chez les boîtes comme {{leur_société}} (même taille, même secteur), c'est que cette approche bute généralement sur {{problème_invisible}}.

Vous l'observez chez vous ?"

[Cela démontre que vous connaissez leur réalité — vous n'êtes pas juste un commercial qui pitche.]`,
      },
      {
        title: 'Proposition de valeur (45 secondes)',
        content: `"Ce que je propose, c'est {{description_courte}}.

Chez {{ref_similaire}} (même secteur, taille proche), on a fait passer {{métrique}} de {{avant}} à {{après}} en {{durée}}.

Le pitch précis dépendrait de votre contexte. Si on prenait 30 min la semaine prochaine pour que je vous montre comment {{ref_similaire}} a fait ?"`,
      },
      {
        title: 'Closing + multi-threading (30 secondes)',
        content: `"Mardi 14h ou jeudi 11h ?"

[Une fois calé : "Est-ce qu'il y a quelqu'un d'autre côté {{leur_société}} qu'il faudrait inclure ? Souvent on a {{persona1}} et {{persona2}} sur ce type de sujet."]

[Le multi-threading dès le 1er call accélère le sales cycle de 30-50%.]`,
      },
    ],
  },

  {
    id: 3,
    title: 'Cold call après un cold email (callback)',
    context: 'Vous avez envoyé un cold email 3-5 jours avant et le prospect a ouvert mais pas répondu.',
    duration: '3-5 minutes max',
    sections: [
      {
        title: 'Ouverture référencée (20 secondes)',
        content: `"Bonjour {{prenom}}, c'est {{moi}} chez {{ma_société}}.

Je vous ai envoyé un mail mardi à propos de {{sujet}}. Je ne sais pas si vous l'avez vu, j'imagine que votre boîte mail est saturée.

Je voulais juste vous poser ma question de vive voix : {{question}} ?"`,
      },
      {
        title: 'Si réponse positive',
        content: `[Continuer comme le script #1 ou #2 selon le segment.]

Avantage du callback : 3-5× plus de taux de réponse vs email seul, car vous démontrez de la persévérance ET que vous êtes une vraie personne.`,
      },
      {
        title: 'Si "je n\'ai pas lu, désolé"',
        content: `"Pas de souci, je vous le résume en 30 secondes :

[Reformuler en plus court que le mail original — focus sur LA douleur résolue.]

Vous voulez qu'on en parle 15 min cette semaine, ou je vous renvoie le mail avec un slot Calendly ?"`,
      },
      {
        title: 'Si "ça ne m\'intéresse pas"',
        content: `"OK, merci d'avoir pris le temps. Juste par curiosité : c'est parce que vous avez déjà une solution en place, ou parce que ce n'est pas un sujet prioritaire pour {{leur_société}} en ce moment ?"

[La réponse vous donne une info précieuse pour disqualifier proprement OU revenir dans 6 mois si "pas prioritaire MAINTENANT".]`,
      },
    ],
  },

  {
    id: 4,
    title: 'Cold call après une demande inbound (rappel à chaud)',
    context: 'Le prospect a téléchargé un lead magnet ou rempli un formulaire dans les 24h. Vous le rappelez immédiatement.',
    duration: '10-15 minutes',
    sections: [
      {
        title: 'Ouverture (15 secondes)',
        content: `"Bonjour {{prenom}}, c'est {{moi}} chez {{ma_société}}.

Vous avez téléchargé notre {{lead_magnet}} il y a 2 heures, je voulais vous appeler tant que c'est frais.

Vous avez 5 minutes pour qu'on en discute ?"

[Timing crucial : le speed-to-lead < 5 min × multiplie par 10 la conversion vs > 24h.]`,
      },
      {
        title: 'Découverte chaude (5 minutes)',
        content: `"Qu'est-ce qui vous a fait télécharger {{lead_magnet}} aujourd'hui ?"

[Cette question révèle le trigger — la douleur précise et présente.]

[Suivre avec :
- "Et qu'est-ce qui se passe actuellement chez {{leur_société}} qui rend ce sujet prioritaire ?"
- "Vous avez déjà essayé des choses ? Ça a donné quoi ?"
- "Si vous trouviez la bonne solution, à quoi ressemblerait votre situation dans 6 mois ?"]`,
      },
      {
        title: 'Qualification BANT (3 minutes)',
        content: `[Discrètement, vérifier :
- BUDGET : "C'est un investissement de quel ordre que vous envisagez pour résoudre ça ?"
- AUTHORITY : "Vous êtes la personne qui prendra la décision finale, ou il y a d'autres parties prenantes ?"
- NEED : déjà couvert ci-dessus
- TIMING : "Vous voulez avoir résolu ça d'ici quand idéalement ?"]`,
      },
      {
        title: 'Proposition de demo',
        content: `"OK, donc si je résume : vous cherchez {{résumé}}, idéalement avant {{date}}, avec un budget de l'ordre de {{budget}}.

Voilà ce que je vous propose : 30 min de démo personnalisée. Je vous montre exactement comment {{ref_similaire}} a résolu le même problème, avec les chiffres.

Mardi 14h ou jeudi 10h ?"`,
      },
    ],
  },

  {
    id: 5,
    title: 'Cold call de "résurrection" (deal perdu il y a 3-6 mois)',
    context: 'Le prospect a dit "non" il y a quelques mois. Vous le recontactez avec une nouvelle angle ou actualité.',
    duration: '5-7 minutes',
    sections: [
      {
        title: 'Ouverture honnête (20 secondes)',
        content: `"Bonjour {{prenom}}, c'est {{moi}} chez {{ma_société}}.

On s'est parlé en {{mois}}, vous m'aviez dit que {{raison_no}} — totalement compréhensible.

Je vous appelle parce que {{nouvel_élément}} et je me demande si la situation a évolué chez {{leur_société}} depuis ?"`,
      },
      {
        title: 'Triggers efficaces (à choisir)',
        content: `Le "nouvel élément" doit être pertinent pour eux :
- "On a sorti une nouvelle feature {{X}} qui réglait exactement votre objection"
- "Un client comme vous ({{ref_similaire}}) vient de signer après 6 mois de réflexion"
- "Vos concurrents {{X}} et {{Y}} sont passés sur notre solution récemment"
- "On a baissé le pricing pour les boîtes de votre taille"
- "Vous avez fait une levée / vous avez changé de poste / votre boîte a publié X"`,
      },
      {
        title: 'Si "non, ça n\'a pas changé"',
        content: `"Pas de souci. Je vous propose qu'on se reparle dans 6 mois pour faire le point ?

D'ici là, je vous envoie 1 fois tous les 2 mois un mail avec les cas clients similaires aux vôtres, ça vous va ?"

[Ne JAMAIS insister. La résurrection est un long game.]`,
      },
      {
        title: 'Si "oui, on en reparle"',
        content: `"Génial. Cette fois je propose qu'on inclue {{persona_décideur}} aussi, pour gagner du temps. Vous validez ?

Mardi 11h ou jeudi 15h ?"`,
      },
    ],
  },
];

export default function ScriptColdCall() {
  return (
    <div>
      <header className="mb-10 keep-together">
        <div className="text-xs uppercase tracking-wider text-violet-500 font-semibold mb-2">
          Ressource Volia · Scripts
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight">
          5 scripts cold call B2B qui prennent des RDV
        </h1>
        <p className="text-content-secondary leading-relaxed mb-6">
          5 scénarios complets d&apos;appel à froid B2B en français : ouverture en 15 secondes,
          gestion d&apos;objections, prise de RDV. Conversion observée : 4-8% par appel.
        </p>
        <div className="rounded-2xl border border-violet-500/30 bg-violet-500/[0.04] p-4 text-sm text-content-secondary">
          <strong className="text-content-primary">Règle d&apos;or :</strong>{' '}
          le commercial parle <strong>20% du temps</strong>, le prospect <strong>80%</strong>.
          Si c&apos;est l&apos;inverse, vous avez pitché trop tôt.
          Variables <code>{'{{xxx}}'}</code> à remplacer par les données réelles du prospect.
        </div>
      </header>

      <div className="space-y-12">
        {SCRIPTS.map((s) => (
          <section key={s.id} className="keep-together">
            <div className="border-l-4 border-violet-500 pl-4 mb-4">
              <div className="text-xs text-content-tertiary uppercase tracking-wider mb-1">
                Script #{s.id} · {s.duration}
              </div>
              <h2 className="text-2xl font-bold mb-2 text-content-primary">{s.title}</h2>
              <p className="text-sm text-content-secondary italic">{s.context}</p>
            </div>

            <div className="space-y-4">
              {s.sections.map((sec, i) => (
                <div key={i} className="rounded-xl border border-line bg-surface-card p-4 keep-together">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-content-primary text-sm uppercase tracking-wider text-violet-500">
                      {sec.title}
                    </h3>
                    <CopyButton text={sec.content} label="Copier" />
                  </div>
                  <pre className="font-mono text-sm whitespace-pre-wrap leading-relaxed text-content-primary">
                    {sec.content}
                  </pre>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer className="mt-12 pt-6 border-t border-line text-sm text-content-tertiary keep-together">
        <p className="mb-2">
          <strong className="text-content-primary">Cadre légal France :</strong> en B2B,
          le cold call est légal sous régime de l&apos;intérêt légitime (RGPD art. 6.1.f).
          Identifiez-vous clairement, respectez les opt-out immédiats,
          n&apos;automatisez jamais (les robocalls sont interdits par la CNIL).
        </p>
        <p>
          © Volia 2026 · Licence Creative Commons BY 4.0 · Libre de reproduction avec mention de la source.
          Source : <a href="https://volia.fr/ressources/script-cold-call-b2b-fr" className="text-violet-500 hover:underline">volia.fr/ressources/script-cold-call-b2b-fr</a>
        </p>
      </footer>
    </div>
  );
}
