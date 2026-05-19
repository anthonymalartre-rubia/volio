import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getAuthenticatedUser } from '@/lib/auth';

/**
 * GET /api/stripe/diagnose
 *
 * Endpoint temporaire de diagnostic pour comprendre pourquoi le checkout
 * Stripe renvoie "An error occurred with our connection to Stripe".
 *
 * Vérifications :
 *  1. STRIPE_SECRET_KEY présente et bien formatée (sk_test_ ou sk_live_)
 *  2. STRIPE_PRO_PRICE_ID présent et bien formaté (price_)
 *  3. Mode test/live de la clé
 *  4. Appel léger stripe.balance.retrieve() pour tester l'auth + connectivité
 *  5. Appel stripe.prices.retrieve(STRIPE_PRO_PRICE_ID) pour valider le price
 *
 * Réservé aux utilisateurs authentifiés (pour éviter la fuite d'info).
 * À supprimer une fois le bug réglé.
 */
export async function GET() {
  const result = {
    timestamp: new Date().toISOString(),
    checks: {},
  };

  try {
    const { user } = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'authenticated only' }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: 'authenticated only' }, { status: 401 });
  }

  // 1. Env vars présence et format
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const proPriceId = process.env.STRIPE_PRO_PRICE_ID;
  const entPriceId = process.env.STRIPE_ENTERPRISE_PRICE_ID;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  result.checks.env = {
    STRIPE_SECRET_KEY: secretKey ? `${secretKey.slice(0, 8)}…${secretKey.slice(-4)} (${secretKey.length} chars)` : 'MISSING',
    STRIPE_PRO_PRICE_ID: proPriceId || 'MISSING',
    STRIPE_ENTERPRISE_PRICE_ID: entPriceId || 'MISSING',
    STRIPE_WEBHOOK_SECRET: webhookSecret ? `${webhookSecret.slice(0, 8)}… (${webhookSecret.length} chars)` : 'MISSING',
  };

  if (!secretKey) {
    return NextResponse.json(result, { status: 500 });
  }

  // 2. Mode détection
  const isLiveKey = secretKey.startsWith('sk_live_');
  const isTestKey = secretKey.startsWith('sk_test_');
  const isRestrictedKey = secretKey.startsWith('rk_');
  result.checks.keyMode = {
    isLiveKey,
    isTestKey,
    isRestrictedKey,
    format: isLiveKey ? 'live' : isTestKey ? 'test' : isRestrictedKey ? 'restricted (rk_)' : 'UNKNOWN/INVALID',
  };

  // 3. Détecte mismatch test/live entre clé et prix
  if (proPriceId) {
    // En général un price ID n'expose pas son mode dans l'ID lui-même
    // (mais Stripe Test et Live ont des spaces séparés)
    result.checks.priceWarning = isLiveKey
      ? 'Clé LIVE → STRIPE_PRO_PRICE_ID doit exister dans le mode Live de votre compte Stripe.'
      : 'Clé TEST → STRIPE_PRO_PRICE_ID doit exister dans le mode Test de votre compte Stripe.';
  }

  // 4. Test connectivité + auth via balance.retrieve (call léger)
  try {
    const stripe = new Stripe(secretKey, {
      maxNetworkRetries: 1, // au lieu de 2 default, pour répondre plus vite
      timeout: 15000,        // 15s au lieu de 80s default
    });

    const t0 = Date.now();
    const balance = await stripe.balance.retrieve();
    result.checks.balance = {
      ok: true,
      durationMs: Date.now() - t0,
      livemode: balance.livemode,
      availableCurrencies: balance.available?.map((a) => a.currency) || [],
    };
  } catch (err) {
    result.checks.balance = {
      ok: false,
      type: err?.type,
      code: err?.code,
      message: err?.message,
      statusCode: err?.statusCode,
      requestId: err?.requestId,
    };
  }

  // 5. Test le price ID
  if (proPriceId) {
    try {
      const stripe = new Stripe(secretKey, { maxNetworkRetries: 1, timeout: 15000 });
      const t0 = Date.now();
      const price = await stripe.prices.retrieve(proPriceId);
      result.checks.price = {
        ok: true,
        durationMs: Date.now() - t0,
        id: price.id,
        active: price.active,
        currency: price.currency,
        unit_amount: price.unit_amount,
        product: price.product,
        livemode: price.livemode,
      };
    } catch (err) {
      result.checks.price = {
        ok: false,
        type: err?.type,
        code: err?.code,
        message: err?.message,
      };
    }
  }

  const allOk = result.checks.balance?.ok && (!proPriceId || result.checks.price?.ok);
  return NextResponse.json(result, { status: allOk ? 200 : 500 });
}
