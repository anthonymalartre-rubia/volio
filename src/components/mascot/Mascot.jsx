// Brand Sprint 2 — composant unifié Mascot.
//
// Usage :
//   import Mascot from '@/components/mascot/Mascot';
//   <Mascot variant="welcome" size="lg" />
//
// Variantes : 'welcome' | 'thinking' | 'success' | 'error' | 'empty' | 'celebration'
// Tailles   : 'sm' (32) | 'md' (64) | 'lg' (128) | 'xl' (256)
//
// Props extras :
//   - className : classes wrapper additionnelles
//   - motion    : false pour désactiver l'animation idle (utile dans tableaux)
//   - alt       : si fourni, role=img + aria-label ; sinon aria-hidden

'use client';

import { Welcome, Thinking, Success, ErrorVariant, Empty, Celebration } from './variants';

const SIZES = { sm: 32, md: 64, lg: 128, xl: 256 };

const VARIANTS = {
  welcome:     Welcome,
  thinking:    Thinking,
  success:     Success,
  error:       ErrorVariant,
  empty:       Empty,
  celebration: Celebration,
};

export default function Mascot({
  variant = 'welcome',
  size = 'md',
  motion = true,
  className = '',
  alt = '',
  ...rest
}) {
  const Component = VARIANTS[variant] || VARIANTS.welcome;
  const px = SIZES[size] || SIZES.md;

  const a11y = alt
    ? { role: 'img', 'aria-label': alt }
    : { 'aria-hidden': 'true' };

  return (
    <span
      className={`inline-block leading-none align-middle ${className}`}
      style={{ width: px, height: px }}
      {...a11y}
      {...rest}
    >
      <Component pixelSize={px} motion={motion} />
    </span>
  );
}

// Helpers nommés pour les imports ciblés (optionnel)
Mascot.Welcome = (p) => <Mascot variant="welcome" {...p} />;
Mascot.Thinking = (p) => <Mascot variant="thinking" {...p} />;
Mascot.Success = (p) => <Mascot variant="success" {...p} />;
Mascot.Error = (p) => <Mascot variant="error" {...p} />;
Mascot.Empty = (p) => <Mascot variant="empty" {...p} />;
Mascot.Celebration = (p) => <Mascot variant="celebration" {...p} />;
