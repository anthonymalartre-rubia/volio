import { notFound } from 'next/navigation';
import PersonaPage from '@/components/PersonaPage';
import { getPersona, getAllPersonas } from '@/lib/personas';
import { breadcrumbSchema, productSchema } from '@/lib/seo-helpers';

const SITE_URL = 'https://prospectia.cloud';

export async function generateStaticParams() {
  return getAllPersonas().map((p) => ({ persona: p.slug }));
}

export async function generateMetadata({ params }) {
  const { persona: slug } = await params;
  const persona = getPersona(slug);
  if (!persona) return {};
  return {
    title: persona.title,
    description: persona.metaDescription,
    alternates: { canonical: `${SITE_URL}/pour/${slug}` },
    openGraph: {
      title: persona.title,
      description: persona.metaDescription,
      url: `${SITE_URL}/pour/${slug}`,
    },
  };
}

export default async function PersonaRoute({ params }) {
  const { persona: slug } = await params;
  const persona = getPersona(slug);
  if (!persona) notFound();

  const breadcrumbs = [
    { label: 'Accueil', href: '/' },
    { label: persona.badge },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      breadcrumbSchema(breadcrumbs),
      {
        '@type': 'WebPage',
        name: persona.title,
        description: persona.metaDescription,
        url: `${SITE_URL}/pour/${slug}`,
        inLanguage: 'fr-FR',
      },
      productSchema({
        name: `Prospectia ${persona.badge}`,
        description: persona.intro,
        url: `${SITE_URL}/pour/${slug}`,
        priceFrom: persona.idealPlan?.price || 19,
      }),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PersonaPage persona={persona} />
    </>
  );
}
