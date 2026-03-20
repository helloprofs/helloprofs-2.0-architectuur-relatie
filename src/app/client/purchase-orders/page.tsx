"use client";

import { useState, useMemo } from "react";
import { mockPurchaseOrders, mockDossiers, mockProjects, mockRelations } from "@/lib/mock-data";
import { Search, Plus, FileText, Users, MapPin, Euro, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

function POStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    'Verstuurd':    'bg-blue-100 text-blue-700',
    'Concept':      'bg-slate-100 text-slate-500',
    'Afgerond':     'bg-emerald-100 text-emerald-700',
    'Geannuleerd':  'bg-red-100 text-red-500',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${map[status] ?? 'bg-slate-100 text-slate-500'}`}>
      {status}
    </span>
  );
}

function POTypeBadge({ type }: { type: string }) {
  const label = type === 'raamovereenkomst' ? 'Raamovereenkomst' : 'Overeenkomst';
  const cls   = type === 'raamovereenkomst' ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-600';
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>{label}</span>;
}

export default function PurchaseOrdersPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return mockPurchaseOrders.filter(po =>
      !q || po.title.toLowerCase().includes(q) || po.id.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Inkoopopdrachten</h2>
          <p className="text-slate-500 mt-1">Overzicht van alle uitgestuurde opdrachten en bijbehorende relaties.</p>
        </div>
        <button
          onClick={() => router.push('/client/purchase-orders/new')}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
        >
          <Plus size={16} />
          <span>Inkoopopdracht aanmaken</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Zoeken op titel of PO-nummer..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Inkoopopdracht</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Project</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Relaties</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Budget</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Aangemaakt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-400">
                    Geen inkoopopdrachten gevonden.
                  </td>
                </tr>
              ) : filtered.map(po => {
                const project    = mockProjects.find(p => p.id === po.projectId);
                const dossiersForPO = mockDossiers.filter(d => d.purchaseOrderId === po.id);
                const relationCount = new Set(dossiersForPO.map(d => d.relationId)).size;

                return (
                  <tr
                    key={po.id}
                    onClick={() => router.push(`/client/purchase-orders/${po.id}`)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">{po.title}</p>
                      <p className="text-xs font-mono text-slate-400 mt-0.5">{po.id}</p>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      {project ? (
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <MapPin size={12} className="text-slate-400 shrink-0" />
                          <span className="truncate max-w-[180px]">{project.name}</span>
                        </div>
                      ) : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      <POTypeBadge type={po.type} />
                    </td>
                    <td className="px-6 py-4">
                      <POStatusBadge status={po.status} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                        <Users size={12} />
                        {relationCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      {po.budget ? (
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Euro size={12} className="text-slate-400" />
                          {po.budget.toLocaleString('nl-NL')}
                        </div>
                      ) : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Calendar size={12} />
                        {new Date(po.dateCreated).toLocaleDateString('nl-NL')}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50">
          <span className="text-sm text-slate-500">Totaal {filtered.length} inkoopopdrachten</span>
        </div>
      </div>
    </div>
  );
}
