// Wordmark unifié Prospectia.
//
// Avant : 2 brand marks coexistaient — "Prospectia.ai" en rose (login,
// signup, TopBar) vs "Prospectia.cloud" en violet (footer, marketing,
// auth shell). Schizophrénie complète alors que le domaine officiel
// est prospectia.cloud (cf CLAUDE.md).
//
// Ce composant centralise le rendu pour qu'un changement futur (ex:
// rebranding, accent color update) se fasse en 1 endroit.
//
// Variants :
// - default : "Prospectia" + ".cloud" violet (usage standard)
// - logo : avec le P carré violet/indigo à gauche (header nav, hero)
// - compact : juste "Prospectia" sans suffixe (très petits espaces)

import Link from 'next/link';

const SIZES = {
  xs: { text: 'text-sm', logo: 'w-6 h-6 text-[10px]', suffix: 'text-[10px]' },
  sm: { text: 'text-base', logo: 'w-7 h-7 text-[11px]', suffix: 'text-xs' },
  md: { text: 'text-lg', logo: 'w-8 h-8 text-xs', suffix: 'text-xs' },
  lg: { text: 'text-xl', logo: 'w-9 h-9 text-sm', suffix: 'text-sm' },
  xl: { text: 'text-2xl', logo: 'w-12 h-12 text-base', suffix: 'text-base' },
};

export default function BrandWordmark({
  variant = 'default',
  size = 'md',
  asLink = false,
  href = '/',
  className = '',
}) {
  const s = SIZES[size] || SIZES.md;
  const inner = (
    <span className={`inline-flex items-center gap-1.5 font-bold tracking-tight ${className}`}>
      {variant === 'logo' && (
        <span className={`rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold mr-1 shadow-lg shadow-violet-500/20 ${s.logo}`}>
          P
        </span>
      )}
      <span className={s.text}>Prospectia</span>
      {variant !== 'compact' && (
        <span className={`text-violet-400 font-semibold ${s.suffix}`}>.cloud</span>
      )}
    </span>
  );

  if (asLink) {
    return <Link href={href} className="inline-flex items-center hover:opacity-90 transition">{inner}</Link>;
  }
  return inner;
}
