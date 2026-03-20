"use client";

import { mockRelations, RelationStatus, ComplianceStatus } from "@/lib/mock-data";
import { Search, Filter, Plus, User, Building2, MoreVertical, ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";

function StatusBadge({ status }: { status: RelationStatus }) {
  const styles: Record<RelationStatus, string> = {
    'Uitgenodigd': 'bg-slate-100 text-slate-600',
    'Aangemeld': 'bg-blue-100 text-blue-700',
    'Goedgekeurd': 'bg-indigo-100 text-indigo-700',
    'Samenwerking_Actief': 'bg-emerald-100 text-emerald-700',
    'Samenwerking_Beeindigd': 'bg-slate-100 text-slate-500',
    'Gearchiveerd': 'bg-slate-100 text-slate-500',
  };

  const labels: Record<RelationStatus, string> = {
    'Uitgenodigd': 'Uitgenodigd',
    'Aangemeld': 'Aangemeld',
    'Goedgekeurd': 'Goedgekeurd',
    'Samenwerking_Actief': 'Actief',
    'Samenwerking_Beeindigd': 'Beëindigd',
    'Gearchiveerd': 'Gearchiveerd',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function ComplianceBadge({ status }: { status: ComplianceStatus }) {
  const configs: Record<ComplianceStatus, { color: string, icon: any, label: string }> = {
    'Groen': { color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: ShieldCheck, label: 'Compliant' },
    'Oranje': { color: 'text-amber-600 bg-amber-50 border-amber-100', icon: ShieldAlert, label: 'Actie Vereist' },
    'Rood': { color: 'text-rose-600 bg-rose-50 border-rose-100', icon: ShieldX, label: 'Non-Compliant' },
  };

  const { color, icon: Icon, label } = configs[status];

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs font-medium ${color}`}>
      <Icon size={14} />
      <span>{label}</span>
    </div>
  );
}

export default function RelationsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Relaties</h2>
          <p className="text-slate-500 mt-1">Beheer alle connecties en samenwerkingen met relaties.</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors">
          <Plus size={16} />
          <span>Relatie Uitnodigen</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Zoeken op naam, KVK of email..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Filter size={16} />
            <span>Filters</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Relatie</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">KVK</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Compliance</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Labels</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Dossiers</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockRelations.map((relation) => (
                <tr key={relation.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 group-hover:border-blue-200 transition-colors">
                        {relation.type === 'ZZP' ? (
                          <User size={16} className="text-slate-500" />
                        ) : (
                          <Building2 size={16} className="text-slate-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">{relation.name}</p>
                        <p className="text-xs text-slate-500">{relation.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-sm text-slate-500 font-mono">{relation.kvk || '—'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={relation.status} />
                  </td>
                  <td className="px-6 py-4">
                    <ComplianceBadge status={relation.complianceStatus} />
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {relation.labels.map(label => (
                        <span key={label} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs font-medium">
                          {label}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                      {relation.activeDossiersCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
          <span className="text-sm text-slate-500">Totaal {mockRelations.length} relaties</span>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 rounded border border-slate-200 bg-white text-sm hover:bg-slate-50 disabled:opacity-50" disabled>Vorige</button>
            <button className="px-3 py-1.5 rounded border border-slate-200 bg-white text-sm hover:bg-slate-50">Volgende</button>
          </div>
        </div>
      </div>
    </div>
  );
}
