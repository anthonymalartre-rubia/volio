// Helpers pour les routes Belgique francophone (/prospection-be/*).
//
// Périmètre v1 : Wallonie (5 provinces) + Bruxelles-Capitale = 6 provinces
// francophones uniquement. La Flandre néerlandophone est exclue pour ne pas
// rivaliser avec un marché qu'on ne cible pas linguistiquement.
//
// Réutilise B2B_GROUPS (et donc B2B_CATS / getAllCategories) inchangé : les
// 150 catégories sont strictement les mêmes en France et en Belgique.

import { DEPTS_BE, REGIONS_BE } from './constants';
import { toSlug } from './slugs';

// Provinces francophones uniquement (Wallonie + Bruxelles)
const FRANCOPHONE_PROVINCE_CODES = ['BE-BRU', 'BE-WHT', 'BE-WLG', 'BE-WLX', 'BE-WNA', 'BE-WBR'];

/**
 * Slug URL friendly pour une province (ex 'BE-WHT' → 'hainaut').
 * On retire le préfixe BE- pour avoir des URLs propres.
 */
export function provinceSlugBE(code) {
  const dept = DEPTS_BE[code];
  if (!dept) return null;
  return toSlug(dept.name);
}

/**
 * Liste les 6 provinces francophones avec leurs slugs + meta.
 * Utilisé pour generateStaticParams + listing.
 */
export function getAllProvincesBE() {
  return FRANCOPHONE_PROVINCE_CODES.map((code) => {
    const d = DEPTS_BE[code];
    return {
      code,
      name: d.name,
      slug: provinceSlugBE(code),
      lat: d.lat,
      lng: d.lng,
    };
  });
}

/**
 * Lookup d'une province par slug (ex 'hainaut' → { code: 'BE-WHT', ... }).
 */
export function getProvinceBySlugBE(slug) {
  if (!slug) return null;
  return getAllProvincesBE().find((p) => p.slug === slug) || null;
}

/**
 * Pour le maillage : la "région" (Wallonie / Bruxelles / Flandre) d'une province.
 * Note : on n'expose pas Flandre dans les pages, mais on garde l'info.
 */
export function getRegionForProvinceBE(code) {
  for (const [regionKey, info] of Object.entries(REGIONS_BE)) {
    if (info.depts.includes(code)) {
      return { key: regionKey, name: info.name };
    }
  }
  return null;
}

export { FRANCOPHONE_PROVINCE_CODES };
