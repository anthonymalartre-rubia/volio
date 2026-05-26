// lib/warmup.js
//
// Helpers pour le warmup automatique des domaines d'envoi email.
//
// Version MVP — il ne s'agit PAS de peer-to-peer warming (type Lemwarm /
// Mailwarm où des inboxes amies s'échangent des emails pour générer du
// signal positif). C'est un THROTTLING progressif des vrais envois sur
// 28 jours qui respecte le protocole de warmup standard (Gmail/Outlook
// acceptent mal une montée brutale en volume sur un domaine neuf).
//
// La logique :
//   - À la première vérification d'un sender, on crée une warmup_session
//     (cf. /api/email-senders/[id]/verify)
//   - Le cron process-email-campaigns consulte la session active du
//     sender avant d'envoyer un batch et limite le nombre d'envois du
//     jour selon la phase courante
//   - Au jour 28, la session passe en 'completed' et le throttling
//     est levé (plein régime)
//
// Limites courantes (Resend / domaines neufs) :
//   - Jour 1-7    : 10 emails/j   → soft launch
//   - Jour 8-14   : 30 emails/j   → montée progressive
//   - Jour 15-21  : 100 emails/j  → volume normal
//   - Jour 22-28  : 200 emails/j  → volume cible

export const WARMUP_DURATION_DAYS = 28;

export const WARMUP_PHASES = [
  { days: '1-7', maxPerDay: 10, label: 'Phase 1 : Soft launch' },
  { days: '8-14', maxPerDay: 30, label: 'Phase 2 : Montée progressive' },
  { days: '15-21', maxPerDay: 100, label: 'Phase 3 : Volume normal' },
  { days: '22-28', maxPerDay: 200, label: 'Phase 4 : Volume cible' },
];

/**
 * Retourne la phase courante (objet avec days, maxPerDay, label, phaseNumber).
 * Retourne null si le warmup est terminé (currentDay > 28).
 *
 * @param {number} currentDay - Jour courant du warmup (1..28)
 * @returns {{days: string, maxPerDay: number, label: string, phaseNumber: number} | null}
 */
export function getCurrentPhase(currentDay) {
  if (currentDay <= 0) return null;
  if (currentDay <= 7) return { ...WARMUP_PHASES[0], phaseNumber: 1 };
  if (currentDay <= 14) return { ...WARMUP_PHASES[1], phaseNumber: 2 };
  if (currentDay <= 21) return { ...WARMUP_PHASES[2], phaseNumber: 3 };
  if (currentDay <= 28) return { ...WARMUP_PHASES[3], phaseNumber: 4 };
  return null;
}

/**
 * Calcule le jour courant du warmup depuis la date de début.
 * Jour 1 = jour de démarrage.
 * Cappé à 28 (au-delà, getCurrentPhase renverra null).
 *
 * @param {string|Date} startedAt
 * @returns {number} 1..28+
 */
export function calculateCurrentDay(startedAt) {
  const start = new Date(startedAt);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, Math.min(diffDays, WARMUP_DURATION_DAYS + 1));
}

/**
 * Estime la date de fin du warmup (= started_at + 28 jours).
 *
 * @param {string|Date} startedAt
 * @returns {Date}
 */
export function estimateCompletionDate(startedAt) {
  const start = new Date(startedAt);
  return new Date(start.getTime() + WARMUP_DURATION_DAYS * 24 * 60 * 60 * 1000);
}

/**
 * Compte les envois 'sent' du jour (UTC midnight → maintenant) pour un sender.
 * Joint email_sends → email_campaigns pour matcher campaign.email_sender_id = senderId.
 *
 * Retourne Infinity si pas de warmup actif (le caller doit gérer ce cas avant
 * d'appeler cette fonction normalement).
 *
 * @param {object} supabase - client Supabase admin
 * @param {string} senderId - UUID du email_sender
 * @returns {Promise<number>} nombre d'envois déjà 'sent' aujourd'hui pour ce sender
 */
export async function countTodaySendsForSender(supabase, senderId) {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayStartIso = todayStart.toISOString();

  // 1) Récupère les campaign_id du sender (limite à 1000 — un user n'aura
  //    jamais plus de campagnes que ça associées à un même domaine pendant
  //    la fenêtre de warmup).
  const { data: campaigns, error: cErr } = await supabase
    .from('email_campaigns')
    .select('id')
    .eq('email_sender_id', senderId)
    .limit(1000);

  if (cErr || !campaigns || campaigns.length === 0) return 0;

  const campaignIds = campaigns.map((c) => c.id);

  // 2) Compte les sends 'sent' du jour pour ces campagnes
  const { count, error: sErr } = await supabase
    .from('email_sends')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'sent')
    .gte('sent_at', todayStartIso)
    .in('campaign_id', campaignIds);

  if (sErr) return 0;
  return count || 0;
}

/**
 * Calcule le quota restant aujourd'hui pour un sender en warmup.
 *
 * @param {object} supabase
 * @param {string} senderId
 * @param {number} currentDay
 * @returns {Promise<number>} quota restant aujourd'hui (Infinity si warmup terminé)
 */
export async function getRemainingQuotaToday(supabase, senderId, currentDay) {
  const phase = getCurrentPhase(currentDay);
  if (!phase) return Infinity; // warmup terminé → pas de limite

  const alreadySent = await countTodaySendsForSender(supabase, senderId);
  return Math.max(0, phase.maxPerDay - alreadySent);
}

/**
 * Helper UI — pourcentage de progression du warmup (0..100).
 */
export function getWarmupProgressPercent(currentDay) {
  if (currentDay <= 0) return 0;
  if (currentDay >= WARMUP_DURATION_DAYS) return 100;
  return Math.round((currentDay / WARMUP_DURATION_DAYS) * 100);
}
