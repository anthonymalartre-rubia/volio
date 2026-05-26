'use client';

// ─────────────────────────────────────────────────────────────────────
// BookDemoButton — CTA "Réserver 15 min de démo" vers Google Calendar
// ─────────────────────────────────────────────────────────────────────
// Lien direct vers la page de booking Google Calendar du founder Anthony.
// On garde la landing rapide (pas de script externe). Le tracking se fait
// via Vercel Analytics (custom event book_demo_clicked + source) — Google
// Calendar appointments ne propage pas les query params, donc pas d'UTM.
//
// Variants : primary | secondary | ghost | dark
// Sizes    : sm | md | lg
//
// Override le lien via env var NEXT_PUBLIC_BOOKING_URL
// (fallback : Google Calendar Anthony).
// ─────────────────────────────────────────────────────────────────────

import { CalendarCheck } from 'lucide-react';

const BOOKING_URL =
  process.env.NEXT_PUBLIC_BOOKING_URL ||
  'https://calendar.app.google/AN4reEL1poDB6KmW8';

/**
 * Retourne l'URL de booking. Le source est passé pour le tracking Vercel
 * Analytics côté onClick (les query params ne fonctionnent pas avec les
 * URLs courtes calendar.app.google).
 */
export function getCalUrl(_source = 'unknown') {
  return BOOKING_URL;
}

const VARIANT_STYLES = {
  // Vert emerald : couleur "succès / sans engagement" — se distingue du
  // violet/indigo des CTAs signup principaux pour éviter la cannibalisation.
  primary:
    'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30',
  secondary:
    'bg-white hover:bg-emerald-50 text-emerald-700 border-2 border-emerald-300 hover:border-emerald-400',
  ghost:
    'bg-transparent hover:bg-emerald-50 text-emerald-700 border border-emerald-200 hover:border-emerald-300',
  // dark : pour les sections gradient violet (CTA final landing/pricing) où
  // primary emerald ne contraste pas bien sur fond violet.
  dark:
    'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 backdrop-blur-sm',
};

const SIZE_STYLES = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-7 py-4 text-base gap-2',
};

const ICON_SIZE = { sm: 12, md: 14, lg: 18 };

export default function BookDemoButton({
  label = 'Réserver 15 min de démo',
  variant = 'primary',
  size = 'md',
  source = 'unknown',
  className = '',
  showIcon = true,
}) {
  const url = getCalUrl(source);

  const handleClick = () => {
    // Vercel Analytics custom event — visible dans /analytics → events
    if (typeof window !== 'undefined' && typeof window.va === 'function') {
      try {
        window.va('event', { name: 'book_demo_clicked', source });
      } catch {
        // ignore — analytics non bloquant
      }
    }
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`inline-flex items-center justify-center rounded-xl font-semibold transition-all ${VARIANT_STYLES[variant] || VARIANT_STYLES.primary} ${SIZE_STYLES[size] || SIZE_STYLES.md} ${className}`}
      data-cta="book-demo"
      data-cta-source={source}
    >
      {showIcon && <CalendarCheck size={ICON_SIZE[size] || 14} />}
      {label}
    </a>
  );
}
