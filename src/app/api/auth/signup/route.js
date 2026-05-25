import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { sendEmail } from '@/lib/email';
import { authSignupConfirm } from '@/lib/emailTemplates';

/**
 * POST /api/auth/signup
 * Body: { email: string, password: string }
 *
 * Crée un nouveau compte Supabase (email non confirmé) via l'admin API
 * et envoie un email de confirmation brandé Volia via Resend.
 *
 * Important : ce flow REMPLACE supabase.auth.signUp() côté client. Il faut
 * désactiver les emails de confirmation par défaut de Supabase dans
 * Authentication > Email Templates pour ne pas envoyer 2 emails.
 *
 * Le cookie volia_ref (parrainage) reste géré côté client via
 * /api/referrals/track AFTER login (cf. signup page).
 */
export async function POST(request) {
  try {
    // Rate-limit anti-abuse : 5 tentatives / 15 min par IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    const rate = checkRateLimit(`auth-signup:${ip}`, 5, 15 * 60 * 1000);
    if (!rate.success) {
      return NextResponse.json(
        { error: 'Trop de tentatives d\'inscription. Réessayez dans 15 minutes.' },
        { status: 429 }
      );
    }

    const { email, password } = await request.json().catch(() => ({}));

    // Validation
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 400 });
    }
    if (typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 8 caractères.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const admin = getSupabaseAdmin();

    // 1. Créer l'utilisateur (non confirmé)
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: false,
    });

    if (createError) {
      const msg = (createError.message || '').toLowerCase();
      // Compte déjà existant → 409
      if (msg.includes('already') || msg.includes('exists') || msg.includes('registered') || msg.includes('duplicate')) {
        return NextResponse.json(
          { error: 'Un compte existe déjà avec cet email.' },
          { status: 409 }
        );
      }
      console.error('[auth/signup] createUser error:', createError);
      return NextResponse.json(
        { error: 'Impossible de créer le compte. Réessayez ou contactez le support.' },
        { status: 500 }
      );
    }

    // 2. Générer le lien de confirmation (sans envoyer d'email Supabase)
    // Note : admin.generateLink({ type: 'signup' }) re-définit le password
    // donc on lui passe le même password pour rester cohérent.
    const origin = request.headers.get('origin') || `https://${request.headers.get('host')}` || 'https://volia.fr';
    const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
      type: 'signup',
      email: normalizedEmail,
      password,
      options: {
        redirectTo: `${origin}/dashboard`,
      },
    });

    if (linkError || !linkData?.properties?.action_link) {
      console.error('[auth/signup] generateLink error:', linkError);
      return NextResponse.json(
        { error: 'Compte créé mais lien de confirmation non disponible. Contactez le support.' },
        { status: 500 }
      );
    }

    const confirmUrl = linkData.properties.action_link;

    // 3. Envoyer l'email brandé via Resend
    const { subject, html } = authSignupConfirm({ confirmUrl, email: normalizedEmail });
    const sendResult = await sendEmail({ to: normalizedEmail, subject, html });

    if (!sendResult.success) {
      // L'utilisateur EST déjà créé en base. On log + retourne une 500
      // avec un message qui invite à utiliser "Renvoyer l'email".
      console.error('[auth/signup] Resend send failed for', normalizedEmail, sendResult.error);
      return NextResponse.json(
        {
          error: 'Compte créé mais l\'email de confirmation n\'a pas pu être envoyé. Cliquez sur "Renvoyer l\'email" ou contactez le support.',
          partial: true,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email de confirmation envoyé.',
      userId: created?.user?.id || null,
    });
  } catch (err) {
    console.error('[auth/signup] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Erreur interne. Réessayez dans quelques instants.' },
      { status: 500 }
    );
  }
}
