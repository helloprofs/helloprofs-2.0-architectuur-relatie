"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
    'Inkoopopdracht_Verstuurd': { label: 'Inkoopopdracht Verstuurd', cls: 'bg-indigo-100 text-indigo-700' },
    'Niet_Gereageerd': { label: 'Niet Gereageerd', cls: 'bg-orange-100 text-orange-700' },
    'Inkoopopdracht_Geweigerd': { label: 'Geweigerd', cls: 'bg-red-100 text-red-700' },
    'Aanbod_Verstuurd': { label: 'Aanbod Verstuurd', cls: 'bg-purple-100 text-purple-700' },
    'Aanbod_Geaccepteerd': { label: 'Aanbod Geaccepteerd', cls: 'bg-teal-100 text-teal-700' },
    'Contract_Lopend': { label: 'Contract Lopend', cls: 'bg-emerald-100 text-emerald-700' },
    'Contract_Verlopen': { label: 'Contract Verlopen', cls: 'bg-slate-100 text-slate-500' },
  };
  const { label, cls } = map[status] || { label: status, cls: 'bg-slate-100' };
  return <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${cls}`}>{label}</span>;
}

// ─── Timeline event icon ──────────────────────────────────────
function EventIcon({ type }: { type: EventType }) {
  const map: Record<EventType, { icon: React.ReactNode; cls: string }> = {
    'inkoopopdracht_verstuurd': { icon: <Send size={14} />, cls: 'bg-indigo-100 text-indigo-600' },
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

export default function VendorDossierDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  const dossier = mockDossiers.find(d => d.id === id);
  const po = mockPurchaseOrders.find(p => p.id === dossier?.purchaseOrderId);
  const isRaamopdracht = po?.type === 'Raamopdracht';

  const [activeTab, setActiveTab] = useState(tabParam || (isRaamopdracht ? 'deelopdrachten' : 'tijdlijn'));
  const [filterStatus, setFilterStatus] = useState<string>('In_Uitvoering');
  const [chatMessage, setChatMessage] = useState('');
  const [messagesList, setMessagesList] = useState(mockDossierMessages.filter(m => m.dossierId === id));

  // State for Deelopdracht Drawer
  const [selectedDeelopdracht, setSelectedDeelopdracht] = useState<typeof mockDeelopdrachten[0] | null>(null);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [newWorkorder, setNewWorkorder] = useState({
    title: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    responsibility: 'Opdrachtnemer (Volledig)',
    expectedResult: '',
    location: ''
  });

  const [localDeelopdrachten, setLocalDeelopdrachten] = useState(mockDeelopdrachten.filter(d => d.dossierId === id));

  const handleCreateWorkorder = () => {
    const newItem = {
      id: `DO-${4000 + localDeelopdrachten.length + 1}`,
      dossierId: id!,
      ...newWorkorder,
      status: 'In_Uitvoering' as const,
      historyCount: 0
    };
    setLocalDeelopdrachten([newItem, ...localDeelopdrachten]);
    setIsCreateDrawerOpen(false);
    setNewWorkorder({
      title: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      responsibility: 'Opdrachtnemer (Volledig)',
      expectedResult: '',
      location: ''
    });
  };

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
      author: 'Marc de Vriend',
      role: 'opdrachtnemer' as const,
      message: chatMessage,
      date: new Date().toISOString(),
    };
    setMessagesList([...messagesList, newMessage]);
    setChatMessage('');
  };

  if (!dossier) return (
    <div className="text-center py-20">
      <p className="text-slate-500">Dossier niet gevonden.</p>
      <Link href="/vendor/dossiers" className="text-indigo-600 text-sm mt-2 inline-block">← Terug</Link>
    </div>
  );

  const relation = mockRelations.find(r => r.id === dossier.relationId);
  const project = po ? mockProjects.find(p => p.id === po.projectId) : null;
  const events = mockDossierEvents.filter(e => e.dossierId === id).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const attachments = mockDossierAttachments.filter(a => a.dossierId === id);
  const messages = messagesList;
  const deelopdrachten = localDeelopdrachten;

  const visibleTabs = [
    ...(isRaamopdracht ? [{ id: 'deelopdrachten', label: 'Deelopdrachten', icon: Hammer }] : []),
    { id: 'inkoopopdracht', label: 'Inkoopopdracht', icon: FileText },
    { id: 'aanbod', label: 'Mijn Aanbod', icon: FileCheck },
    { id: 'contract', label: 'Contract', icon: FileCheck },
    { id: 'bijlagen', label: 'Bijlagen', icon: Paperclip },
    { id: 'communicatie', label: 'Communicatie', icon: MessageSquare },
    { id: 'tijdlijn', label: 'Tijdlijn', icon: Clock },
  ];

  return (
    <div className="space-y-6 text-slate-800">
      {/* Breadcrumb */}
      <Link href="/vendor/dossiers" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
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
            <h2 className="text-2xl font-bold text-slate-900">{po?.title || dossier.id}</h2>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
              {project && <span>📁 {project.name}</span>}
              {relation && <span>👤 Klant: {relation.name}</span>}
            </div>
          </div>
          <div className="flex flex-col items-end gap-3 self-center sm:self-start">
            <StatusBadge status={dossier.status} />
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
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 cursor-pointer ${activeTab === tab.id
                ? 'text-indigo-700 border-indigo-600 bg-indigo-50/50'
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

          {/* ── DEELOPDRACHTEN (ONLY RAAMDORSSIERS) ── */}
          {activeTab === 'deelopdrachten' && isRaamopdracht && (
            <div className="space-y-4">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Mijn Deelopdrachten</h3>
                  <p className="text-sm text-slate-500 mt-1">Registratie van uw werkzaamheden binnen dit raamcontract.</p>
                </div>
                <button 
                  onClick={() => setIsCreateDrawerOpen(true)}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                >
                  <Plus size={15} /> Werkzaamheid registreren
                </button>
              </div>

              {deelopdrachten.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                  <Hammer size={32} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-600">Nog geen deelopdrachten geregistreerd</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {deelopdrachten.map(werk => (
                      <div
                        key={werk.id}
                        className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
                      >
                         <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{werk.id}</span>
                            <span className="text-[10px] font-bold text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded">{werk.status.replace('_', ' ')}</span>
                         </div>
                         <h4 className="font-bold text-slate-900 text-sm mb-2">{werk.title}</h4>
                         <p className="text-xs text-slate-500 line-clamp-2">{werk.description}</p>
                         <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 font-medium">{new Date(werk.startDate).toLocaleDateString('nl-NL')}</span>
                            <span className="text-[10px] font-bold text-indigo-600">Details →</span>
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
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Mijn Logboek</p>
              <div className="relative">
                <div className="absolute left-3.5 top-0 bottom-0 w-px bg-slate-200"></div>
                <div className="space-y-4">
                  {events.map(event => (
                    <div key={event.id} className="flex gap-4 relative">
                      <EventIcon type={event.type} />
                      <div className="flex-1 bg-slate-50 rounded-lg border border-slate-100 p-3.5">
                        <p className="text-sm font-medium text-slate-800">{event.description}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                          <span>{new Date(event.date).toLocaleString('nl-NL')}</span>
                          <span>·</span>
                          <span>{event.actor}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── AANBOD ── */}
          {activeTab === 'aanbod' && (
             <div className="space-y-4">
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
                   <h3 className="font-bold text-indigo-900 mb-4">Mijn ingediende aanbod</h3>
                   <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                         <p className="text-xs font-bold text-indigo-500 uppercase">Totaalbedrag</p>
                         <p className="text-2xl font-bold text-indigo-900">€ 13.750,00</p>
                      </div>
                      <div>
                         <p className="text-xs font-bold text-indigo-500 uppercase">Geldig tot</p>
                         <p className="text-lg font-bold text-indigo-900">12 april 2024</p>
                      </div>
                   </div>
                   <div className="p-4 bg-white rounded-lg border border-indigo-200">
                      <p className="text-xs font-bold text-indigo-400 uppercase mb-2">Toelichting</p>
                      <p className="text-sm text-slate-700 leading-relaxed">Hierbij bieden wij de gevraagde werkzaamheden aan. Inclusief alle materialen en reiskosten.</p>
                   </div>
                </div>
             </div>
          )}

          {/* ── COMMUNICATIE (CHAT) ── */}
          {activeTab === 'communicatie' && (
            <div className="flex flex-col h-[500px]">
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4 custom-scrollbar">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.role === 'opdrachtnemer' ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-[80%]">
                      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'opdrachtnemer'
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-slate-100 text-slate-800 rounded-tl-none'
                        }`}>
                        <p>{msg.message}</p>
                      </div>
                      <p className={`text-[10px] text-slate-400 mt-1 ${msg.role === 'opdrachtnemer' ? 'text-right' : ''}`}>
                         {msg.author} · {new Date(msg.date).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Typ uw bericht..."
                    className="flex-1 px-4 py-3 bg-slate-50 border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <button
                    type="submit"
                    className="px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all cursor-pointer"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </div>
          )}

           {/* Placeholder tabs */}
           {(['inkoopopdracht', 'contract', 'bijlagen'].includes(activeTab)) && (
              <div className="text-center py-20 text-slate-400 italic">
                 Inhoud voor {activeTab} is gelijk aan de opdrachtgever view, aangepast voor uw portaal.
              </div>
           )}

        </div>
      </div>
    </div>
  );
}
