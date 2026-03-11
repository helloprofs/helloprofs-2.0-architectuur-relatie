import { mockRelations, RelationStatus } from "@/lib/mock-data";
import { Search, Filter, Plus, User, Building2, MoreVertical } from "lucide-react";

export default function RelationsPage() {
  
  const getStatusBadge = (status: RelationStatus) => {
    switch (status) {
      case 'Uitgenodigd':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">Uitgenodigd</span>;
      case 'Aangemeld':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">Aangemeld</span>;
      case 'Goedgekeurd':
         return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">Goedgekeurd</span>;
      case 'Samenwerking_Actief':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Actieve Samenwerking</span>;
      case 'Samenwerking_Beeindigd':
      case 'Gearchiveerd':
         return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500">Inactief</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">Relaties (Relation Manager)</h2>
          <p className="text-slate-500 text-sm mt-1">Beheer uw connecties met opdrachtnemers (ZZP'ers & MKB).</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
          <Plus size={18} />
          <span>Relatie Uitnodigen</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Zoeken op naam, KVK of email..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
            <Filter size={16} />
            <span>Filters</span>
          </button>
        </div>

        {/* List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Relatie</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">KVK / Status</th>
                <th className="px-6 py-4 font-medium hidden lg:table-cell">Labels</th>
                <th className="px-6 py-4 font-medium text-center">Dossiers</th>
                <th className="px-6 py-4 font-medium text-right">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockRelations.map((relation) => (
                <tr key={relation.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                        {relation.type === 'ZZP' ? <User size={20} className="text-slate-500" /> : <Building2 size={20} className="text-slate-500" />}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{relation.name}</p>
                        <p className="text-xs text-slate-500">{relation.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="flex flex-col items-start gap-1.5">
                      <span className="text-xs text-slate-500 font-mono">{relation.kvk || 'Onbekend'}</span>
                      {getStatusBadge(relation.status)}
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {relation.labels.map(label => (
                        <span key={label} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200 uppercase tracking-wide">
                          {label}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-semibold text-sm">
                      {relation.activeDossiersCount}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors">
                       <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex justify-between items-center text-sm text-slate-500">
           <span>Totaal {mockRelations.length} relaties</span>
           <div className="flex gap-1">
             <button className="px-3 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50" disabled>Vorige</button>
             <button className="px-3 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50">Volgende</button>
           </div>
        </div>

      </div>
    </div>
  );
}
