'use client';

// Page complète /notifications — liste toutes les notifs du user,
// filtres (toutes / non lues / par type), mark-as-read, archive,
// pagination simple ("Charger plus").

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell, CheckCheck, Loader2, Inbox, X, ArrowLeft, Filter,
  Mail, AlertCircle, TrendingUp, CreditCard, Sparkles, Award, Megaphone,
  MessageSquare, Trophy, Settings as SettingsIcon,
} from 'lucide-react';
import { getSupabase } from '@/lib/supabase';

// Mapping type → icône + couleur + label (FR)
const TYPE_META = {
  enrichment_done:        { Icon: Mail,           color: 'text-green-400',   bg: 'bg-green-500/10',   label: 'Enrichissement' },
  search_complete:        { Icon: Mail,           color: 'text-green-400',   bg: 'bg-green-500/10',   label: 'Recherche' },
  campaign_sent:          { Icon: Mail,           color: 'text-blue-400',    bg: 'bg-blue-500/10',    label: 'Campagne envoyée' },
  campaign_completed:     { Icon: Mail,           color: 'text-blue-400',    bg: 'bg-blue-500/10',    label: 'Campagne terminée' },
  reply_received:         { Icon: MessageSquare,  color: 'text-indigo-400',  bg: 'bg-indigo-500/10',  label: 'Réponse reçue' },
  deal_created:           { Icon: TrendingUp,     color: 'text-violet-400',  bg: 'bg-violet-500/10',  label: 'Deal créé' },
  deal_won:               { Icon: Trophy,         color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Deal gagné' },
  quota_warning:          { Icon: AlertCircle,    color: 'text-amber-600',   bg: 'bg-amber-500/10',   label: 'Quota 80%' },
  usage_warning:          { Icon: AlertCircle,    color: 'text-amber-600',   bg: 'bg-amber-500/10',   label: 'Usage' },
  quota_reached:          { Icon: AlertCircle,    color: 'text-red-400',     bg: 'bg-red-500/10',     label: 'Quota atteint' },
  limit_reached:          { Icon: AlertCircle,    color: 'text-red-400',     bg: 'bg-red-500/10',     label: 'Limite atteinte' },
  payment_success:        { Icon: CreditCard,     color: 'text-green-400',   bg: 'bg-green-500/10',   label: 'Paiement' },
  payment_failed:         { Icon: CreditCard,     color: 'text-red-400',     bg: 'bg-red-500/10',     label: 'Paiement échoué' },
  subscription_cancelled: { Icon: CreditCard,     color: 'text-content-secondary', bg: 'bg-zinc-500/10', label: 'Annulation' },
  plan_changed:           { Icon: TrendingUp,     color: 'text-violet-400',  bg: 'bg-violet-500/10',  label: 'Plan' },
  new_feature:            { Icon: Sparkles,       color: 'text-violet-400',  bg: 'bg-violet-500/10',  label: 'Nouveauté' },
  study_published:        { Icon: Award,          color: 'text-violet-400',  bg: 'bg-violet-500/10',  label: 'Étude' },
  weekly_digest:          { Icon: Mail,           color: 'text-blue-400',    bg: 'bg-blue-500/10',    label: 'Digest' },
  admin_message:          { Icon: Megaphone,      color: 'text-indigo-400',  bg: 'bg-indigo-500/10',  label: 'Annonce' },
  system:                 { Icon: SettingsIcon,   color: 'text-content-secondary', bg: 'bg-zinc-500/10', label: 'Système' },
};

const DEFAULT_META = { Icon: Bell, color: 'text-content-secondary', bg: 'bg-zinc-500/10', label: 'Notification' };

const PAGE_SIZE = 30;

function timeAgo(iso) {
  if (!iso) return '';
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return `il y a ${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `il y a ${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `il y a ${days}j`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `il y a ${weeks}sem`;
  return new Date(iso).toLocaleDateString('fr-FR');
}

export default function NotificationsPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [authed, setAuthed] = useState(false);

  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  // Filtres
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | type-specific
  const [typeFilter, setTypeFilter] = useState(null);

  // Check auth
  useEffect(() => {
    (async () => {
      const supabase = getSupabase();
      if (!supabase) {
        setAuthChecked(true);
        return;
      }
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setAuthed(true);
      } else {
        router.replace('/login?return=/notifications');
        return;
      }
      setAuthChecked(true);
    })();
  }, [router]);

  // Fetch helper — toujours depuis offset 0
  const fetchPage = useCallback(async (opts = {}) => {
    const offset = opts.offset || 0;
    const append = !!opts.append;
    const params = new URLSearchParams({ limit: String(PAGE_SIZE), offset: String(offset) });
    if (filter === 'unread') params.set('unread', '1');
    if (typeFilter) params.set('type', typeFilter);

    try {
      const res = await fetch(`/api/notifications?${params.toString()}`, { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      setItems((prev) => (append ? [...prev, ...(data.notifications || [])] : (data.notifications || [])));
      setUnread(data.unread_count || 0);
      setTotal(data.total_count || 0);
    } catch (e) {
      console.error('[notifications] fetch error', e);
    }
  }, [filter, typeFilter]);

  // Initial + on filter change
  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    fetchPage({ offset: 0, append: false }).finally(() => setLoading(false));
  }, [authed, fetchPage]);

  const loadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    await fetchPage({ offset: items.length, append: true });
    setLoadingMore(false);
  };

  const markOneRead = async (id) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read_at: n.read_at || new Date().toISOString() } : n)));
    setUnread((u) => Math.max(0, u - 1));
    try {
      await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
    } catch {}
  };

  const archiveOne = async (id) => {
    // Optimistic remove
    setItems((prev) => prev.filter((n) => n.id !== id));
    setTotal((t) => Math.max(0, t - 1));
    try {
      await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
    } catch {}
  };

  const markAllRead = async () => {
    if (unread === 0 || markingAll) return;
    setMarkingAll(true);
    const now = new Date().toISOString();
    setItems((prev) => prev.map((n) => ({ ...n, read_at: n.read_at || now })));
    setUnread(0);
    try {
      await fetch('/api/notifications/mark-all-read', { method: 'POST' });
    } catch {}
    setMarkingAll(false);
  };

  const handleCardClick = (n) => {
    if (!n.read_at) markOneRead(n.id);
    if (n.link) router.push(n.link);
  };

  // Types présents dans la liste actuelle (pour dropdown filtre dynamique)
  const presentTypes = Array.from(new Set(items.map((n) => n.type)));

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center py-32 text-content-secondary">
        <Loader2 size={20} className="animate-spin" />
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-content-tertiary hover:text-content-secondary mb-3"
        >
          <ArrowLeft size={12} />
          Retour au dashboard
        </Link>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
              <Bell size={22} className="text-violet-400" />
              Notifications
              {unread > 0 && (
                <span className="inline-flex items-center justify-center min-w-[26px] h-6 px-2 rounded-full bg-violet-600 text-white text-xs font-bold">
                  {unread}
                </span>
              )}
            </h1>
            <p className="text-sm text-content-secondary mt-1">
              {total > 0
                ? `${total} notification${total > 1 ? 's' : ''}${unread > 0 ? ` · ${unread} non lue${unread > 1 ? 's' : ''}` : ''}`
                : 'Aucune notification'}
            </p>
          </div>
          {unread > 0 && (
            <button
              onClick={markAllRead}
              disabled={markingAll}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-line bg-surface-elevated/40 hover:bg-surface-elevated text-sm text-content-primary disabled:opacity-50 transition"
            >
              {markingAll ? <Loader2 size={14} className="animate-spin" /> : <CheckCheck size={14} />}
              Tout marquer comme lu
            </button>
          )}
        </div>
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <FilterPill active={filter === 'all' && !typeFilter} onClick={() => { setFilter('all'); setTypeFilter(null); }}>
          Toutes
        </FilterPill>
        <FilterPill active={filter === 'unread' && !typeFilter} onClick={() => { setFilter('unread'); setTypeFilter(null); }}>
          Non lues {unread > 0 && <span className="ml-1 text-[10px] opacity-70">({unread})</span>}
        </FilterPill>
        {presentTypes.length > 1 && (
          <div className="relative inline-flex">
            <select
              value={typeFilter || ''}
              onChange={(e) => {
                const v = e.target.value;
                setTypeFilter(v || null);
                if (v) setFilter('all');
              }}
              className="appearance-none pl-9 pr-8 py-1.5 rounded-full border border-line bg-surface-elevated/40 text-sm text-content-primary hover:bg-surface-elevated transition cursor-pointer"
            >
              <option value="">Tous les types</option>
              {presentTypes.map((t) => (
                <option key={t} value={t}>{(TYPE_META[t] || DEFAULT_META).label}</option>
              ))}
            </select>
            <Filter size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-content-tertiary pointer-events-none" />
          </div>
        )}
      </div>

      {/* Liste */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-content-secondary">
          <Loader2 size={20} className="animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState filter={filter} typeFilter={typeFilter} />
      ) : (
        <div className="rounded-2xl border border-line bg-surface-card overflow-hidden divide-y divide-line">
          {items.map((n) => {
            const meta = TYPE_META[n.type] || DEFAULT_META;
            const { Icon } = meta;
            const isRead = !!n.read_at;
            return (
              <div
                key={n.id}
                className={`group relative flex gap-3 sm:gap-4 px-4 sm:px-5 py-4 transition ${
                  isRead ? '' : 'bg-violet-500/[0.04]'
                } hover:bg-surface-elevated/60 ${n.link ? 'cursor-pointer' : ''}`}
                onClick={(e) => {
                  // ignore clicks on inner buttons
                  if (e.target.closest('button')) return;
                  handleCardClick(n);
                }}
              >
                {/* Icône type */}
                <div className={`w-10 h-10 rounded-xl ${meta.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={16} className={meta.color} />
                </div>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] uppercase tracking-wider text-content-tertiary font-medium">
                          {meta.label}
                        </span>
                        {!isRead && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-violet-300 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                            Nouveau
                          </span>
                        )}
                      </div>
                      <p className={`text-sm leading-snug mt-1 ${isRead ? 'text-content-secondary' : 'text-content-primary font-semibold'}`}>
                        {n.title}
                      </p>
                      {n.body && (
                        <p className="text-xs text-content-tertiary mt-1 leading-relaxed">
                          {n.body}
                        </p>
                      )}
                      <p className="text-[10px] text-content-tertiary mt-2 tabular-nums">{timeAgo(n.created_at)}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  {!isRead && (
                    <button
                      onClick={(e) => { e.stopPropagation(); markOneRead(n.id); }}
                      className="text-[10px] text-violet-400 hover:text-violet-300 inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 focus:opacity-100 transition"
                      aria-label="Marquer comme lu"
                    >
                      <CheckCheck size={11} />
                      Marquer lu
                    </button>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); archiveOne(n.id); }}
                    className="p-1 rounded-md text-content-tertiary hover:text-red-400 hover:bg-red-500/10 transition opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Archiver"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Charger plus */}
      {!loading && items.length > 0 && items.length < total && (
        <div className="mt-6 text-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-line bg-surface-elevated/40 hover:bg-surface-elevated text-sm text-content-primary disabled:opacity-50 transition"
          >
            {loadingMore ? <Loader2 size={14} className="animate-spin" /> : null}
            Charger plus ({total - items.length} restantes)
          </button>
        </div>
      )}

      {/* Lien préférences */}
      <div className="mt-8 text-center">
        <Link
          href="/settings#notifications"
          className="text-xs text-content-tertiary hover:text-violet-400 transition"
        >
          Préférences de notifications →
        </Link>
      </div>
    </main>
  );
}

function FilterPill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm transition border ${
        active
          ? 'border-violet-500/40 bg-violet-500/15 text-violet-200 font-medium'
          : 'border-line bg-surface-elevated/40 text-content-secondary hover:text-content-primary hover:bg-surface-elevated'
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState({ filter, typeFilter }) {
  let msg = 'Aucune notification pour le moment';
  let sub = 'Tout est calme — on vous prévient dès qu\'il se passe quelque chose.';
  if (filter === 'unread') {
    msg = 'Aucune notification non lue';
    sub = 'Vous êtes à jour. Bravo !';
  } else if (typeFilter) {
    msg = 'Aucune notification de ce type';
    sub = 'Essayez un autre filtre.';
  }
  return (
    <div className="rounded-2xl border border-line bg-surface-card px-6 py-16 text-center">
      <div className="w-14 h-14 rounded-full bg-surface-elevated mx-auto mb-4 flex items-center justify-center">
        <Inbox size={22} className="text-content-tertiary" />
      </div>
      <p className="text-sm font-medium text-content-primary mb-1">{msg}</p>
      <p className="text-xs text-content-tertiary">{sub}</p>
    </div>
  );
}
