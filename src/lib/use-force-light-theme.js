'use client';

// ─────────────────────────────────────────────────────────────────────
// useForceLightTheme — force light mode sur les pages marketing
// ─────────────────────────────────────────────────────────────────────
//
// Décision UX rebrand Volia mai 2026 :
//
// Les pages MARKETING (landing, produits, blog, outils, comparatifs,
// pricing, FAQ, auth shell, etc.) DOIVENT TOUJOURS être en light mode.
// Raison : tous les concurrents B2B sales (Waalaxy, Apollo, Lemlist,
// HubSpot, Salesforce, Pipedrive…) ont leurs pages publiques en light.
// Un visiteur SDR/commercial qui découvre Volia en dark serait perdu
// (sensation "dev tool" vs "outil pro accessible") = mauvaise conversion.
//
// L'APP (dashboard, settings, /app/*) reste theme-aware : l'user peut
// toggle dark/light via ThemeToggle pour son confort de travail (les
// SaaS comme Linear, GitHub, Vercel laissent ce choix dans l'app).
//
// Implémentation : ce hook ajoute `light` sur <html> au mount. Il ne
// touche PAS au localStorage (sinon il override le choix dashboard de
// l'user). Quand l'user navigue vers /dashboard, le ThemeProvider
// re-sync avec localStorage (peut remettre dark si c'est sa préférence).
//
// Usage : appeler en haut d'un composant client (LandingContent,
// ProductPageLayout, AuthPageShell, etc.).
// ─────────────────────────────────────────────────────────────────────

import { useEffect } from 'react';

export function useForceLightTheme() {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.add('light');
  }, []);
}
