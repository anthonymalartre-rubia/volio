// src/lib/usage.js
import { getPlan, isLimitReached } from './plans';

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

// Get or create usage record for current month
export async function getUsage(supabase, userId) {
  const month = getCurrentMonth();

  const { data } = await supabase
    .from('usage_tracking')
    .select('*')
    .eq('user_id', userId)
    .eq('month', month)
    .single();

  if (data) return data;

  // Create if not exists
  const { data: newData } = await supabase
    .from('usage_tracking')
    .insert({ user_id: userId, month })
    .select()
    .single();

  return newData || { searches: 0, enrichments: 0, exports: 0 };
}

// Get user plan
export async function getUserPlan(supabase, userId) {
  const { data } = await supabase
    .from('user_profiles')
    .select('plan')
    .eq('id', userId)
    .single();

  return getPlan(data?.plan || 'free');
}

// Check if user can perform an action
export async function checkLimit(supabase, userId, action) {
  const plan = await getUserPlan(supabase, userId);
  const usage = await getUsage(supabase, userId);
  const limit = plan.limits[`${action}_per_month`];
  const current = usage[action] || 0;

  return {
    allowed: !isLimitReached(limit, current),
    current,
    limit,
    plan: plan.id,
    remaining: limit === -1 ? -1 : Math.max(0, limit - current),
  };
}

// Increment usage counter
export async function incrementUsage(supabase, userId, action, amount = 1) {
  const month = getCurrentMonth();

  const { data: existing } = await supabase
    .from('usage_tracking')
    .select('id, ' + action)
    .eq('user_id', userId)
    .eq('month', month)
    .single();

  if (existing) {
    await supabase
      .from('usage_tracking')
      .update({ [action]: (existing[action] || 0) + amount, updated_at: new Date().toISOString() })
      .eq('id', existing.id);
  } else {
    await supabase
      .from('usage_tracking')
      .insert({ user_id: userId, month, [action]: amount });
  }
}
