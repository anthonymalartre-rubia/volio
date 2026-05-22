// Helpers pour les routes Suisse romande (/prospection-ch/*).
//
// Périmètre : Suisse romande = 6 cantons francophones (Genève, Vaud, Valais,
// Neuchâtel, Fribourg bilingue mais majoritairement francophone, Jura).
// Marché de ~2 M habitants francophones, PIB par habitant le plus élevé
// d'Europe — cible B2B premium.

import { DEPTS_CH } from './constants';
import { toSlug } from './slugs';

const ROMANDE_CANTON_CODES = ['CH-GE', 'CH-VD', 'CH-VS', 'CH-NE', 'CH-FR', 'CH-JU'];

export function cantonSlugCH(code) {
  const c = DEPTS_CH[code];
  if (!c) return null;
  return toSlug(c.name);
}

export function getAllCantonsCH() {
  return ROMANDE_CANTON_CODES.map((code) => {
    const c = DEPTS_CH[code];
    return {
      code,
      name: c.name,
      slug: cantonSlugCH(code),
      lat: c.lat,
      lng: c.lng,
    };
  });
}

export function getCantonBySlugCH(slug) {
  if (!slug) return null;
  return getAllCantonsCH().find((c) => c.slug === slug) || null;
}

export { ROMANDE_CANTON_CODES };
