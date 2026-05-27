// Brand Sprint 2 — Mascotte Volia "V qui se déplie en avion en papier".
//
// Concept : la lettre V du logo Volia est une forme triangulaire pliée.
// L'avion en papier en est la version "dépliée + lancée" — métaphore parfaite
// pour un SaaS qui aide à envoyer, déployer, lancer (prospection, campagnes).
//
// 6 expressions :
//   - Welcome     : avion qui sourit + lève une aile (greeting)
//   - Thinking    : avion qui regarde en l'air + ? au-dessus
//   - Success     : avion en loop + petits confettis
//   - Error       : avion qui pique du nez (sans drama) + tongue out
//   - Empty       : avion qui scrute à la jumelle (cherche)
//   - Celebration : avion en loop large + confettis abondants
//
// Palette : violet-600 (#7C3AED) + indigo-500 (#6366F1) + white.
// Style : flat, traits clairs, pas de gradient complexe.
//
// Toutes les animations respectent prefers-reduced-motion (cf. globals.css).

import React from 'react';

// SVG primitives partagées : le corps V/avion (côté gauche + droit, fold central).
// On le centre dans un viewBox 100×100, l'avion pointe vers la droite-haut.
function PaperPlaneBody({ withFace = true, faceVariant = 'neutral', rotation = -8 }) {
  // Côtés du V/avion : 2 triangles partageant l'arête centrale (le "fold")
  return (
    <g transform={`rotate(${rotation} 50 50)`}>
      {/* Aile gauche (face avant — violet plus foncé) */}
      <path
        d="M 50 18 L 18 78 L 50 64 Z"
        fill="#7C3AED"
      />
      {/* Aile droite (face dos — indigo plus clair) */}
      <path
        d="M 50 18 L 82 78 L 50 64 Z"
        fill="#6366F1"
      />
      {/* Ligne de pliage centrale (white subtle) */}
      <path
        d="M 50 18 L 50 64"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Ombre sous l'avion (subtle) */}
      <ellipse cx="50" cy="84" rx="22" ry="2.5" fill="rgba(0,0,0,0.12)" />

      {withFace && <Face variant={faceVariant} />}
    </g>
  );
}

// Visages — placés sur l'aile gauche (face visible)
function Face({ variant }) {
  // Position de référence du visage (centre de l'aile gauche)
  const cx = 36;
  const cy = 52;

  if (variant === 'smile') {
    return (
      <g>
        {/* Yeux */}
        <circle cx={cx - 4} cy={cy - 2} r="1.6" fill="#fff" />
        <circle cx={cx + 4} cy={cy - 2} r="1.6" fill="#fff" />
        {/* Bouche souriante */}
        <path d={`M ${cx - 4} ${cy + 4} Q ${cx} ${cy + 7} ${cx + 4} ${cy + 4}`}
              stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </g>
    );
  }

  if (variant === 'lookUp') {
    return (
      <g>
        <circle cx={cx - 4} cy={cy - 3} r="1.6" fill="#fff" />
        <circle cx={cx + 4} cy={cy - 3} r="1.6" fill="#fff" />
        {/* Pupille pointée vers haut */}
        <circle cx={cx - 4} cy={cy - 4} r="0.6" fill="#7C3AED" />
        <circle cx={cx + 4} cy={cy - 4} r="0.6" fill="#7C3AED" />
        {/* Petite bouche "o" */}
        <ellipse cx={cx} cy={cy + 4} rx="1.6" ry="2" fill="#fff" />
      </g>
    );
  }

  if (variant === 'happy') {
    return (
      <g>
        {/* Yeux fermés joyeux */}
        <path d={`M ${cx - 5} ${cy - 2} Q ${cx - 3} ${cy - 4} ${cx - 1} ${cy - 2}`}
              stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <path d={`M ${cx + 1} ${cy - 2} Q ${cx + 3} ${cy - 4} ${cx + 5} ${cy - 2}`}
              stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        {/* Grand sourire */}
        <path d={`M ${cx - 5} ${cy + 3} Q ${cx} ${cy + 9} ${cx + 5} ${cy + 3}`}
              stroke="#fff" strokeWidth="1.6" fill="rgba(255,255,255,0.15)" strokeLinecap="round" />
      </g>
    );
  }

  if (variant === 'tongue') {
    return (
      <g>
        {/* X et petit œil — petit choc */}
        <path d={`M ${cx - 6} ${cy - 4} L ${cx - 2} ${cy}`} stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
        <path d={`M ${cx - 6} ${cy} L ${cx - 2} ${cy - 4}`} stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx={cx + 4} cy={cy - 2} r="1.6" fill="#fff" />
        {/* Tongue out */}
        <path d={`M ${cx - 1} ${cy + 3} Q ${cx} ${cy + 8} ${cx + 3} ${cy + 6}`}
              stroke="#fff" strokeWidth="1.4" fill="#FCA5A5" strokeLinecap="round" />
      </g>
    );
  }

  if (variant === 'searching') {
    return (
      <g>
        {/* Une jumelle stylisée tenue devant les yeux */}
        <rect x={cx - 7} y={cy - 4} width="6" height="6" rx="1.5" fill="#fff" />
        <rect x={cx + 1} y={cy - 4} width="6" height="6" rx="1.5" fill="#fff" />
        <rect x={cx - 1} y={cy - 2} width="2" height="2" fill="#fff" />
        {/* Lentilles violet */}
        <circle cx={cx - 4} cy={cy - 1} r="1.4" fill="#7C3AED" />
        <circle cx={cx + 4} cy={cy - 1} r="1.4" fill="#7C3AED" />
        {/* Petit reflet */}
        <circle cx={cx - 4.6} cy={cy - 1.6} r="0.4" fill="#fff" />
        <circle cx={cx + 3.4} cy={cy - 1.6} r="0.4" fill="#fff" />
      </g>
    );
  }

  // 'neutral' — yeux ronds simples
  return (
    <g>
      <circle cx={cx - 4} cy={cy - 2} r="1.6" fill="#fff" />
      <circle cx={cx + 4} cy={cy - 2} r="1.6" fill="#fff" />
      <circle cx={cx} cy={cy + 4} r="1" fill="#fff" />
    </g>
  );
}

