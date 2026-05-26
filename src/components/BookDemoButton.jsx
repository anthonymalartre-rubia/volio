'use client';

// ─────────────────────────────────────────────────────────────────────
// BookDemoButton — CTA "Réserver 15 min de démo" vers Cal.com
// ─────────────────────────────────────────────────────────────────────
// Lien direct vers la page Cal.com du founder Anthony (variant léger,
// pas de script Cal.com chargé : on garde la landing rapide). Le tracking
// UTM permet d'attribuer la source du booking (landing, pricing, vs/X…).
//
// Variants : primary | secondary | ghost | dark
// Sizes    : sm | md | lg
//
// Override le slug Cal.com via env vars NEXT_PUBLIC_CAL_USERNAME +
// NEXT_PUBLIC_CAL_EVENT_TYPE (fallback : anthony-malartre/15min).
// ─────────────────────────────────────────────────────────────────────

import { CalendarCheck } from 'lucide-react';

const CAL_USERNAME = process.env.NEXT_PUBLIC_CAL_USERNAME || 'anthony-malartre';
const CAL_EVENT_TYPE = process.env.NEXT_PUBLIC_CAL_EVENT_TYPE || '15min';

/**
 * Construit l'URL Cal.com avec tracking UTM (source du clic).
 * Exposé pour réutilisation par /demo (iframe embed inline).
 */
export function getCalUrl(source = 'unknown') {
  const safeSource = String(source).replace(/[^a-z0-9_-]/gi, '_');
  return `https://cal.com/${CAL_USERNAME}/${CAL_EVENT_TYPE}?utm_source=volia&utm_medium=cta&utm_campaign=${safeSource}`;
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
