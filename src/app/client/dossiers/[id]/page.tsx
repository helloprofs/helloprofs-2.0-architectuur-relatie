"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useDynamicState } from "@/hooks/use-dynamic-state";
import {
  mockRelations,
  mockDossierEvents, mockDossierAttachments, mockDossierMessages, mockDeelopdrachten,
  mockInvoices,
  DossierStatus, EventType, Invoice, InvoiceLine
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
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const { projects, purchaseOrders, dossiers, isLoaded } = useDynamicState();

  const dossier = dossiers.find(d => d.id === id);
  const po = purchaseOrders.find(p => p.id === dossier?.purchaseOrderId);
  const isRaamopdracht = po?.type === 'Raamopdracht';

  const [activeTab, setActiveTab] = useState(tabParam || (isRaamopdracht ? 'deelopdrachten' : 'tijdlijn'));
  const [filterStatus, setFilterStatus] = useState<string>('In_Uitvoering');
  const [chatMessage, setChatMessage] = useState('');
  const [messagesList, setMessagesList] = useState(mockDossierMessages.filter(m => m.dossierId === id));

  const [localEvents, setLocalEvents] = useState(mockDossierEvents.filter(e => e.dossierId === id));
  const [localInvoices, setLocalInvoices] = useState<Invoice[]>(mockInvoices.filter(i => (i as Invoice).dossierId === id));
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isRequestingChanges, setIsRequestingChanges] = useState(false);
  const [changeReason, setChangeReason] = useState("");


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

  const handleCancelWorkorder = (id: string) => {
    if (confirm('Weet u zeker dat u deze werkorder wilt annuleren? Deze actie kan niet ongedaan worden gemaakt in het dossier.')) {
      setLocalDeelopdrachten(prev => prev.map(d => d.id === id ? { ...d, status: 'Geannuleerd' } : d));
      setSelectedDeelopdracht(null);
    }
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
      author: 'Tim de Ruiter',
      role: 'opdrachtgever' as const,
      message: chatMessage,
      date: new Date().toISOString(),
    };
    setMessagesList([...messagesList, newMessage]);
    setChatMessage('');
  };

  const handleApproveInvoice = (invoiceId: string) => {
    const invoice = localInvoices.find(i => i.id === invoiceId);
    if (!invoice) return;

    setLocalInvoices(prev => prev.map(inv => 
      inv.id === invoiceId 
        ? { 
            ...inv, 
            status: 'Factuur_Verstuurd', 
            isConcept: false, 
            logs: [...inv.logs, { date: new Date().toISOString(), action: 'Factuur goedgekeurd', actor: 'Tim de Ruiter' }] 
          }
        : inv
    ));

    const newEvent = {
        id: `ev-${Date.now()}`,
        dossierId: id!,
        type: 'inkoopopdracht_geaccepteerd' as any, 
        description: `Factuur ${invoice.invoiceNumber} goedgekeurd door opdrachtgever`,
        date: new Date().toISOString(),
        actor: 'Tim de Ruiter',
        linkedSection: 'factuur'
    };
    setLocalEvents([newEvent, ...localEvents]);
    setSelectedInvoice(null);
  };

  const handleRequestChanges = (invoiceId: string) => {
    const invoice = localInvoices.find(i => i.id === invoiceId);
    if (!invoice) return;

    if (!isRequestingChanges) {
      setIsRequestingChanges(true);
      return;
    }

    if (!changeReason.trim()) {
      return;
    }

    setLocalInvoices(prev => prev.map(inv => 
      inv.id === invoiceId 
        ? { 
            ...inv, 
            status: 'Herziening_Nodig', 
            logs: [...inv.logs, { date: new Date().toISOString(), action: `Aanpassing gevraagd: ${changeReason}`, actor: 'Tim de Ruiter' }] 
          }
        : inv
    ));

    const newEvent = {
        id: `ev-${Date.now()}`,
        dossierId: id!,
        type: 'inkoopopdracht_geweigerd' as any, 
        description: `Aanpassingen gevraagd voor factuur ${invoice.invoiceNumber}: ${changeReason}`,
        date: new Date().toISOString(),
        actor: 'Tim de Ruiter',
        linkedSection: 'factuur'
    };
    setLocalEvents([newEvent, ...localEvents]);
    setSelectedInvoice(null);
    setIsRequestingChanges(false);
    setChangeReason("");
  };


  const handleExport = () => {
    if (!dossier) return;

    // Build the CSV content
    const sections = [];

    // Header section
    sections.push(['DOSSIER EXPORT - ' + dossier.id]);
    sections.push(['Titel', po?.title || dossier.id]);
    sections.push(['Status', dossier.status]);
    sections.push(['Datum Export', new Date().toLocaleString('nl-NL')]);
    sections.push([]);

    // PO Section
    if (po) {
      sections.push(['INKOOPOPDRACHT DETAILS']);
      sections.push(['PO ID', po.id]);
      sections.push(['Type', po.type]);
      sections.push(['Project', project?.name || po.projectId]);
      sections.push(['Budget', po.budget ? `€${po.budget.toLocaleString('nl-NL')}` : '-']);
      sections.push(['Omschrijving', po.description]);
      sections.push([]);
    }

    // Relation Section
    if (relation) {
      sections.push(['RELATIE DETAILS']);
      sections.push(['Naam', relation.name]);
      sections.push(['Email', relation.email]);
      sections.push([]);
    }

    // Timeline Section
    const events = mockDossierEvents.filter(e => e.dossierId === id);
    if (events.length > 0) {
      sections.push(['TIJDLIJN EVENTS']);
      sections.push(['Datum', 'Type', 'Beschrijving', 'Actor']);
      events.forEach(e => {
        sections.push([
          new Date(e.date).toLocaleString('nl-NL'),
          e.type,
          e.description,
          e.actor
        ]);
      });
      sections.push([]);
    }

    // Chat History
    if (messagesList.length > 0) {
      sections.push(['COMMUNICATIE LOG']);
      sections.push(['Datum', 'Auteur', 'Bericht']);
      messagesList.forEach(m => {
        sections.push([
          new Date(m.date).toLocaleString('nl-NL'),
          m.author,
          m.message.replace(/\n/g, ' ')
        ]);
      });
      sections.push([]);
    }

    // Convert arrays to CSV string
    const csvContent = sections.map(row => row.map(cell => `"${cell || ''}"`).join(',')).join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `dossier_export_${dossier.id}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isLoaded) return <div className="p-8 text-center text-slate-500">Laden...</div>;

  if (!dossier) return (
    <div className="text-center py-20">
      <p className="text-slate-500">Dossier niet gevonden.</p>
      <Link href="/client/dossiers" className="text-blue-600 text-sm mt-2 inline-block">← Terug</Link>
    </div>
  );

  const relation = mockRelations.find(r => r.id === dossier.relationId);
  const project = po ? projects.find(p => p.id === po.projectId) : null;
  const events = [...localEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const attachments = mockDossierAttachments.filter(a => a.dossierId === id);
  const messages = messagesList;
  const deelopdrachten = mockDeelopdrachten.filter(d => d.dossierId === id);

  const visibleTabs = [
    ...(isRaamopdracht ? [{ id: 'deelopdrachten', label: 'Deelopdrachten', icon: Hammer }] : []),
    { id: 'inkoopopdracht', label: 'Inkoopopdracht', icon: FileText },
    { id: 'aanbod', label: 'Aanbod', icon: FileCheck },
    { id: 'contract', label: 'Contract', icon: FileCheck },
    { id: 'bijlagen', label: 'Bijlagen', icon: Paperclip },
    { id: 'communicatie', label: 'Communicatie', icon: MessageSquare },
    { id: 'tijdlijn', label: 'Tijdlijn', icon: Clock },
    { id: 'factuur', label: 'Factuur', icon: Receipt },
  ];

  const invoices = localInvoices;


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
          <div className="flex flex-col items-end gap-3 self-center sm:self-start">
            <StatusBadge status={dossier.status} />
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
            >
              <Download size={16} /> Exporteren
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
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 cursor-pointer ${activeTab === tab.id
                ? 'text-blue-700 border-blue-600 bg-blue-50/50'
                : 'text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50'
                }`}
            >
              <tab.icon size={15} />
              {tab.label}
              {tab.id === 'deelopdrachten' && deelopdrachten.length > 0 && <span className="ml-1 bg-slate-200 text-slate-600 rounded-full text-xs px-1.5 py-0.5">{deelopdrachten.length}</span>}
              {tab.id === 'bijlagen' && attachments.length > 0 && <span className="ml-1 bg-slate-200 text-slate-600 rounded-full text-xs px-1.5 py-0.5">{attachments.length}</span>}
              {tab.id === 'communicatie' && messages.length > 0 && <span className="ml-1 bg-slate-200 text-slate-600 rounded-full text-xs px-1.5 py-0.5">{messages.length}</span>}
              {tab.id === 'factuur' && invoices.length > 0 && <span className="ml-1 bg-slate-200 text-slate-600 rounded-full text-xs px-1.5 py-0.5">{invoices.length}</span>}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">

          {/* ── FACTUUR ── */}
          {activeTab === 'factuur' && (
            <div className="space-y-6">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Facturatie</h3>
                  <p className="text-sm text-slate-500 mt-1">Overzicht van alle financiële vastleggingen binnen dit dossier.</p>
                </div>
              </div>

              {invoices.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                  <Receipt size={32} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-600">Nog geen facturen beschikbaar</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Zodra de opdrachtnemer een (concept)factuur indient, verschijnt deze hier.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {invoices.map((invoice: Invoice) => {
                    const subtotal = invoice.lines.reduce((acc: number, line: InvoiceLine) => acc + (line.quantity * line.rate), 0);
                    const vat = invoice.lines.reduce((acc: number, line: InvoiceLine) => acc + (line.quantity * line.rate * (line.vatPercentage / 100)), 0);
                    const total = subtotal + vat;

                    return (
                      <div key={invoice.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-5 flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${
                              invoice.status === 'Betaald' ? 'bg-emerald-50 text-emerald-600' : 
                              invoice.status === 'Concept_Verstuurd' ? 'bg-amber-50 text-amber-600' : 
                              invoice.status === 'Herziening_Nodig' ? 'bg-red-50 text-red-600' :
                              'bg-indigo-50 text-indigo-600'
                            }`}>
                              <Receipt size={24} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-mono font-bold text-slate-400">{invoice.id}</span>
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                    invoice.status === 'Betaald' ? 'bg-emerald-100 text-emerald-700' :
                                    invoice.status === 'Concept_Verstuurd' ? 'bg-amber-100 text-amber-700' :
                                      invoice.status === 'Herziening_Nodig' ? 'bg-red-100 text-red-700' :
                                        'bg-indigo-100 text-indigo-700'
                                  }`}>
                                    {invoice.status === 'Factuur_Verstuurd' ? 'Factuur ontvangen' :
                                     invoice.status === 'Concept_Verstuurd' ? 'Controle gevraagd' :
                                      invoice.status === 'Herziening_Nodig' ? 'Aanpassing gevraagd' :
                                        invoice.status.replace('_', ' ')}
                                  </span>
                                </div>
                                <h4 className="font-bold text-slate-800">{invoice.description}</h4>
                                <p className="text-xs text-slate-500 mt-1">Factuurdatum: {new Date(invoice.date).toLocaleDateString('nl-NL')}</p>
                            </div>
                          </div>
                          <div className="text-right">
                             <p className="text-xl font-bold text-slate-900">€{total.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</p>
                             <p className="text-xs text-slate-400 mt-0.5">incl. BTW (Excl. €{subtotal.toLocaleString('nl-NL', { minimumFractionDigits: 2 })})</p>
                             <div className="mt-3 flex gap-2 justify-end">
                                {invoice.status === 'Concept_Verstuurd' && (
                                  <button 
                                    onClick={() => setSelectedInvoice(invoice)}
                                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                                  >
                                    Controleren
                                  </button>
                                )}
                                <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer">
                                  <Download size={14} /> PDF
                                </button>
                             </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* ── INVOICE REVIEW MODAL (CLIENT) ── */}
          {selectedInvoice && (
            <>
              <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200]" onClick={() => { setSelectedInvoice(null); setIsRequestingChanges(false); setChangeReason(""); }} />
              <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-[201] overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-blue-50/50">
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{selectedInvoice.status === 'Concept_Verstuurd' ? 'Controle gevraagd' : 'Factuur Details'}</span>
                    <h3 className="text-xl font-bold text-slate-900">{selectedInvoice.id} - {selectedInvoice.description}</h3>
                  </div>
                  <button onClick={() => { setSelectedInvoice(null); setIsRequestingChanges(false); setChangeReason(""); }} className="text-slate-400 hover:text-slate-600 cursor-pointer"><XCircle size={24} /></button>
                </div>
                
                <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                   {isRequestingChanges ? (
                     <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">

                       <div className="space-y-1.5">
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reden voor aanpassing</label>
                         <textarea 
                           autoFocus
                           rows={6}
                           placeholder="Bijv. Het uurtarief wijkt af van de gemaakte afspraken..."
                           className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                           value={changeReason}
                           onChange={(e) => setChangeReason(e.target.value)}
                         />
                       </div>
                     </div>
                   ) : (
                     <>
                        <div className="grid grid-cols-2 gap-8 text-sm">
                           <div className="space-y-1">
                              <p className="text-[10px] font-bold text-slate-400 uppercase">Factuurdatum</p>
                              <p className="font-medium">{new Date(selectedInvoice.date).toLocaleDateString('nl-NL')}</p>
                           </div>
                           <div className="space-y-1 text-right">
                              <p className="text-[10px] font-bold text-slate-400 uppercase">Huidige Status</p>
                              <p className={`text-xs font-bold ${
                                selectedInvoice.status === 'Concept_Verstuurd' ? 'text-amber-600' :
                                selectedInvoice.status === 'Herziening_Nodig' ? 'text-red-600' :
                                'text-indigo-600'
                              }`}>
                                {selectedInvoice.status === 'Factuur_Verstuurd' ? 'Factuur ontvangen' :
                                 selectedInvoice.status === 'Concept_Verstuurd' ? 'Controle gevraagd' :
                                 selectedInvoice.status === 'Herziening_Nodig' ? 'Aanpassing gevraagd' :
                                 selectedInvoice.status.replace('_', ' ')}
                              </p>
                           </div>
                        </div>

                        <table className="w-full text-left text-sm">
                           <thead className="text-[10px] font-bold text-slate-400 uppercase border-b border-slate-100">
                              <tr>
                                 <th className="pb-2">Omschrijving</th>
                                 <th className="pb-2 text-right">Aantal</th>
                                 <th className="pb-2 text-right">Tarief</th>
                                 <th className="pb-2 text-right">Totaal</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-50">
                              {selectedInvoice.lines.map((line, idx) => (
                                <tr key={idx}>
                                   <td className="py-3 text-slate-700">{line.description}</td>
                                   <td className="py-3 text-right">{line.quantity}</td>
                                   <td className="py-3 text-right">€{line.rate.toLocaleString('nl-NL')}</td>
                                   <td className="py-3 text-right font-bold">€{(line.quantity * line.rate).toLocaleString('nl-NL')}</td>
                                </tr>
                              ))}
                           </tbody>
                        </table>

                        <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                           <div className="flex justify-between text-slate-500 text-xs">
                              <span>Subtotaal (Excl. BTW)</span>
                              <span>€{selectedInvoice.lines.reduce((a, b: any) => a + (b.quantity * b.rate), 0).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
                           </div>
                           <div className="flex justify-between text-slate-500 text-xs">
                              <span>BTW (21%)</span>
                              <span>€{(selectedInvoice.lines.reduce((a, b: any) => a + (b.quantity * b.rate), 0) * 0.21).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
                           </div>
                           <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-2">
                              <span>Totaalbedrag</span>
                              <span>€{(selectedInvoice.lines.reduce((a, b: any) => a + (b.quantity * b.rate), 0) * 1.21).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
                           </div>
                        </div>

                        <div className="space-y-4">
                           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Logboek & Historie</label>
                           <div className="space-y-2">
                              {selectedInvoice.logs.map((log, idx) => (
                                <div key={idx} className="flex gap-3 text-xs p-2 bg-slate-50 rounded-lg">
                                   <span className="font-mono text-slate-400">{new Date(log.date).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}</span>
                                   <span className="font-bold text-slate-700">{log.action}</span>
                                   <span className="text-slate-400 ml-auto">{log.actor}</span>
                                </div>
                              ))}
                           </div>
                        </div>
                     </>
                   )}
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                   {isRequestingChanges ? (
                     <>
                       <button 
                         onClick={() => { setIsRequestingChanges(false); setChangeReason(""); }}
                         className="px-6 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-white transition-all cursor-pointer"
                       >
                         Annuleren
                       </button>
                       <button 
                         onClick={() => handleRequestChanges(selectedInvoice.id)}
                         disabled={!changeReason.trim()}
                         className={`flex-1 px-6 py-3 rounded-xl text-sm font-bold shadow-lg transition-all cursor-pointer border-none ${
                           !changeReason.trim() ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                         }`}
                       >
                         Bevestigen
                       </button>
                     </>
                   ) : (
                     <>
                       <button onClick={() => { setSelectedInvoice(null); setIsRequestingChanges(false); setChangeReason(""); }} className="px-6 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-white transition-all cursor-pointer">Sluiten</button>
                       {selectedInvoice.status === 'Concept_Verstuurd' && (
                          <div className="flex-1 flex gap-3">
                            <button 
                              onClick={() => handleRequestChanges(selectedInvoice.id)}
                              className="flex-1 px-6 py-3 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-sm font-bold transition-all cursor-pointer"
                            >
                              Aanpassing vragen
                            </button>
                            <button 
                              onClick={() => handleApproveInvoice(selectedInvoice.id)}
                              className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all cursor-pointer border-none"
                            >
                              Accorderen
                            </button>
                          </div>
                        )}
                     </>
                   )}
                </div>
              </div>
            </>
          )}

          {/* ── DEELOPDRACHTEN / WERKORDERS (ONLY RAAMDORSSIERS) ── */}
          {activeTab === 'deelopdrachten' && isRaamopdracht && (
            <div className="space-y-4">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Deelopdrachten</h3>
                  <p className="text-sm text-slate-500 mt-1">Geregistreerde werkzaamheden die binnen de kaders van dit raamcontract vallen.</p>
                </div>
                <button 
                  onClick={() => setIsCreateDrawerOpen(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                >
                  <Plus size={15} /> Deelopdracht toevoegen
                </button>
              </div>

              {localDeelopdrachten.length > 0 && (
                <div className="flex items-center gap-2 mb-2 pb-4 border-b border-slate-100 overflow-x-auto">
                  {['In_Uitvoering', 'Herstel_Nodig', 'Opgeleverd', 'Geannuleerd', 'Alle'].map(f => (
                    <button
                      key={f}
                      onClick={() => setFilterStatus(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${filterStatus === f
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      {f === 'Alle' ? `Alle (${localDeelopdrachten.length})` :
                        `${f.replace('_', ' ')} (${localDeelopdrachten.filter(d => d.status === f).length})`}
                    </button>
                  ))}
                </div>
              )}

              {localDeelopdrachten.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                  <Hammer size={32} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-600">Nog geen deelopdrachten geregistreerd</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Nieuwe opdrachten vanuit het systeem van de opdrachtgever verschijnen automatisch hier.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {localDeelopdrachten
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
                                  werk.status === 'Geannuleerd' ? 'bg-slate-100 text-slate-500 line-through' :
                                    'bg-slate-100 text-slate-600'
                              }`}>
                              {werk.status.replace('_', ' ')}
                            </span>
                          </div>
                          <h4 className={`font-bold text-slate-800 leading-tight group-hover:text-blue-700 transition-colors uppercase tracking-tight text-sm ${werk.status === 'Geannuleerd' ? 'text-slate-400' : ''}`}>{werk.title}</h4>
                          <p className={`text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed ${werk.status === 'Geannuleerd' ? 'text-slate-300' : ''}`}>{werk.description}</p>
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
                                className="text-xs text-blue-600 hover:underline flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
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
                    <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-2.5 text-sm font-semibold transition-colors cursor-pointer">
                      Aanbod Accepteren
                    </button>
                    <button className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg py-2.5 text-sm font-semibold transition-colors cursor-pointer">
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
                <button className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 border border-blue-200 rounded-lg px-3 py-1.5 hover:bg-blue-50 transition-colors cursor-pointer">
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
                      <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
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
                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'opdrachtgever'
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
                    className="w-11 h-11 flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all shrink-0 cursor-pointer"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── SIDE DRAWER (CREATE WORKORDER) ── */}
      {isCreateDrawerOpen && (
        <>
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] transition-opacity"
            onClick={() => setIsCreateDrawerOpen(false)}
          />
          <div className="fixed top-0 right-0 h-screen w-full max-w-lg bg-white shadow-2xl z-[101] flex flex-col border-l border-black/5 animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-black/[0.03] flex items-center justify-between bg-slate-50/50">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Nieuwe Deelopdracht</span>
                <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Deelopdracht toevoegen</h3>
              </div>
              <button onClick={() => setIsCreateDrawerOpen(false)} className="p-2 hover:bg-black/5 rounded-full text-slate-400 cursor-pointer">
                <XCircle size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Titel van de deelopdracht</label>
                <input 
                  type="text"
                  placeholder="Bijv. Kozijnplaatsing Sector A"
                  className="w-full px-4 py-3 bg-slate-50 border border-black/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-500/50 transition-all font-medium"
                  value={newWorkorder.title}
                  onChange={e => setNewWorkorder({...newWorkorder, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Startdatum</label>
                  <input 
                    type="date"
                    className="w-full px-4 py-3 bg-slate-50 border border-black/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-500/50 transition-all font-medium"
                    value={newWorkorder.startDate}
                    onChange={e => setNewWorkorder({...newWorkorder, startDate: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Verantwoordelijke</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border border-black/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-500/50 transition-all font-medium appearance-none"
                    value={newWorkorder.responsibility}
                    onChange={e => setNewWorkorder({...newWorkorder, responsibility: e.target.value})}
                  >
                    <option>Opdrachtnemer (Volledig)</option>
                    <option>Opdrachtgever (Ondersteunend)</option>
                    <option>Gezamenlijk</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Omschrijving werkzaamheden</label>
                <textarea 
                  rows={4}
                  placeholder="Beschrijf hier de specifieke taken..."
                  className="w-full px-4 py-3 bg-slate-50 border border-black/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-500/50 transition-all font-medium resize-none"
                  value={newWorkorder.description}
                  onChange={e => setNewWorkorder({...newWorkorder, description: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Locatie (Adres)</label>
                <input 
                  type="text"
                  placeholder="Bijv. Stationsplein 1, Utrecht"
                  className="w-full px-4 py-3 bg-slate-50 border border-black/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-500/50 transition-all font-medium"
                  value={newWorkorder.location}
                  onChange={e => setNewWorkorder({...newWorkorder, location: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Verwacht Resultaat (SLA)</label>
                <textarea 
                  rows={3}
                  placeholder="Wat moet er bij oplevering geconstateerd worden?"
                  className="w-full px-4 py-3 bg-blue-50/30 border border-blue-500/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-500/50 transition-all font-medium resize-none text-blue-900"
                  value={newWorkorder.expectedResult}
                  onChange={e => setNewWorkorder({...newWorkorder, expectedResult: e.target.value})}
                />
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-black/[0.03] flex justify-between gap-3 font-semibold">
              <button 
                onClick={() => setIsCreateDrawerOpen(false)}
                className="px-6 py-3 bg-white border border-black/10 hover:bg-slate-100 text-slate-600 rounded-xl text-sm transition-all cursor-pointer"
              >
                Annuleren
              </button>
              <button 
                onClick={handleCreateWorkorder}
                disabled={!newWorkorder.title || !newWorkorder.description}
                className="px-10 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
              >
                Opslaan
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── SIDE DRAWER (DEELOPDRACHT DETAILS) ── */}
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
                className="p-2 hover:bg-black/5 rounded-full transition-colors text-slate-400 cursor-pointer"
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
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${selectedDeelopdracht.status === 'In_Uitvoering' ? 'bg-blue-100 text-blue-700' :
                      selectedDeelopdracht.status === 'Herstel_Nodig' ? 'bg-amber-100 text-amber-700' :
                        selectedDeelopdracht.status === 'Opgeleverd' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-slate-100 text-slate-500'
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

                {/* Location & Maps Section */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Locatie & Werkplek</h4>
                  <div className="p-5 rounded-2xl bg-slate-50 border border-black/5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1">Adres</p>
                         <p className="text-sm font-semibold text-slate-800">{selectedDeelopdracht.location || 'Geen specifiek adres opgegeven'}</p>
                      </div>
                      {selectedDeelopdracht.location && (
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedDeelopdracht.location)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-white border border-black/10 hover:bg-slate-50 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                        >
                          Open in Maps <ArrowRight size={10} />
                        </a>
                      )}
                    </div>
                    
                    {/* Real Google Maps Embed */}
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-black/5 bg-slate-100 group">
                      {selectedDeelopdracht.location ? (
                        <iframe
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          loading="lazy"
                          allowFullScreen
                          referrerPolicy="no-referrer-when-downgrade"
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedDeelopdracht.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                        ></iframe>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                          <AlertTriangle size={24} className="mb-2" />
                          <p className="text-[10px] uppercase font-bold tracking-wider">Geen locatie beschikbaar</p>
                        </div>
                      )}
                    </div>
                  </div>
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
            <div className="p-6 bg-slate-50/50 border-t border-black/[0.03] flex justify-end gap-3 font-semibold">
              {selectedDeelopdracht.status !== 'Geannuleerd' && selectedDeelopdracht.status !== 'Opgeleverd' && (
                <button
                  onClick={() => handleCancelWorkorder(selectedDeelopdracht.id)}
                  className="px-6 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <XCircle size={14} /> Deelopdracht Annuleren
                </button>
              )}
              {selectedDeelopdracht.status === 'Geannuleerd' && (
                 <div className="flex-1 flex items-center gap-2 text-red-600 text-xs font-bold uppercase tracking-tight italic">
                    <AlertTriangle size={14} /> Deze deelopdracht is geannuleerd
                 </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
