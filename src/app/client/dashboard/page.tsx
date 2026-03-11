import { mockDossiers, mockProjects, mockRelations } from "@/lib/mock-data";
import { FolderKanban, Users, Files, ArrowUpRight } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    { name: "Actieve Relaties", value: mockRelations.length, icon: Users, color: "text-blue-600" },
    { name: "Lopende Projecten", value: mockProjects.length, icon: FolderKanban, color: "text-emerald-600" },
    { name: "Alle Dossiers", value: mockDossiers.length, icon: Files, color: "text-indigo-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{stat.name}</p>
                <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-lg bg-slate-50 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800">Recente Dossiers</h3>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
              Bekijk alles <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {mockDossiers.map(dossier => (
              <div key={dossier.id} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm text-slate-800">{dossier.id}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Relatie ID: {dossier.relationId}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                  {dossier.status.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800">Actieve Projecten</h3>
             <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
              Bekijk alles <ArrowUpRight size={16} />
            </button>
          </div>
           <div className="divide-y divide-slate-100">
            {mockProjects.map(project => (
              <div key={project.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-1">
                   <p className="font-medium text-sm text-slate-800">{project.name}</p>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">
                      {project.status}
                    </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-1">{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
