// src/lib/analytics.js — Single-pass computation

export function computeAnalytics(prospects, searchHistory) {
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 86400000;
  const sevenDaysAgo = now - 7 * 86400000;

  // Week boundaries for trend (4 weeks, with readable labels)
  const weekBounds = [];
  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const monthNames = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (let i = 3; i >= 0; i--) {
    const start = new Date(now - (i + 1) * 7 * 86400000);
    const end = new Date(now - i * 7 * 86400000);
    const label = i === 0 ? 'Cette semaine' : i === 1 ? 'Sem. derniere' : `${start.getDate()} ${monthNames[start.getMonth()]}`;
    weekBounds.push({
      label,
      start: start.getTime(),
      end: end.getTime(),
      count: 0,
    });
  }

  let recent30 = 0;
  let recent7 = 0;
  let withEmail = 0;
  let withPhone = 0;
  let withWebsite = 0;
  const byDept = {};
  const byMethod = {};
  const byType = { b2b: 0, copro: 0, custom: 0 };
  const scoreDistribution = { excellent: 0, bon: 0, moyen: 0, faible: 0 };

  // Single pass over all prospects
  for (let i = 0; i < prospects.length; i++) {
    const p = prospects[i];
    const ts = new Date(p.created_at).getTime();

    if (ts >= thirtyDaysAgo) recent30++;
    if (ts >= sevenDaysAgo) recent7++;

    if (p.email) {
      withEmail++;
      if (p.email_method) byMethod[p.email_method] = (byMethod[p.email_method] || 0) + 1;
    }
    if (p.telephone) withPhone++;
    if (p.site_web) withWebsite++;

    if (p.departement) byDept[p.departement] = (byDept[p.departement] || 0) + 1;
    if (p.type) byType[p.type] = (byType[p.type] || 0) + 1;

    // Weekly trend
    for (let w = 0; w < weekBounds.length; w++) {
      if (ts >= weekBounds[w].start && ts < weekBounds[w].end) {
        weekBounds[w].count++;
        break;
      }
    }

    // Score distribution (based on data completeness)
    const score = p.lead_score || computeLeadScore(p);
    if (score >= 80) scoreDistribution.excellent++;
    else if (score >= 60) scoreDistribution.bon++;
    else if (score >= 40) scoreDistribution.moyen++;
    else scoreDistribution.faible++;
  }

  return {
    total: prospects.length,
    recent30,
    recent7,
    withEmail,
    withPhone,
    withWebsite,
    enrichmentRate: prospects.length > 0 ? Math.round((withEmail / prospects.length) * 100) : 0,
    byDept,
    byMethod,
    byType,
    weeklyTrend: weekBounds.map(w => ({ label: w.label, count: w.count })),
    scoreDistribution,
    searchCount: searchHistory?.length || 0,
  };
}

// Compute a lead quality score based on data completeness
function computeLeadScore(p) {
  let score = 0;
  if (p.email) score += 35;
  if (p.telephone) score += 20;
  if (p.site_web) score += 15;
  if (p.note && p.note >= 4) score += 15;
  if (p.nb_avis && p.nb_avis >= 10) score += 10;
  if (p.adresse) score += 5;
  return score;
}
