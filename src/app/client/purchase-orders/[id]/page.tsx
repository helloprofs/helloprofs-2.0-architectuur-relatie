"use client";

import { useDynamicState } from "@/hooks/use-dynamic-state";
import { mockRelations, DossierStatus } from "@/lib/mock-data";
import Link from "next/link";
import { ArrowLeft, FileText, MapPin, Calendar, Euro, History, ArrowRight } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function DossierStatusBadge({ status }: { status: DossierStatus }) {
  const styles: Record<DossierStatus, string> = {
    'Inkoopopdracht_Verstuurd': 'bg-blue-100 text-blue-700',
    'Niet_Gereageerd': 'bg-orange-100 text-orange-700',
    'Inkoopopdracht_Geweigerd': 'bg-red-100 text-red-700',
    'Aanbod_Verstuurd': 'bg-purple-100 text-purple-700',
    'Aanbod_Geaccepteerd': 'bg-teal-100 text-teal-700',
    'Contract_Lopend': 'bg-emerald-100 text-emerald-700',
    'Contract_Verlopen': 'bg-slate-100 text-slate-500',
    'Compliance_Freeze': 'bg-yellow-100 text-yellow-700',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export default function PurchaseOrderDetailPage() {
  const { id } = useParams() as { id: string };
  const { projects, purchaseOrders, dossiers, isLoaded } = useDynamicState();

  if (!isLoaded) return <div className="p-8 text-center text-slate-500">Laden...</div>;

  const po = purchaseOrders.find(p => p.id === id);
  if (!po) return <div className="p-8 text-center">Opdracht niet gevonden</div>;

  const project = projects.find(p => p.id === po.projectId);
  const poDossiers = dossiers.filter(d => d.purchaseOrderId === po.id);
  const getRelationName = (rid: string) => mockRelations.find(r => r.id === rid)?.name || rid;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        href="/client/purchase-orders"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft size={15} />
        Terug naar Inkoopopdrachten
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{po.id}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">{po.type}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">{po.title}</h2>
            {project && (
              <p className="text-sm text-blue-600 font-medium mt-1 flex items-center gap-1">
                <MapPin size={13} />
                {project.name} — {project.location}
              </p>
            )}
          </div>
          <span className={`px-3 py-1.5 rounded-full text-sm font-semibold flex-shrink-0 ${
            po.status === 'Verstuurd' ? 'bg-blue-100 text-blue-700' :
            po.status === 'Afgerond' ? 'bg-emerald-100 text-emerald-700' :
            'bg-slate-100 text-slate-500'
          }`}>
            {po.status}
          </span>
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
            <FileText size={14} className="text-slate-400" />
            <strong className="text-slate-700">{poDossiers.length}</strong> dossiers
          </div>
        </div>
      </div>

      {/* Dossiers */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Onderliggende Dossiers</h3>
          <p className="text-xs text-slate-500 mt-0.5">Elke aannemer die deze opdracht heeft ontvangen krijgt een eigen dossier.</p>
        </div>

        {poDossiers.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-slate-400 italic">Nog geen dossiers voor deze opdracht</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Dossier</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Aannemer</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Tijdlijn</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {poDossiers.map(dossier => (
                <tr 
                  key={dossier.id} 
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <Link href={`/client/dossiers/${dossier.id}`} className="text-sm font-mono font-bold text-slate-700 group-hover:text-blue-600 transition-colors hover:underline">
                      {dossier.id}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-700">{getRelationName(dossier.relationId)}</p>
                    <p className="text-xs text-slate-400">{dossier.relationId}</p>
                  </td>
                  <td className="px-6 py-4">
                    <DossierStatusBadge status={dossier.status} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-blue-100 hover:text-blue-700 transition-colors">
                      <History size={13} />
                      {dossier.historyCount} stappen
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/client/dossiers/${dossier.id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:text-blue-800 transition-colors">
                      Bekijk <ArrowRight size={13} />
                    </Link>
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
