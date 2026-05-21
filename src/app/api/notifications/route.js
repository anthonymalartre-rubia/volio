// GET  /api/notifications        → liste les notifs non archivées du user
// POST /api/notifications/mark-read     → body { ids?: [], all?: true }
// POST /api/notifications/archive       → body { ids?: [], all?: true }
//
// Tous les endpoints exigent un user authentifié et reposent sur RLS
// Supabase pour la sécurité (un user ne peut toucher que ses notifs).

import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';

const LIMIT_DEFAULT = 30;
const LIMIT_MAX = 100;

export async function GET(request) {
  const { user, supabase } = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(request.url);
  const limitParam = parseInt(url.searchParams.get('limit') || '', 10);
  const limit = Math.min(LIMIT_MAX, isNaN(limitParam) ? LIMIT_DEFAULT : Math.max(1, limitParam));
  const onlyUnread = url.searchParams.get('unread') === '1';

  let query = supabase
    .from('notifications')
    .select('id, type, title, body, link, metadata, read_at, created_at')
    .is('archived_at', null)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (onlyUnread) {
    query = query.is('read_at', null);
  }

  const { data, error } = await query;
  if (error) {
    console.error('[api/notifications] fetch error', error);
    return NextResponse.json({ error: 'Erreur lecture' }, { status: 500 });
  }

  // Compteur de non-lues (séparé pour permettre la pagination future)
  const { count: unreadCount } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .is('read_at', null)
    .is('archived_at', null);

  return NextResponse.json({
    notifications: data || [],
    unread_count: unreadCount || 0,
  });
}
