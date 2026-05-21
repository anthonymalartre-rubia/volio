// Authentification par clé API pour les endpoints /api/v1/*.
//
// Format de clé : "pk_" + 48 caractères base62 = "pk_a1b2c3d4e5f6...."
// - "pk" = public key (par opposition à "sk" service key qui n'existe pas
//   encore mais qu'on pourra ajouter plus tard si besoin)
// - 48 chars base62 = 286 bits d'entropie (largement suffisant)
//
// Stockage : on hash SHA-256 la clé entière + on garde les 8 premiers chars
// en clair pour permettre à l'utilisateur d'identifier visuellement sa clé.

import crypto from 'crypto';
import { getSupabaseAdmin } from './supabase-admin';

const KEY_PREFIX = 'pk_';
const KEY_RANDOM_LENGTH = 48; // chars (1 char = ~6 bits d'entropie en base62)

/**
 * Génère une nouvelle clé API claire (à donner UNE SEULE FOIS à l'utilisateur).
 * Format : "pk_" + 48 caractères base62.
 */
export function generateApiKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = crypto.randomBytes(KEY_RANDOM_LENGTH);
  let random = '';
  for (let i = 0; i < KEY_RANDOM_LENGTH; i++) {
    random += chars[bytes[i] % chars.length];
  }
  return KEY_PREFIX + random;
}

/**
 * Hash SHA-256 d'une clé (pour stockage en DB).
 */
export function hashApiKey(plainKey) {
  return crypto.createHash('sha256').update(plainKey).digest('hex');
}

/**
 * Extrait le préfixe lisible (8 premiers caractères) d'une clé pour
 * permettre à l'utilisateur d'identifier visuellement laquelle est laquelle.
 * Ex : "pk_a1b2c3..." → "pk_a1b2c3"
 */
export function getKeyPrefix(plainKey) {
  return plainKey.slice(0, 8);
}

/**
 * Authentifie une requête API à partir du header Authorization.
 *
 * Format attendu : "Authorization: Bearer pk_xxxxxxxxxxxxxxxxxxxxxxxx"
 *
 * Retourne :
 *   - { ok: true, userId, keyId } si la clé est valide
 *   - { ok: false, status, error } si auth échoue
 *
 * Met à jour last_used_at + request_count de manière asynchrone (fire-and-forget).
 */
export async function authenticateApiRequest(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      ok: false,
      status: 401,
      error: 'Missing Authorization header. Use "Authorization: Bearer pk_xxxxx".',
    };
  }

  const plainKey = authHeader.slice('Bearer '.length).trim();
  if (!plainKey.startsWith(KEY_PREFIX) || plainKey.length < 20) {
    return {
      ok: false,
      status: 401,
      error: 'Invalid API key format. Expected "pk_..." with at least 20 chars.',
    };
  }

  const supabase = getSupabaseAdmin();
  const keyHash = hashApiKey(plainKey);

  const { data: apiKey, error } = await supabase
    .from('api_keys')
    .select('id, user_id, revoked_at, expires_at, scopes')
    .eq('key_hash', keyHash)
    .maybeSingle();

  if (error || !apiKey) {
    return { ok: false, status: 401, error: 'Invalid API key.' };
  }

  if (apiKey.revoked_at) {
    return { ok: false, status: 401, error: 'API key revoked.' };
  }

  if (apiKey.expires_at && new Date(apiKey.expires_at) < new Date()) {
    return { ok: false, status: 401, error: 'API key expired.' };
  }

  // Fire-and-forget : on ne bloque pas la réponse sur cette mise à jour
  supabase
    .from('api_keys')
    .update({
      last_used_at: new Date().toISOString(),
      request_count: (apiKey.request_count || 0) + 1,
    })
    .eq('id', apiKey.id)
    .then(() => null)
    .catch((err) => console.warn('[api-auth] last_used update failed', err));

  return {
    ok: true,
    userId: apiKey.user_id,
    keyId: apiKey.id,
    scopes: apiKey.scopes || ['full'],
  };
}

/**
 * Wrapper pour CORS sur les endpoints publics /api/v1/* :
 * autorise toutes les origines (les clés API protègent l'accès).
 */
export function apiCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}
