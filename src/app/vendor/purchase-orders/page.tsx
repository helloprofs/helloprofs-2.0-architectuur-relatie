"use client";

import { Suspense } from "react";
import { mockPurchaseOrders, mockDossiers, mockProjects } from "@/lib/mock-data";
import Link from "next/link";
import { Plus, Search, ArrowRight, Files, X, FilterX, Filter } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

function VendorPurchaseOrdersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const projectIdFilter = searchParams.get("projectId");
  const activeProject = projectIdFilter ? mockProjects.find(p => p.id === projectIdFilter) : null;

  const getProjectName = (id: string) =>
    mockProjects.find(p => p.id === id)?.name || id;

  const getDossierCount = (poId: string) =>
    mockDossiers.filter(d => d.purchaseOrderId === poId).length;

  const filteredPOs = (projectIdFilter
    ? mockPurchaseOrders.filter(po => po.projectId === projectIdFilter)
    : mockPurchaseOrders).filter(po =>
      mockDossiers.some(d => d.purchaseOrderId === po.id && d.relationId === 'R-001')
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Mijn Inkoopopdrachten</h2>
          <p className="text-slate-500 mt-1">Overzicht van alle inkoopopdrachten die aan u zijn verstuurd.</p>
        </div>
      </div>

      {/* Active Filter Badge */}
      {activeProject && (
        <div className="flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
              <FilterX size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Gefilterd op project</p>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{activeProject.name}</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/vendor/purchase-orders')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-800 transition-colors"
          >
            <X size={14} /> Filter wissen
          </button>
        </div>
      )}

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm text-slate-800">
        {/* Toolbar */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-100 bg-slate-50">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Zoeken op titel of PO-nummer..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <Filter size={16} className="text-slate-400" />
            Filteren
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Inkoopopdracht</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Dossiers</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Datum</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPOs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <p className="text-sm text-slate-500 italic">Geen inkoopopdrachten gevonden.</p>
                  </td>
                </tr>
              ) : (
                filteredPOs.map(po => {
                  const dossierCount = getDossierCount(po.id);
                  const dossier = mockDossiers.find(d => d.purchaseOrderId === po.id && d.relationId === 'R-001');
                  return (
                    <tr key={po.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{po.title}</p>
                          <p className="text-xs font-mono text-slate-400 mt-0.5">{po.id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600">{getProjectName(po.projectId)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs font-medium">{po.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${po.status === 'Verstuurd' ? 'bg-indigo-100 text-indigo-700' :
                          po.status === 'Afgerond' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-slate-100 text-slate-500'
                          }`}>
                          {po.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
                          <Files size={12} />
                          {dossierCount}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs text-slate-400">{new Date(po.dateCreated).toLocaleDateString('nl-NL')}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={dossier ? `/vendor/dossiers/${dossier.id}` : '#'}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          Bekijk Dossier <ArrowRight size={13} />
                        </Link>
                      </td>
                    </tr>
                  );
                }))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function VendorPurchaseOrdersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Laden...</div>}>
      <VendorPurchaseOrdersContent />
    </Suspense>
  );
}
