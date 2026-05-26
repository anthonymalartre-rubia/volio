// Helper fire-and-forget pour logger des activités CRM depuis le module Campagnes.
//
// Objectif : créer une vue 360° dans le CRM. Quand on envoie un email à un
// contact qui existe AUSSI dans le CRM (même user_id / owner_id, même email),
// on insère une activity dans crm_activities pour qu'elle apparaisse dans la
// timeline du contact et (si trouvé) du deal lié.
//
// ⚠️ Sécurité : on filtre STRICTEMENT par user_id = ownerId du campaign, pour
// éviter de logger dans le CRM d'un autre user (data leak cross-tenant).
//
// ⚠️ Robustesse : ne JAMAIS faire échouer le cron d'envoi. Toute erreur est
// catchée et loggée, le helper retourne null en cas de problème.

/**
 * Log une activity "email envoyé" dans le CRM si le destinataire matche un contact CRM.
 *
 * @param {object} args
 * @param {object} args.supabaseAdmin  - Client Supabase service_role
 * @param {string} args.ownerId        - user_id propriétaire du campaign (filtre CRM)
 * @param {string} args.recipientEmail - Email du destinataire
 * @param {object} args.campaign       - { id, name, subject, ... }
 * @param {string} [args.providerId]   - ID Resend (preuve d'envoi)
 * @returns {Promise<{logged: boolean, activity_id?: string, contact_id?: string, deal_id?: string|null} | null>}
 */
export async function logEmailSentToCrm({ supabaseAdmin, ownerId, recipientEmail, campaign, providerId }) {
  try {
    if (!supabaseAdmin || !ownerId || !recipientEmail || !campaign?.id) {
      return null;
    }

    const emailLower = String(recipientEmail).trim().toLowerCase();
    if (!emailLower) return null;

    // 1) Lookup contact CRM (strict user_id match → pas de data leak)
    const { data: contact, error: contactErr } = await supabaseAdmin
      .from('crm_contacts')
      .select('id')
      .eq('user_id', ownerId)
      .ilike('email', emailLower)
      .maybeSingle();

    if (contactErr) {
      console.warn('[crm-activity-logger] contact lookup error', contactErr.message);
      return null;
    }
    if (!contact) {
      // Pas de contact CRM correspondant → no-op silencieux
      return null;
    }

    // 2) Lookup deal ouvert lié à ce contact (optionnel)
    let dealId = null;
    const { data: deal } = await supabaseAdmin
      .from('crm_deals')
      .select('id')
      .eq('user_id', ownerId)
      .eq('contact_id', contact.id)
      .eq('status', 'open')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (deal) dealId = deal.id;

    // 3) Insert activity (email envoyé = completed)
    const nowIso = new Date().toISOString();
    const subject = campaign.subject || campaign.name || 'sans objet';

    const { data: inserted, error: insertErr } = await supabaseAdmin
      .from('crm_activities')
      .insert({
        user_id: ownerId,
        contact_id: contact.id,
        deal_id: dealId,
        type: 'email',
        content: `Email envoyé : ${subject}`,
        completed_at: nowIso,
        metadata: {
          source: 'campagne',
          campaign_id: campaign.id,
          campaign_name: campaign.name || null,
          provider_id: providerId || null,
        },
      })
      .select('id')
      .single();

    if (insertErr) {
      console.warn('[crm-activity-logger] insert error', insertErr.message);
      return null;
    }

    return {
      logged: true,
      activity_id: inserted.id,
      contact_id: contact.id,
      deal_id: dealId,
    };
  } catch (err) {
    // Fire-and-forget : on n'échoue jamais le caller
    console.error('[crm-activity-logger] unexpected error', err);
    return null;
  }
}
