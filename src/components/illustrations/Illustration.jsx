// Brand Sprint 2 — Illustration system.
//
// 8 illustrations SVG cohérentes en flat-design moderne, palette violet/indigo.
// Style abstrait mais lisible. Inspiration : Linear / Vercel / Cal.com en violet.
//
// Usage :
//   import Illustration from '@/components/illustrations/Illustration';
//   <Illustration name="empty-state-prospection" className="w-64" alt="" />
//
// Les SVG sources vivent dans /public/illustrations/*.svg
// On les charge via <img> pour bénéficier du cache navigateur + lazy loading.

import Image from 'next/image';

const ILLUSTRATIONS = {
  'empty-state-prospection': { w: 320, h: 220, alt: 'Carte de France avec une zone de prospection active' },
  'empty-state-crm':         { w: 320, h: 220, alt: 'Pipeline CRM vide invitant à ajouter un deal' },
  'empty-state-campagnes':   { w: 320, h: 220, alt: 'Enveloppe qui s\'envole, première campagne' },
  'empty-state-forms':       { w: 320, h: 220, alt: 'Formulaire vide avec curseur clignotant' },
  'onboarding-step-1':       { w: 320, h: 220, alt: 'Silhouette entourée de points d\'interrogation' },
  'onboarding-step-2':       { w: 320, h: 220, alt: 'Boussole qui pointe vers l\'objectif' },
  'onboarding-step-3':       { w: 320, h: 220, alt: 'Fusée en décollage, prête à lancer' },
  'error-404':               { w: 320, h: 220, alt: 'Logo V légèrement cassé, page 404' },
};

export default function Illustration({
  name,
  className = '',
  alt,
  priority = false,
  width,
  height,
  ...rest
}) {
  const meta = ILLUSTRATIONS[name];
  if (!meta) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[Illustration] unknown name: ${name}`);
    }
    return null;
  }

  return (
    <Image
      src={`/illustrations/${name}.svg`}
      alt={alt ?? meta.alt}
      width={width ?? meta.w}
      height={height ?? meta.h}
      className={className}
      priority={priority}
      unoptimized
      {...rest}
    />
  );
}

// Exporte la liste pour debug/preview (ex: page admin design-system)
export const ILLUSTRATION_NAMES = Object.keys(ILLUSTRATIONS);
