// POST /api/referrals/track
// Body: { code: 'ant3X9' }
// Lie l'user authentifié au parrain dont le code est fourni.
//
// Appelé une seule fois juste après le signup, depuis le client
// (ou via /signup/page.js après création du compte).

import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { trackReferralSignup } from '@/lib/referrals';

export async function POST(request) {
  const { user } = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const code = (body.code || '').trim();
  if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 });

  const result = await trackReferralSignup({
    referrerCode: code,
    referredUserId: user.id,
    referredEmail: user.email,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json(result);
}
