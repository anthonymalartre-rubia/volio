// Input primitive partagée.
//
// Avant : 3 styles différents (landing utilisait bg-zinc-900/60, dashboard
// bg-surface-base, settings bg-surface-base + focus violet/50 quasi
// invisible). Aucun focus ring lisible.
//
// Après : style canonique + focus ring violet visible + slot pour
// leading icon (Mail, Lock...) + slot pour trailing button (œil, X).

import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  {
    leadingIcon: LeadingIcon = null,
    trailingSlot = null,
    error = false,
    className = '',
    type = 'text',
    ...rest
  },
  ref
) {
  const base =
    'w-full rounded-xl border bg-surface-card text-sm text-content-primary placeholder-content-muted transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed';

  const colors = error
    ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30'
    : 'border-line focus:border-violet-500 focus:ring-violet-500/30';

  const padding = LeadingIcon
    ? trailingSlot ? 'pl-10 pr-11 py-2.5' : 'pl-10 pr-4 py-2.5'
    : trailingSlot ? 'pl-4 pr-11 py-2.5' : 'px-4 py-2.5';

  return (
    <div className="relative">
      {LeadingIcon && (
        <LeadingIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-muted" />
      )}
      <input
        ref={ref}
        type={type}
        className={`${base} ${colors} ${padding} ${className}`.trim()}
        {...rest}
      />
      {trailingSlot && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          {trailingSlot}
        </div>
      )}
    </div>
  );
});

export default Input;
