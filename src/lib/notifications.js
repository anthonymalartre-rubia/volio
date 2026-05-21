// Helpers serveur pour créer des notifications dashboard.
//
// À utiliser depuis :
// - Les API routes (api/enrich-waterfall, api/stripe/webhook, etc.)
// - Les cron jobs (api/cron/*)
// - Toute autre logique serveur qui veut notifier un utilisateur
//
// NE PAS appeler ces helpers côté client : ils utilisent supabase-admin
// (service_role) qui ne doit jamais finir dans un bundle navigateur.

import { getSupabaseAdmin } from './supabase-admin';

// Types sémantiques recommandés. Tout autre string est accepté mais
// le front affichera une icône par défaut.
export const NOTIF_TYPES = {
  ENRICHMENT_DONE: 'enrichment_done',           // Enrichissement waterfall terminé
  SEARCH_COMPLETE: 'search_complete',           // Recherche Google Places finie
  QUOTA_WARNING: 'quota_warning',               // 80 % du quota atteint
  QUOTA_REACHED: 'quota_reached',               // 100 % atteint
  PAYMENT_SUCCESS: 'payment_success',           // Paiement Stripe OK
  PAYMENT_FAILED: 'payment_failed',             // Paiement échoué
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',
  PLAN_CHANGED: 'plan_changed',                 // Upgrade / downgrade
  NEW_FEATURE: 'new_feature',                   // Annonce produit (broadcast)
  WEEKLY_DIGEST: 'weekly_digest',               // Récap hebdo
  STUDY_PUBLISHED: 'study_published',           // Nouvelle étude / article
  ADMIN_MESSAGE: 'admin_message',               // Message admin custom
};

/**
 * Crée une notification pour un utilisateur.
 *
 * @param {string} userId - UUID de l'utilisateur (auth.users.id)
 * @param {object} options
 * @param {string} options.type - Type sémantique (cf NOTIF_TYPES)
 * @param {string} options.title - Titre court (1 ligne)
 * @param {string} [options.body] - Corps optionnel (2-3 lignes max)
 * @param {string} [options.link] - URL d'action (peut être interne ou externe)
 * @param {object} [options.metadata] - Données structurées additionnelles
 * @returns {Promise<{id: string} | null>} id créé, ou null si erreur
 */
export async function createNotification(userId, { type, title, body, link, metadata }) {
  if (!userId || !type || !title) {
    console.warn('[notifications] missing required fields', { userId, type, title });
    return null;
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type,
      title,
      body: body || null,
      link: link || null,
      metadata: metadata || {},
    })
    .select('id')
    .single();

  if (error) {
    console.error('[notifications] insert error', error);
    return null;
  }
  return data;
}

/**
 * Crée une notification pour TOUS les utilisateurs (broadcast).
 * À utiliser avec parcimonie — typiquement pour les annonces produit.
 *
 * Implémentation : on récupère tous les user_id de user_profiles
 * (= utilisateurs ayant un profil créé), puis bulk insert.
 *
 * @param {object} options - mêmes paramètres que createNotification (sans userId)
 * @returns {Promise<number>} nombre de notifications créées
 */
export async function broadcastNotification({ type, title, body, link, metadata }) {
  const supabase = getSupabaseAdmin();
  // Récupère tous les user_id (de user_profiles, pas auth.users — évite les
  // comptes orphelins jamais loggés).
  const { data: users, error: usersErr } = await supabase
    .from('user_profiles')
    .select('id');

  if (usersErr) {
    console.error('[notifications] broadcast users fetch error', usersErr);
    return 0;
  }

  if (!users || users.length === 0) return 0;

  const rows = users.map((u) => ({
    user_id: u.id,
    type,
    title,
    body: body || null,
    link: link || null,
    metadata: metadata || {},
  }));

  const { error: insertErr, count } = await supabase
    .from('notifications')
    .insert(rows, { count: 'exact' });

  if (insertErr) {
    console.error('[notifications] broadcast insert error', insertErr);
    return 0;
  }

  return count || rows.length;
}
