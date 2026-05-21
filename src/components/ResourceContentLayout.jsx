'use client';

import Link from 'next/link';
import { ArrowLeft, Printer, Zap } from 'lucide-react';
import ReaderHeader from '@/components/ReaderHeader';
import ReaderFooter from '@/components/ReaderFooter';

/**
 * Layout commun pour toutes les pages de contenu des ressources :
 * - /ressources/[slug]/telecharger (versions imprimables PDF-like)
 * - /ressources/[slug]/utiliser (calculateurs interactifs)
 *
 * Inclut un CSS @media print pour transformer en PDF propre (Cmd+P)
 * et une bannière "Imprimer / Sauvegarder en PDF" pour les ressources
 * imprimables.
 */
export default function ResourceContentLayout({
  resource,
  printable = false,
  children,
}) {
  return (
    <div className="min-h-screen bg-surface-base text-content-primary">
      {/* Print-only styles : cache le header/footer/CTA, optimise les sauts de page */}
      <style jsx global>{`
        @media print {
          /* Cache les éléments d'UI non pertinents en PDF */
          .no-print { display: none !important; }
          /* Texte noir, fond blanc pour économiser l'encre */
          body { background: #fff !important; color: #1a1a1a !important; }
          .print-bg-white { background: #fff !important; }
          .print-text-black { color: #1a1a1a !important; }
          /* Évite la coupure au milieu des sections */
          h1, h2, h3 { break-after: avoid; page-break-after: avoid; }
          .keep-together { break-inside: avoid; page-break-inside: avoid; }
          /* Marges PDF */
          @page { margin: 1.5cm 1.2cm; }
        }
      `}</style>

      <div className="no-print">
        <ReaderHeader />
      </div>

      <main className="pt-24 pb-16 print:pt-0 print:pb-0">
        {/* Top bar : retour + print */}
        <div className="no-print max-w-4xl mx-auto px-4 sm:px-6 mb-6 flex items-center justify-between gap-3 flex-wrap">
          <Link
            href={`/ressources/${resource.slug}`}
            className="inline-flex items-center gap-2 text-sm text-content-tertiary hover:text-violet-400 transition"
          >
            <ArrowLeft size={14} />
            Retour à la description
          </Link>

          {printable && (
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition shadow-lg shadow-violet-500/20"
            >
              <Printer size={14} />
              Imprimer / Sauvegarder en PDF
            </button>
          )}
        </div>

        {/* Contenu */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 print:max-w-none print:px-0 print-bg-white">
          {children}
        </article>

        {/* Footer CTA — caché en print */}
        <div className="no-print max-w-4xl mx-auto px-4 sm:px-6 mt-12">
          <div className="rounded-2xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/30 p-6 sm:p-8 text-center">
            <Zap size={28} className="text-violet-400 mx-auto mb-3" />
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Au-delà de cette ressource</h2>
            <p className="text-content-secondary mb-5 max-w-xl mx-auto text-sm">
              Prospectia trouve les entreprises et leurs emails partout en France.
              Gratuit pour commencer · à partir de 19 €/mois.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition"
            >
              Démarrer gratuitement
            </Link>
          </div>
        </div>
      </main>

      <div className="no-print">
        <ReaderFooter />
      </div>
    </div>
  );
}