// ---------- 6 variantes exportées ----------

export function Welcome({ pixelSize, className = '', motion = true }) {
  return (
    <svg viewBox="0 0 100 100" width={pixelSize} height={pixelSize} className={className} aria-hidden="true">
      <g className={motion ? 'animate-mascot-float' : ''}>
        <g className={motion ? 'animate-mascot-wing' : ''}>
          <PaperPlaneBody faceVariant="smile" rotation={-6} />
        </g>
        {/* Petite "main qui salue" — un trait court en haut à droite */}
        <g transform="translate(72,30)" className={motion ? 'animate-mascot-think' : ''}>
          <circle cx="0" cy="0" r="3.5" fill="#FBBF24" />
          <path d="M -1 -1 L 1 1 M 1 -1 L -1 1" stroke="#fff" strokeWidth="0.9" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}

export function Thinking({ pixelSize, className = '', motion = true }) {
  return (
    <svg viewBox="0 0 100 100" width={pixelSize} height={pixelSize} className={className} aria-hidden="true">
      <g className={motion ? 'animate-mascot-float' : ''}>
        <PaperPlaneBody faceVariant="lookUp" rotation={-4} />
      </g>
      {/* Bulle ? au-dessus */}
      <g transform="translate(72,18)" className={motion ? 'animate-mascot-think' : ''}>
        <circle cx="0" cy="0" r="8" fill="#fff" stroke="#7C3AED" strokeWidth="1.4" />
        <text x="0" y="3.2" textAnchor="middle" fontSize="10" fontWeight="700" fill="#7C3AED" fontFamily="Inter, sans-serif">?</text>
      </g>
    </svg>
  );
}

export function Success({ pixelSize, className = '', motion = true }) {
  return (
    <svg viewBox="0 0 100 100" width={pixelSize} height={pixelSize} className={className} aria-hidden="true">
      <g className={motion ? 'animate-mascot-loop' : ''}>
        <PaperPlaneBody faceVariant="happy" rotation={-12} />
      </g>
      {/* Confettis */}
      <g>
        <rect x="22" y="20" width="3" height="3" fill="#7C3AED" className={motion ? 'animate-confetti-1' : ''} />
        <rect x="78" y="24" width="3" height="3" fill="#6366F1" className={motion ? 'animate-confetti-2' : ''} />
        <rect x="80" y="60" width="3" height="3" fill="#FBBF24" className={motion ? 'animate-confetti-3' : ''} />
      </g>
    </svg>
  );
}

export function ErrorVariant({ pixelSize, className = '', motion = true }) {
  return (
    <svg viewBox="0 0 100 100" width={pixelSize} height={pixelSize} className={className} aria-hidden="true">
      <g className={motion ? 'animate-mascot-wobble' : ''}>
        <PaperPlaneBody faceVariant="tongue" rotation={14} />
      </g>
      {/* Petite étoile choc */}
      <g transform="translate(76,40)">
        <path d="M 0 -4 L 1.2 -1.2 L 4 0 L 1.2 1.2 L 0 4 L -1.2 1.2 L -4 0 L -1.2 -1.2 Z"
              fill="#FBBF24" />
      </g>
    </svg>
  );
}

export function Empty({ pixelSize, className = '', motion = true }) {
  return (
    <svg viewBox="0 0 100 100" width={pixelSize} height={pixelSize} className={className} aria-hidden="true">
      <g className={motion ? 'animate-mascot-float' : ''}>
        <PaperPlaneBody faceVariant="searching" rotation={-2} />
      </g>
      {/* Petits "..." comme s'il cherchait */}
      <g transform="translate(72,72)" className={motion ? 'animate-mascot-think' : ''}>
        <circle cx="0" cy="0" r="1.2" fill="#a78bfa" />
        <circle cx="5" cy="0" r="1.2" fill="#a78bfa" />
        <circle cx="10" cy="0" r="1.2" fill="#a78bfa" />
      </g>
    </svg>
  );
}

export function Celebration({ pixelSize, className = '', motion = true }) {
  return (
    <svg viewBox="0 0 100 100" width={pixelSize} height={pixelSize} className={className} aria-hidden="true">
      <g className={motion ? 'animate-mascot-loop' : ''}>
        <PaperPlaneBody faceVariant="happy" rotation={-18} />
      </g>
      {/* Beaucoup de confettis */}
      <g>
        <rect x="14" y="14" width="3.4" height="3.4" fill="#7C3AED" transform="rotate(20 16 16)" className={motion ? 'animate-confetti-1' : ''} />
        <rect x="84" y="18" width="3.4" height="3.4" fill="#6366F1" transform="rotate(-30 86 20)" className={motion ? 'animate-confetti-2' : ''} />
        <rect x="86" y="58" width="3.4" height="3.4" fill="#FBBF24" className={motion ? 'animate-confetti-3' : ''} />
        <circle cx="20" cy="64" r="1.6" fill="#EC4899" className={motion ? 'animate-confetti-1' : ''} />
        <circle cx="76" cy="36" r="1.6" fill="#10B981" className={motion ? 'animate-confetti-2' : ''} />
        <rect x="10" y="38" width="2.4" height="2.4" fill="#7C3AED" transform="rotate(45 11 39)" className={motion ? 'animate-confetti-3' : ''} />
      </g>
    </svg>
  );
}
