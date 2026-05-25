// Cron Vercel qui process les email_sends en status 'pending'.
//
// Stratégie :
//   - Tourne toutes les 5 min (vercel.json)
//   - Récupère max BATCH_SIZE sends pending les plus anciens
//   - Pour chaque : récupère le contact + campaign + applique template +
//     envoie via Resend + update le status du send
//   - Recalcule les stats de la campagne à la fin
//   - Si une campagne n'a plus aucun send pending → status 'sent'
//
// Protégé par CRON_SECRET (header Authorization Bearer).

import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { sendEmail } from '@/lib/email';
import { applyTemplate, appendOptOutFooter } from '@/lib/campaign-templates';
import { cleanEnv } from '@/lib/envClean';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Pro tier requis si > 10s sur free, mais 60 ici par sécurité

// Resend rate limit : ~10 emails/sec. On reste prudent (5/sec = 50 max par batch sur 10s)
const BATCH_SIZE = 50;

export async function GET(request) {
  // Auth via CRON_SECRET
  const expected = cleanEnv(process.env.CRON_SECRET);
  const provided = request.headers.get('authorization');
  if (expected && provided !== `Bearer ${expected}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();

  // 1) Auto-promote les campagnes 'scheduled' arrivées à échéance → 'sending'
  await supabase
    .from('email_campaigns')
    .update({ status: 'sending', started_at: new Date().toISOString() })
    .eq('status', 'scheduled')
    .lte('scheduled_at', new Date().toISOString());

  // 2) Récup le batch de sends pending (les plus anciens)
  const { data: sends, error: fetchErr } = await supabase
    .from('email_sends')
    .select('id, campaign_id, contact_id, email')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(BATCH_SIZE);

  if (fetchErr) {
    console.error('[cron/email-campaigns] fetch error', fetchErr);
    return NextResponse.json({ error: fetchErr.message }, { status: 500 });
  }
  if (!sends || sends.length === 0) {
    return NextResponse.json({ ok: true, processed: 0, message: 'Rien en queue' });
  }

  // 3) Charge en bulk les campaigns et contacts dont on a besoin
  const campaignIds = [...new Set(sends.map((s) => s.campaign_id))];
  const contactIds = [...new Set(sends.map((s) => s.contact_id))];

  const [{ data: campaigns }, { data: contacts }] = await Promise.all([
    supabase.from('email_campaigns').select('id, name, subject, body_html, from_name, from_email, reply_to, status').in('id', campaignIds),
    supabase.from('prospect_contacts').select('id, email, phone, first_name, last_name, company, position_title, custom_fields, opt_out').in('id', contactIds),
  ]);

  const campaignMap = new Map((campaigns || []).map((c) => [c.id, c]));
  const contactMap = new Map((contacts || []).map((c) => [c.id, c]));

  // 4) Envoie chaque send
  const results = await Promise.all(sends.map(async (send) => {
    const campaign = campaignMap.get(send.campaign_id);
    const contact = contactMap.get(send.contact_id);

    if (!campaign || !contact) {
      return updateSendStatus(supabase, send.id, 'failed', { error: 'Campaign or contact missing' });
    }
    if (campaign.status === 'paused') {
      return null; // skip silencieusement, sera retraité quand reprise
    }
    if (contact.opt_out) {
      return updateSendStatus(supabase, send.id, 'failed', { error: 'Contact opt-out' });
    }

    // Templating
    const subject = applyTemplate(campaign.subject, contact, '');
    let html = applyTemplate(campaign.body_html, contact, '');

    // Ajoute le lien opt-out RGPD
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://volia.fr';
    const optOutUrl = `${baseUrl}/api/prospection/opt-out?c=${contact.id}&cmp=${campaign.id}`;
    html = appendOptOutFooter(html, optOutUrl, campaign.name);

    const fromHeader = `${campaign.from_name} <${campaign.from_email}>`;

    const result = await sendEmail({
      to: contact.email,
      subject,
      html,
      replyTo: campaign.reply_to,
    });

    if (result.success) {
      // Met aussi à jour last_email_at sur le contact (throttling)
      await supabase.from('prospect_contacts')
        .update({ last_email_at: new Date().toISOString() })
        .eq('id', contact.id);
      return updateSendStatus(supabase, send.id, 'sent', {
        provider_id: result.id,
        sent_at: new Date().toISOString(),
      });
    } else {
      return updateSendStatus(supabase, send.id, 'failed', {
        error: result.error || 'Unknown error',
      });
    }
  }));

  const succeeded = results.filter((r) => r?.ok).length;
  const failed = results.filter((r) => r && !r.ok).length;

  // 5) Recalcule les stats des campagnes touchées
  for (const cid of campaignIds) {
    await supabase.rpc('refresh_email_campaign_stats', { campaign_uuid: cid });
  }

  // 6) Marque les campagnes complètes (plus de pending) comme 'sent'
  for (const cid of campaignIds) {
    const { count } = await supabase
      .from('email_sends')
      .select('id', { count: 'exact', head: true })
      .eq('campaign_id', cid)
      .eq('status', 'pending');
    if ((count || 0) === 0) {
      await supabase
        .from('email_campaigns')
        .update({ status: 'sent', completed_at: new Date().toISOString() })
        .eq('id', cid)
        .eq('status', 'sending');
    }
  }

  return NextResponse.json({
    ok: true,
    processed: sends.length,
    succeeded,
    failed,
    campaigns_affected: campaignIds.length,
  });
}

async function updateSendStatus(supabase, sendId, status, extra = {}) {
  const { error } = await supabase
    .from('email_sends')
    .update({ status, ...extra })
    .eq('id', sendId);
  return { ok: !error, sendId, status, error };
}
