// POST /api/notifications/mark-read
// Body : { ids?: string[], all?: boolean }
// Marque les notifications spécifiées comme lues (sets read_at = now).
// Si all=true, marque toutes les notifs non lues du user.

import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';

export async function POST(request) {
  const { user, supabase } = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const { ids, all } = body;

  if (!all && (!Array.isArray(ids) || ids.length === 0)) {
    return NextResponse.json({ error: 'ids[] ou all=true requis' }, { status: 400 });
  }

  const now = new Date().toISOString();

  let query = supabase
    .from('notifications')
    .update({ read_at: now })
    .is('read_at', null); // n'écrase pas une read_at déjà set

  if (!all) {
    query = query.in('id', ids);
  }

  const { error, count } = await query.select('id', { count: 'exact' });

  if (error) {
    console.error('[api/notifications/mark-read] error', error);
    return NextResponse.json({ error: 'Erreur update' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, marked_count: count || 0 });
}
