// GET /api/admin/prospection/lists/[id]/sources/sessions
//
// Liste les 50 dernières search_sessions de l'utilisateur avec compteurs agrégés
// (prospects totaux + prospects avec email) pour proposer un import dans la liste.
//
// Réponse :
//   { sessions: [{ session_id, created_at, departments, categories,
//                  prospects_count, emails_count }] }

import { NextResponse } from 'next/server';
import { requireCampagnesAccess } from '@/lib/campagnes-access-server';

const MAX_SESSIONS = 50;

export async function GET(_request, { params }) {
  const auth = await requireCampagnesAccess();
  if (auth instanceof NextResponse) return auth;
  const { user, supabase } = auth;
  const { id: listId } = await params;

  // Vérifie que la liste existe et appartient au user (cohérence avec le reste
  // des routes — on évite d'exposer la liste des sessions sur un listId arbitraire).
  const { data: list, error: listErr } = await supabase
    .from('prospect_lists')
    .select('id')
    .eq('id', listId)
    .eq('owner_id', user.id)
    .maybeSingle();
  if (listErr || !list) {
    return NextResponse.json({ error: 'Liste introuvable' }, { status: 404 });
  }

  // 1. Récupère les sessions du user
  const { data: sessions, error: sErr } = await supabase
    .from('search_sessions')
    .select('id, created_at, departments, categories, results_count, status, label')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(MAX_SESSIONS);

  if (sErr) return NextResponse.json({ error: sErr.message }, { status: 500 });

  const sessionIds = (sessions || []).map((s) => s.id);
  if (sessionIds.length === 0) return NextResponse.json({ sessions: [] });

  // 2. Compte les prospects par session (total + ceux avec email).
  //    Une seule requête, on agrège côté JS.
  const { data: prospectRows, error: pErr } = await supabase
    .from('prospects')
    .select('search_session_id, email')
    .eq('user_id', user.id)
    .in('search_session_id', sessionIds);

  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 });

  const counts = new Map(); // session_id → { total, withEmail }
  for (const row of prospectRows || []) {
    const k = row.search_session_id;
    const c = counts.get(k) || { total: 0, withEmail: 0 };
    c.total++;
    if (row.email && String(row.email).trim()) c.withEmail++;
    counts.set(k, c);
  }

  const out = (sessions || []).map((s) => {
    const c = counts.get(s.id) || { total: 0, withEmail: 0 };
    return {
      session_id: s.id,
      created_at: s.created_at,
      departments: s.departments || [],
      categories: s.categories || null,
      label: s.label || null,
      status: s.status || null,
      prospects_count: c.total,
      emails_count: c.withEmail,
    };
  });

  return NextResponse.json({ sessions: out });
}
