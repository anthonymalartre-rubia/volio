import { notFound, redirect } from 'next/navigation';
import { getCompetitor, getAllCompetitors } from '@/lib/competitors';
import CompetitorVsPage from '@/components/CompetitorVsPage';

export async function generateStaticParams() {
  return getAllCompetitors().map((c) => ({ competitor: c.slug }));
}

export async function generateMetadata({ params }) {
  const { competitor: slug } = await params;
  const c = getCompetitor(slug);
  if (!c) return {};

  const savingsPct = Math.max(0, Math.round((c.pricing - 19) / c.pricing * 100));
  return {
    title: `Meilleure alternative à ${c.name} en 2026 — Prospectia (à partir de 19 €/mois)`,
    description: `Cherche une alternative à ${c.name} ? Prospectia est l'alternative française pour la prospection B2B : à partir de 19 €/mois (${savingsPct}% moins cher), scraping intelligent + Google Places, conforme RGPD.`,
    alternates: {
      canonical: `https://prospectia.cloud/alternative/${slug}`,
      // Lien croisé vers le comparatif neutre /vs/X — Google comprend que
      // les 2 URLs visent 2 intents distincts (alternative vs comparaison)
      // mais sur le même outil, et qu'elles sont liées.
    },
    openGraph: {
      title: `Alternative à ${c.name} en 2026 — Prospectia`,
      description: `L'alternative française à ${c.name} : à partir de 19 €/mois, scraping + Google Places, conforme RGPD.`,
      url: `https://prospectia.cloud/alternative/${slug}`,
    },
    other: {
      'See also': `https://prospectia.cloud/vs/${slug}`,
    },
  };
}

export default async function AlternativeCompetitor({ params }) {
  const { competitor: slug } = await params;
  const c = getCompetitor(slug);
  if (!c) notFound();

  // Reuse the comparison component (same content, different keyword target)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Alternative à ${c.name}`,
    description: `Prospectia est l'alternative française à ${c.name} pour la prospection B2B.`,
    url: `https://prospectia.cloud/alternative/${slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CompetitorVsPage competitor={c} intent="alternative" />
    </>
  );
}
