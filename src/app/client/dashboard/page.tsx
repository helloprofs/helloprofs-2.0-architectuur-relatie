import { mockDossiers, mockProjects, mockRelations } from "@/lib/mock-data";
import { FolderKanban, Users, Files, ArrowUpRight } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    { name: "Actieve Relaties", value: mockRelations.length, icon: Users, color: "text-blue-600", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { name: "Lopende Projecten", value: mockProjects.length, icon: FolderKanban, color: "text-emerald-600", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { name: "Alle Dossiers", value: mockDossiers.length, icon: Files, color: "text-indigo-600", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  ];

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h2>
        <p className="text-slate-500 text-[15px] mt-2">Welkom terug. Hier is een overzicht van al uw actieve samenwerkingen.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all group ring-1 ring-slate-100 hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-bold tracking-widest text-slate-500 uppercase mb-1.5">{stat.name}</p>
                <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">{stat.value}</h3>
              </div>
              <div className={`p-4 rounded-xl ${stat.bg} ${stat.border} border ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon size={26} strokeWidth={2.5} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden ring-1 ring-slate-100 flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-xl">
            <h3 className="font-bold text-lg text-slate-900">Recente Dossiers</h3>
            <button className="text-[13px] text-blue-600 hover:text-blue-700 font-bold tracking-wide flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
              Bekijk alles <ArrowUpRight size={16} strokeWidth={2.5} />
            </button>
          </div>
          <div className="divide-y divide-slate-100 flex-1">
            {mockDossiers.map((dossier, i) => (
              <div key={dossier.id} className={`p-5 hover:bg-slate-50/80 transition-colors flex justify-between items-center cursor-pointer group ${i === 0 ? 'bg-blue-50/30' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:text-blue-600 group-hover:shadow-sm border border-slate-200 transition-all font-bold text-xs">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-bold text-[15px] text-slate-900 group-hover:text-blue-700 transition-colors">{dossier.id}</p>
                    <p className="text-[13px] font-medium text-slate-500 mt-0.5">Relatie: <span className="text-slate-700">{dossier.relationId}</span></p>
                  </div>
                </div>
                <span className="px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-slate-100 text-slate-600 border border-slate-200/60 shadow-sm">
                  {dossier.status.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden ring-1 ring-slate-100 flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-xl">
            <h3 className="font-bold text-lg text-slate-900">Actieve Projecten</h3>
             <button className="text-[13px] text-blue-600 hover:text-blue-700 font-bold tracking-wide flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
              Bekijk alles <ArrowUpRight size={16} strokeWidth={2.5} />
            </button>
          </div>
           <div className="divide-y divide-slate-100 flex-1">
            {mockProjects.map(project => (
              <div key={project.id} className="p-5 hover:bg-slate-50/80 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                   <p className="font-bold text-[15px] text-slate-900 group-hover:text-blue-700 transition-colors">{project.name}</p>
                    <span className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-sm ring-1 ring-emerald-500/10">
                      {project.status}
                    </span>
                </div>
                <p className="text-[13px] font-medium text-slate-500 line-clamp-2 leading-relaxed">{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
