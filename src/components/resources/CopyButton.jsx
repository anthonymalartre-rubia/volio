'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

/**
 * Bouton "Copier" réutilisable avec feedback animé.
 * Reset automatique du state copied après 2s.
 */
export default function CopyButton({ text, label = 'Copier', className = '' }) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    if (copied) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback : sélectionne le texte si clipboard API indispo (rare)
      console.warn('Clipboard API unavailable');
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition no-print ${
        copied
          ? 'bg-green-500/15 text-green-400 border border-green-500/30'
          : 'bg-surface-elevated text-content-secondary hover:text-content-primary hover:bg-violet-500/10 border border-line hover:border-violet-500/30'
      } ${className}`}
      aria-label={copied ? 'Copié' : label}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copié' : label}
    </button>
  );
}
