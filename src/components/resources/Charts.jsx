'use client';

import { useMemo } from 'react';

/**
 * Funnel chart SVG — affiche une succession de barres horizontales
 * descendantes (chaque barre est plus courte que la précédente),
 * avec label et valeur à droite.
 *
 * data: [{ label, value, color? }]
 */
export function FunnelChart({ data, formatter = (n) => Math.round(n).toLocaleString('fr-FR') }) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-2">
      {data.map((d, idx) => {
        const pct = (d.value / maxValue) * 100;
        const color = d.color || `hsl(${260 - idx * 15}, 70%, 60%)`;
        return (
          <div key={idx} className="group">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-content-secondary">{d.label}</span>
              <span className="font-mono font-semibold text-content-primary">{formatter(d.value)}</span>
            </div>
            <div className="h-3 rounded-full bg-surface-elevated overflow-hidden relative">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                  boxShadow: `0 0 12px ${color}40`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Donut chart SVG simple — montre la répartition d'une grandeur en parts.
 *
 * data: [{ label, value, color }]
 * size: diamètre en px
 */
export function DonutChart({ data, size = 200, formatter = (n) => Math.round(n).toLocaleString('fr-FR'), centerLabel, centerValue }) {
  const total = data.reduce((sum, d) => sum + Math.max(0, d.value), 0);
  const radius = size / 2 - 12;
  const innerRadius = radius * 0.62;
  const circumference = 2 * Math.PI * radius;

  // Pré-calcule les offsets cumulatifs
  let offset = 0;
  const segments = data.map((d) => {
    const value = Math.max(0, d.value);
    const pct = total > 0 ? value / total : 0;
    const dasharray = `${pct * circumference} ${circumference}`;
    const dashoffset = -offset * circumference;
    offset += pct;
    return { ...d, pct, dasharray, dashoffset };
  });

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="flex-shrink-0">
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth={size - 2 * innerRadius}
          />
          {/* Segments */}
          {segments.map((s, i) => (
            <circle
              key={i}
              cx={size / 2} cy={size / 2} r={radius}
              fill="none"
              stroke={s.color || `hsl(${260 - i * 30}, 70%, 60%)`}
              strokeWidth={size - 2 * innerRadius}
              strokeDasharray={s.dasharray}
              strokeDashoffset={s.dashoffset}
              style={{ transition: 'stroke-dasharray 0.5s ease-out' }}
            />
          ))}
        </g>
        {/* Center label */}
        {centerLabel && (
          <>
            <text x={size / 2} y={size / 2 - 4} textAnchor="middle" className="fill-current font-bold" style={{ fontSize: size * 0.13 }}>
              {centerValue}
            </text>
            <text x={size / 2} y={size / 2 + size * 0.1} textAnchor="middle" className="fill-current opacity-50" style={{ fontSize: size * 0.06 }}>
              {centerLabel}
            </text>
          </>
        )}
      </svg>

      <div className="space-y-1.5 flex-1 min-w-0">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ background: s.color || `hsl(${260 - i * 30}, 70%, 60%)` }}
              />
              <span className="text-content-secondary truncate">{s.label}</span>
            </div>
            <span className="font-mono font-semibold text-content-primary whitespace-nowrap">
              {formatter(s.value)} <span className="text-content-tertiary">({Math.round(s.pct * 100)}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Timeline SVG — montre la projection LTV cumulée vs CAC sur N mois.
 *
 * Utilise un area chart simple avec ligne CAC en référence horizontale.
 */
export function PaybackTimeline({ cac, monthlyMargin, totalMonths = 36 }) {
  const { points, paybackMonth, maxValue } = useMemo(() => {
    const pts = [];
    let cumulative = 0;
    let payback = null;
    for (let i = 0; i <= totalMonths; i++) {
      cumulative = i * monthlyMargin;
      if (payback === null && cumulative >= cac && cac > 0) payback = i;
      pts.push({ month: i, value: cumulative });
    }
    return {
      points: pts,
      paybackMonth: payback,
      maxValue: Math.max(cumulative, cac * 1.5),
    };
  }, [cac, monthlyMargin, totalMonths]);

  const width = 100;
  const height = 60;
  const pad = 2;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;

  const path = points
    .map((p, i) => {
      const x = pad + (i / totalMonths) * innerW;
      const y = height - pad - (p.value / maxValue) * innerH;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');

  // Ligne CAC (rouge)
  const cacY = height - pad - (cac / maxValue) * innerH;

  // Point de payback
  const paybackX = paybackMonth !== null ? pad + (paybackMonth / totalMonths) * innerW : null;
  const paybackY = paybackMonth !== null ? height - pad - (paybackMonth * monthlyMargin / maxValue) * innerH : null;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="w-full h-32"
      >
        {/* Grid horizontal (CAC line) */}
        <line
          x1={pad} y1={cacY} x2={width - pad} y2={cacY}
          stroke="rgb(239 68 68 / 0.4)" strokeWidth="0.3" strokeDasharray="1 1"
        />
        {/* LTV curve */}
        <path d={path} fill="none" stroke="rgb(139 92 246)" strokeWidth="0.8" strokeLinejoin="round" />
        {/* Fill under curve */}
        <path
          d={`${path} L ${width - pad} ${height - pad} L ${pad} ${height - pad} Z`}
          fill="rgb(139 92 246 / 0.12)"
        />
        {/* Payback point */}
        {paybackX !== null && (
          <>
            <line x1={paybackX} y1={pad} x2={paybackX} y2={height - pad} stroke="rgb(34 197 94 / 0.4)" strokeWidth="0.3" strokeDasharray="1 1" />
            <circle cx={paybackX} cy={paybackY} r="1.2" fill="rgb(34 197 94)" />
          </>
        )}
      </svg>
      <div className="flex justify-between text-[10px] text-content-tertiary mt-1 font-mono">
        <span>M0</span>
        <span className="text-red-400">CAC: {cac.toLocaleString('fr-FR')}€</span>
        {paybackMonth !== null && (
          <span className="text-green-400">Payback: M{paybackMonth}</span>
        )}
        <span>M{totalMonths}</span>
      </div>
    </div>
  );
}
