// POST /api/notifications/mark-all-read
// Marque toutes les notifications non lues du user comme lues.
// Pas de body — opération idempotente.

import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';

export async function POST() {
  const { user, supabase } = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const now = new Date().toISOString();

  const { error, count } = await supabase
    .from('notifications')
    .update({ read_at: now })
    .is('read_at', null)
    .select('id', { count: 'exact' });

  if (error) {
    console.error('[api/notifications/mark-all-read] error', error);
    return NextResponse.json({ error: 'Erreur update' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, marked_count: count || 0 });
}
