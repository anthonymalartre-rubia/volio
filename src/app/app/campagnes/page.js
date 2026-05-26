// ─────────────────────────────────────────────────────────────────────
// /app/campagnes — alias canonique du module Volia Campagnes
// ─────────────────────────────────────────────────────────────────────
//
// /app/campagnes est l'URL canonique 2026+ pour le module Volia
// Campagnes (séquences email automatisées). On redirige vers
// /admin/prospection/campaigns qui héberge actuellement le code des
// campagnes (legacy nommage : "admin/prospection" est en réalité
// le backend Campagnes).
//
// Migration progressive : à terme on déplacera le code de
// /admin/prospection/campaigns ici et on supprimera l'alias.
//
// La détection dans ModuleSwitcher.jsx reconnaît /admin/prospection/
// campaigns ET /app/campagnes comme module "Campagnes" actif.
//
// Le module SMS (Twilio) est désactivé via SMS_CAMPAIGNS_ENABLED
// dans lib/feature-flags.js. Le code SMS reste en place pour
// réactivation future.
// ─────────────────────────────────────────────────────────────────────

import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function CampagnesAppRedirect() {
  redirect('/admin/prospection/campaigns');
}
