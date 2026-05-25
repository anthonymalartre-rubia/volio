import Link from 'next/link';
import { Book, ArrowRight } from 'lucide-react';
import { getGlossaryByCategory, getAllGlossaryTerms } from '@/lib/glossary';
import { breadcrumbSchema } from '@/lib/seo-helpers';
import ReaderHeader from '@/components/ReaderHeader';
import ReaderFooter from '@/components/ReaderFooter';

export const metadata = {
  title: 'Glossaire prospection B2B — Termes, concepts, définitions',
  description: 'Dictionnaire des termes de la prospection B2B en 2026 : cold emailing, ICP, BANT, RGPD, deliverability, CRM. Définitions claires et exemples.',
  alternates: { canonical: 'https://volia.fr/glossaire' },
  openGraph: {
    title: 'Glossaire prospection B2B',
    description: 'Tous les termes de la prospection B2B expliqués simplement.',
    url: 'https://volia.fr/glossaire',
  },
};

export default function GlossaryIndex() {
  const grouped = getGlossaryByCategory();
  const all = getAllGlossaryTerms();

  const breadcrumbs = [{ label: 'Accueil', href: '/' }, { label: 'Glossaire' }];
  const jsonLd = breadcrumbSchema(breadcrumbs);

  return (
    <div className="min-h-screen bg-surface-base text-content-primary">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ReaderHeader />

      <main className="pt-24 pb-16">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs text-violet-300 mb-6">
            <Book size={12} />
            Glossaire
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight mb-6 text-content-primary">
            Glossaire de la prospection B2B
          </h1>
          <p className="text-lg text-content-secondary leading-relaxed max-w-2xl">
            {all.length} termes essentiels de la prospection B2B en 2026 : cold emailing, deliverability, RGPD, CRM... Définitions claires et exemples pratiques.
          </p>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6">
          {Object.entries(grouped).map(([category, terms]) => (
            <div key={category} className="mb-10">
              <h2 className="text-sm font-semibold text-violet-400 uppercase tracking-wider mb-4">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {terms.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/glossaire/${t.slug}`}
                    className="block rounded-xl border border-line bg-surface-card hover:bg-surface-elevated hover:border-violet-500/30 transition p-4 group"
                  >
                    <h3 className="font-semibold mb-1 group-hover:text-violet-400 transition flex items-center gap-2">
                      {t.term}
                      <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition" />
                    </h3>
                    <p className="text-sm text-content-tertiary leading-snug">{t.shortDef}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>

      <ReaderFooter />
    </div>
  );
}
