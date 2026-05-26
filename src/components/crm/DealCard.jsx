'use client';

// ─────────────────────────────────────────────────────────────────────
// DealCard — carte cliquable + draggable d'un deal dans le Kanban.
// ─────────────────────────────────────────────────────────────────────
// Props :
//   - deal : objet deal (avec contact + stage embarqués)
//   - onClick : ouvre le DealDetailDrawer
//   - onDragStart : handler natif HTML5 (parent gère le dataTransfer)
//   - onDragEnd   : reset visual state côté parent
//   - isDragging  : applique opacity-50 + ring violet
//
// Visuel : 240px wide, p-3, rounded-lg, hover shadow.
// Status 'won' → badge emerald + bg-emerald-50
// Status 'lost' → badge rose + bg-rose-50 + opacity-70
// ─────────────────────────────────────────────────────────────────────

import { Building2, Banknote, Calendar, User } from 'lucide-react';
import { formatDealValue } from '@/lib/crm';

// ─── helpers date ────────────────────────────────────────────────────
function formatRelativeDate(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;

  const now = new Date();
  // Tronque à minuit pour éviter biais d'heure.
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return { label: "Aujourd'hui", tone: 'warn' };
  if (diffDays === 1) return { label: 'Demain', tone: 'warn' };
  if (diffDays === -1) return { label: 'Hier', tone: 'danger' };
  if (diffDays < 0) return { label: `Retard ${Math.abs(diffDays)}j`, tone: 'danger' };
  if (diffDays <= 7) return { label: `Dans ${diffDays}j`, tone: 'warn' };

  // > 7 jours : date complète FR
  const fmt = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: target.getFullYear() === today.getFullYear() ? undefined : 'numeric',
  });
  return { label: fmt.format(date), tone: 'neutral' };
}

export default function DealCard({
  deal,
  onClick,
  onDragStart,
  onDragEnd,
  isDragging = false,
}) {
  if (!deal) return null;

  const isWon = deal.status === 'won';
  const isLost = deal.status === 'lost';
  const isClosed = isWon || isLost;

  const dateInfo = formatRelativeDate(deal.expected_close_date);
  const contact = deal.contact;
  const company = contact?.company;
  const contactName = contact?.name;
  // Heuristique : titre principal = company > contact.name > deal.title
  const heading = company || contactName || null;

  const baseColors = isWon
    ? 'bg-emerald-50/80 border-emerald-200 hover:border-emerald-300'
    : isLost
    ? 'bg-rose-50/60 border-rose-200 hover:border-rose-300 opacity-75'
    : 'bg-surface-card border-line hover:border-emerald-300';

  const dateColors =
    dateInfo?.tone === 'danger'
      ? 'text-rose-600'
      : dateInfo?.tone === 'warn'
      ? 'text-amber-600'
      : 'text-content-tertiary';

  return (
    <div
      role="button"
      tabIndex={0}
      draggable={!isClosed}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`
        group relative w-full p-3 rounded-lg border
        text-left transition-all
        ${baseColors}
        ${isClosed ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'}
        ${isDragging ? 'opacity-40 ring-2 ring-emerald-400 ring-offset-2 ring-offset-surface-elevated' : 'hover:shadow-md hover:-translate-y-0.5'}
        focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base
      `}
      aria-label={`Deal ${deal.title}, valeur ${formatDealValue(deal.value_cents)}${heading ? `, ${heading}` : ''}`}
    >
      {/* Status badge top-right (only if closed) */}
      {isClosed && (
        <div className="absolute top-2 right-2">
          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide ${
              isWon
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                : 'bg-rose-100 text-rose-700 border border-rose-200'
            }`}
          >
            {isWon ? '✓ Gagné' : '✗ Perdu'}
          </span>
        </div>
      )}

      {/* Heading : company OR contact name */}
      {heading && (
        <div className="flex items-center gap-1.5 mb-1 text-content-secondary">
          <Building2 size={11} className="flex-shrink-0 text-content-tertiary" />
          <span className="text-[11px] font-semibold uppercase tracking-wide truncate">
            {heading}
          </span>
        </div>
      )}

      {/* Title */}
      <h3 className={`text-sm font-semibold text-content-primary leading-tight mb-2 ${isClosed ? 'pr-16' : ''}`}>
        {deal.title}
      </h3>

      {/* Value + date row */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="inline-flex items-center gap-1 text-content-primary font-bold tabular-nums">
          <Banknote size={12} className="text-emerald-600" />
          <span>{formatDealValue(deal.value_cents, deal.currency)}</span>
        </div>
        {dateInfo && (
          <div className={`inline-flex items-center gap-1 ${dateColors} font-medium`}>
            <Calendar size={11} />
            <span>{dateInfo.label}</span>
          </div>
        )}
      </div>

      {/* Contact name (compact, only if heading shown company) */}
      {company && contactName && (
        <div className="mt-2 pt-2 border-t border-line flex items-center gap-1.5 text-[11px] text-content-tertiary">
          <User size={10} />
          <span className="truncate">{contactName}</span>
        </div>
      )}
    </div>
  );
}
