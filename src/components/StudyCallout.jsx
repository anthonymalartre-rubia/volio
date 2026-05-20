import Link from 'next/link';
import { BarChart3, ArrowRight } from 'lucide-react';

/**
 * Encart compact qui pousse l'étude exclusive Prospectia depuis tous les
 * articles blog + guides. Génère ~50 backlinks internes contextuels.
 */
export default function StudyCallout() {
  return (
    <aside className="mt-12 rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-500/[0.06] via-indigo-500/[0.04] to-transparent p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
          <BarChart3 size={18} className="text-violet-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-semibold text-violet-300 uppercase tracking-wider mb-1.5">
            Étude exclusive Prospectia
          </div>
          <h3 className="text-base sm:text-lg font-bold text-content-primary mb-2">
            L&apos;État de la Prospection B2B en France 2026
          </h3>
          <p className="text-sm text-content-secondary leading-relaxed mb-3">
            38 chiffres clés sur le marché français : coûts réels, performance cold email,
            conformité RGPD, couverture par secteur et par région. Données publiques + analyse Prospectia.
          </p>
          <Link
            href="/etude/prospection-b2b-france-2026"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-300 hover:text-violet-200 transition group"
          >
            Lire l&apos;étude complète
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
