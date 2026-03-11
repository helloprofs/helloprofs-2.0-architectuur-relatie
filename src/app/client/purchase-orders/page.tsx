import { mockPurchaseOrders, mockDossiers, mockProjects } from "@/lib/mock-data";
import { Plus, Search, FileText } from "lucide-react";

export default function PurchaseOrdersPage() {
  const getProjectName = (id: string) => {
    return mockProjects.find(p => p.id === id)?.name || "Onbekend project";
  };

  const getDossiersForPo = (poId: string) => {
    return mockDossiers.filter(d => d.purchaseOrderId === poId);
  };

  const getRelationName = (id: string) => {
    const names: Record<string, string> = {
      'R-001': 'Jan de Bouwer',
      'R-002': 'Electra Fix BV',
      'R-003': 'Van der Kleij',
    };
    return names[id] || id;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Inkoopopdrachten</h2>
          <p className="text-slate-500 mt-1">Eén opdracht kan meerdere dossiers opleveren.</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors">
          <Plus size={16} />
          <span>Nieuwe Inkoopopdracht</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-100 bg-slate-50">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Zoeken op titel of PO-nummer..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* List of Purchase Orders */}
        <div className="divide-y divide-slate-100">
          {mockPurchaseOrders.map(po => {
            const relatedDossiers = getDossiersForPo(po.id);

            return (
              <div key={po.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* PO Details */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{po.id}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">{po.type}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">{po.title}</h3>
                        <p className="text-sm text-blue-600 font-medium mt-0.5">↳ {getProjectName(po.projectId)}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        po.status === 'Verstuurd' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {po.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">{po.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                      <span>Aangemaakt: <strong className="text-slate-700">{new Date(po.dateCreated).toLocaleDateString('nl-NL')}</strong></span>
                      {po.budget && <span>Budget: <strong className="text-slate-700">€{po.budget.toLocaleString('nl-NL')}</strong></span>}
                    </div>
                  </div>

                  {/* Related Dossiers */}
                  <div className="lg:w-72 bg-slate-50 rounded-lg border border-slate-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Onderliggende Dossiers</h4>
                      <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-full">{relatedDossiers.length}</span>
                    </div>
                    <div className="space-y-2">
                      {relatedDossiers.length === 0 ? (
                        <p className="text-xs text-slate-400 italic text-center py-4">Nog geen dossiers</p>
                      ) : relatedDossiers.map(dossier => {
                        const statusColor = 
                          dossier.status.includes('Verstuurd') ? 'bg-blue-100 text-blue-700' :
                          dossier.status.includes('Geweigerd') || dossier.status.includes('Niet') ? 'bg-red-100 text-red-700' :
                          dossier.status.includes('Lopend') || dossier.status.includes('Geaccepteerd') ? 'bg-emerald-100 text-emerald-700' :
                          'bg-slate-100 text-slate-600';
                        return (
                          <div key={dossier.id} className="bg-white rounded-lg border border-slate-200 p-3 hover:border-blue-200 transition-colors cursor-pointer">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-bold text-slate-700">{dossier.id}</p>
                                <p className="text-xs text-slate-500">{getRelationName(dossier.relationId)}</p>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${statusColor}`}>
                                {dossier.status.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                              <FileText size={11} />
                              <span>{dossier.historyCount} stappen</span>
                            </div>
                          </div>
                        );
                      })}
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
