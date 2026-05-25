// Page d'utilisation d'un calculateur interactif.
// Route : /ressources/[slug]/utiliser
//
// Réservée aux ressources avec deliveryMode: 'direct' (calculateurs web).
// Pas de capture lead — accès immédiat (UX premium pour les outils).

import { notFound } from 'next/navigation';
import { getResource, getAllResources } from '@/lib/resources';
import ResourceContentLayout from '@/components/ResourceContentLayout';
import CalculatorCacLtv from '@/components/resources/CalculatorCacLtv';
import CalculatorRoiProspection from '@/components/resources/CalculatorRoiProspection';

const CONTENT_MAP = {
  'calculateur-cac-ltv-saas': CalculatorCacLtv,
  'calculateur-roi-prospection-b2b': CalculatorRoiProspection,
};

export async function generateStaticParams() {
  return getAllResources()
    .filter((r) => r.deliveryMode === 'direct')
    .map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const r = getResource(slug);
  if (!r) return {};
  return {
    title: `${r.title} — Outil gratuit Volia`,
    description: r.shortDesc,
    alternates: { canonical: `https://volia.fr/ressources/${slug}/utiliser` },
    robots: { index: true, follow: true },
  };
}

export default async function ResourceCalculatorPage({ params }) {
  const { slug } = await params;
  const r = getResource(slug);
  const Content = CONTENT_MAP[slug];

  if (!r || !Content) notFound();

  return (
    <ResourceContentLayout resource={r}>
      <Content />
    </ResourceContentLayout>
  );
}
