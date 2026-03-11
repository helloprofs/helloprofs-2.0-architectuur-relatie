import { mockDossiers, mockPurchaseOrders, mockRelations, DossierStatus } from "@/lib/mock-data";
import { Search, Filter, AlignLeft, LayoutGrid, AlertCircle, History } from "lucide-react";

export default function DossiersPage() {
  
  const getRelationName = (id: string) => mockRelations.find(r => r.id === id)?.name || id;
  const getPurchaseOrderTitle = (id: string) => mockPurchaseOrders.find(p => p.id === id)?.title || id;

  const getStatusColor = (status: DossierStatus) => {
    switch (status) {
      case 'Inkoopopdracht_Verstuurd': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Aanbod_Verstuurd': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Contract_Lopend': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Inkoopopdracht_Geweigerd':
      case 'Niet_Gereageerd': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
     <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">Dossiers</h2>
          <p className="text-slate-500 text-sm mt-1">Hier vindt u alle 1-op-1 samenwerkingen voortkomend uit inkoopopdrachten.</p>
        </div>
      </div>

       <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 text-sm text-blue-800">
        <AlertCircle size={20} className="shrink-0 text-blue-600" />
        <p>Een dossier toont de <strong>Dossierstatus</strong> (voortgang van de specifieke samenwerking). Dit staat los van de algemene <strong>Relatiestatus</strong> die u in het Relation Manager overzicht ziet.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Zoeken in dossiers..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 flex items-center gap-2 text-sm font-medium">
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>

        {/* List of Dossiers */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Dossier ID</th>
                <th className="px-6 py-4 font-medium">Inkoopopdracht</th>
                <th className="px-6 py-4 font-medium">Relatie (ZZP/MKB)</th>
                <th className="px-6 py-4 font-medium">Actuele Status</th>
                <th className="px-6 py-4 font-medium text-center">Historie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockDossiers.map(dossier => (
                <tr key={dossier.id} className="hover:bg-slate-50/80 transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-medium text-slate-800 group-hover:text-blue-600 transition-colors">{dossier.id}</span>
                  </td>
                  <td className="px-6 py-4">
                     <div>
                       <p className="text-sm font-medium text-slate-800 truncate max-w-xs" title={getPurchaseOrderTitle(dossier.purchaseOrderId)}>
                         {getPurchaseOrderTitle(dossier.purchaseOrderId)}
                       </p>
                       <p className="text-[10px] uppercase font-bold text-slate-400 mt-0.5 tracking-wider">{dossier.purchaseOrderId}</p>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <p className="text-sm text-slate-700">{getRelationName(dossier.relationId)}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(dossier.status)}`}>
                        {dossier.status.replace(/_/g, ' ')}
                      </span>
                  </td>
                  <td className="px-6 py-4 text-center text-slate-400 group-hover:text-blue-600 transition-colors">
                     <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-50 hover:bg-blue-50 text-xs font-medium border border-transparent hover:border-blue-100 transition-colors">
                       <History size={14} />
                       {dossier.historyCount} stappen
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
     </div>
  )
}
