import { mockRelations, RelationStatus } from "@/lib/mock-data";
import { Search, Filter, Plus, User, Building2, MoreVertical } from "lucide-react";

export default function RelationsPage() {
  
  const getStatusBadge = (status: RelationStatus) => {
    switch (status) {
      case 'Uitgenodigd':
        return <span className="px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-slate-100 text-slate-500 border border-slate-200/60 shadow-sm">Uitgenodigd</span>;
      case 'Aangemeld':
        return <span className="px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-blue-50/80 text-blue-700 border border-blue-200/50 shadow-sm ring-1 ring-blue-500/10">Aangemeld</span>;
      case 'Goedgekeurd':
         return <span className="px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-indigo-50/80 text-indigo-700 border border-indigo-200/50 shadow-sm ring-1 ring-indigo-500/10">Goedgekeurd</span>;
      case 'Samenwerking_Actief':
        return <span className="px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-sm ring-1 ring-emerald-500/20">Actief</span>;
      case 'Samenwerking_Beeindigd':
      case 'Gearchiveerd':
         return <span className="px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-slate-50 text-slate-400 border border-slate-200/50">Inactief</span>;
    }
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Relaties</h2>
          <p className="text-slate-500 text-[15px] mt-2">Beheer centraal alle connecties en samenwerkingen met opdrachtnemers.</p>
        </div>
        <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] ring-1 ring-slate-900/5 hover:-translate-y-0.5">
          <Plus size={18} strokeWidth={2.5} />
          <span>Relatie Uitnodigen</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200/60 overflow-hidden isolate ring-1 ring-slate-100">
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/50 backdrop-blur-xl">
          <div className="relative w-full sm:w-[400px] group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Zoeken op naam, KVK of email..." 
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 font-medium"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
            <Filter size={16} strokeWidth={2.5} />
            <span>Filters</span>
          </button>
        </div>

        {/* List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold text-slate-900">Relatie</th>
                <th className="px-6 py-4 font-semibold text-slate-900 hidden md:table-cell">KVK & Status</th>
                <th className="px-6 py-4 font-semibold text-slate-900 hidden lg:table-cell">Labels (Werkgroepen)</th>
                <th className="px-6 py-4 font-semibold text-slate-900 text-center">Open Dossiers</th>
                <th className="px-6 py-4 font-semibold text-slate-900 text-right">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockRelations.map((relation) => (
                <tr key={relation.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-slate-100/80 border border-slate-200 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:border-blue-200 group-hover:shadow-sm transition-all">
                        {relation.type === 'ZZP' ? <User size={20} className="text-slate-500 group-hover:text-blue-600 transition-colors" /> : <Building2 size={20} className="text-slate-500 group-hover:text-blue-600 transition-colors" />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-[15px] group-hover:text-blue-700 transition-colors">{relation.name}</p>
                        <p className="text-[13px] font-medium text-slate-500 mt-0.5">{relation.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="flex flex-col items-start gap-2">
                      <span className="text-[13px] text-slate-500 font-mono font-medium">{relation.kvk || 'GGB-0000'}</span>
                      {getStatusBadge(relation.status)}
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1.5">
                      {relation.labels.map(label => (
                        <span key={label} className="px-2.5 py-1 rounded bg-slate-50 text-slate-600 text-[11px] font-semibold border border-slate-200/60 uppercase tracking-wider">
                          {label}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center justify-center min-w-[32px] h-8 px-2 rounded-full bg-blue-50/80 border border-blue-100 text-blue-700 font-bold text-[13px] shadow-sm">
                      {relation.activeDossiersCount}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
                       <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-5 border-t border-slate-100 bg-white flex justify-between items-center text-sm font-medium text-slate-500">
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
