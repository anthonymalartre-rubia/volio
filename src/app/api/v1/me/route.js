// GET /api/v1/me
// Retourne le profil de l'utilisateur authentifié + plan + usage du mois.
//
// Usage typique : ping initial pour vérifier que la clé est valide
// avant d'exécuter des actions plus lourdes.

import { NextResponse } from 'next/server';
import { authenticateApiRequest, apiCorsHeaders } from '@/lib/api-auth';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { PLANS } from '@/lib/plans';

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: apiCorsHeaders() });
}

export async function GET(request) {
  const auth = await authenticateApiRequest(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status, headers: apiCorsHeaders() });
  }

  const supabase = getSupabaseAdmin();
  const { userId } = auth;

  // Profil
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id, plan, created_at')
    .eq('id', userId)
    .maybeSingle();

  // Email depuis auth.users
  const { data: { user: authUser } } = await supabase.auth.admin.getUserById(userId);

  // Usage du mois courant
  const month = new Date().toISOString().slice(0, 7); // YYYY-MM
  const { data: usage } = await supabase
    .from('usage_tracking')
    .select('searches, enrichments, exports')
    .eq('user_id', userId)
    .eq('month', month)
    .maybeSingle();

  const planId = profile?.plan || 'free';
  const plan = PLANS[planId] || PLANS.free;

  return NextResponse.json(
    {
      user: {
        id: userId,
        email: authUser?.email || null,
        created_at: profile?.created_at || null,
      },
      plan: {
        id: planId,
        name: plan.name,
        limits: plan.limits,
      },
      usage: {
        month,
        searches: usage?.searches || 0,
        enrichments: usage?.enrichments || 0,
        exports: usage?.exports || 0,
      },
    },
    { headers: apiCorsHeaders() }
  );
}
