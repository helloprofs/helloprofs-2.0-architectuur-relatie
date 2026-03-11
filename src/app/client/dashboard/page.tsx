import { mockDossiers, mockProjects, mockRelations } from "@/lib/mock-data";
import { FolderKanban, Users, Files, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const stats = [
    { name: "Actieve Relaties", value: mockRelations.length, icon: Users, color: "blue", href: "/client/relations" },
    { name: "Lopende Projecten", value: mockProjects.length, icon: FolderKanban, color: "green", href: "/client/projects" },
    { name: "Samenwerkingen", value: mockDossiers.length, icon: Files, color: "purple", href: "/client/dossiers" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Welkom terug</h2>
        <p className="text-slate-500 mt-1">Hier is een overzicht van al uw actieve samenwerkingen.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((stat) => (
          <Link key={stat.name} href={stat.href} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md hover:border-blue-200 transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 group-hover:text-blue-600 transition-colors">{stat.name}</p>
                <p className="text-4xl font-bold text-slate-800">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl transition-colors ${stat.color === 'blue' ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-100' :
                stat.color === 'green' ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100' :
                  'bg-purple-50 text-purple-600 group-hover:bg-purple-100'
                }`}>
                <stat.icon size={24} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Content grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Active Projects - LEFT */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <Link href="/client/projects" className="font-semibold text-slate-800 hover:text-blue-700 transition-colors">
              Actieve Projecten
            </Link>
            <Link href="/client/projects" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
              Bekijk alles <ArrowUpRight size={14} />
            </Link>
          </div>
          <div>
            {mockProjects.map((project) => (
              <div key={project.id} className="px-6 py-4 hover:bg-slate-50 border-b border-slate-100 last:border-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{project.name}</p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{project.description}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 flex-shrink-0">
                    {project.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Dossiers - RIGHT */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Recente Samenwerkingen</h3>
            <Link href="/client/dossiers" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
              Bekijk alles <ArrowUpRight size={14} />
            </Link>
          </div>
          <div>
            {mockDossiers.map((dossier, i) => {
              const statusColor =
                dossier.status.includes('Actief') || dossier.status.includes('Lopend') ? 'bg-emerald-100 text-emerald-700' :
                  dossier.status.includes('Verstuurd') ? 'bg-blue-100 text-blue-700' :
                    dossier.status.includes('Geweigerd') ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-600';
              return (
                <div key={dossier.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{dossier.id}</p>
                      <p className="text-xs text-slate-500">Relatie: {dossier.relationId}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                    {dossier.status.replace(/_/g, ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
