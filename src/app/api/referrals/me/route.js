// GET /api/referrals/me
// Retourne le code de parrainage de l'user authentifié + ses stats.

import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { getReferralStats } from '@/lib/referrals';

export async function GET() {
  const { user } = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await getReferralStats(user.id);
  if (!data) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  return NextResponse.json(data);
}
