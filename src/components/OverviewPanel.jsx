'use client';

import { useMemo } from 'react';
import { Users, Mail, TrendingUp, BarChart3, MapPin, Target } from 'lucide-react';
import { computeAnalytics } from '@/lib/analytics';
import { DEPTS } from '@/lib/constants';

export default function OverviewPanel({ prospects, searchHistory }) {
  const analytics = useMemo(
    () => computeAnalytics(prospects || [], searchHistory || []),
    [prospects, searchHistory]
  );

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-lg font-semibold text-[#fafafa]">Vue d'ensemble</h2>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={Users} label="Total leads" value={analytics.total} sub={`+${analytics.recent7} cette semaine`} />
        <KpiCard icon={Mail} label="Emails trouves" value={analytics.withEmail} sub={`${analytics.enrichmentRate}% enrichis`} />
        <KpiCard icon={Target} label="Recherches" value={analytics.searchCount} sub="sessions lancees" />
        <KpiCard icon={TrendingUp} label="7 derniers jours" value={analytics.recent7} sub="nouveaux leads" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly trend */}
        <div className="rounded-xl border border-[#1e1e24] bg-[#111114] p-4">
          <h3 className="text-sm font-medium text-[#a1a1aa] mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4" /> Tendance hebdomadaire
          </h3>
          <div className="flex items-end gap-3 h-32">
            {analytics.weeklyTrend.map((w, i) => {
              const maxCount = Math.max(...analytics.weeklyTrend.map(x => x.count), 1);
              const height = (w.count / maxCount) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-[#71717a]">{w.count}</span>
                  <div className="w-full rounded-t-md bg-violet-600/80" style={{ height: `${Math.max(4, height)}%` }} />
                  <span className="text-[10px] text-[#52525b]">{w.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* By department */}
        <div className="rounded-xl border border-[#1e1e24] bg-[#111114] p-4">
          <h3 className="text-sm font-medium text-[#a1a1aa] mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4" /> Par departement
          </h3>
          <div className="space-y-3">
            {Object.entries(analytics.byDept).sort((a, b) => b[1] - a[1]).map(([dept, count]) => {
              const pct = analytics.total > 0 ? (count / analytics.total) * 100 : 0;
              return (
                <div key={dept}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#a1a1aa]">{DEPTS[dept]?.name || dept}</span>
                    <span className="text-[#71717a]">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#1e1e24] overflow-hidden">
                    <div className="h-full rounded-full bg-indigo-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Score distribution & email methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[#1e1e24] bg-[#111114] p-4">
          <h3 className="text-sm font-medium text-[#a1a1aa] mb-4">Qualite des leads</h3>
          <div className="space-y-2">
            {[
              { key: 'excellent', label: 'Excellent (80+)', color: 'bg-green-500' },
              { key: 'bon', label: 'Bon (60-79)', color: 'bg-blue-500' },
              { key: 'moyen', label: 'Moyen (40-59)', color: 'bg-amber-500' },
              { key: 'faible', label: 'Faible (<40)', color: 'bg-red-500' },
            ].map(({ key, label, color }) => (
              <div key={key} className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                <span className="text-xs text-[#a1a1aa] flex-1">{label}</span>
                <span className="text-xs font-medium text-[#fafafa]">{analytics.scoreDistribution[key]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[#1e1e24] bg-[#111114] p-4">
          <h3 className="text-sm font-medium text-[#a1a1aa] mb-4">Sources d'enrichissement</h3>
          <div className="space-y-2">
            {Object.entries(analytics.byMethod).sort((a, b) => b[1] - a[1]).map(([method, count]) => (
              <div key={method} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                <span className="text-xs text-[#a1a1aa] flex-1 capitalize">{method}</span>
                <span className="text-xs font-medium text-[#fafafa]">{count}</span>
              </div>
            ))}
            {Object.keys(analytics.byMethod).length === 0 && (
              <div className="text-xs text-[#52525b]">Aucun enrichissement</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-xl border border-[#1e1e24] bg-[#111114] p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-violet-400" />
        <span className="text-xs text-[#71717a]">{label}</span>
      </div>
      <div className="text-2xl font-bold text-[#fafafa]">{value}</div>
      {sub && <div className="text-[10px] text-[#52525b] mt-1">{sub}</div>}
    </div>
  );
}
