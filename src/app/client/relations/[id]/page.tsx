"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  mockRelations, mockDossiers, mockPurchaseOrders, mockProjects, mockRelationChains,
  ComplianceStatus, Relation, Dossier, PurchaseOrder, RelationChain
} from "@/lib/mock-data";
import {
  ArrowLeft, Building2, User, ShieldCheck, ShieldAlert, ShieldX,
  FileText, Hammer, Users, Landmark, Clock, ChevronRight,
  MoreVertical, Mail, Phone, MapPin, ExternalLink, Check
} from "lucide-react";

// --- Components ---

function ComplianceBadge({ status }: { status: ComplianceStatus }) {
  const configs: Record<ComplianceStatus, { color: string, icon: any, label: string }> = {
    'Groen': { color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: ShieldCheck, label: 'Compliant' },
    'Oranje': { color: 'text-amber-600 bg-amber-50 border-amber-100', icon: ShieldAlert, label: 'Actie Vereist' },
    'Rood': { color: 'text-rose-600 bg-rose-50 border-rose-100', icon: ShieldX, label: 'Non-Compliant' },
  };
  const { color, icon: Icon, label } = configs[status];
  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider ${color}`}>
      <Icon size={12} />
      <span>{label}</span>
    </div>
  );
}

// --- Main Page ---

export default function RelationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const relation = mockRelations.find(r => r.id === id);
  const [activeTab, setActiveTab] = useState<'overzicht' | 'inkoopopdrachten'>('overzicht');

  if (!relation) return <div className="p-8 text-center text-slate-500">Relatie niet gevonden.</div>;

  // Get related dossiers and POs
  const relatedDossiers = mockDossiers.filter(d => d.relationId === id);
  const dossiersWithPO = relatedDossiers.map((d: Dossier) => {
    const po = mockPurchaseOrders.find(p => p.id === d.purchaseOrderId);
    const project = po ? mockProjects.find(p => p.id === po.projectId) : null;
    return { ...d, po, project };
  });

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/client/relations" className="hover:text-slate-800 transition-colors">Relaties</Link>
        <ChevronRight size={14} />
        <span className="text-slate-900 font-medium">{relation.name}</span>
      </nav>

      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 shrink-0">
            {relation.type === 'ZZP' ? <User size={40} /> : <Building2 size={40} />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{relation.name}</h1>
              <ComplianceBadge status={relation.complianceStatus} />
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5 hover:text-blue-600 transition-colors cursor-pointer"><Mail size={14} className="text-slate-400" /> {relation.email}</span>
              <span className="w-px h-3 bg-slate-200 hidden sm:block" />
              <span className="flex items-center gap-1.5"><Phone size={14} className="text-slate-400" /> {relation.phone || '—'}</span>
              <span className="w-px h-3 bg-slate-200 hidden sm:block" />
              {relation.kvk && <span className="flex items-center gap-1.5"><Building2 size={14} className="text-slate-400" /> KVK {relation.kvk}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100 bg-slate-50/50 p-2 gap-2">
          {[
            { id: 'overzicht', label: 'Overzicht & Compliance', icon: ShieldCheck },
            { id: 'inkoopopdrachten', label: 'Inkoopopdrachten', icon: FileText },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-500 hover:bg-white/50 hover:text-slate-800'
                }`}
            >
              <tab.icon size={16} />
              {tab.label}
              {tab.id === 'inkoopopdrachten' && <span className="ml-1 opacity-50">({dossiersWithPO.length})</span>}
            </button>
          ))}
        </div>

        <div className="p-8">
          {activeTab === 'overzicht' && (
            <div className="space-y-8">
              {/* Compliance Passport */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Compliance Paspoort</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { label: 'KVK Uittreksel', valid: relation.wkaData.kvkGeldig },
                    { label: 'BTW-ID Controle', valid: relation.wkaData.btwGeldig },
                    { label: 'Identificatie (ID)', valid: relation.wkaData.idGeldig },
                    { label: 'Verzekeringsbewijs', valid: relation.wkaData.verzekeringGeldig },
                    { label: 'Fiscaal juridisch profiel', valid: relation.wkaData.modelOvereenkomstGeldig },
                    { label: 'G-Rekening Verificatie', valid: relation.wkaData.gsrekeningGeldig ?? true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200/60 shadow-sm hover:border-slate-300 transition-colors">
                      <span className="text-sm font-medium text-slate-600">{item.label}</span>
                      {item.valid ? (
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-tighter bg-emerald-50 px-2 py-0.5 rounded-full">
                          <Check size={12} strokeWidth={3} /> Geldig
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-rose-600 uppercase tracking-tighter bg-rose-50 px-2 py-0.5 rounded-full">
                          <ShieldAlert size={12} strokeWidth={3} /> Actie
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* G-Rekening Section */}
                {relation.gRekening && (
                  <div className="p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                          <Landmark size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">G-Rekening</h4>
                          <p className="text-xs text-slate-500">WKA Loonheffingen afsplitsing actief.</p>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-tighter border border-emerald-100">
                        Actief
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">IBAN</p>
                        <p className="font-mono text-sm font-bold text-slate-700">{relation.gRekening.accountNumber}</p>
                      </div>
                      <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Percentage</p>
                        <p className="text-2xl font-black text-slate-800">{relation.gRekening.percentage}%</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {activeTab === 'inkoopopdrachten' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">Inkoopopdrachten & Dossiers</h3>
              </div>

              {dossiersWithPO.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-500">Geen actieve inkoopopdrachten gevonden voor deze relatie.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {dossiersWithPO.map((item: any) => (
                    <Link
                      key={item.id}
                      href={`/client/dossiers/${item.id}`}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white border border-slate-200 rounded-2xl hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          <FileText size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase">{item.id}</span>
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded italic">{item.po?.type}</span>
                          </div>
                          <h4 className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{item.po?.title}</h4>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 italic">
                            <MapPin size={12} /> {item.project?.name} ({item.project?.location})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-8 mt-4 sm:mt-0">
                        <div className="text-right hidden md:block">
                          <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Status</p>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-tighter">
                            {item.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <ChevronRight className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
