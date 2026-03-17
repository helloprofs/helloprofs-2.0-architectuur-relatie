"use client";

import { 
  mockDossiers, 
  mockInvoices, 
  mockProjects, 
  mockPurchaseOrders
} from "@/lib/mock-data";
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  ArrowRight,
  FolderKanban
} from "lucide-react";
import Link from "next/link";

export default function VendorDashboard() {
  const vendorId = 'R-001'; // Jan de Bouwer
  
  // Filter relevant data
  const vendorDossiers = mockDossiers.filter(d => d.relationId === vendorId);
  const vendorInvoices = mockInvoices.filter(i => i.relationId === vendorId);
  
  // Stats calculation
  const activeAssignments = vendorDossiers.filter(d => d.status === 'Contract_Lopend').length;
  
  const billableAmount = vendorInvoices
    .filter(i => i.status === 'Factuur_Verstuurd' || i.status === 'Concept_Verstuurd')
    .reduce((sum, inv) => sum + inv.lines.reduce((lSum, line) => lSum + (line.quantity * line.rate), 0), 0);
    
  const pendingActions = vendorDossiers.filter(d => d.status === 'Inkoopopdracht_Verstuurd').length + 
                        vendorInvoices.filter(i => i.status === 'Herziening_Nodig').length;

  const stats = [
    { label: "Actieve Opdrachten", value: activeAssignments.toString(), icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Uren deze maand", value: "140", icon: Clock, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Facturabel Bedrag", value: `€ ${billableAmount.toLocaleString('nl-NL')}`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Openstaande Acties", value: pendingActions.toString(), icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  const getPurchaseOrder = (id: string) => mockPurchaseOrders.find(po => po.id === id);
  const getProjectName = (poId: string) => {
    const po = getPurchaseOrder(poId);
    return po ? mockProjects.find(p => p.id === po.projectId)?.name || po.projectId : '—';
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Opdrachtnemer</h1>
        <p className="text-slate-500">Welkom terug, Jan. Hier is een overzicht van je huidige prestaties en dossiers.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                <stat.icon size={24} />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Active Dossiers */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-slate-800">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Mijn Recente Dossiers</h2>
            <Link href="/vendor/dossiers" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Bekijk alles</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dossier / Project</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Inkoopopdracht</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vendorDossiers.slice(0, 5).map((dossier) => (
                  <tr key={dossier.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                          <FolderKanban size={16} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{dossier.id}</p>
                          <p className="text-xs text-slate-500 truncate max-w-[150px]">{getProjectName(dossier.purchaseOrderId)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600 font-medium">{getPurchaseOrder(dossier.purchaseOrderId)?.title || '—'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        dossier.status === 'Contract_Lopend' ? 'bg-emerald-100 text-emerald-700' : 
                        dossier.status === 'Inkoopopdracht_Verstuurd' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {dossier.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/vendor/dossiers/${dossier.id}`} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors inline-block">
                        <ArrowRight size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notifications / Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-slate-800">
            <h2 className="font-bold text-slate-900 mb-6">Herinneringen</h2>
            <div className="space-y-4">
              {vendorInvoices.filter(i => i.status === 'Concept_Verstuurd').map(i => (
                <div key={i.id} className="flex gap-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="text-blue-600 mt-0.5"><Clock size={20} /></div>
                  <div>
                    <p className="text-sm font-bold text-blue-900">Conceptfactuur</p>
                    <p className="text-xs text-blue-700 mt-1">Concept {i.invoiceNumber} is verstuurd voor controle.</p>
                  </div>
                </div>
              ))}
              {vendorDossiers.filter(d => d.status === 'Inkoopopdracht_Verstuurd').map(d => (
                <div key={d.id} className="flex gap-4 p-4 rounded-xl bg-orange-50 border border-orange-100">
                  <div className="text-orange-600 mt-0.5"><AlertCircle size={20} /></div>
                  <div>
                    <p className="text-sm font-bold text-orange-900">Nieuwe Inkoopopdracht</p>
                    <p className="text-xs text-orange-700 mt-1">{d.id} wacht op uw reactie.</p>
                  </div>
                </div>
              ))}
              {vendorDossiers.length === 0 && (
                <p className="text-sm text-slate-400 italic">Geen nieuwe herinneringen.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
