"use client";

import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  ArrowUpRight
} from "lucide-react";

export default function VendorDashboard() {
  const stats = [
    { label: "Actieve Opdrachten", value: "2", icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Uren deze week", value: "32.5", icon: Clock, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Facturabel Bedrag", value: "€ 4.250", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Openstaande Taken", value: "5", icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  const assignments = [
    { id: "PROJ-2024-001", client: "Opdrachtgever B.V.", role: "Senior Frontend Developer", status: "In uitvoering", end: "31 Dec 2024" },
    { id: "PROJ-2024-005", client: "Gemeente Almere", role: "React Architect", status: "Wacht op start", end: "15 Maart 2025" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Opdrachtnemer</h1>
        <p className="text-slate-500">Welkom terug, Marc. Hier is een overzicht van je huidige prestaties en opdrachten.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                <ArrowUpRight size={12} /> +12%
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-slate-800">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Mijn Actieve Opdrachten</h2>
            <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Bekijk alles</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID / Cliënt</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rol</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Einddatum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assignments.map((assignment) => (
                  <tr key={assignment.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{assignment.id}</p>
                      <p className="text-xs text-slate-500">{assignment.client}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{assignment.role}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                        <CheckCircle2 size={12} /> {assignment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{assignment.end}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-slate-800">
          <h2 className="font-bold text-slate-900 mb-6">Herinneringen</h2>
          <div className="space-y-4">
            <div className="flex gap-4 p-4 rounded-xl bg-orange-50 border border-orange-100">
              <div className="text-orange-600 mt-0.5"><AlertCircle size={20} /></div>
              <div>
                <p className="text-sm font-bold text-orange-900">Urenverantwoording</p>
                <p className="text-xs text-orange-700 mt-1">Vergeet niet je uren voor Week 11 in te dienen voor maandag.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
              <div className="text-blue-600 mt-0.5"><CheckCircle2 size={20} /></div>
              <div>
                <p className="text-sm font-bold text-blue-900">Nieuwe Opdracht!</p>
                <p className="text-xs text-blue-700 mt-1">Gemeente Almere heeft je aanvraag voor de Architect rol goedgekeurd.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
