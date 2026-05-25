// POST /api/newsletter/subscribe
// Body : { email, source? }
// Inscrit un email à la newsletter mensuelle. Idempotent.

import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Domaines email perso bloqués pour la newsletter B2B (cohérent avec
// le filtre RGPD de l'app)
const PERSONAL_DOMAINS = new Set([
  'gmail.com', 'yahoo.com', 'yahoo.fr', 'hotmail.com', 'hotmail.fr',
  'outlook.com', 'outlook.fr', 'live.com', 'live.fr', 'aol.com',
  'icloud.com', 'me.com', 'orange.fr', 'free.fr', 'sfr.fr',
  'laposte.net', 'wanadoo.fr', 'protonmail.com', 'proton.me',
]);

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || '').trim().toLowerCase();
  const source = String(body.source || '').slice(0, 100) || 'unknown';

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
  }

  const domain = email.split('@')[1];
  if (PERSONAL_DOMAINS.has(domain)) {
    return NextResponse.json(
      { error: 'Pour les newsletters B2B Volia, merci d\'utiliser votre email professionnel.' },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();

  // Upsert : si l'email existait et était unsubscribed, on le réactive
  const { data: existing } = await supabase
    .from('newsletter_subscribers')
    .select('id, unsubscribed_at')
    .eq('email', email)
    .maybeSingle();

  if (existing) {
    if (existing.unsubscribed_at) {
      // Réactivation
      await supabase
        .from('newsletter_subscribers')
        .update({ unsubscribed_at: null, source, subscribed_at: new Date().toISOString() })
        .eq('id', existing.id);
      return NextResponse.json({ ok: true, status: 'reactivated' });
    }
    return NextResponse.json({ ok: true, status: 'already_subscribed' });
  }

  // Nouveau subscriber
  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({ email, source, confirmed_at: new Date().toISOString() });

  if (error) {
    console.error('[newsletter/subscribe] error', error);
    return NextResponse.json({ error: 'Erreur enregistrement' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, status: 'subscribed' });
}
