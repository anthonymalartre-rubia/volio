import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';

// Cap payload size pour éviter qu'un attaquant balance des MB de "stack trace"
// pour exploser les logs Vercel (= facture).
const MAX_FIELD_LEN = 2000;

function trunc(v) {
  if (v == null) return null;
  const s = String(v);
  return s.length > MAX_FIELD_LEN ? s.slice(0, MAX_FIELD_LEN) + '…[trunc]' : s;
}

export async function POST(request) {
  try {
    // Rate-limit anti-spam logs (P2 audit) : 20 reports max / IP / 10 min.
    // Avant : endpoint anonyme sans limite → vector pour spammer console.error
    // et faire grimper la facture log Vercel.
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    const rate = checkRateLimit(`report-error:${ip}`, 20, 10 * 60 * 1000);
    if (!rate.success) {
      return NextResponse.json({ received: false, rateLimited: true }, { status: 429 });
    }

    const body = await request.json();

    const errorReport = {
      level: 'error',
      timestamp: body.timestamp || new Date().toISOString(),
      message: trunc(body.message || 'Unknown error'),
      stack: trunc(body.stack),
      url: trunc(body.url),
      userAgent: trunc(body.userAgent),
      boundary: trunc(body.boundary),
      component: trunc(body.component),
      action: trunc(body.action),
      ip,
    };

    // Structured log — in production this could be extended to:
    // - Send to Slack/Discord webhook
    // - Write to a database
    // - Forward to an external logging service
    console.error('[ErrorReport]', JSON.stringify(errorReport));

    return NextResponse.json({ received: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
