'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import { PLANS } from '@/lib/plans';
import {
  Shield, Users, Mail, CreditCard, Search, ArrowLeft, Crown, RefreshCw,
  Trash2, KeyRound, Eye, EyeOff, Ban, CheckCircle, AlertTriangle, X,
  ChevronDown, ChevronUp, Clock, Globe, UserCheck, UserX
} from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalProspects: 0, proUsers: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedUser, setExpandedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const supabase = getSupabase();

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  function showToast(message, type = 'success') {
    setToast({ message, type });
  }

  async function checkAdminAndLoad() {
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      router.push('/dashboard');
      return;
    }

    setIsAdmin(true);
    await loadUsers();
    setLoading(false);
  }

  async function loadUsers() {
    // Load all user profiles
    const { data: profiles } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!profiles) return;

    // Load prospect counts per user
    const { data: prospectCounts } = await supabase
      .from('prospects')
      .select('user_id');

    // Load usage data
    const month = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    const { data: usageData } = await supabase
      .from('usage_tracking')
      .select('*')
      .eq('month', month);

    // Build counts
    const prospectCountMap = {};
    (prospectCounts || []).forEach(p => {
      prospectCountMap[p.user_id] = (prospectCountMap[p.user_id] || 0) + 1;
    });

    const usageMap = {};
    (usageData || []).forEach(u => {
      usageMap[u.user_id] = u;
    });

    // Fetch user details from admin API
    let authMap = {};
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const { users: authUsers } = await res.json();
        authMap = authUsers || {};
      }
    } catch (e) {
      console.error('Failed to load auth users', e);
    }

    const enrichedUsers = profiles.map(p => ({
      ...p,
      email: authMap[p.id]?.email || 'N/A',
      auth_created_at: authMap[p.id]?.created_at,
      last_sign_in_at: authMap[p.id]?.last_sign_in_at,
      email_confirmed_at: authMap[p.id]?.email_confirmed_at,
      provider: authMap[p.id]?.provider || 'email',
      prospectCount: prospectCountMap[p.id] || 0,
      usage: usageMap[p.id] || { searches: 0, enrichments: 0, exports: 0 },
    }));

    setUsers(enrichedUsers);
    setStats({
      totalUsers: profiles.length,
      totalProspects: Object.values(prospectCountMap).reduce((a, b) => a + b, 0),
      proUsers: profiles.filter(p => p.plan !== 'free').length,
    });
  }

  async function adminAction(action, userId, data = {}) {
    setActionLoading(`${action}-${userId}`);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userId, data }),
      });
      const result = await res.json();
      if (res.ok) {
        showToast(result.message || 'Action effectuee', 'success');
        // Send notification email via Resend when password is set
        if (action === 'set_password') {
          const targetUser = users.find(u => u.id === userId);
          if (targetUser?.email) {
            fetch('/api/admin/send-reset', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: targetUser.email, type: 'reset' }),
            }).catch(() => {});
          }
        }
        await loadUsers();
      } else {
        showToast(result.error || 'Erreur', 'error');
      }
    } catch (err) {
      showToast('Erreur reseau', 'error');
    }
    setActionLoading(null);
    setConfirmDialog(null);
    setNewPassword('');
  }

  const filteredUsers = users.filter(u =>
    !searchQuery ||
    u.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.plan || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }

  function timeAgo(dateStr) {
    if (!dateStr) return 'Jamais';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `Il y a ${mins}min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `Il y a ${days}j`;
    return formatDate(dateStr);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08080c] flex items-center justify-center">
        <RefreshCw className="h-6 w-6 text-violet-400 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#08080c] text-content-primary">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium shadow-lg animate-in fade-in slide-in-from-top-2 ${
          toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
          'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          {toast.message}
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70"><X className="h-3.5 w-3.5" /></button>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-card border border-line rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${confirmDialog.danger ? 'bg-red-500/20' : 'bg-violet-500/20'}`}>
                {confirmDialog.danger ? <AlertTriangle className="h-5 w-5 text-red-400" /> : <KeyRound className="h-5 w-5 text-violet-400" />}
              </div>
              <h3 className="text-lg font-semibold">{confirmDialog.title}</h3>
            </div>
            <p className="text-sm text-content-secondary mb-4">{confirmDialog.description}</p>
            {confirmDialog.email && (
              <p className="text-xs font-mono bg-surface-base rounded-lg px-3 py-2 mb-4 text-content-tertiary">{confirmDialog.email}</p>
            )}

            {confirmDialog.showPasswordInput && (
              <div className="mb-4">
                <label className="text-xs text-content-tertiary mb-1.5 block">Nouveau mot de passe</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Min. 6 caracteres"
                    className="w-full px-3 py-2 pr-10 rounded-lg bg-surface-base border border-line text-sm text-content-primary placeholder-content-muted focus:outline-none focus:border-violet-500"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-primary"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setConfirmDialog(null); setNewPassword(''); }}
                className="px-4 py-2 rounded-lg text-sm bg-surface-elevated hover:bg-surface-active transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => confirmDialog.onConfirm()}
                disabled={confirmDialog.showPasswordInput && newPassword.length < 6}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 ${
                  confirmDialog.danger
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                    : 'bg-violet-600 text-white hover:bg-violet-700'
                }`}
              >
                {actionLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-line bg-surface-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/dashboard')} className="p-2 rounded-lg hover:bg-surface-elevated transition-colors">
              <ArrowLeft className="h-4 w-4 text-content-tertiary" />
            </button>
            <Shield className="h-5 w-5 text-violet-400" />
            <h1 className="text-lg font-semibold">Administration</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-violet-500/20 text-violet-400">Admin</span>
          </div>
          <button onClick={() => { loadUsers(); showToast('Donnees actualisees'); }} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs bg-surface-elevated hover:bg-surface-active transition-colors">
            <RefreshCw className="h-3.5 w-3.5" /> Actualiser
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-line bg-surface-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-violet-400" />
              <span className="text-xs text-content-tertiary">Utilisateurs</span>
            </div>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </div>
          <div className="rounded-xl border border-line bg-surface-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-4 w-4 text-violet-400" />
              <span className="text-xs text-content-tertiary">Total prospects</span>
            </div>
            <div className="text-2xl font-bold">{stats.totalProspects}</div>
          </div>
          <div className="rounded-xl border border-line bg-surface-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="h-4 w-4 text-violet-400" />
              <span className="text-xs text-content-tertiary">Utilisateurs Pro</span>
            </div>
            <div className="text-2xl font-bold">{stats.proUsers}</div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-muted" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher par email, ID ou plan..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-card border border-line text-sm text-content-primary placeholder-content-muted focus:outline-none focus:border-violet-500"
          />
        </div>

        {/* Users list */}
        <div className="space-y-3">
          {filteredUsers.map(u => {
            const plan = PLANS[u.plan] || PLANS.free;
            const isExpanded = expandedUser === u.id;
            const isEmailConfirmed = !!u.email_confirmed_at;

            return (
              <div key={u.id} className="rounded-xl border border-line bg-surface-card overflow-hidden transition-colors hover:border-[#2a2a32]">
                {/* User row — clickable */}
                <button
                  onClick={() => setExpandedUser(isExpanded ? null : u.id)}
                  className="w-full px-5 py-4 flex items-center gap-4 text-left"
                >
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    u.is_admin ? 'bg-amber-500/20 text-amber-400' : 'bg-violet-500/15 text-violet-400'
                  }`}>
                    {(u.email || '?')[0].toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">{u.email}</span>
                      {u.is_admin && <Crown className="h-3.5 w-3.5 text-amber-400 shrink-0" />}
                      {!isEmailConfirmed && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-orange-500/20 text-orange-400 shrink-0">Non confirme</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[11px] text-content-muted font-mono">{u.id.slice(0, 12)}...</span>
                      <span className="text-[11px] text-content-muted">Inscrit {timeAgo(u.auth_created_at || u.created_at)}</span>
                    </div>
                  </div>

                  {/* Plan badge */}
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${
                    u.plan === 'enterprise' ? 'bg-amber-500/20 text-amber-400' :
                    u.plan === 'pro' ? 'bg-violet-500/20 text-violet-400' :
                    'bg-surface-elevated text-content-tertiary'
                  }`}>
                    {plan.name}
                  </span>

                  {/* Stats */}
                  <div className="hidden sm:flex items-center gap-4 text-xs text-content-tertiary shrink-0">
                    <span>{u.prospectCount} leads</span>
                    <span>{u.usage?.searches || 0} rech.</span>
                  </div>

                  {/* Expand icon */}
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-content-muted shrink-0" /> : <ChevronDown className="h-4 w-4 text-content-muted shrink-0" />}
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-line bg-surface-alt">
                    {/* Details grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-content-muted mb-1">Email</div>
                        <div className="text-sm text-content-primary break-all">{u.email}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-content-muted mb-1">User ID</div>
                        <div className="text-xs font-mono text-content-secondary break-all">{u.id}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-content-muted mb-1">Inscription</div>
                        <div className="text-sm text-content-secondary">{formatDate(u.auth_created_at || u.created_at)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-content-muted mb-1">Derniere connexion</div>
                        <div className="text-sm text-content-secondary">{u.last_sign_in_at ? timeAgo(u.last_sign_in_at) : 'Jamais'}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-content-muted mb-1">Email confirme</div>
                        <div className="flex items-center gap-1.5">
                          {isEmailConfirmed
                            ? <><UserCheck className="h-3.5 w-3.5 text-emerald-400" /><span className="text-sm text-emerald-400">Oui</span></>
                            : <><UserX className="h-3.5 w-3.5 text-orange-400" /><span className="text-sm text-orange-400">Non</span></>
                          }
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-content-muted mb-1">Provider</div>
                        <div className="text-sm text-content-secondary capitalize">{u.provider}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-content-muted mb-1">Prospects</div>
                        <div className="text-sm text-content-primary font-medium">{u.prospectCount}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-content-muted mb-1">Usage (ce mois)</div>
                        <div className="text-xs text-content-secondary">
                          {u.usage?.searches || 0} rech. / {u.usage?.enrichments || 0} enrich. / {u.usage?.exports || 0} exports
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 px-5 pb-5">
                      {/* Plan selector */}
                      <select
                        value={u.plan || 'free'}
                        onChange={e => adminAction('update_plan', u.id, { plan: e.target.value })}
                        className="px-3 py-2 rounded-lg text-xs bg-surface-base border border-line text-content-primary focus:outline-none focus:border-violet-500 cursor-pointer"
                      >
                        <option value="free">Starter</option>
                        <option value="pro">Pro</option>
                        <option value="enterprise">Enterprise</option>
                      </select>

                      {/* Toggle admin */}
                      <button
                        onClick={() => adminAction('toggle_admin', u.id)}
                        disabled={actionLoading === `toggle_admin-${u.id}`}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                          u.is_admin
                            ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                            : 'bg-surface-elevated text-content-tertiary hover:text-content-primary hover:bg-surface-active'
                        }`}
                      >
                        <Crown className="h-3.5 w-3.5" />
                        {u.is_admin ? 'Retirer admin' : 'Promouvoir admin'}
                      </button>

                      {/* Confirm email */}
                      {!isEmailConfirmed && (
                        <button
                          onClick={() => adminAction('confirm_email', u.id)}
                          disabled={actionLoading === `confirm_email-${u.id}`}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          Confirmer email
                        </button>
                      )}

                      {/* Send password reset email */}
                      <button
                        onClick={() => setConfirmDialog({
                          title: 'Reinitialiser le mot de passe',
                          description: 'Un email de reinitialisation sera envoye a l\'utilisateur.',
                          email: u.email,
                          danger: false,
                          onConfirm: () => adminAction('reset_password', u.id),
                        })}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs bg-surface-elevated text-content-secondary hover:text-content-primary hover:bg-surface-active transition-colors"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        Envoyer reset email
                      </button>

                      {/* Set password directly */}
                      <button
                        onClick={() => setConfirmDialog({
                          title: 'Definir un mot de passe',
                          description: 'Definir manuellement un nouveau mot de passe pour cet utilisateur.',
                          email: u.email,
                          showPasswordInput: true,
                          danger: false,
                          onConfirm: () => adminAction('set_password', u.id, { password: newPassword }),
                        })}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs bg-surface-elevated text-content-secondary hover:text-content-primary hover:bg-surface-active transition-colors"
                      >
                        <KeyRound className="h-3.5 w-3.5" />
                        Definir mdp
                      </button>

                      {/* Delete user */}
                      <button
                        onClick={() => setConfirmDialog({
                          title: 'Supprimer l\'utilisateur',
                          description: 'Cette action est irreversible. Tous les prospects, donnees d\'usage et le compte seront supprimes.',
                          email: u.email,
                          danger: true,
                          onConfirm: () => adminAction('delete_user', u.id),
                        })}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Supprimer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredUsers.length === 0 && (
            <div className="rounded-xl border border-line bg-surface-card p-8 text-center text-xs text-content-muted">
              Aucun utilisateur trouve
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
