"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  mockDossiers, mockPurchaseOrders, mockRelations, mockProjects,
  mockDossierEvents, mockDossierAttachments, mockDossierMessages,
  DossierStatus, EventType
} from "@/lib/mock-data";
import {
  ArrowLeft, Clock, FileText, FileCheck, Hammer, Receipt,
  Paperclip, MessageSquare, Download, Plus, CheckCircle,
  XCircle, Send, AlertTriangle, File, User
} from "lucide-react";

// ─── Status Badge ────────────────────────────────────────────
function StatusBadge({ status }: { status: DossierStatus }) {
  const map: Record<DossierStatus, { label: string; cls: string }> = {
    'Inkoopopdracht_Verstuurd': { label: 'Inkoopopdracht Verstuurd', cls: 'bg-blue-100 text-blue-700' },
    'Niet_Gereageerd':          { label: 'Niet Gereageerd',          cls: 'bg-orange-100 text-orange-700' },
    'Inkoopopdracht_Geweigerd': { label: 'Geweigerd',                cls: 'bg-red-100 text-red-700' },
    'Aanbod_Verstuurd':         { label: 'Aanbod Verstuurd',         cls: 'bg-purple-100 text-purple-700' },
    'Aanbod_Geaccepteerd':      { label: 'Aanbod Geaccepteerd',      cls: 'bg-teal-100 text-teal-700' },
    'Contract_Lopend':          { label: 'Contract Lopend',          cls: 'bg-emerald-100 text-emerald-700' },
    'Contract_Verlopen':        { label: 'Contract Verlopen',        cls: 'bg-slate-100 text-slate-500' },
  };
  const { label, cls } = map[status];
  return <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${cls}`}>{label}</span>;
}

// ─── Timeline event icon ──────────────────────────────────────
function EventIcon({ type }: { type: EventType }) {
  const map: Record<EventType, { icon: React.ReactNode; cls: string }> = {
    'inkoopopdracht_verstuurd':   { icon: <Send size={14} />,          cls: 'bg-blue-100 text-blue-600' },
    'inkoopopdracht_geaccepteerd':{ icon: <CheckCircle size={14} />,   cls: 'bg-emerald-100 text-emerald-600' },
    'inkoopopdracht_geweigerd':   { icon: <XCircle size={14} />,       cls: 'bg-red-100 text-red-600' },
    'aanbod_verstuurd':           { icon: <FileText size={14} />,      cls: 'bg-purple-100 text-purple-600' },
    'aanbod_geaccepteerd':        { icon: <CheckCircle size={14} />,   cls: 'bg-emerald-100 text-emerald-600' },
    'aanbod_afgewezen':           { icon: <XCircle size={14} />,       cls: 'bg-red-100 text-red-600' },
    'contract_ondertekend':       { icon: <FileCheck size={14} />,     cls: 'bg-indigo-100 text-indigo-600' },
    'bijlage_toegevoegd':         { icon: <Paperclip size={14} />,     cls: 'bg-slate-100 text-slate-600' },
    'bericht_verstuurd':          { icon: <MessageSquare size={14} />, cls: 'bg-slate-100 text-slate-600' },
    'controle_vastgelegd':        { icon: <AlertTriangle size={14} />, cls: 'bg-amber-100 text-amber-600' },
  };
  const { icon, cls } = map[type];
  return <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${cls}`}>{icon}</div>;
}

const TABS = [
  { id: 'tijdlijn',         label: 'Tijdlijn',         icon: Clock },
  { id: 'inkoopopdracht',   label: 'Inkoopopdracht',   icon: FileText },
  { id: 'aanbod',           label: 'Aanbod',           icon: FileCheck },
  { id: 'contract',         label: 'Contract',         icon: FileCheck },
  { id: 'bijlagen',         label: 'Bijlagen',         icon: Paperclip },
  { id: 'communicatie',     label: 'Communicatie',     icon: MessageSquare },
];

