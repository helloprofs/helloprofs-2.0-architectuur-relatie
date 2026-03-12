"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  mockDossiers, mockPurchaseOrders, mockRelations, mockProjects,
  mockDossierEvents, mockDossierAttachments, mockDossierMessages, mockDeelopdrachten,
  DossierStatus, EventType
} from "@/lib/mock-data";
import {
  ArrowLeft, ArrowRight, Clock, FileText, FileCheck, Hammer, Receipt,
  Paperclip, MessageSquare, Download, Plus, CheckCircle,
  XCircle, Send, AlertTriangle, File, User
} from "lucide-react";

// ─── Status Badge ────────────────────────────────────────────
function StatusBadge({ status }: { status: DossierStatus }) {
  const map: Record<DossierStatus, { label: string; cls: string }> = {
    'Inkoopopdracht_Verstuurd': { label: 'Inkoopopdracht Verstuurd', cls: 'bg-blue-100 text-blue-700' },
    'Niet_Gereageerd': { label: 'Niet Gereageerd', cls: 'bg-orange-100 text-orange-700' },
    'Inkoopopdracht_Geweigerd': { label: 'Geweigerd', cls: 'bg-red-100 text-red-700' },
    'Aanbod_Verstuurd': { label: 'Aanbod Verstuurd', cls: 'bg-purple-100 text-purple-700' },
    'Aanbod_Geaccepteerd': { label: 'Aanbod Geaccepteerd', cls: 'bg-teal-100 text-teal-700' },
    'Contract_Lopend': { label: 'Contract Lopend', cls: 'bg-emerald-100 text-emerald-700' },
    'Contract_Verlopen': { label: 'Contract Verlopen', cls: 'bg-slate-100 text-slate-500' },
  };
  const { label, cls } = map[status];
  return <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${cls}`}>{label}</span>;
}

// ─── Timeline event icon ──────────────────────────────────────
function EventIcon({ type }: { type: EventType }) {
  const map: Record<EventType, { icon: React.ReactNode; cls: string }> = {
    'inkoopopdracht_verstuurd': { icon: <Send size={14} />, cls: 'bg-blue-100 text-blue-600' },
    'inkoopopdracht_geaccepteerd': { icon: <CheckCircle size={14} />, cls: 'bg-emerald-100 text-emerald-600' },
    'inkoopopdracht_geweigerd': { icon: <XCircle size={14} />, cls: 'bg-red-100 text-red-600' },
    'aanbod_verstuurd': { icon: <FileText size={14} />, cls: 'bg-purple-100 text-purple-600' },
    'aanbod_geaccepteerd': { icon: <CheckCircle size={14} />, cls: 'bg-emerald-100 text-emerald-600' },
    'aanbod_afgewezen': { icon: <XCircle size={14} />, cls: 'bg-red-100 text-red-600' },
    'contract_ondertekend': { icon: <FileCheck size={14} />, cls: 'bg-indigo-100 text-indigo-600' },
    'bijlage_toegevoegd': { icon: <Paperclip size={14} />, cls: 'bg-slate-100 text-slate-600' },
    'bericht_verstuurd': { icon: <MessageSquare size={14} />, cls: 'bg-slate-100 text-slate-600' },
    'controle_vastgelegd': { icon: <AlertTriangle size={14} />, cls: 'bg-amber-100 text-amber-600' },
  };
  const { icon, cls } = map[type];
  return <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${cls}`}>{icon}</div>;
}

