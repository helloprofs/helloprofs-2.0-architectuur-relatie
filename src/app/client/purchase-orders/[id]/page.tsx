"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  mockPurchaseOrders, mockDossiers, mockProjects, mockRelations,
  DossierStatus, ComplianceStatus, RelationStatus
} from "@/lib/mock-data";
import {
  ArrowLeft, MapPin, Calendar, Euro, Users, ShieldCheck, ShieldAlert,
  ShieldX, User, Building2, FileText, ArrowRight
} from "lucide-react";

function POStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    'Verstuurd':   'bg-blue-100 text-blue-700',
    'Concept':     'bg-slate-100 text-slate-500',
    'Afgerond':    'bg-emerald-100 text-emerald-700',
    'Geannuleerd': 'bg-red-100 text-red-500',
  };
  return (
    <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${map[status] ?? 'bg-slate-100 text-slate-500'}`}>
      {status}
    </span>
  );
}

function DossierStatusBadge({ status }: { status: DossierStatus }) {
  const map: Record<DossierStatus, { label: string; cls: string }> = {
    'Inkoopopdracht_Verstuurd': { label: 'IO Verstuurd',    cls: 'bg-blue-100 text-blue-700' },
    'Niet_Gereageerd':          { label: 'Geen reactie',    cls: 'bg-orange-100 text-orange-700' },
    'Inkoopopdracht_Geweigerd': { label: 'Geweigerd',       cls: 'bg-red-100 text-red-700' },
    'Aanbod_Verstuurd':         { label: 'Aanbod verstuurd', cls: 'bg-purple-100 text-purple-700' },
    'Aanbod_Geaccepteerd':      { label: 'Geaccepteerd',    cls: 'bg-teal-100 text-teal-700' },
    'Contract_Lopend':          { label: 'Contract lopend', cls: 'bg-emerald-100 text-emerald-700' },
    'Contract_Verlopen':        { label: 'Verlopen',        cls: 'bg-slate-100 text-slate-500' },
    'Compliance_Freeze':        { label: 'Compliance freeze', cls: 'bg-yellow-100 text-yellow-700' },
  };
  const { label, cls } = map[status] ?? { label: status, cls: 'bg-slate-100 text-slate-500' };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>{label}</span>;
}

function SamenwerkingBadge({ status, compliance }: { status: RelationStatus; compliance: ComplianceStatus }) {
  if (status === 'Uitgenodigd')
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">Uitgenodigd</span>;
  if (status === 'Aangemeld' || status === 'Goedgekeurd')
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Screening</span>;
  if (status === 'Samenwerking_Beeindigd' || status === 'Gearchiveerd')
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-400">Beëindigd</span>;

  if (compliance === 'Groen')
    return <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200"><ShieldCheck size={12} strokeWidth={2.5} /><span>Actief · Compliant</span></div>;
  if (compliance === 'Oranje')
    return <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200"><ShieldAlert size={12} strokeWidth={2.5} /><span>Actief · Actie Vereist</span></div>;
  return <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200"><ShieldX size={12} strokeWidth={2.5} /><span>Actief · Non-Compliant</span></div>;
}

export default function PurchaseOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const po      = mockPurchaseOrders.find(p => p.id === id);
  const project = po ? mockProjects.find(p => p.id === po.projectId) : null;

  if (!po) return <div className="p-8 text-center text-slate-500">Inkoopopdracht niet gevonden.</div>;

  // Build linked relations from both invitedRelationIds and dossiers (union)
  const dossiersForPO = mockDossiers.filter(d => d.purchaseOrderId === po.id);
  const allRelationIds = Array.from(new Set([
    ...po.invitedRelationIds,
    ...dossiersForPO.map(d => d.relationId),
  ]));

  const linkedRelations = allRelationIds.map(rid => {
    const relation = mockRelations.find(r => r.id === rid);
    const dossier  = dossiersForPO.find(d => d.relationId === rid);
    return { relation, dossier };
  }).filter(item => item.relation != null) as { relation: NonNullable<typeof mockRelations[0]>; dossier: typeof dossiersForPO[0] | undefined }[];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <button
        onClick={() => router.push('/client/purchase-orders')}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
      >
        <ArrowLeft size={15} />
        Terug naar Inkoopopdrachten
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{po.id}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${po.type === 'raamovereenkomst' ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-600'}`}>
                {po.type === 'raamovereenkomst' ? 'Raamovereenkomst' : 'Overeenkomst'}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">{po.title}</h2>
            {project && (
              <p className="text-sm text-blue-600 font-medium mt-1.5 flex items-center gap-1.5">
                <MapPin size={13} />
                {project.name} — {project.location}
              </p>
            )}
          </div>
          <POStatusBadge status={po.status} />
        </div>

        <p className="text-sm text-slate-500 leading-relaxed mt-4">{po.description}</p>

        <div className="flex flex-wrap gap-6 mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Calendar size={14} className="text-slate-400" />
            Aangemaakt: <strong className="text-slate-700">{new Date(po.dateCreated).toLocaleDateString('nl-NL')}</strong>
          </div>
          {po.budget && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Euro size={14} className="text-slate-400" />
              Budget: <strong className="text-slate-700">€{po.budget.toLocaleString('nl-NL')}</strong>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Users size={14} className="text-slate-400" />
            <strong className="text-slate-700">{linkedRelations.length}</strong> relaties
          </div>
        </div>
      </div>

      {/* Linked Relations */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Gekoppelde Relaties</h3>
          <p className="text-xs text-slate-500 mt-0.5">Relaties die deze inkoopopdracht hebben ontvangen.</p>
        </div>

        {linkedRelations.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-slate-400 italic">Nog geen relaties gekoppeld aan deze opdracht.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Relatie</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Samenwerking</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Dossier status</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Dossier</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {linkedRelations.map(({ relation, dossier }) => (
                <tr
                  key={relation.id}
                  onClick={() => router.push(`/client/relations/${relation.id}`)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 group-hover:border-blue-200 transition-colors">
                        {relation.type === 'ZZP' ? <User size={14} className="text-slate-500" /> : <Building2 size={14} className="text-slate-500" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">{relation.name}</p>
                        <p className="text-xs text-slate-400">{relation.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <SamenwerkingBadge status={relation.status} compliance={relation.complianceStatus} />
                  </td>
                  <td className="px-6 py-4">
                    {dossier ? <DossierStatusBadge status={dossier.status} /> : <span className="text-xs text-slate-300">—</span>}
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    {dossier ? (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <FileText size={12} />
                        {dossier.id}
                      </div>
                    ) : <span className="text-xs text-slate-300">—</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:text-blue-800 transition-colors">
                      Bekijk <ArrowRight size={13} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
