'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import fr from '@/locales/fr';

// FR est chargé en sync (locale par défaut, majorité des users).
// EN est lazy-loadé via dynamic import → -30 KB sur le First Load JS pour
// les utilisateurs francophones qui ne basculent jamais (P2 audit perf).
const locales = { fr };

async function loadLocale(code) {
  if (locales[code]) return locales[code];
  if (code === 'en') {
    const mod = await import(/* webpackChunkName: "locale-en" */ '@/locales/en');
    locales.en = mod.default;
    return locales.en;
  }
  return null;
}

const I18nContext = createContext({ t: (key) => key, locale: 'fr', setLocale: () => {} });

// Nested key access: t('sidebar.overview') → locales.fr.sidebar.overview
function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState('fr');

  useEffect(() => {
    const saved = localStorage.getItem('prospectia_locale');
    if (saved === 'fr' || saved === 'en') {
      // Précharger la locale avant de switcher pour éviter un flash de FR.
      loadLocale(saved).then((loaded) => {
        if (loaded) setLocaleState(saved);
      });
    }
  }, []);

  const setLocale = useCallback(async (newLocale) => {
    const loaded = await loadLocale(newLocale);
    if (loaded) {
      setLocaleState(newLocale);
      try { localStorage.setItem('prospectia_locale', newLocale); } catch {}
    }
  }, []);

  const t = useCallback((key, replacements) => {
    // Si la locale n'est pas (encore) chargée, fallback FR.
    const activeLocale = locales[locale] || locales.fr;
    let value = getNestedValue(activeLocale, key);
    if (value === undefined) {
      value = getNestedValue(locales.fr, key);
    }
    if (value === undefined) return key;
    // Handle {{variable}} replacements.
    // Bug fix P2 : on utilise une fonction de replacement au lieu d'une string
    // pour éviter que String.prototype.replace n'interprète les `$&`, `$1`,
    // `$$` etc. présents dans la valeur (ex: nom d'entreprise "Cap & Co $1 Inc.").
    if (replacements && typeof value === 'string') {
      Object.entries(replacements).forEach(([k, v]) => {
        const replacement = String(v ?? '');
        value = value.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), () => replacement);
      });
    }
    return value;
  }, [locale]);

  return (
    <I18nContext.Provider value={{ t, locale, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
