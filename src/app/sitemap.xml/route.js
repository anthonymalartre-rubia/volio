// Sitemap index dynamique.
//
// Next.js 14 (App Router) avec generateSitemaps() génère bien les
// sous-sitemaps /sitemap/0.xml, /sitemap/1.xml, ... mais ne génère PAS
// automatiquement l'index /sitemap.xml. Conséquence : Google Search
// Console renvoie 404 sur /sitemap.xml et ne découvre aucun sous-fichier.
//
// Ce route handler reproduit la même logique de chunks que
// src/app/sitemap.js (1 page statique + N chunks SEO de 5000 URLs),
// puis émet un <sitemapindex> qui les liste.

import { getAllSeoUrls } from '@/lib/slugs';

const BASE = 'https://prospectia.cloud';
const CHUNK_SIZE = 5000;

// 1 régénération / jour suffit (les chunks bougent peu)
export const revalidate = 86400;

export async function GET() {
  const seoUrls = getAllSeoUrls(BASE);
  const seoChunks = Math.ceil(seoUrls.length / CHUNK_SIZE);
  // id=0 : pages statiques + blog/guides/glossaire/vs (~150 URLs)
  // id=1..N : chunks SEO programmatiques
  const totalChunks = seoChunks + 1;

  const now = new Date().toISOString();
  const entries = Array.from({ length: totalChunks }, (_, i) => `  <sitemap>
    <loc>${BASE}/sitemap/${i}.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
