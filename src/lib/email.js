// src/lib/email.js
// Lightweight email utility using Resend REST API (no SDK dependency)
import { cleanEnv } from './envClean';

// From address par défaut. Configurable via env var pour les déploiements
// preview / staging qui utilisent un autre sender domain Resend.
const DEFAULT_FROM = 'Prospectia <hello@prospectia.cloud>';
const FALLBACK_FROM = 'Prospectia <onboarding@resend.dev>';

/**
 * Send a transactional email via Resend API.
 * @param {{ to: string, subject: string, html: string, replyTo?: string }} options
 * @returns {Promise<{ success: boolean, id?: string, error?: string }>}
 */
export async function sendEmail({ to, subject, html, replyTo }) {
  const apiKey = cleanEnv(process.env.RESEND_API_KEY);
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY not configured — skipping email');
    return { success: false, error: 'RESEND_API_KEY not configured' };
  }

  // Resend impose d'utiliser leur sandbox sender quand on a une clé de test
  // OU quand le domaine n'a pas encore été vérifié sur Resend.
  const isTestKey = apiKey.startsWith('re_test_');
  const customFrom = cleanEnv(process.env.RESEND_FROM_ADDRESS);
  const from = isTestKey ? FALLBACK_FROM : (customFrom || DEFAULT_FROM);

  try {
    const body = { from, to: [to], subject, html };
    if (replyTo) body.reply_to = replyTo;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('[email] Resend API error:', data);
      return { success: false, error: data.message || 'Resend API error' };
    }

    console.log(`[email] Sent "${subject}" to ${to} (id: ${data.id})`);
    return { success: true, id: data.id };
  } catch (err) {
    console.error('[email] Failed to send email:', err);
    return { success: false, error: err.message };
  }
}
