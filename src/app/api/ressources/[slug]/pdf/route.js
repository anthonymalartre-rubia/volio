// Génère un vrai PDF de la page /ressources/[slug]/telecharger via Puppeteer.
//
// Pourquoi pas client-side (html2pdf.js) ?
//   → qualité médiocre, ne gère pas bien les sauts de page, performance moyenne.
//
// Pourquoi pas @react-pdf/renderer ?
//   → nécessite de réécrire entièrement les composants en <View><Text> custom.
//     Pour 6 ressources, trop coûteux.
//
// Solution : puppeteer-core + @sparticuz/chromium qui marche sur Vercel
// (serverless function). On charge l'URL HTML existante, on génère le PDF.
// Réutilise le @media print CSS déjà en place.

import { NextResponse } from 'next/server';
import { getResource } from '@/lib/resources';

// Edge runtime NE supporte PAS puppeteer → forcer Node.js runtime
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Vercel free tier : 10s. Pro : 60s. Notre génération prend ~3-5s.
export const maxDuration = 30;

export async function GET(request, { params }) {
  const { slug } = await params;
  const resource = getResource(slug);

  if (!resource) {
    return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
  }
  if (resource.deliveryMode === 'direct') {
    return NextResponse.json(
      { error: 'Cette ressource est un calculateur, pas un PDF.' },
      { status: 400 }
    );
  }

  try {
    // Import dynamique pour ne pas bloater le bundle si la route n'est pas appelée
    const [{ default: chromium }, puppeteer] = await Promise.all([
      import('@sparticuz/chromium'),
      import('puppeteer-core'),
    ]);

    const isLocal = process.env.NODE_ENV === 'development';

    const browser = await puppeteer.default.launch({
      args: isLocal
        ? ['--no-sandbox', '--disable-setuid-sandbox']
        : chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: isLocal
        ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
        : await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    // Construit l'URL absolue de la page à imprimer
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${request.headers.get('host')}`;
    const targetUrl = `${baseUrl}/ressources/${slug}/telecharger?pdf=1`;

    // ?pdf=1 → on pourrait ajouter un CSS spécifique côté front si besoin
    await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: 25_000 });

    // Force le mode print et attend les éventuelles polices
    await page.emulateMediaType('print');

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '15mm', bottom: '15mm', left: '15mm', right: '15mm' },
      displayHeaderFooter: true,
      headerTemplate: `<div></div>`,
      footerTemplate: `
        <div style="font-size:9px; color:#888; width:100%; padding:0 15mm; display:flex; justify-content:space-between;">
          <span>Prospectia · ${resource.title.substring(0, 60)}</span>
          <span><span class="pageNumber"></span> / <span class="totalPages"></span></span>
        </div>
      `,
    });

    await browser.close();

    // Nom de fichier propre : prospectia-templates-cold-email-b2b-fr.pdf
    const filename = `prospectia-${slug}.pdf`;

    return new NextResponse(pdf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (err) {
    console.error('[api/ressources/pdf] error', err);
    return NextResponse.json(
      { error: 'Erreur génération PDF. Réessayez ou utilisez le bouton "Imprimer" en haut.' },
      { status: 500 }
    );
  }
}
