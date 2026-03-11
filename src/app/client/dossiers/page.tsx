import { mockDossiers, mockPurchaseOrders, mockRelations, DossierStatus } from "@/lib/mock-data";
import { Search, Filter, AlignLeft, LayoutGrid, AlertCircle, History } from "lucide-react";

export default function DossiersPage() {
  
  const getRelationName = (id: string) => mockRelations.find(r => r.id === id)?.name || id;
  const getPurchaseOrderTitle = (id: string) => mockPurchaseOrders.find(p => p.id === id)?.title || id;

  const getStatusColor = (status: DossierStatus) => {
    switch (status) {
      case 'Inkoopopdracht_Verstuurd': return 'bg-blue-50/80 text-blue-700 border-blue-200/50 ring-1 ring-blue-500/10';
      case 'Aanbod_Verstuurd': return 'bg-purple-50/80 text-purple-700 border-purple-200/50 ring-1 ring-purple-500/10';
      case 'Contract_Lopend': return 'bg-emerald-50 text-emerald-700 border-emerald-200/60 ring-1 ring-emerald-500/10';
      case 'Inkoopopdracht_Geweigerd':
      case 'Niet_Gereageerd': return 'bg-red-50 text-red-700 border-red-200/50 ring-1 ring-red-500/10';
      default: return 'bg-slate-100 text-slate-600 border-slate-200/60 shadow-sm';
    }
  };

  return (
     <div className="space-y-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Dossiers</h2>
          <p className="text-slate-500 text-[15px] mt-2">Hier vindt u alle individuele 1-op-1 samenwerkingen voortkomend uit inkoopopdrachten.</p>
        </div>
      </div>

       <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/30 border border-blue-100/60 rounded-2xl p-5 flex gap-4 text-[14px] text-blue-900 shadow-sm">
        <AlertCircle size={22} className="shrink-0 text-blue-600 mt-0.5" strokeWidth={2.5} />
        <p className="leading-relaxed">Een dossier toont in detail de <strong>Dossierstatus</strong> (voortgang van een specifieke inkoopopdracht & samenwerking). Dit staat los van de algemene <strong className="text-blue-700">Relatiestatus</strong> die u in het Relation Manager overzicht ziet.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200/60 overflow-hidden isolate ring-1 ring-slate-100">
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-xl">
          <div className="relative w-full sm:w-[500px] group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Zoeken in dossiers..." 
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 font-medium"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="px-5 py-2.5 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 flex items-center gap-2 text-sm font-semibold transition-all shadow-sm">
              <Filter size={16} strokeWidth={2.5} /> Filters
            </button>
          </div>
        </div>

        {/* List of Dossiers */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold text-slate-900">Dossier ID</th>
                <th className="px-6 py-4 font-semibold text-slate-900">Originele Inkoopopdracht</th>
                <th className="px-6 py-4 font-semibold text-slate-900">Relatie (ZZP / Leverancier)</th>
                <th className="px-6 py-4 font-semibold text-slate-900">Actuele Dossierstatus</th>
                <th className="px-6 py-4 font-semibold text-slate-900 text-center">Tijdlijn / Historie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockDossiers.map(dossier => (
                <tr key={dossier.id} className="hover:bg-slate-50/80 transition-colors cursor-pointer group/row">
                  <td className="px-6 py-5">
                    <span className="font-mono text-[14px] font-bold tracking-widest text-slate-900 group-hover/row:text-blue-600 transition-colors">{dossier.id}</span>
                  </td>
                  <td className="px-6 py-5">
                     <div>
                       <p className="text-[14px] font-bold text-slate-900 truncate max-w-xs group-hover/row:text-blue-700 transition-colors" title={getPurchaseOrderTitle(dossier.purchaseOrderId)}>
                         {getPurchaseOrderTitle(dossier.purchaseOrderId)}
                       </p>
                       <p className="text-[11px] uppercase font-bold text-slate-400 mt-1 tracking-widest">{dossier.purchaseOrderId}</p>
                     </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                       <p className="text-[14px] font-semibold text-slate-800">{getRelationName(dossier.relationId)}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                     <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase border shadow-sm ${getStatusColor(dossier.status)}`}>
                        {dossier.status.replace(/_/g, ' ')}
                      </span>
                  </td>
                  <td className="px-6 py-5 text-center text-slate-400">
                     <button className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 shadow-sm hover:shadow hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-700 text-[12px] font-bold transition-all">
                       <History size={15} strokeWidth={2.5} className="group-hover/row:rotate-180 transition-transform duration-500" />
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
