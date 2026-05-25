// Helper de templating pour les campagnes : remplace les variables
// {{first_name}}, {{company}}, etc. par les valeurs du contact.
//
// Variables supportées :
//   {{first_name}} {{last_name}} {{email}} {{phone}}
//   {{company}} {{position_title}}
//   {{custom.X}} pour les custom_fields (ex: {{custom.secteur}})
//
// Toute variable non trouvée est remplacée par la valeur "fallback"
// (chaîne vide par défaut). Les contacts sans first_name reçoivent donc
// un greeting vide mais le mail reste lisible.

export function applyTemplate(template, contact, fallback = '') {
  if (!template) return '';
  if (!contact) return template;

  return String(template).replace(/\{\{\s*([\w.]+)\s*\}\}/g, (match, varName) => {
    const value = lookupContactField(contact, varName);
    return value != null ? String(value) : fallback;
  });
}

function lookupContactField(contact, varName) {
  const normalized = varName.toLowerCase().trim();

  // Standard fields
  if (normalized === 'first_name' || normalized === 'firstname' || normalized === 'prenom') return contact.first_name;
  if (normalized === 'last_name' || normalized === 'lastname' || normalized === 'nom') return contact.last_name;
  if (normalized === 'email') return contact.email;
  if (normalized === 'phone' || normalized === 'tel' || normalized === 'telephone') return contact.phone;
  if (normalized === 'company' || normalized === 'societe' || normalized === 'entreprise') return contact.company;
  if (normalized === 'position_title' || normalized === 'poste' || normalized === 'title' || normalized === 'job') return contact.position_title;

  // Custom field via {{custom.X}}
  if (normalized.startsWith('custom.')) {
    const key = normalized.slice('custom.'.length);
    return contact.custom_fields?.[key] ?? null;
  }

  return null;
}

/**
 * Liste les variables non résolues dans un template (pour preview UI).
 * Utile pour avertir "il manque {{first_name}} chez 30 contacts".
 */
export function extractVariables(template) {
  if (!template) return [];
  const set = new Set();
  const re = /\{\{\s*([\w.]+)\s*\}\}/g;
  let m;
  while ((m = re.exec(template)) !== null) {
    set.add(m[1].toLowerCase().trim());
  }
  return Array.from(set);
}

/**
 * Ajoute automatiquement un lien de désinscription RGPD compliant à un
 * email HTML, à la fin du body. Indispensable pour la conformité.
 */
export function appendOptOutFooter(html, optOutUrl, campaignName) {
  const footer = `
<div style="margin-top:32px;padding-top:16px;border-top:1px solid #e5e5ea;color:#86868b;font-size:11px;line-height:1.5;font-family:-apple-system,BlinkMacSystemFont,sans-serif;text-align:center;">
  <p style="margin:0 0 4px;">Vous recevez ce mail dans le cadre de la campagne « ${escapeHtml(campaignName || '')} » de Volia (intérêt légitime — RGPD art. 6.1.f).</p>
  <p style="margin:0;">
    Vous ne souhaitez plus recevoir nos messages ?
    <a href="${optOutUrl}" style="color:#7c3aed;text-decoration:underline;">Se désinscrire en un clic</a>
  </p>
</div>`;
  return html + footer;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
