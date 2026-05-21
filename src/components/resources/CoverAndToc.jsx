// Page de garde + table des matières pour les contenus longs.
//
// - CoverPage : grande hero avec titre + sous-titre + date + auteur, page-break-after en print
// - Toc       : sommaire avec ancres cliquables vers les sections, optimisé écran ET print

export function CoverPage({ title, subtitle, edition = '2026', author = 'Anthony Malartre', tagline }) {
  return (
    <div className="mb-12 keep-together print:min-h-[90vh] print:flex print:flex-col print:justify-between print:break-after-page">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-violet-500 font-semibold mb-6">
          Ressource Prospectia · Édition {edition}
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 text-content-primary print-text-black">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl sm:text-2xl text-content-secondary leading-relaxed mb-10 max-w-3xl">
            {subtitle}
          </p>
        )}
        {tagline && (
          <div className="inline-block px-4 py-2 rounded-full bg-violet-500/10 text-violet-300 text-sm font-medium border border-violet-500/30">
            {tagline}
          </div>
        )}
      </div>

      <div className="mt-12 pt-8 border-t border-line text-sm text-content-tertiary print-text-black">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <strong className="text-content-primary print-text-black">Par {author}</strong>
            <span className="mx-2">·</span>
            <span>Édition {edition}</span>
          </div>
          <div className="text-xs">
            © Prospectia · Licence Creative Commons BY 4.0
          </div>
        </div>
      </div>
    </div>
  );
}

export function Toc({ items }) {
  return (
    <nav
      aria-label="Sommaire"
      className="mb-10 rounded-2xl border border-line bg-surface-card p-5 keep-together print-bg-white"
    >
      <div className="text-xs font-semibold text-violet-500 uppercase tracking-wider mb-3">Sommaire</div>
      <ol className="space-y-2 text-sm">
        {items.map((item, idx) => (
          <li key={item.id} className="flex items-baseline gap-3">
            <span className="text-content-tertiary font-mono text-xs w-6 flex-shrink-0">
              {String(idx + 1).padStart(2, '0')}
            </span>
            <a
              href={`#${item.id}`}
              className="text-content-primary hover:text-violet-400 transition flex-1 print-text-black"
            >
              {item.label}
            </a>
            {item.meta && (
              <span className="text-content-tertiary text-xs">{item.meta}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
