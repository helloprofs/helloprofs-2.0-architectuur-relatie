"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DossierDetailContent } from "@/components/dossier/DossierDetailContent";
import { ContactModal } from "@/components/interaction/ContactModal";
import {
  mockRelations, mockDossiers, mockPurchaseOrders, mockProjects, mockDossierEvents,
  ComplianceStatus, Dossier, DossierStatus, EventType
} from "@/lib/mock-data";
import {
  Building2, User, ShieldCheck, ShieldAlert, ShieldX,
  FileText, Landmark, ChevronRight, ChevronLeft, Clock,
  Mail, Phone, Check, Download, MapPin, Zap,
  Send, CheckCircle, XCircle, Paperclip, MessageSquare, AlertTriangle, MessageCircle, FileCheck
} from "lucide-react";

// --- Badge ---

function ComplianceBadge({ status }: { status: ComplianceStatus }) {
  const configs: Record<ComplianceStatus, { color: string; icon: any; label: string }> = {
    'Groen': { color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: ShieldCheck, label: 'Compliant' },
    'Oranje': { color: 'text-amber-600 bg-amber-50 border-amber-100', icon: ShieldAlert, label: 'Actie Vereist' },
    'Rood': { color: 'text-rose-600 bg-rose-50 border-rose-100', icon: ShieldX, label: 'Non-Compliant' },
  };
  const { color, icon: Icon, label } = configs[status];
  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider ${color}`}>
      <Icon size={12} /><span>{label}</span>
    </div>
  );
}

function DossierStatusBadge({ status }: { status: DossierStatus }) {
  const map: Record<DossierStatus, { label: string; cls: string }> = {
    'Inkoopopdracht_Verstuurd': { label: 'Inkoopopdracht Verstuurd', cls: 'bg-blue-100 text-blue-700' },
    'Niet_Gereageerd': { label: 'Niet Gereageerd', cls: 'bg-orange-100 text-orange-700' },
    'Inkoopopdracht_Geweigerd': { label: 'Geweigerd', cls: 'bg-red-100 text-red-700' },
    'Aanbod_Verstuurd': { label: 'Aanbod Verstuurd', cls: 'bg-purple-100 text-purple-700' },
    'Aanbod_Geaccepteerd': { label: 'Aanbod Geaccepteerd', cls: 'bg-teal-100 text-teal-700' },
    'Contract_Lopend': { label: 'Contract Lopend', cls: 'bg-emerald-100 text-emerald-700' },
    'Contract_Verlopen': { label: 'Contract Verlopen', cls: 'bg-slate-100 text-slate-500' },
    'Compliance_Freeze': { label: 'Compliance Freeze', cls: 'bg-rose-100 text-rose-700' },
  };
  const { label, cls } = map[status];
  return <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${cls}`}>{label}</span>;
}