export default function DossierDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('tijdlijn');

  const dossier = mockDossiers.find(d => d.id === id);
  if (!dossier) return (
    <div className="text-center py-20">
      <p className="text-slate-500">Dossier niet gevonden.</p>
      <Link href="/client/dossiers" className="text-blue-600 text-sm mt-2 inline-block">← Terug</Link>
    </div>
  );

  const po       = mockPurchaseOrders.find(p => p.id === dossier.purchaseOrderId);
  const relation = mockRelations.find(r => r.id === dossier.relationId);
  const project  = po ? mockProjects.find(p => p.id === po.projectId) : null;
  const events   = mockDossierEvents.filter(e => e.dossierId === id).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const attachments = mockDossierAttachments.filter(a => a.dossierId === id);
  const messages    = mockDossierMessages.filter(m => m.dossierId === id);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link href="/client/dossiers" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
        <ArrowLeft size={15} /> Terug naar Dossiers
      </Link>

      {/* Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{dossier.id}</span>
              {po && <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-medium">{po.type}</span>}
            </div>
            <h2 className="text-2xl font-bold text-slate-800">{po?.title || dossier.id}</h2>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
              {project && <span>📁 {project.name}</span>}
              {relation && <span>👤 {relation.name}</span>}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusBadge status={dossier.status} />
            <button className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors">
              <Download size={13} /> Exporteren
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex overflow-x-auto border-b border-slate-100">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'text-blue-700 border-blue-600 bg-blue-50/50'
                  : 'text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <tab.icon size={15} />
              {tab.label}
              {tab.id === 'bijlagen'     && attachments.length > 0 && <span className="ml-1 bg-slate-200 text-slate-600 rounded-full text-xs px-1.5 py-0.5">{attachments.length}</span>}
              {tab.id === 'communicatie' && messages.length > 0    && <span className="ml-1 bg-slate-200 text-slate-600 rounded-full text-xs px-1.5 py-0.5">{messages.length}</span>}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">

          {/* ── TIJDLIJN ── */}
          {activeTab === 'tijdlijn' && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Chronologische log — alle gebeurtenissen in dit dossier</p>
              {events.length === 0 ? (
                <p className="text-sm text-slate-400 italic">Nog geen gebeurtenissen geregistreerd.</p>
              ) : (
                <div className="relative">
                  <div className="absolute left-3.5 top-0 bottom-0 w-px bg-slate-200"></div>
                  <div className="space-y-4">
                    {events.map(event => (
                      <div key={event.id} className="flex gap-4 relative">
                        <EventIcon type={event.type} />
                        <div className="flex-1 bg-slate-50 rounded-lg border border-slate-100 p-3.5 hover:border-blue-200 hover:bg-white transition-colors group">
                          <div className="flex justify-between items-start gap-3">
                            <p className="text-sm font-medium text-slate-800">{event.description}</p>
                            {event.linkedSection && (
                              <button
                                onClick={() => setActiveTab(event.linkedSection!)}
                                className="text-xs text-blue-600 hover:underline flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                Bekijk →
                              </button>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                            <span>{new Date(event.date).toLocaleString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                            <span>·</span>
                            <span>{event.actor}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── INKOOPOPDRACHT ── */}
          {activeTab === 'inkoopopdracht' && po && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">PO Nummer</p>
                  <p className="text-sm font-bold text-slate-700 font-mono">{po.id}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Type</p>
                  <p className="text-sm font-bold text-slate-700">{po.type}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                  <p className="text-sm font-bold text-slate-700">{po.status}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Budget</p>
                  <p className="text-sm font-bold text-slate-700">{po.budget ? `€${po.budget.toLocaleString('nl-NL')}` : 'Niet opgegeven'}</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Omschrijving</p>
                <p className="text-sm text-slate-700 leading-relaxed">{po.description}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Project</p>
                <p className="text-sm font-bold text-slate-700">{project?.name || po.projectId}</p>
              </div>
            </div>
          )}

          {/* ── AANBOD ── */}
          {activeTab === 'aanbod' && (
            <div className="space-y-4">
              {dossier.status === 'Inkoopopdracht_Verstuurd' || dossier.status === 'Niet_Gereageerd' || dossier.status === 'Inkoopopdracht_Geweigerd' ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
                  <FileCheck size={32} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-500">Nog geen aanbod ontvangen</p>
                  <p className="text-xs text-slate-400 mt-1">Het aanbod verschijnt hier zodra de opdrachtnemer reageert.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Bedrag</p>
                      <p className="text-2xl font-bold text-slate-800">€13.750</p>
                      <p className="text-xs text-slate-400 mt-0.5">excl. BTW</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Uitvoeringstermijn</p>
                      <p className="text-sm font-bold text-slate-700">4 weken</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Toelichting opdrachtnemer</p>
                    <p className="text-sm text-slate-700 leading-relaxed">Prijs inclusief materiaalkosten voor kozijnprofiel en afwerking. Exclusief verfwerk.</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-2.5 text-sm font-semibold transition-colors">
                      Aanbod Accepteren
                    </button>
                    <button className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg py-2.5 text-sm font-semibold transition-colors">
                      Aanbod Afwijzen
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── CONTRACT ── */}
          {activeTab === 'contract' && (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
              <FileCheck size={32} className="text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-500">Nog geen contract aangemaakt</p>
              <p className="text-xs text-slate-400 mt-1">Het contract wordt aangemaakt nadat het aanbod is geaccepteerd.</p>
            </div>
          )}

          {/* ── BIJLAGEN ── */}
          {activeTab === 'bijlagen' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{attachments.length} bijlagen</p>
                <button className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 border border-blue-200 rounded-lg px-3 py-1.5 hover:bg-blue-50 transition-colors">
                  <Plus size={14} /> Bijlage toevoegen
                </button>
              </div>
              {attachments.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
                  <Paperclip size={32} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-400">Nog geen bijlagen</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {attachments.map(att => (
                    <div key={att.id} className="flex items-center gap-4 p-3.5 bg-slate-50 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-white transition-colors">
                      <div className="p-2 bg-red-50 rounded-lg">
                        <File size={18} className="text-red-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{att.name}</p>
                        <p className="text-xs text-slate-400">{att.size} · Geüpload door {att.uploadedBy} op {new Date(att.date).toLocaleDateString('nl-NL')}</p>
                      </div>
                      <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                        <Download size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── COMMUNICATIE ── */}
          {activeTab === 'communicatie' && (
            <div className="space-y-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Berichtengeschiedenis</p>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex gap-3 ${msg.role === 'opdrachtgever' ? 'flex-row-reverse' : ''}`}>
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                      <User size={14} className="text-slate-500" />
                    </div>
                    <div className={`max-w-sm rounded-xl px-4 py-3 ${msg.role === 'opdrachtgever' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
                      <p className="text-xs font-semibold mb-1 opacity-75">{msg.author}</p>
                      <p className="text-sm leading-relaxed">{msg.message}</p>
                      <p className="text-xs mt-2 opacity-60">{new Date(msg.date).toLocaleString('nl-NL', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <input
                  type="text"
                  placeholder="Stuur een bericht..."
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors">
                  <Send size={15} />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
