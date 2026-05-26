'use client';

import { useEffect } from 'react';
import { Lock, Zap, X, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { getPlan } from '@/lib/plans';

/**
 * Modal affichée quand un utilisateur clique sur un item de navigation
 * (ou une feature) qui nécessite un plan supérieur au sien.
 *
 * Pattern de conversion : on ne CACHE plus les features premium (sinon
 * l'user ne sait pas qu'elles existent et n'upgrade jamais). On les MONTRE
 * avec un badge "Pro" / "Business" + ouverture de cette modale au clic
 * → CTA direct vers la page pricing avec le bon plan présélectionné.
 *
 * Props :
 *  - feature: string          — nom de la feature ("Vérifier emails")
 *  - requiredPlan: 'solo'|'pro'|'business'
 *  - currentPlan?: string     — id du plan actuel (pour wording)
 *  - onClose: () => void
 *  - onUpgrade?: (planId) => void  — si fourni, déclenche le flow Stripe direct
 *                                    (sinon redirige vers /pricing?plan=X)
 */
export default function UpgradeRequiredModal({
  feature,
  requiredPlan,
  currentPlan,
  onClose,
  onUpgrade,
}) {
  // Echap pour fermer + lock scroll body
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const plan = getPlan(requiredPlan);
  const planName = plan?.name || requiredPlan;
  const priceEuros = plan?.price ? Math.round(plan.price / 100) : null;

  // Bénéfices à mettre en avant pour le plan ciblé (3 premiers features)
  const benefits = (plan?.features || []).slice(0, 4);

  const handleUpgradeClick = () => {
    if (typeof onUpgrade === 'function') {
      onUpgrade(requiredPlan);
      return;
    }
    // Fallback : redirection vers /pricing avec plan présélectionné
    window.location.href = `/pricing?plan=${requiredPlan}`;
  };

  const handleSeeAllPlans = () => {
    window.location.href = '/pricing';
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-required-title"
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-surface-card border border-line shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-lg text-content-muted hover:text-content-primary hover:bg-surface-elevated transition"
          aria-label="Fermer"
        >
          <X size={16} />
        </button>

        {/* Header — gradient violet/indigo "premium" */}
        <div className="relative px-6 pt-7 pb-5 bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-violet-500/10 border-b border-line">
          <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="relative flex items-start gap-3">
            <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Lock size={20} className="text-white" />
            </div>
            <div className="flex-1 pr-6">
              <h2 id="upgrade-required-title" className="text-lg font-semibold text-content-primary leading-tight">
                {feature ? `${feature} — réservé au plan ${planName}` : `Fonctionnalité ${planName}`}
              </h2>
              <p className="mt-1 text-xs text-content-tertiary">
                {feature
                  ? `Cette fonctionnalité est incluse dans le plan ${planName}${priceEuros ? ` (${priceEuros} €/mois)` : ''}.`
                  : `Disponible dès le plan ${planName}${priceEuros ? ` (${priceEuros} €/mois)` : ''}.`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Bénéfices du plan ciblé */}
          {benefits.length > 0 && (
            <div className="rounded-xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                  <Sparkles size={12} className="text-white" />
                </div>
                <span className="text-sm font-semibold text-content-primary">
                  Ce que vous débloquez avec {planName}
                </span>
              </div>
              <ul className="space-y-1.5">
                {benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-content-secondary">
                    <Zap size={12} className="text-violet-500 mt-0.5 flex-shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Trust signal */}
          <div className="flex items-center gap-2 text-[11px] text-content-muted">
            <ShieldCheck size={13} className="text-emerald-500" />
            <span>Sans engagement · Annulation en 1 clic · Données conservées</span>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="px-6 pb-6 pt-1 flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleUpgradeClick}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 hover:from-violet-500 hover:to-indigo-500 transition-all active:scale-[0.98]"
          >
            <Zap size={16} />
            Passer à {planName}{priceEuros ? ` (${priceEuros} €/mois)` : ''}
            <ArrowRight size={16} />
          </button>
          <button
            onClick={handleSeeAllPlans}
            className="inline-flex items-center justify-center px-4 py-3 rounded-xl border border-line-hover bg-surface-card text-sm font-medium text-content-secondary hover:text-content-primary hover:border-content-faint hover:bg-surface-elevated transition-all active:scale-[0.98]"
          >
            Voir tous les plans
          </button>
        </div>
      </div>
    </div>
  );
}