function TimelineEventIcon({ type }: { type: EventType }) {
  const map: Record<EventType, { icon: React.ReactNode; cls: string }> = {
    'inkoopopdracht_verstuurd': { icon: <Send size={13} />, cls: 'bg-blue-100 text-blue-600' },
    'inkoopopdracht_geaccepteerd': { icon: <CheckCircle size={13} />, cls: 'bg-emerald-100 text-emerald-600' },
    'inkoopopdracht_geweigerd': { icon: <XCircle size={13} />, cls: 'bg-red-100 text-red-600' },
    'aanbod_verstuurd': { icon: <FileText size={13} />, cls: 'bg-purple-100 text-purple-600' },
    'aanbod_geaccepteerd': { icon: <CheckCircle size={13} />, cls: 'bg-emerald-100 text-emerald-600' },
    'aanbod_afgewezen': { icon: <XCircle size={13} />, cls: 'bg-red-100 text-red-600' },
    'contract_ondertekend': { icon: <FileCheck size={13} />, cls: 'bg-indigo-100 text-indigo-600' },
    'bijlage_toegevoegd': { icon: <Paperclip size={13} />, cls: 'bg-slate-100 text-slate-600' },
    'bericht_verstuurd': { icon: <MessageSquare size={13} />, cls: 'bg-slate-100 text-slate-600' },
    'controle_vastgelegd': { icon: <AlertTriangle size={13} />, cls: 'bg-amber-100 text-amber-600' },
    'contact_call': { icon: <Phone size={13} />, cls: 'bg-blue-100 text-blue-600' },
    'contact_whatsapp': { icon: <MessageCircle size={13} />, cls: 'bg-emerald-100 text-emerald-600' },
    'refusal_evidence': { icon: <XCircle size={13} />, cls: 'bg-rose-100 text-rose-600' },
    'compliance_check': { icon: <ShieldCheck size={13} />, cls: 'bg-indigo-100 text-indigo-600' },
  };
  const { icon, cls } = map[type] || { icon: <Clock size={13} />, cls: 'bg-slate-100 text-slate-600' };
  return <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${cls}`}>{icon}</div>;
}

// --- Audit Export Modal ---

function AuditExportModal({
  isOpen, onClose, dossiersWithPO
}: {
  isOpen: boolean;
  onClose: () => void;
  dossiersWithPO: any[];
}) {
  const [filterYear, setFilterYear] = useState('');
  const [filterPO, setFilterPO] = useState('');

  if (!isOpen) return null;

  const years = Array.from(new Set(
    mockDossierEvents.map(e => new Date(e.date).getFullYear().toString())
  )).sort().reverse();

  const handleExport = () => {
    const relevantDossierIds = dossiersWithPO
      .filter(d => !filterPO || d.id === filterPO)
      .map(d => d.id);

    const events = mockDossierEvents
      .filter(e => relevantDossierIds.includes(e.dossierId))
      .filter(e => !filterYear || new Date(e.date).getFullYear().toString() === filterYear)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const rows = [
      ['Datum', 'Tijdstip', 'Dossier', 'Type', 'Omschrijving', 'Actor', 'Juridische Status'],
      ...events.map(e => {
        const juridisch = e.type === 'refusal_evidence' ? '🚩 Bewijs: Vrijheid van weigering'
          : e.type === 'inkoopopdracht_geaccepteerd' ? '✅ Bewijs: Geen loondienst-dwang'
          : e.type === 'contact_call' || e.type === 'contact_whatsapp' ? '⚪ Contactpoging gelogd'
          : '';
        return [
          new Date(e.date).toLocaleDateString('nl-NL'),
          new Date(e.date).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }),
          e.dossierId,
          e.type.replace(/_/g, ' '),
          e.description,
          e.actor,
          juridisch,
        ];
      })
    ];

    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_export${filterYear ? '_' + filterYear : ''}${filterPO ? '_' + filterPO : ''}.csv`;
    a.click();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Exporteren</span>
              <h2 className="text-base font-bold text-slate-900">Audit Export</h2>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer"><XCircle size={18} /></button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filter op jaar</label>
            <select
              value={filterYear}
              onChange={e => setFilterYear(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all appearance-none"
            >
              <option value="">Alle jaren</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filter op inkoopopdracht</label>
            <select
              value={filterPO}
              onChange={e => setFilterPO(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all appearance-none"
            >
              <option value="">Alle inkoopopdrachten</option>
              {dossiersWithPO.map(d => (
                <option key={d.id} value={d.id}>{d.id} — {d.po?.title ?? 'Onbekend'}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-700 cursor-pointer">Annuleren</button>
          <button
            onClick={handleExport}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-all cursor-pointer border-none shadow-sm"
          >
            <Download size={15} /> Exporteer CSV
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main Page ---

export default function RelationDetailPage() {
  const { id } = useParams<{ id: string }>();

  const relation = mockRelations.find(r => r.id === id);
  const [activeTab, setActiveTab] = useState<'overzicht' | 'inkoopopdrachten' | 'tijdlijn'>('overzicht');
  const [selectedDossierId, setSelectedDossierId] = useState<string | null>(null);
  const [auditExportOpen, setAuditExportOpen] = useState(false);
  const [klusModalOpen, setKlusModalOpen] = useState(false);
  const [extraEvents, setExtraEvents] = useState<any[]>([]);

  if (!relation) return <div className="p-8 text-center text-slate-500">Relatie niet gevonden.</div>;

  const relatedDossiers = mockDossiers.filter(d => d.relationId === id);
  const dossiersWithPO = relatedDossiers.map((d: Dossier) => {
    const po = mockPurchaseOrders.find(p => p.id === d.purchaseOrderId);
    const project = po ? mockProjects.find(p => p.id === po.projectId) : null;
    return { ...d, po, project };
  });

  // All events across all dossiers of this relation, sorted newest first
  const allEvents = [...mockDossierEvents.filter(e => relatedDossiers.some(d => d.id === e.dossierId)), ...extraEvents]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const selectedItem = dossiersWithPO.find(d => d.id === selectedDossierId);

  const tabs = [
    { id: 'overzicht', label: 'Overzicht & Compliance', icon: ShieldCheck },
    { id: 'inkoopopdrachten', label: 'Inkoopopdrachten', icon: FileText, count: dossiersWithPO.length },
    { id: 'tijdlijn', label: 'Tijdlijn', icon: Clock, count: allEvents.length },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/client/relations" className="hover:text-slate-800 transition-colors">Relaties</Link>
        <ChevronRight size={14} />
        <span className="text-slate-900 font-medium">{relation.name}</span>
      </nav>

      {/* Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-300 shrink-0">
            {relation.type === 'ZZP' ? <User size={32} /> : <Building2 size={32} />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-2">
              <h1 className="text-xl font-bold text-slate-900">{relation.name}</h1>
              <ComplianceBadge status={relation.complianceStatus} />
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 hover:text-blue-600 transition-colors cursor-pointer"><Mail size={12} className="text-slate-400" /> {relation.email}</span>
              <span className="w-px h-3 bg-slate-200 hidden sm:block" />
              <span className="flex items-center gap-1.5"><Phone size={12} className="text-slate-400" /> {relation.phone || '—'}</span>
              <span className="w-px h-3 bg-slate-200 hidden sm:block" />
              {relation.kvk && <span className="flex items-center gap-1.5"><Building2 size={12} className="text-slate-400" /> KVK {relation.kvk}</span>}
            </div>
          </div>
          <button
            onClick={() => setKlusModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-all cursor-pointer border-none shrink-0"
          >
            <Zap size={14} /> Dienst Toewijzen
          </button>
        </div>
      </div>

      {/* Tabs + Audit Export */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-2 py-2 gap-2">
          {/* Tabs */}
          <div className="flex gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSelectedDossierId(null); }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-500 hover:bg-white/50 hover:text-slate-800'
                }`}
              >
                <tab.icon size={15} />
                {tab.label}
                {'count' in tab && tab.count !== undefined && (
                  <span className="ml-0.5 opacity-50">({tab.count})</span>
                )}
              </button>
            ))}
          </div>

          {/* Audit Export */}
          <button
            onClick={() => setAuditExportOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-sm shrink-0"
          >
            <Download size={14} /> Audit Export
          </button>
        </div>

        <div className="p-8">

          {/* ── OVERZICHT & COMPLIANCE ── */}
          {activeTab === 'overzicht' && (
            <div className="space-y-8">
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
                      <div className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-tighter border border-emerald-100">Actief</div>
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

          {/* ── INKOOPOPDRACHTEN ── */}
          {activeTab === 'inkoopopdrachten' && (
            <>
              {dossiersWithPO.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-500">Geen actieve inkoopopdrachten gevonden voor deze relatie.</p>
                </div>
              ) : !selectedItem ? (
                /* LIST VIEW */
                <div className="grid grid-cols-1 gap-3">
                  {dossiersWithPO.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedDossierId(item.id)}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white border border-slate-200 rounded-2xl hover:border-blue-400 hover:shadow-md transition-all text-left cursor-pointer w-full"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">
                          <FileText size={22} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase">{item.id}</span>
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded italic">{item.po?.type}</span>
                          </div>
                          <h4 className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{item.po?.title ?? '—'}</h4>
                          {item.project && (
                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 italic">
                              <MapPin size={11} /> {item.project.name} ({item.project.location})
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-4 sm:mt-0">
                        <DossierStatusBadge status={item.status} />
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                /* DETAIL VIEW */
                <div className="space-y-4">
                  <button
                    onClick={() => setSelectedDossierId(null)}
                    className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={16} /> Terug naar inkoopopdrachten
                  </button>
                  <DossierDetailContent
                    dossierId={selectedItem.id}
                    onEventLogged={(event) => setExtraEvents(prev => [event, ...prev])}
                  />
                </div>
              )}
            </>
          )}

          {/* ── TIJDLIJN (overkoepelend) ── */}
          {activeTab === 'tijdlijn' && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-6">
                Chronologisch overzicht — alle activiteit voor {relation.name}
              </p>
              {allEvents.length === 0 ? (
                <p className="text-sm text-slate-400 italic">Nog geen gebeurtenissen geregistreerd.</p>
              ) : (
                <div className="relative">
                  <div className="absolute left-3.5 top-0 bottom-0 w-px bg-slate-200" />
                  <div className="space-y-3">
                    {allEvents.map(event => {
                      const dossier = dossiersWithPO.find(d => d.id === event.dossierId);
                      return (
                        <div key={event.id} className="flex gap-4 relative">
                          <TimelineEventIcon type={event.type} />
                          <div className="flex-1 bg-slate-50 rounded-lg border border-slate-100 p-3.5 hover:border-blue-200 hover:bg-white transition-colors group">
                            <div className="flex justify-between items-start gap-3">
                              <p className="text-sm font-medium text-slate-800">{event.description}</p>
                              {dossier && (
                                <button
                                  onClick={() => { setActiveTab('inkoopopdrachten'); setSelectedDossierId(dossier.id); }}
                                  className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded hover:bg-blue-100 transition-colors flex-shrink-0 cursor-pointer opacity-0 group-hover:opacity-100"
                                >
                                  {dossier.id} →
                                </button>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                              <span>{new Date(event.date).toLocaleString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                              <span>·</span>
                              <span>{event.actor}</span>
                              {dossier?.po && (
                                <>
                                  <span>·</span>
                                  <span className="italic">{dossier.po.title}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ContactModal
        isOpen={klusModalOpen}
        onClose={() => setKlusModalOpen(false)}
        relationName={relation.name}
        phone={relation.phone || '0612345678'}
        dossierId={dossiersWithPO[0]?.id || ''}
        availablePOs={dossiersWithPO.map(d => ({ id: d.id, title: d.po?.title ?? d.id, type: d.po?.type ?? '' }))}
        defaultPOId={dossiersWithPO[0]?.id}
        onLog={({ channel, outcome, description, poId }) => {
          setExtraEvents(prev => [{
            id: `ev-${Date.now()}`,
            dossierId: poId || dossiersWithPO[0]?.id || '',
            type: outcome === 'Geweigerd' ? 'refusal_evidence' : channel === 'whatsapp' ? 'contact_whatsapp' : 'contact_call',
            description: `${channel === 'call' ? '📞 Telefoon' : '💬 WhatsApp'}: "${description}" — ${outcome.replace('_', ' ')}`,
            date: new Date().toISOString(),
            actor: 'Tim de Ruiter',
          }, ...prev]);
        }}
      />

      <AuditExportModal
        isOpen={auditExportOpen}
        onClose={() => setAuditExportOpen(false)}
        dossiersWithPO={dossiersWithPO}
      />
    </div>
  );
}
