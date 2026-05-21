// GET /api/v1/usage
// Retourne l'usage du mois courant (ou d'un mois spécifique via ?month=YYYY-MM)
// avec les pourcentages vs limites du plan.

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
  const url = new URL(request.url);

  const month = url.searchParams.get('month') || new Date().toISOString().slice(0, 7);
  // Validation format YYYY-MM
  if (!/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json(
      { error: 'Invalid month format. Use YYYY-MM (e.g. 2026-05).' },
      { status: 400, headers: apiCorsHeaders() }
    );
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('plan')
    .eq('id', userId)
    .maybeSingle();

  const planId = profile?.plan || 'free';
  const plan = PLANS[planId] || PLANS.free;
  const limits = plan.limits || {};

  const { data: usage } = await supabase
    .from('usage_tracking')
    .select('searches, enrichments, exports')
    .eq('user_id', userId)
    .eq('month', month)
    .maybeSingle();

  const counts = {
    searches: usage?.searches || 0,
    enrichments: usage?.enrichments || 0,
    exports: usage?.exports || 0,
  };

  // Calcule les % pour chaque action
  const pct = (current, limit) => {
    if (limit === -1) return null; // unlimited
    if (!limit) return null;
    return Math.round((current / limit) * 1000) / 10; // 1 décimale
  };

  return NextResponse.json(
    {
      month,
      plan: { id: planId, name: plan.name },
      usage: {
        searches: {
          used: counts.searches,
          limit: limits.searches_per_month ?? null,
          percent: pct(counts.searches, limits.searches_per_month),
        },
        enrichments: {
          used: counts.enrichments,
          limit: limits.enrichments_per_month ?? null,
          percent: pct(counts.enrichments, limits.enrichments_per_month),
        },
        exports: {
          used: counts.exports,
          limit: limits.exports_per_month ?? null,
          percent: pct(counts.exports, limits.exports_per_month),
        },
      },
    },
    { headers: apiCorsHeaders() }
  );
}
