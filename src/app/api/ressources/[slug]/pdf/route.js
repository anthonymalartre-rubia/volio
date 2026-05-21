// Cette route est DÉSACTIVÉE volontairement.
//
// Tentative initiale : générer un vrai PDF côté serveur via puppeteer-core +
// @sparticuz/chromium. Ça compile localement mais le bundle dépasse les
// limites du free tier Vercel (50 MB compressé) et la route plante en prod
// avec une erreur "Cannot find module" ou un timeout.
//
// Solution adoptée : on garde le bouton "Télécharger en PDF" sur l'UI qui
// déclenche window.print() avec une modale d'instruction. Le navigateur
// génère un PDF de qualité native gratuitement, sans dépendance externe.
//
// Si on veut un VRAI PDF serveur plus tard, options :
//   1. Vercel Pro (4-8 GB de bundle) + puppeteer-core full
//   2. Service externe (browserless.io, htmlcsstoimage) — payant
//   3. @react-pdf/renderer — nécessite réécrire chaque composant en <View><Text>

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const { slug } = await params;
  return NextResponse.json(
    {
      error: 'Génération PDF serveur indisponible',
      message: 'Utilisez le bouton "Télécharger en PDF" sur la page — il déclenche la dialog d\'impression du navigateur (option "Enregistrer au format PDF").',
      fallback_url: `https://prospectia.cloud/ressources/${slug}/telecharger`,
    },
    { status: 410 /* Gone */ }
  );
}
