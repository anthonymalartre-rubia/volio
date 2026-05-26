// POST /api/onboarding/complete
//
// Sauvegarde les champs de profil collectés par le wizard /onboarding et
// marque l'onboarding comme "completed" pour cet utilisateur.
//
// Body attendu :
//   {
//     company_name: string (required)
//     role: string (required) — 'founder' | 'sales' | 'marketing' | 'freelance' | 'other'
//     team_size: string (required) — '1' | '2-10' | '11-50' | '51+'
//     target_category: string (required) — une cat de B2B_CATS
//     target_dept: string (required) — code DEPT (FR : '75', '13'…)
//   }
//
// Side effects :
// - UPDATE user_profiles SET company_name, role, team_size, target_category,
//                          target_dept, onboarding_completed_at = NOW()
// - Marque aussi onboarding_steps.profile_completed = NOW() (cohérence avec
//   le widget OnboardingChecklist qui attend cette step).
//
// Le wizard appelle ENSUITE /api/onboarding/complete-step avec step=first_search
// au moment où il redirect vers le dashboard pour lancer la 1ère recherche.

import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';

const VALID_ROLES = new Set(['founder', 'sales', 'marketing', 'freelance', 'other']);
const VALID_TEAM_SIZES = new Set(['1', '2-10', '11-50', '51+']);

export async function POST(request) {
  const { user, supabase } = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const {
    company_name,
    role,
    team_size,
    target_category,
    target_dept,
  } = body || {};

  // Validation simple — le wizard envoie tjs des valeurs propres mais on
  // se prémunit contre un POST direct sans données.
  if (typeof company_name !== 'string' || company_name.trim().length === 0) {
    return NextResponse.json({ error: 'company_name required' }, { status: 400 });
  }
  if (typeof role !== 'string' || !VALID_ROLES.has(role)) {
    return NextResponse.json({ error: 'invalid role' }, { status: 400 });
  }
  if (typeof team_size !== 'string' || !VALID_TEAM_SIZES.has(team_size)) {
    return NextResponse.json({ error: 'invalid team_size' }, { status: 400 });
  }
  if (typeof target_category !== 'string' || target_category.trim().length === 0) {
    return NextResponse.json({ error: 'target_category required' }, { status: 400 });
  }
  if (typeof target_dept !== 'string' || target_dept.trim().length === 0) {
    return NextResponse.json({ error: 'target_dept required' }, { status: 400 });
  }

  // Récupère l'état actuel pour ne pas écraser onboarding_steps existant
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('onboarding_steps, onboarding_completed_at')
    .eq('id', user.id)
    .maybeSingle();

  const now = new Date().toISOString();
  const currentSteps = profile?.onboarding_steps || {};
  const nextSteps = {
    ...currentSteps,
    profile_completed: currentSteps.profile_completed || now,
  };

  const { error: updErr } = await supabase
    .from('user_profiles')
    .update({
      company_name: company_name.trim().slice(0, 200),
      role,
      team_size,
      target_category: target_category.trim().slice(0, 100),
      target_dept: target_dept.trim().slice(0, 10),
      onboarding_steps: nextSteps,
      onboarding_completed_at: profile?.onboarding_completed_at || now,
    })
    .eq('id', user.id);

  if (updErr) {
    console.error('[onboarding/complete] update error', updErr);
    return NextResponse.json({ error: updErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, completed_at: now });
}