export default function DossierDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const dossier = mockDossiers.find(d => d.id === id);
  const po = mockPurchaseOrders.find(p => p.id === dossier?.purchaseOrderId);
  const isRaamopdracht = po?.type === 'Raamopdracht';

  const [activeTab, setActiveTab] = useState(isRaamopdracht ? 'deelopdrachten' : 'tijdlijn');
  const [filterStatus, setFilterStatus] = useState<string>('In_Uitvoering');
  const [chatMessage, setChatMessage] = useState('');
  const [messagesList, setMessagesList] = useState(mockDossierMessages.filter(m => m.dossierId === id));

  // State for Deelopdracht Drawer
  const [selectedDeelopdracht, setSelectedDeelopdracht] = useState<typeof mockDeelopdrachten[0] | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeTab === 'communicatie') {
      scrollToBottom();
    }
  }, [messagesList, activeTab]);

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    const newMessage = {
      id: `msg-${Date.now()}`,
      dossierId: id!,
      author: 'Tim de Ruiter',
      role: 'opdrachtgever' as const,
      message: chatMessage,
      date: new Date().toISOString(),
    };
    setMessagesList([...messagesList, newMessage]);
    setChatMessage('');
  };

  if (!dossier) return (
    <div className="text-center py-20">
      <p className="text-slate-500">Dossier niet gevonden.</p>
      <Link href="/client/dossiers" className="text-blue-600 text-sm mt-2 inline-block">← Terug</Link>
    </div>
  );

  const relation = mockRelations.find(r => r.id === dossier.relationId);
  const project = po ? mockProjects.find(p => p.id === po.projectId) : null;
  const events = mockDossierEvents.filter(e => e.dossierId === id).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const attachments = mockDossierAttachments.filter(a => a.dossierId === id);
  const messages = messagesList;
  const deelopdrachten = mockDeelopdrachten.filter(d => d.dossierId === id);

  const visibleTabs = [
    ...(isRaamopdracht ? [{ id: 'deelopdrachten', label: 'Werkorders', icon: Hammer }] : []),
    { id: 'inkoopopdracht', label: 'Inkoopopdracht', icon: FileText },
    { id: 'aanbod', label: 'Aanbod', icon: FileCheck },
    { id: 'contract', label: 'Contract', icon: FileCheck },
    { id: 'bijlagen', label: 'Bijlagen', icon: Paperclip },
    { id: 'communicatie', label: 'Communicatie', icon: MessageSquare },
    { id: 'tijdlijn', label: 'Tijdlijn', icon: Clock },
  ];

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
          {visibleTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.id
                ? 'text-blue-700 border-blue-600 bg-blue-50/50'
                : 'text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50'
                }`}
            >
              <tab.icon size={15} />
              {tab.label}
              {tab.id === 'deelopdrachten' && deelopdrachten.length > 0 && <span className="ml-1 bg-slate-200 text-slate-600 rounded-full text-xs px-1.5 py-0.5">{deelopdrachten.length}</span>}
              {tab.id === 'bijlagen' && attachments.length > 0 && <span className="ml-1 bg-slate-200 text-slate-600 rounded-full text-xs px-1.5 py-0.5">{attachments.length}</span>}
              {tab.id === 'communicatie' && messages.length > 0 && <span className="ml-1 bg-slate-200 text-slate-600 rounded-full text-xs px-1.5 py-0.5">{messages.length}</span>}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">

          {/* ── DEELOPDRACHTEN / WERKORDERS (ONLY RAAMDORSSIERS) ── */}
          {activeTab === 'deelopdrachten' && isRaamopdracht && (
            <div className="space-y-4">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Deelopdrachten & Werkorders</h3>
                  <p className="text-sm text-slate-500 mt-1">Geregistreerde werkzaamheden die binnen de kaders van dit raamcontract vallen.</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                  <Plus size={15} /> Handmatig Toevoegen
                </button>
              </div>

              {deelopdrachten.length > 0 && (
                <div className="flex items-center gap-2 mb-2 pb-4 border-b border-slate-100 overflow-x-auto">
                  {['In_Uitvoering', 'Herstel_Nodig', 'Opgeleverd', 'Alle'].map(f => (
                    <button
                      key={f}
                      onClick={() => setFilterStatus(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${filterStatus === f
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      {f === 'Alle' ? `Alle (${deelopdrachten.length})` :
                        `${f.replace('_', ' ')} (${deelopdrachten.filter(d => d.status === f).length})`}
                    </button>
                  ))}
                </div>
              )}

              {deelopdrachten.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                  <Hammer size={32} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-600">Nog geen werkorders geregistreerd</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Nieuwe opdrachten vanuit het systeem van de opdrachtgever verschijnen automatisch hier.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {deelopdrachten
                    .filter(werk => filterStatus === 'Alle' || werk.status === filterStatus)
                    .map(werk => (
                      <div 
                        key={werk.id} 
                        onClick={() => setSelectedDeelopdracht(werk)}
                        className="bg-white rounded-2xl border border-black/5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-blue-500/20 transition-all flex flex-col group cursor-pointer"
                      >
                        <div className="p-5 border-b border-black/[0.03]">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{werk.id}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${werk.status === 'In_Uitvoering' ? 'bg-blue-100 text-blue-700' :
                              werk.status === 'Herstel_Nodig' ? 'bg-amber-100 text-amber-700' :
                                werk.status === 'Opgeleverd' ? 'bg-emerald-100 text-emerald-700' :
                                  'bg-slate-100 text-slate-600'
                              }`}>
                              {werk.status.replace('_', ' ')}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-800 leading-tight group-hover:text-blue-700 transition-colors uppercase tracking-tight text-sm">{werk.title}</h4>
                          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{werk.description}</p>
                        </div>

                        <div className="p-5 bg-slate-50/50 flex-1 space-y-3">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Verantwoordelijkheid</p>
                            <p className="text-xs font-medium text-slate-700">{werk.responsibility}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Verwacht Resultaat (SLA)</p>
                            <p className="text-xs font-medium text-slate-700">{werk.expectedResult}</p>
                          </div>
                        </div>

                        <div className="px-5 py-3 border-t border-black/[0.03] flex items-center justify-between bg-white rounded-b-2xl">
                          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                            <Clock size={12} /> {new Date(werk.startDate).toLocaleDateString('nl-NL')}
                          </span>
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600">
                             Details <ArrowRight size={13} />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

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

          {/* ── COMMUNICATIE (CHAT) ── */}
          {activeTab === 'communicatie' && (
            <div className="flex flex-col h-[500px]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">Berichtengeschiedenis</h3>
                  <p className="text-[11px] text-slate-400 font-medium uppercase tracking-tight">Directe lijn met {relation?.name || 'opdrachtnemer'}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4 custom-scrollbar">
                {messages.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-sm text-slate-400 italic">Nog geen berichten gewisseld.</p>
                  </div>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.role === 'opdrachtgever' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] group`}>
                        <div className={`flex items-center gap-2 mb-1 ${msg.role === 'opdrachtgever' ? 'flex-row-reverse' : ''}`}>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{msg.author}</span>
                          <span className="text-[10px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                            {new Date(msg.date).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                          msg.role === 'opdrachtgever' 
                            ? 'bg-blue-600 text-white rounded-tr-none' 
                            : 'bg-slate-100 text-slate-800 rounded-tl-none border border-black/5'
                        }`}>
                          <p>{msg.message}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="pt-4 border-t border-black/[0.03]">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Typ uw bericht..."
                    className="flex-1 px-4 py-3 bg-black/[0.03] border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-500/50 transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={!chatMessage.trim()}
                    className="w-11 h-11 flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all shrink-0"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── SIDE DRAWER (DEELOPDRACHT DETAILS & CHAT) ── */}
      {selectedDeelopdracht && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] transition-opacity duration-300"
            onClick={() => setSelectedDeelopdracht(null)}
          />
          
          {/* Drawer */}
          <div className="fixed top-0 right-0 h-screen w-full max-w-lg bg-white shadow-2xl z-[101] flex flex-col transform transition-transform duration-300 ease-out border-l border-black/5">
            {/* Drawer Header */}
            <div className="p-6 border-b border-black/[0.03] flex items-center justify-between bg-slate-50/50">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{selectedDeelopdracht.id}</span>
                <h3 className="text-lg font-bold text-slate-800 leading-tight uppercase tracking-tight">{selectedDeelopdracht.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedDeelopdracht(null)}
                className="p-2 hover:bg-black/5 rounded-full transition-colors text-slate-400"
              >
                <XCircle size={24} />
              </button>
            </div>

            {/* Drawer Body - Scrollable */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
              {/* Details Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Specificaties & SLA</h4>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    selectedDeelopdracht.status === 'In_Uitvoering' ? 'bg-blue-100 text-blue-700' :
                    selectedDeelopdracht.status === 'Herstel_Nodig' ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {selectedDeelopdracht.status.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-black/5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1">Startdatum</p>
                    <p className="text-xs font-semibold text-slate-800">{new Date(selectedDeelopdracht.startDate).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-black/5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1">Verantwoordelijke</p>
                    <p className="text-xs font-semibold text-slate-800">{selectedDeelopdracht.responsibility}</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-black/5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-2">Omschrijving</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{selectedDeelopdracht.description}</p>
                </div>

                <div className="p-5 rounded-2xl bg-blue-50 border border-blue-500/10">
                  <p className="text-[10px] font-bold text-blue-600/60 uppercase tracking-tight mb-2">Verwacht Resultaat (SLA)</p>
                  <p className="text-sm font-medium text-blue-900 leading-relaxed">{selectedDeelopdracht.expectedResult}</p>
                </div>

                {/* Info Alert instead of chat */}
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-500/10 flex gap-4">
                   <AlertTriangle className="text-amber-500 shrink-0" size={20} />
                   <div>
                     <p className="text-xs font-bold text-amber-900 uppercase tracking-tight mb-1">Let op</p>
                     <p className="text-xs text-amber-800/80 leading-relaxed">
                       Vragen of opmerkingen over deze specifieke werkorder worden centraal afgehandeld via de hoofdpagina van het dossier.
                     </p>
                   </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-6 bg-slate-50/50 border-t border-black/[0.03] flex justify-end">
              <button 
                onClick={() => setSelectedDeelopdracht(null)}
                className="px-6 py-2.5 bg-white border border-black/10 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-all shadow-sm"
              >
                Sluiten
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
