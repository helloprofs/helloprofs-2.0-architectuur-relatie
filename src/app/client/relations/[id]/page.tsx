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
  MoreVertical, Mail, Phone, MapPin, ExternalLink
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
  const [activeTab, setActiveTab] = useState<'overzicht' | 'inkoopopdrachten' | 'keten'>('overzicht');

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
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
          <div className="flex gap-6">
            <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
              {relation.type === 'ZZP' ? <User size={40} /> : <Building2 size={40} />}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">{relation.name}</h1>
                <ComplianceBadge status={relation.complianceStatus} />
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-medium">
                <span className="flex items-center gap-1.5"><Mail size={16} /> {relation.email}</span>
                <span className="flex items-center gap-1.5"><Phone size={16} /> {relation.phone || 'Geen telefoon'}</span>
                {relation.kvk && <span className="flex items-center gap-1.5 font-mono bg-slate-100 px-2 py-0.5 rounded text-xs text-slate-600">KVK {relation.kvk}</span>}
              </div>
            </div>
          </div>

          <div className="flex gap-3 w-full lg:w-auto">
            <button className="flex-1 lg:flex-none px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
              Profiel Bewerken
            </button>
            <button className="flex-1 lg:flex-none px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
              Actie Uitvoeren
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100 bg-slate-50/50 p-2 gap-2">
          {[
            { id: 'overzicht', label: 'Overzicht & Compliance', icon: ShieldCheck },
            { id: 'inkoopopdrachten', label: 'Inkoopopdrachten', icon: FileText },
            { id: 'keten', label: 'Keten-Inzicht', icon: Users },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id 
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Compliance Passport */}
              <div className="col-span-1 md:col-span-2 space-y-6">
                <h3 className="text-lg font-bold text-slate-800">Compliance Paspoort</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'KVK Uittreksel', valid: relation.wkaData.kvkGeldig },
                    { label: 'BTW-ID Controle', valid: relation.wkaData.btwGeldig },
                    { label: 'Identificatie (ID)', valid: relation.wkaData.idGeldig },
                    { label: 'Verzekeringsbewijs', valid: relation.wkaData.verzekeringGeldig },
                    { label: 'Modelovereenkomst', valid: relation.wkaData.modelOvereenkomstGeldig },
                    { label: 'G-Rekening Verificatie', valid: relation.wkaData.gsrekeningGeldig ?? true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-sm font-bold text-slate-700">{item.label}</span>
                      {item.valid ? (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase">
                          <ShieldCheck size={14} /> Geldig
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-rose-600 uppercase">
                          <ShieldAlert size={14} /> Actie Vereist
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* G-Rekening Section */}
                {relation.gRekening && (
                  <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                        <Landmark size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-blue-900">G-Rekening Actief</h4>
                        <p className="text-xs text-blue-600">Automatische afsplitsing van loonheffingen (WKA).</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                      <div>
                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">IBAN</p>
                        <p className="font-mono text-sm font-bold text-slate-700">{relation.gRekening.accountNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Percentage</p>
                        <p className="text-xl font-black text-blue-700">{relation.gRekening.percentage}%</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Engagement Stats */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800">Engagement</h3>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Magic Link Clicks</span>
                    <span className="font-bold text-slate-900">{relation.engagement?.magicLinkClicks || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Laatste CRM Contact</span>
                    <span className="font-bold text-emerald-600">{relation.engagement?.lastCallOutcome || 'Nader in te vullen'}</span>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-200">
                    <p className="text-xs text-slate-400 italic">Sinds de start van de samenwerking zijn er geen weigeringen (Refusal Evidence) vastgelegd.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inkoopopdrachten' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">Inkoopopdrachten & Dossiers</h3>
                <button className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">+ Nieuwe Inkoopopdracht</button>
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
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase">{item.po?.type}</span>
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

          {activeTab === 'keten' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800">Hierarchische Keten</h3>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Compliant</div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Actie Vereist</div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Kritiek</div>
                </div>
              </div>

              {/* Tree View */}
              <div className="relative pl-8 space-y-12">
                {/* Horizontal & Vertical lines through CSS borders and absolute positioning */}
                
                {/* Root Relation (This one) */}
                <div className="relative flex items-center gap-4">
                  <div className="absolute -left-8 w-8 h-px bg-slate-200"></div>
                  <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 z-10">
                    {relation.type === 'ZZP' ? <User size={24} /> : <Building2 size={24} />}
                  </div>
                  <div className="bg-white p-4 rounded-xl border-2 border-blue-100 shadow-sm min-w-[240px]">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-black text-slate-900">{relation.name}</span>
                      <ComplianceBadge status={relation.complianceStatus} />
                    </div>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Hoofdaannemer (U)</p>
                  </div>
                </div>

                {/* Sub-contractors */}
                <div className="relative pl-12 space-y-8 border-l-2 border-slate-100 ml-6">
                  {mockRelationChains.filter((c: RelationChain) => c.parentId === id).length === 0 ? (
                    <div className="text-sm text-slate-400 italic py-4">Geen actieve onderaannemers geregistreerd in de keten.</div>
                  ) : (
                    mockRelationChains.filter((c: RelationChain) => c.parentId === id).map((chain: RelationChain, idx: number) => {
                      const child = mockRelations.find(r => r.id === chain.childId);
                      if (!child) return null;
                      
                      return (
                        <div key={idx} className="relative flex items-center gap-4 group">
                          {/* Connector line */}
                          <div className="absolute -left-12 w-12 h-px bg-slate-200 group-hover:bg-blue-300 transition-colors"></div>
                          
                          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 group-hover:border-blue-200 group-hover:bg-blue-50 transition-colors z-10">
                            {child.type === 'ZZP' ? <User size={20} /> : <Building2 size={20} />}
                          </div>
                          
                          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm min-w-[240px] group-hover:border-blue-200 group-hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-sm font-bold text-slate-800">{child.name}</span>
                              <ComplianceBadge status={child.complianceStatus} />
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              <span>Onderaannemer</span>
                              <span className="text-slate-300 font-mono">ID: {child.id}</span>
                            </div>
                          </div>

                          {/* Level 3: Sub-sub-contractors (Deep chain check) */}
                          <div className="absolute top-1/2 left-[100%] ml-8 flex items-center">
                             <div className="w-8 h-px bg-slate-100"></div>
                             <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-bold text-slate-400 uppercase flex items-center gap-2">
                               <Clock size={10} /> Toekomstige Keten-laag
                             </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Guardrails Info */}
              <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-bold text-slate-800 mb-1">Privacy Guardrail Actief</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    U ziet alleen de compliance-status van de keten. Specifieke inkoopbedragen en contractdetails tussen de onderliggende partijen zijn afgeschermd volgens de architectuur-richtlijnen.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
