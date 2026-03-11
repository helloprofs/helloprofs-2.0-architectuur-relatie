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
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">Inkoopopdrachten</h2>
          <p className="text-slate-500 text-sm mt-1">Centrale plek voor uitvragen: één opdracht vormt meerdere dossiers.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
          <Plus size={18} />
          <span>Nieuwe Inkoopopdracht</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Zoeken op titel of PO-nummer..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50">
              <Filter size={18} />
            </button>
            <div className="h-6 w-px bg-slate-200 mx-1 border-r"></div>
            <button className="p-2 text-blue-600 bg-blue-50 border border-blue-200 rounded-md">
              <AlignLeft size={18} />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-md">
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>

        {/* List of Purchase Orders */}
        <div className="divide-y divide-slate-100">
          {mockPurchaseOrders.map(po => {
            const relatedDossiers = getDossiersForPo(po.id);

            return (
              <div key={po.id} className="p-6 hover:bg-slate-50/80 transition-colors">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  {/* Left Side: PO Details */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs font-mono font-medium text-slate-500 px-2 py-0.5 bg-white border border-slate-200 rounded">{po.id}</span>
                          <h3 className="text-lg font-semibold text-slate-800">{po.title}</h3>
                        </div>
                        <p className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                          Project: {getProjectName(po.projectId)}
                        </p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                        po.status === 'Verstuurd' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {po.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-slate-600">{po.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                      <span className="flex items-center gap-1">
                         <span className="w-2 h-2 rounded-full bg-slate-300 inline-block"></span>
                         Type: {po.type}
                      </span>
                      <span>•</span>
                      <span>Aangemaakt: {new Date(po.dateCreated).toLocaleDateString('nl-NL')}</span>
                      {po.budget && (
                        <>
                          <span>•</span>
                          <span>Budget: €{po.budget.toLocaleString('nl-NL')}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Associated Dossiers breakdown */}
                  <div className="lg:w-80 bg-slate-50 border border-slate-200 rounded-lg p-4">
                     <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex justify-between items-center">
                       Onderliggende Dossiers
                       <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-[10px]">{relatedDossiers.length}</span>
                     </h4>
                     <div className="space-y-2">
                       {relatedDossiers.length === 0 ? (
                         <p className="text-sm text-slate-500 italic">Nog geen dossiers gestart</p>
                       ) : (
                         relatedDossiers.map(dossier => (
                           <div key={dossier.id} className="bg-white border border-slate-200 rounded-md p-2.5 flex justify-between items-start shadow-sm text-sm hover:border-blue-300 transition-colors cursor-pointer group">
                             <div>
                               <p className="font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">{dossier.id}</p>
                               <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Relatie: {dossier.relationId}</span>
                             </div>
                             <div className="flex flex-col items-end">
                               <span className="text-xs font-medium text-slate-600 bg-slate-50 px-2 rounded-full mb-1">
                                 {dossier.status.replace(/_/g, ' ')}
                               </span>
                               <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                  <FileText size={10} /> {dossier.historyCount} stappen
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
