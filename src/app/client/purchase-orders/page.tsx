import { mockPurchaseOrders, mockDossiers, mockProjects } from "@/lib/mock-data";
import { Plus, Search, Filter, AlignLeft, LayoutGrid, FileText } from "lucide-react";

export default function PurchaseOrdersPage() {
  
  const getProjectName = (id: string) => {
    return mockProjects.find(p => p.id === id)?.name || "Onbekend project";
  };

  const getDossiersForPo = (poId: string) => {
    return mockDossiers.filter(d => d.purchaseOrderId === poId);
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Inkoopopdrachten</h2>
          <p className="text-slate-500 text-[15px] mt-2">Centrale plek voor uitvragen: één opdracht vormt meerdere dossiers.</p>
        </div>
        <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] ring-1 ring-slate-900/5 hover:-translate-y-0.5">
          <Plus size={18} strokeWidth={2.5} />
          <span>Nieuwe Inkoopopdracht</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200/60 overflow-hidden isolate ring-1 ring-slate-100">
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-xl">
          <div className="relative w-full sm:w-[500px] group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Zoeken op titel of PO-nummer..." 
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 font-medium"
            />
          </div>
          <div className="flex items-center gap-2.5">
            <button className="p-2.5 text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-700 transition-all shadow-sm">
              <Filter size={18} strokeWidth={2.5} />
            </button>
            <div className="h-6 w-px bg-slate-200 mx-1 border-r border-slate-100"></div>
            <button className="p-2.5 text-blue-700 bg-blue-50/80 border border-blue-200/50 rounded-xl shadow-sm ring-1 ring-blue-500/10 transition-all">
              <AlignLeft size={18} strokeWidth={2.5} />
            </button>
            <button className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 bg-white border border-transparent rounded-xl transition-all">
              <LayoutGrid size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* List of Purchase Orders */}
        <div className="divide-y divide-slate-100">
          {mockPurchaseOrders.map(po => {
            const relatedDossiers = getDossiersForPo(po.id);

            return (
              <div key={po.id} className="p-8 hover:bg-slate-50/80 transition-colors group">
                <div className="flex flex-col lg:flex-row justify-between gap-8">
                  {/* Left Side: PO Details */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[11px] font-mono font-bold tracking-widest text-slate-500 px-2 py-1 bg-white border border-slate-200/60 rounded-md shadow-sm">{po.id}</span>
                          <h3 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-blue-700 transition-colors">{po.title}</h3>
                        </div>
                        <p className="text-[14px] font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer inline-flex items-center gap-1">
                          Project: {getProjectName(po.projectId)}
                        </p>
                      </div>
                      <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase border shadow-sm ${
                        po.status === 'Verstuurd' ? 'bg-blue-50/80 text-blue-700 border-blue-200/50 ring-1 ring-blue-500/10' : 'bg-slate-100 text-slate-500 border-slate-200/60'
                      }`}>
                        {po.status}
                      </span>
                    </div>
                    
                    <p className="text-[15px] text-slate-600 leading-relaxed max-w-2xl">{po.description}</p>
                    
                    <div className="flex items-center flex-wrap gap-4 text-[13px] font-medium text-slate-500 pt-2">
                      <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/60">
                         <span className="w-2 h-2 rounded-full bg-slate-400 inline-block shadow-sm"></span>
                         Type: <span className="text-slate-700 font-semibold">{po.type}</span>
                      </span>
                      <span className="text-slate-300">•</span>
                      <span>Aangemaakt: <span className="text-slate-700">{new Date(po.dateCreated).toLocaleDateString('nl-NL')}</span></span>
                      {po.budget && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span>Budget: <span className="text-slate-700 font-semibold">€{po.budget.toLocaleString('nl-NL')}</span></span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Associated Dossiers breakdown */}
                  <div className="lg:w-96 bg-slate-50/50 border border-slate-200/80 rounded-2xl p-5 shadow-[inset_0_1px_4px_rgba(0,0,0,0.02)]">
                     <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-4 flex justify-between items-center">
                       Onderliggende Dossiers
                       <span className="bg-white border border-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full text-[11px] shadow-sm">{relatedDossiers.length}</span>
                     </h4>
                     <div className="space-y-2.5">
                       {relatedDossiers.length === 0 ? (
                         <div className="text-center py-6 px-4 bg-white rounded-xl border border-slate-200 border-dashed">
                           <p className="text-[13px] text-slate-500 italic font-medium">Nog geen dossiers gestart</p>
                         </div>
                       ) : (
                         relatedDossiers.map(dossier => (
                           <div key={dossier.id} className="bg-white border border-slate-200/80 rounded-xl p-3.5 flex justify-between items-start shadow-sm hover:shadow-md hover:border-blue-300/60 transition-all cursor-pointer group/dossier">
                             <div>
                               <p className="font-bold text-[14px] text-slate-800 group-hover/dossier:text-blue-700 transition-colors">{dossier.id}</p>
                               <span className="text-[11px] uppercase font-bold tracking-widest text-slate-500 mt-0.5 inline-block">Relatie: <span className="text-slate-700">{dossier.relationId}</span></span>
                             </div>
                             <div className="flex flex-col items-end gap-1.5">
                               <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                                 {dossier.status.replace(/_/g, ' ')}
                               </span>
                               <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                                  <FileText size={12} strokeWidth={2.5} /> {dossier.historyCount} stappen
                               </span>
                             </div>
                           </div>
                         ))
                       )}
                     </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
