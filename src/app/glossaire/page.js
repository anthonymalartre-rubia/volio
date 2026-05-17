import Link from 'next/link';
import { Book, ArrowRight } from 'lucide-react';
import { getGlossaryByCategory, getAllGlossaryTerms } from '@/lib/glossary';
import { breadcrumbSchema } from '@/lib/seo-helpers';

export const metadata = {
  title: 'Glossaire prospection B2B — Termes, concepts, définitions',
  description: 'Dictionnaire des termes de la prospection B2B en 2026 : cold emailing, ICP, BANT, RGPD, deliverability, CRM. Définitions claires et exemples.',
  alternates: { canonical: 'https://prospectia.cloud/glossaire' },
  openGraph: {
    title: 'Glossaire prospection B2B',
    description: 'Tous les termes de la prospection B2B expliqués simplement.',
    url: 'https://prospectia.cloud/glossaire',
  },
};

export default function GlossaryIndex() {
  const grouped = getGlossaryByCategory();
  const all = getAllGlossaryTerms();

  const breadcrumbs = [{ label: 'Accueil', href: '/' }, { label: 'Glossaire' }];
  const jsonLd = breadcrumbSchema(breadcrumbs);

  return (
    <div className="dark min-h-screen bg-[#08080c] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="fixed top-0 w-full z-50 bg-[#08080c]/70 backdrop-blur-2xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mr-1.5">
              <span className="text-[11px] font-bold text-white">P</span>
            </div>
            <span className="text-lg font-bold tracking-tight">Prospectia</span>
            <span className="text-violet-400 text-xs font-semibold">.cloud</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition">Se connecter</Link>
            <Link href="/signup" className="text-sm px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold transition">
              Essayer gratuitement
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs text-violet-300 mb-6">
            <Book size={12} />
            Glossaire
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight mb-6 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
            Glossaire de la prospection B2B
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed max-w-2xl">
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
                    className="block rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-violet-500/30 transition p-4 group"
                  >
                    <h3 className="font-semibold mb-1 group-hover:text-violet-400 transition flex items-center gap-2">
                      {t.term}
                      <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition" />
                    </h3>
                    <p className="text-sm text-zinc-500 leading-snug">{t.shortDef}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-white/[0.06] py-8 mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-zinc-500">© 2026 Prospectia.cloud</div>
          <div className="flex gap-4 text-xs text-zinc-500">
            <Link href="/cgu" className="hover:text-zinc-300 transition">CGU</Link>
            <Link href="/confidentialite" className="hover:text-zinc-300 transition">Confidentialité</Link>
            <Link href="/rgpd" className="hover:text-zinc-300 transition">RGPD</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
