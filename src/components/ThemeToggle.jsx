'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/theme';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className={`p-2 rounded-lg text-content-muted hover:text-content-primary hover:bg-surface-elevated active:scale-95 transition-all ${className}`}
      title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
      aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
