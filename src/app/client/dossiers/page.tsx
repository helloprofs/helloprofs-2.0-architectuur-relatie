"use client";

import { useRouter } from "next/navigation";
import { mockDossiers, mockPurchaseOrders, mockRelations, mockProjects, DossierStatus } from "@/lib/mock-data";
import { Search, Filter, AlertCircle, History, FolderKanban, ArrowRight } from "lucide-react";
import Link from "next/link";

function DossierStatusBadge({ status }: { status: DossierStatus }) {
  const styles: Record<DossierStatus, string> = {
    'Inkoopopdracht_Verstuurd': 'bg-blue-100 text-blue-700',
    'Niet_Gereageerd': 'bg-orange-100 text-orange-700',
    'Inkoopopdracht_Geweigerd': 'bg-red-100 text-red-700',
    'Aanbod_Verstuurd': 'bg-purple-100 text-purple-700',
    'Aanbod_Geaccepteerd': 'bg-teal-100 text-teal-700',
    'Contract_Lopend': 'bg-emerald-100 text-emerald-700',
    'Contract_Verlopen': 'bg-slate-100 text-slate-500',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export default function DossiersPage() {
  const router = useRouter();

  const getPurchaseOrder = (id: string) =>
    mockPurchaseOrders.find(po => po.id === id);

  const getProjectName = (purchaseOrderId: string) => {
    const po = getPurchaseOrder(purchaseOrderId);
    return po ? mockProjects.find(p => p.id === po.projectId)?.name || po.projectId : '—';
  };

  const getRelationName = (id: string) =>
    mockRelations.find(r => r.id === id)?.name || id;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dossiers</h2>
        <p className="text-slate-500 mt-1">Alle individuele samenwerkingen voortkomend uit inkoopopdrachten.</p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-lg p-4">
        <AlertCircle size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">
          Een <strong>Dossierstatus</strong> toont de voortgang van een specifieke samenwerking en staat los van de algemene <strong>Relatiestatus</strong>.
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-100 bg-slate-50">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Zoeken in dossiers..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Filter size={15} />
            <span>Filters</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Dossier</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Inkoopopdracht</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Relatie</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Dossierstatus</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Tijdlijn</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockDossiers.map(dossier => (
                <tr 
                  key={dossier.id} 
                  onClick={() => router.push(`/client/dossiers/${dossier.id}`)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <Link href={`/client/dossiers/${dossier.id}`} className="text-sm font-mono font-bold text-slate-700 group-hover:text-blue-600 transition-colors hover:underline">
                      {dossier.id}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FolderKanban size={15} className="text-slate-400 flex-shrink-0" />
                      <p className="text-sm font-semibold text-slate-700 truncate max-w-[180px]">
                        {getProjectName(dossier.purchaseOrderId)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors truncate max-w-xs">
                        {getPurchaseOrder(dossier.purchaseOrderId)?.title || dossier.purchaseOrderId}
                      </p>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{dossier.purchaseOrderId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-700">{getRelationName(dossier.relationId)}</p>
                    <p className="text-xs text-slate-400">{dossier.relationId}</p>
                  </td>
                  <td className="px-6 py-4">
                    <DossierStatusBadge status={dossier.status} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-blue-100 hover:text-blue-700 transition-colors">
                      <History size={13} />
                      {dossier.historyCount} stappen
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:text-blue-800 transition-colors">
                      Bekijk <ArrowRight size={13} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
