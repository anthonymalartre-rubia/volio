// Gestion des clés API depuis le dashboard /settings#api.
//
// GET  /api/api-keys              → liste les clés du user (sans la clé claire)
// POST /api/api-keys body { label }  → crée une nouvelle clé. Retourne la clé claire UNE SEULE FOIS.
// DELETE /api/api-keys?id=...     → révoque (sets revoked_at)

import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { generateApiKey, hashApiKey, getKeyPrefix } from '@/lib/api-auth';

export async function GET() {
  const { user, supabase } = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('api_keys')
    .select('id, key_prefix, label, scopes, last_used_at, request_count, revoked_at, created_at, expires_at')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Erreur lecture' }, { status: 500 });
  }

  return NextResponse.json({ keys: data || [] });
}

export async function POST(request) {
  const { user, supabase } = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const label = (body.label || '').trim();

  if (!label || label.length > 80) {
    return NextResponse.json(
      { error: 'Label requis (1-80 caractères).' },
      { status: 400 }
    );
  }

  // Limite : max 5 clés actives par user (anti-abus)
  const { count: activeCount } = await supabase
    .from('api_keys')
    .select('id', { count: 'exact', head: true })
    .is('revoked_at', null);

  if ((activeCount || 0) >= 5) {
    return NextResponse.json(
      { error: 'Limite atteinte (5 clés actives max). Révoquez une clé existante avant.' },
      { status: 400 }
    );
  }

  const plainKey = generateApiKey();
  const keyHash = hashApiKey(plainKey);
  const keyPrefix = getKeyPrefix(plainKey);

  const { data, error } = await supabase
    .from('api_keys')
    .insert({
      user_id: user.id,
      key_hash: keyHash,
      key_prefix: keyPrefix,
      label,
      scopes: ['full'],
    })
    .select('id, key_prefix, label, created_at')
    .single();

  if (error) {
    console.error('[api/api-keys] POST error', error);
    return NextResponse.json({ error: 'Erreur création' }, { status: 500 });
  }

  // ATTENTION : la clé claire n'est retournée QU'UNE SEULE FOIS.
  // L'utilisateur doit la copier maintenant car elle ne sera plus jamais
  // récupérable (hash seul stocké en DB).
  return NextResponse.json({
    ...data,
    key: plainKey,
    warning: 'Cette clé ne sera plus jamais visible. Copiez-la maintenant.',
  });
}

export async function DELETE(request) {
  const { user, supabase } = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'id requis' }, { status: 400 });
  }

  const { error } = await supabase
    .from('api_keys')
    .update({ revoked_at: new Date().toISOString() })
    .eq('id', id)
    .is('revoked_at', null); // ne révoque pas 2 fois

  if (error) {
    return NextResponse.json({ error: 'Erreur révocation' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
