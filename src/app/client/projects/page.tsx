import { mockProjects, mockPurchaseOrders } from "@/lib/mock-data";
import { FolderKanban, MapPin, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ProjectsPage() {
  const getPurchaseOrdersForProject = (projectId: string) =>
    mockPurchaseOrders.filter(po => po.projectId === projectId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Projecten</h2>
        <p className="text-slate-500 mt-1">Alle actieve en afgeronde projecten binnen uw organisatie.</p>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {mockProjects.map((project) => {
          const purchaseOrders = getPurchaseOrdersForProject(project.id);
          return (
            <div key={project.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              {/* Card Header */}
              <div className="px-6 py-5 border-b border-slate-100">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FolderKanban size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{project.name}</h3>
                      <p className="text-xs font-mono text-slate-400 mt-0.5">{project.id}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                    project.status === 'Actief' ? 'bg-emerald-100 text-emerald-700' :
                    project.status === 'Afgerond' ? 'bg-slate-100 text-slate-500' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="px-6 py-4 space-y-4">
                <p className="text-sm text-slate-500 leading-relaxed">{project.description}</p>

                <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-slate-400" />
                    {project.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-slate-400" />
                    Start: {new Date(project.startDate).toLocaleDateString('nl-NL')}
                  </span>
                  {project.endDate && (
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-slate-400" />
                      Eind: {new Date(project.endDate).toLocaleDateString('nl-NL')}
                    </span>
                  )}
                </div>

                {/* Linked Purchase Orders */}
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Inkoopopdrachten ({purchaseOrders.length})
                  </p>
                  {purchaseOrders.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Geen inkoopopdrachten gekoppeld</p>
                  ) : (
                    <div className="space-y-1.5">
                      {purchaseOrders.map(po => (
                        <div key={po.id} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                          <div>
                            <span className="text-xs font-mono text-slate-400">{po.id}</span>
                            <p className="text-sm font-medium text-slate-700">{po.title}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            po.status === 'Verstuurd' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {po.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 py-3 border-t border-slate-100 bg-slate-50">
                <Link
                  href="/client/purchase-orders"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                >
                  Bekijk alle inkoopopdrachten <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
