// Slug helpers for programmatic SEO pages

import { DEPTS, B2B_GROUPS, B2B_CATS } from './constants';

/**
 * Convert a string to URL-safe slug (lowercase, no accents, dashes)
 * Ex: "Boulangerie pâtisserie" → "boulangerie-patisserie"
 */
export function toSlug(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip accents
    .replace(/['']/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Build a flat list of categories with their slug + group + label
 * Used for static generation and lookups.
 */
export function getAllCategories() {
  const result = [];
  for (const [group, cats] of Object.entries(B2B_GROUPS)) {
    for (const cat of cats) {
      result.push({
        slug: toSlug(cat),
        label: cat,
        labelCapitalized: cat.charAt(0).toUpperCase() + cat.slice(1),
        labelPlural: pluralize(cat),
        group,
      });
    }
  }
  // Deduplicate by slug (some categories appear in multiple groups, like "imprimerie")
  const seen = new Set();
  return result.filter((c) => {
    if (seen.has(c.slug)) return false;
    seen.add(c.slug);
    return true;
  });
}

/**
 * Simple French pluralizer for category names.
 */
function pluralize(str) {
  if (!str) return '';
  const lower = str.toLowerCase().trim();
  // Already plural or ends in s/x/z
  if (/[sxz]$/.test(lower)) return str;
  // Words ending in -al → -aux (cheval → chevaux)
  if (lower.endsWith('al')) return str.slice(0, -2) + 'aux';
  // Words ending in -au or -eu → +x
  if (/(au|eu)$/.test(lower)) return str + 'x';
  // Default: +s
  return str + 's';
}

/**
 * Get all department slugs (FR only for v1)
 * Format: "75-paris", "13-bouches-du-rhone"
 */
export function getAllDepartments() {
  return Object.entries(DEPTS).map(([code, info]) => ({
    code,
    slug: `${code}-${toSlug(info.name)}`,
    name: info.name,
    region: getRegionForDept(code),
  }));
}

/**
 * Get region label for a department code (simple mapping)
 */
function getRegionForDept(code) {
  const num = parseInt(code, 10);
  if (['75','77','78','91','92','93','94','95'].includes(code)) return 'Île-de-France';
  if (['01','03','07','15','26','38','42','43','63','69','73','74'].includes(code)) return 'Auvergne-Rhône-Alpes';
  if (['21','25','39','58','70','71','89','90'].includes(code)) return 'Bourgogne-Franche-Comté';
  if (['22','29','35','56'].includes(code)) return 'Bretagne';
  if (['18','28','36','37','41','45'].includes(code)) return 'Centre-Val de Loire';
  if (['2A','2B'].includes(code)) return 'Corse';
  if (['08','10','51','52','54','55','57','67','68','88'].includes(code)) return 'Grand Est';
  if (['02','59','60','62','80'].includes(code)) return 'Hauts-de-France';
  if (['14','27','50','61','76'].includes(code)) return 'Normandie';
  if (['16','17','19','23','24','33','40','47','64','79','86','87'].includes(code)) return 'Nouvelle-Aquitaine';
  if (['09','11','12','30','31','32','34','46','48','65','66','81','82'].includes(code)) return 'Occitanie';
  if (['44','49','53','72','85'].includes(code)) return 'Pays de la Loire';
  if (['04','05','06','13','83','84'].includes(code)) return 'Provence-Alpes-Côte d\'Azur';
  if (['971','972','973','974','976'].includes(code)) return 'Outre-mer';
  return 'France';
}

/**
 * Find a department by slug (e.g. "75-paris" → DEPTS["75"])
 */
export function getDepartmentBySlug(slug) {
  if (!slug) return null;
  const code = slug.split('-')[0];
  const info = DEPTS[code];
  if (!info) return null;
  return {
    code,
    slug,
    name: info.name,
    region: getRegionForDept(code),
    lat: info.lat,
    lng: info.lng,
  };
}

/**
 * Find a category by slug (e.g. "restaurant" → "restaurant")
 */
export function getCategoryBySlug(slug) {
  if (!slug) return null;
  const all = getAllCategories();
  return all.find((c) => c.slug === slug) || null;
}

/**
 * Build sitemap entries for all programmatic pages
 * Returns array of { loc, priority, changefreq }
 */
export function getAllSeoUrls(baseUrl = 'https://prospectia.cloud') {
  const urls = [];
  const cats = getAllCategories();
  const depts = getAllDepartments();

  // Index page
  urls.push({ loc: `${baseUrl}/prospection`, priority: 0.8, changefreq: 'weekly' });

  // Category pages (1 per cat)
  for (const cat of cats) {
    urls.push({
      loc: `${baseUrl}/prospection/${cat.slug}`,
      priority: 0.6,
      changefreq: 'monthly',
    });
  }

  // Department pages (1 per dept)
  for (const dept of depts) {
    urls.push({
      loc: `${baseUrl}/prospection/dept/${dept.slug}`,
      priority: 0.6,
      changefreq: 'monthly',
    });
  }

  // Combined category × department pages (the bulk)
  for (const cat of cats) {
    for (const dept of depts) {
      urls.push({
        loc: `${baseUrl}/prospection/${cat.slug}/${dept.slug}`,
        priority: 0.4,
        changefreq: 'monthly',
      });
    }
  }

  return urls;
}
