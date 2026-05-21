'use client';

import { useMemo, useState } from 'react';
import { TrendingUp, Euro, Users, Calculator, Info } from 'lucide-react';

const fmt = (n) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n);
const fmtEur = (n) => `${fmt(n)} €`;
const fmtPct = (n) => `${(Math.round(n * 10) / 10)}%`;

/**
 * Calculateur de ROI prospection B2B.
 *
 * Logique :
 * - Coûts : salaires SDR/AE + outils + formation
 * - Volume : emails/jour × 22 jours × reply rate × meeting rate × win rate
 * - Revenu : nb clients × deal size × LTV multiplicateur
 * - ROI = (revenu - coût) / coût
 */
export default function CalculatorRoiProspection() {
  // Inputs
  const [nbSdr, setNbSdr] = useState(1);
  const [salaireSdr, setSalaireSdr] = useState(38000);
  const [variableSdr, setVariableSdr] = useState(8000);
  const [coutOutils, setCoutOutils] = useState(150);
  const [emailsParJour, setEmailsParJour] = useState(60);
  const [replyRate, setReplyRate] = useState(10);
  const [meetingFromReply, setMeetingFromReply] = useState(30);
  const [winRate, setWinRate] = useState(20);
  const [dealSize, setDealSize] = useState(500);
  const [contractMonths, setContractMonths] = useState(12);

  const results = useMemo(() => {
    // Coût mensuel total
    const coutSalaireMensuel = nbSdr * ((salaireSdr + variableSdr) / 12) * 1.45; // 45% charges patronales
    const coutOutilsMensuel = coutOutils * nbSdr;
    const coutTotalMensuel = coutSalaireMensuel + coutOutilsMensuel;
    const coutTotalAnnuel = coutTotalMensuel * 12;

    // Volume mensuel
    const joursOuvres = 20;
    const emailsParMois = nbSdr * emailsParJour * joursOuvres;
    const repliesParMois = emailsParMois * (replyRate / 100);
    const meetingsParMois = repliesParMois * (meetingFromReply / 100);
    const clientsParMois = meetingsParMois * (winRate / 100);

    // Revenu
    const ltvMoyenne = dealSize * contractMonths;
    const revenuMRR = clientsParMois * dealSize;
    const revenuLTVMensuel = clientsParMois * ltvMoyenne;
    const revenuAnnuelARR = clientsParMois * dealSize * 12;

    // ROI
    const margeMensuelle = revenuMRR - coutTotalMensuel;
    const roiMensuel = coutTotalMensuel > 0 ? ((revenuMRR - coutTotalMensuel) / coutTotalMensuel) * 100 : 0;
    const cacParClient = clientsParMois > 0 ? coutTotalMensuel / clientsParMois : 0;
    const paybackMois = cacParClient > 0 && dealSize > 0 ? cacParClient / dealSize : 0;
    const seuilRentabiliteClients = dealSize > 0 ? Math.ceil(coutTotalMensuel / dealSize) : 0;

    return {
      coutTotalMensuel,
      coutTotalAnnuel,
      emailsParMois,
      repliesParMois,
      meetingsParMois,
      clientsParMois,
      revenuMRR,
      revenuAnnuelARR,
      revenuLTVMensuel,
      margeMensuelle,
      roiMensuel,
      cacParClient,
      paybackMois,
      seuilRentabiliteClients,
    };
  }, [
    nbSdr, salaireSdr, variableSdr, coutOutils, emailsParJour,
    replyRate, meetingFromReply, winRate, dealSize, contractMonths,
  ]);

  // Verdict text basé sur le ROI
  const verdict = useMemo(() => {
    if (results.roiMensuel >= 300) return { label: 'Excellent', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' };
    if (results.roiMensuel >= 100) return { label: 'Bon ROI', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' };
    if (results.roiMensuel >= 0) return { label: 'Rentable mais à optimiser', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' };
    return { label: 'Déficitaire', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' };
  }, [results.roiMensuel]);

  return (
    <div>
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-3 text-xs">
          <span className="px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 inline-flex items-center gap-1">
            <Calculator size={11} />
            Calculateur
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Calculateur de ROI prospection B2B</h1>
        <p className="text-content-secondary leading-relaxed">
          Estimez le retour sur investissement réel de votre poste outbound :
          coût total, volume généré, ROI mensuel, CAC et seuil de rentabilité.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Inputs */}
        <section className="rounded-2xl border border-line bg-surface-card p-5">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Users size={18} className="text-violet-400" />
            Vos hypothèses
          </h2>

          <div className="space-y-4">
            <Field
              label="Nombre de SDR / BDR"
              hint="Équipe de prospection sortante"
              value={nbSdr} onChange={setNbSdr} min={1} max={50} step={1}
            />
            <Field
              label="Salaire annuel brut SDR (€)"
              hint="Fixe seul, hors variable (32-42 k€ en France)"
              value={salaireSdr} onChange={setSalaireSdr} min={20000} max={100000} step={1000} fmt={fmtEur}
            />
            <Field
              label="Variable annuel SDR (€)"
              hint="Commission cible sur objectif atteint (5-15 k€)"
              value={variableSdr} onChange={setVariableSdr} min={0} max={50000} step={500} fmt={fmtEur}
            />
            <Field
              label="Coût stack outils / SDR / mois (€)"
              hint="CRM + cadenceur + sourcing + dialer + LinkedIn"
              value={coutOutils} onChange={setCoutOutils} min={0} max={1000} step={10} fmt={fmtEur}
            />
            <Field
              label="Emails envoyés / SDR / jour"
              hint="50-100 conseillé pour préserver la délivrabilité"
              value={emailsParJour} onChange={setEmailsParJour} min={10} max={200} step={5}
            />
            <Field
              label="Taux de réponse (%)"
              hint="Benchmark FR 2026 : 8-15%"
              value={replyRate} onChange={setReplyRate} min={1} max={30} step={0.5} fmt={fmtPct}
            />
            <Field
              label="Meeting / réponse (%)"
              hint="20-40% en moyenne (sur les réponses positives)"
              value={meetingFromReply} onChange={setMeetingFromReply} min={5} max={70} step={1} fmt={fmtPct}
            />
            <Field
              label="Win rate (%)"
              hint="Meetings convertis en clients signés (15-30%)"
              value={winRate} onChange={setWinRate} min={5} max={50} step={1} fmt={fmtPct}
            />
            <Field
              label="Deal size moyen (€/mois)"
              hint="MRR moyen par client (50-2000 € selon segment)"
              value={dealSize} onChange={setDealSize} min={20} max={10000} step={20} fmt={fmtEur}
            />
            <Field
              label="Durée moyenne client (mois)"
              hint="12 = 1 an avant churn (cible : 24+)"
              value={contractMonths} onChange={setContractMonths} min={1} max={60} step={1}
            />
          </div>
        </section>

        {/* Results */}
        <section className="space-y-4">
          {/* Verdict */}
          <div className={`rounded-2xl border ${verdict.border} ${verdict.bg} p-5`}>
            <div className="text-xs text-content-tertiary uppercase tracking-wider mb-1">Verdict</div>
            <div className={`text-2xl font-bold ${verdict.color} mb-1`}>{verdict.label}</div>
            <div className="text-sm text-content-secondary">
              ROI mensuel : <strong>{fmtPct(results.roiMensuel)}</strong>
            </div>
          </div>

          {/* Key stats */}
          <div className="grid grid-cols-2 gap-3">
            <ResultCard
              icon={<Euro size={16} className="text-red-400" />}
              label="Coût total / mois"
              value={fmtEur(results.coutTotalMensuel)}
              sub={`${fmtEur(results.coutTotalAnnuel)} / an`}
            />
            <ResultCard
              icon={<TrendingUp size={16} className="text-green-400" />}
              label="Revenu MRR / mois"
              value={fmtEur(results.revenuMRR)}
              sub={`${fmtEur(results.revenuAnnuelARR)} ARR`}
            />
            <ResultCard
              icon={<Users size={16} className="text-violet-400" />}
              label="Clients / mois"
              value={fmt(results.clientsParMois)}
              sub={`${fmt(results.meetingsParMois)} meetings, ${fmt(results.repliesParMois)} réponses`}
            />
            <ResultCard
              icon={<Calculator size={16} className="text-indigo-400" />}
              label="CAC par client"
              value={fmtEur(results.cacParClient)}
              sub={`Payback : ${results.paybackMois.toFixed(1)} mois`}
            />
          </div>

          {/* Marge */}
          <div className="rounded-2xl border border-line bg-surface-card p-5">
            <div className="text-xs text-content-tertiary uppercase tracking-wider mb-1">Marge mensuelle</div>
            <div className={`text-3xl font-bold mb-1 ${results.margeMensuelle >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {results.margeMensuelle >= 0 ? '+' : ''}{fmtEur(results.margeMensuelle)}
            </div>
            <div className="text-sm text-content-secondary">
              Seuil de rentabilité : <strong>{results.seuilRentabiliteClients} clients / mois</strong>
            </div>
          </div>

          {/* Funnel */}
          <div className="rounded-2xl border border-line bg-surface-card p-5">
            <div className="text-xs text-content-tertiary uppercase tracking-wider mb-3">Funnel mensuel</div>
            <FunnelStep label="Emails envoyés" value={results.emailsParMois} max={results.emailsParMois} color="bg-violet-500" />
            <FunnelStep label="Réponses" value={results.repliesParMois} max={results.emailsParMois} color="bg-indigo-500" />
            <FunnelStep label="Meetings" value={results.meetingsParMois} max={results.emailsParMois} color="bg-fuchsia-500" />
            <FunnelStep label="Clients signés" value={results.clientsParMois} max={results.emailsParMois} color="bg-pink-500" />
          </div>
        </section>
      </div>

      {/* Méthodo + bench */}
      <section className="rounded-2xl border border-line bg-surface-card p-5 mb-8">
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Info size={18} className="text-violet-400" />
          Comment interpréter ces résultats
        </h2>
        <ul className="text-sm text-content-secondary space-y-2 list-disc list-inside">
          <li><strong className="text-content-primary">ROI &gt; 300%</strong> : excellent, vous pouvez doubler l&apos;équipe.</li>
          <li><strong className="text-content-primary">ROI 100-300%</strong> : bon, à scaler progressivement.</li>
          <li><strong className="text-content-primary">ROI 0-100%</strong> : marche mais à optimiser (reply rate, win rate, deal size).</li>
          <li><strong className="text-content-primary">ROI négatif</strong> : revoir l&apos;ICP, le pitch ou réduire les coûts (outils, salaires).</li>
        </ul>
        <p className="text-xs text-content-tertiary mt-3">
          Benchmarks France 2026 :
          CAC SaaS B2B 600-1500 €, payback 12-18 mois, ratio CAC/LTV cible 1/3 ou meilleur.
          Source : <a href="/etude/prospection-b2b-france-2026" className="text-violet-400 hover:underline">étude Prospectia 2026</a>.
        </p>
      </section>
    </div>
  );
}

function Field({ label, hint, value, onChange, min, max, step, fmt }) {
  return (
    <div>
      <label className="block text-sm font-medium text-content-primary mb-1">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min} max={max} step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="flex-1 accent-violet-500"
        />
        <input
          type="number"
          min={min} max={max} step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-24 px-2 py-1 rounded bg-surface-base border border-line text-sm font-mono text-right"
        />
      </div>
      {hint && <div className="text-xs text-content-tertiary mt-1">{hint}</div>}
    </div>
  );
}

function ResultCard({ icon, label, value, sub }) {
  return (
    <div className="rounded-xl border border-line bg-surface-card p-4">
      <div className="flex items-center gap-1.5 text-xs text-content-tertiary uppercase tracking-wider mb-1">
        {icon} {label}
      </div>
      <div className="text-xl font-bold text-content-primary mb-0.5">{value}</div>
      <div className="text-xs text-content-tertiary">{sub}</div>
    </div>
  );
}

function FunnelStep({ label, value, max, color }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="mb-2 last:mb-0">
      <div className="flex justify-between text-xs text-content-secondary mb-1">
        <span>{label}</span>
        <span className="font-mono font-semibold">{fmt(value)}</span>
      </div>
      <div className="h-2 rounded-full bg-surface-elevated overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
