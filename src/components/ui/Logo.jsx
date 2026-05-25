// ─────────────────────────────────────────────────────────────────────
// Logo Volia — composant unifié
// ─────────────────────────────────────────────────────────────────────
//
// 2 sous-composants :
//
// 1. <Logo /> — wordmark complet (symbole P + texte "Volia")
//    Utilise le SVG public/logos/prospectia-wordmark.svg (à renommer Phase C), theme-aware
//    via currentColor (le SVG hérite de la text color du parent).
//
// 2. <LogoIcon /> — symbole P seul (P + viseur intégré), fond gradient
//    indigo→violet. Pour favicon-like, sidebar, hero, OG images.
//
// Le symbole évoque la prospection ciblée :
// - Le P : initiale Volia
// - Le cercle dans le P : radar/cible
// - Le diamant au centre : point de mire (justesse, focus)
//
// Concept design : Concept Cible + Lettre P réinventée (Gemini, mai 2026).
// ─────────────────────────────────────────────────────────────────────

import Link from 'next/link';
import Image from 'next/image';

const SIZES = {
  xs: { icon: 'h-6 w-6', wordmark: 'h-5' },     // sidebar, footer
  sm: { icon: 'h-7 w-7', wordmark: 'h-6' },     // nav, top bar
  md: { icon: 'h-9 w-9', wordmark: 'h-7' },     // login/signup pages
  lg: { icon: 'h-12 w-12', wordmark: 'h-9' },   // hero landing
  xl: { icon: 'h-16 w-16', wordmark: 'h-12' },  // showcase / large
};

// ─────────────────────────────────────────────────────────────────────
// LogoIcon — symbole P seul avec fond gradient indigo→violet
// ─────────────────────────────────────────────────────────────────────
export function LogoIcon({
  size = 'md',
  className = '',
  asLink = false,
  href = '/',
  ariaLabel = 'Volia',
}) {
  const s = SIZES[size] || SIZES.md;
  const icon = (
    <span
      className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20 ${s.icon} ${className}`}
      aria-label={ariaLabel}
      role="img"
    >
      <svg
        viewBox="0 0 32 32"
        className="w-[70%] h-[70%]"
        aria-hidden="true"
      >
        {/* Barre verticale du P */}
        <rect x="7.2" y="6.5" width="3" height="19" fill="white" />
        {/* Boucle du P (cercle radar) */}
        <circle cx="17.5" cy="12.5" r="6.5" fill="none" stroke="white" strokeWidth="3" />
        {/* Viseur central (diamant rotated 45°) */}
        <rect x="15.7" y="10.7" width="3.6" height="3.6" fill="white" transform="rotate(45 17.5 12.5)" />
      </svg>
    </span>
  );

  if (asLink) {
    return (
      <Link href={href} className="inline-flex items-center hover:opacity-90 transition">
        {icon}
      </Link>
    );
  }
  return icon;
}

// ─────────────────────────────────────────────────────────────────────
// Logo — wordmark complet (symbole + texte "Volia")
// ─────────────────────────────────────────────────────────────────────
//
// 2 SVG en swap CSS via la classe .light (qui est ajoutée sur <html>
// par ThemeProvider en mode light) :
// - prospectia-wordmark-dark.svg : fill blanc, visible sur fond sombre (à renommer Phase C)
// - prospectia-wordmark-light.svg : fill noir, visible sur fond clair (à renommer Phase C)
//
// Pourquoi 2 fichiers et pas fill="currentColor" : <Image> de next/image
// traite le SVG comme un raster et NE propage PAS currentColor. Les
// alternatives (mask-image, inline SVG) sont plus lourdes à maintenir.
// 2 fichiers de 7KB chacun reste tout à fait acceptable.
//
// Variants :
// - "wordmark" : SVG complet symbole + texte
// - "icon" : juste le symbole P (alias de LogoIcon)
//
export default function Logo({
  variant = 'wordmark',
  size = 'md',
  className = '',
  asLink = false,
  href = '/',
}) {
  if (variant === 'icon') {
    return <LogoIcon size={size} className={className} asLink={asLink} href={href} />;
  }

  const s = SIZES[size] || SIZES.md;
  const wordmark = (
    <span
      className={`inline-flex items-center ${className}`}
      aria-label="Volia"
    >
      {/* Version dark mode (par défaut, fill blanc) — masquée en .light */}
      <Image
        src="/logos/prospectia-wordmark-dark.svg"
        alt=""
        width={367}
        height={100}
        className={`w-auto block [.light_&]:hidden ${s.wordmark}`}
        priority={size === 'lg' || size === 'xl'}
      />
      {/* Version light mode (fill noir) — visible uniquement quand .light */}
      <Image
        src="/logos/prospectia-wordmark-light.svg"
        alt=""
        width={367}
        height={100}
        className={`w-auto hidden [.light_&]:block ${s.wordmark}`}
        priority={size === 'lg' || size === 'xl'}
      />
    </span>
  );

  if (asLink) {
    return (
      <Link href={href} className="inline-flex items-center hover:opacity-90 transition">
        {wordmark}
      </Link>
    );
  }
  return wordmark;
}
