// POST /api/notifications/archive
// Body : { ids: string[] } ou { all: true }
// "Archive" (suppression douce) une ou plusieurs notifs : sets archived_at.

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
    .update({ archived_at: now })
    .is('archived_at', null);

  if (!all) {
    query = query.in('id', ids);
  }

  const { error, count } = await query.select('id', { count: 'exact' });

  if (error) {
    console.error('[api/notifications/archive] error', error);
    return NextResponse.json({ error: 'Erreur update' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, archived_count: count || 0 });
}
