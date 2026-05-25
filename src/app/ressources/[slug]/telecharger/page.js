// Page de téléchargement / consultation du contenu d'une ressource "PDF-like".
// Route : /ressources/[slug]/telecharger
//
// L'utilisateur a soit cliqué le lien dans son email après capture,
// soit ouvert directement l'URL (le contenu est aussi public — c'est
// indexable Google + accessible par les LLMs, ce qui est positif pour le SEO).
//
// CSS @media print permet de "Sauvegarder en PDF" via Cmd+P du navigateur.

import { notFound } from 'next/navigation';
import { getResource, getAllResources } from '@/lib/resources';
import ResourceContentLayout from '@/components/ResourceContentLayout';
import TemplatesColdEmail from '@/components/resources/TemplatesColdEmail';
import ScriptColdCall from '@/components/resources/ScriptColdCall';
import ChecklistRgpd from '@/components/resources/ChecklistRgpd';
import ChecklistWarmup from '@/components/resources/ChecklistWarmup';
import TemplateSalesPlaybook from '@/components/resources/TemplateSalesPlaybook';
import TemplateIcp from '@/components/resources/TemplateIcp';

// Mapping slug → composant de contenu.
// Si le slug est un "calculateur" (deliveryMode: direct), il n'apparaît PAS
// ici (il sera servi par la route /utiliser à la place).
const CONTENT_MAP = {
  'templates-cold-email-b2b-fr': TemplatesColdEmail,
  'script-cold-call-b2b-fr': ScriptColdCall,
  'checklist-rgpd-cold-email': ChecklistRgpd,
  'checklist-warmup-domaine-cold-email': ChecklistWarmup,
  'template-sales-playbook-tpe-pme': TemplateSalesPlaybook,
  'template-icp-b2b': TemplateIcp,
};

export async function generateStaticParams() {
  // Génère uniquement les pages des ressources non-calculatrices
  return getAllResources()
    .filter((r) => r.deliveryMode !== 'direct')
    .map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const r = getResource(slug);
  if (!r) return {};
  return {
    title: `${r.title} — Ressource Volia`,
    description: r.shortDesc,
    alternates: { canonical: `https://volia.fr/ressources/${slug}/telecharger` },
    // Pages volontairement indexables : contenu de valeur, SEO bonus
    robots: { index: true, follow: true },
  };
}

export default async function ResourceContentPage({ params }) {
  const { slug } = await params;
  const r = getResource(slug);
  const Content = CONTENT_MAP[slug];

  if (!r || !Content) notFound();

  return (
    <ResourceContentLayout resource={r} printable>
      <Content />
    </ResourceContentLayout>
  );
}
