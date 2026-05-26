// PATCH  /api/notifications/[id]  → marque la notification comme lue (read_at = now)
// DELETE /api/notifications/[id]  → archive la notification (soft delete : archived_at = now)
//
// RLS Supabase garantit qu'un user ne peut toucher que ses propres notifs.

import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function PATCH(request, { params }) {
  const { user, supabase } = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;
  if (!id || !UUID_RE.test(id)) {
    return NextResponse.json({ error: 'id invalide' }, { status: 400 });
  }

  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', id)
    .is('read_at', null);

  if (error) {
    console.error('[api/notifications/[id]] PATCH error', error);
    return NextResponse.json({ error: 'Erreur update' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request, { params }) {
  const { user, supabase } = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;
  if (!id || !UUID_RE.test(id)) {
    return NextResponse.json({ error: 'id invalide' }, { status: 400 });
  }

  const { error } = await supabase
    .from('notifications')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', id)
    .is('archived_at', null);

  if (error) {
    console.error('[api/notifications/[id]] DELETE error', error);
    return NextResponse.json({ error: 'Erreur archive' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
