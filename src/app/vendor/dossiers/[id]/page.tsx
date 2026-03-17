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
  Paperclip, MessageSquare, Download, Plus, CheckCircle, CheckCircle2,
  XCircle, Send, AlertTriangle, File, User, Trash2, MoreVertical, History,
  Building, Euro, Calendar, AlertCircle
} from 'lucide-react';

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
  const { projects, purchaseOrders, dossiers, isLoaded } = useDynamicState();

  const dossier = dossiers.find(d => d.id === id);
  const po = purchaseOrders.find(p => p.id === dossier?.purchaseOrderId);
  const isRaamopdracht = po?.type === 'Raamopdracht';

  const [activeTab, setActiveTab] = useState(tabParam || (isRaamopdracht ? 'deelopdrachten' : 'tijdlijn'));
  const [filterStatus, setFilterStatus] = useState<string>('In_Uitvoering');
  const [chatMessage, setChatMessage] = useState('');
  const [messagesList, setMessagesList] = useState(mockDossierMessages.filter(m => m.dossierId === id));

  const [localInvoices, setLocalInvoices] = useState<Invoice[]>(mockInvoices.filter(i => (i as Invoice).dossierId === id));
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    if (selectedInvoice && selectedInvoice.isConcept) {
      setEditingInvoice(JSON.parse(JSON.stringify(selectedInvoice)));
    } else {
      setEditingInvoice(null);
    }
  }, [selectedInvoice]);

  const handleUpdateEditingInvoice = (field: keyof Invoice, value: any) => {
    if (!editingInvoice) return;
    setEditingInvoice({ ...editingInvoice, [field]: value });
  };

  const handleUpdateEditingLines = (index: number, field: keyof InvoiceLine, value: any) => {
    if (!editingInvoice) return;
    const newLines = [...editingInvoice.lines];
    newLines[index] = { ...newLines[index], [field]: value };
    setEditingInvoice({ ...editingInvoice, lines: newLines });
  };

  const handleAddEditingLine = () => {
    if (!editingInvoice) return;
    setEditingInvoice({
      ...editingInvoice,
      lines: [...editingInvoice.lines, { description: '', quantity: 1, rate: 0, vatPercentage: 21 }]
    });
  };

  const handleRemoveEditingLine = (index: number) => {
    if (!editingInvoice) return;
    const newLines = editingInvoice.lines.filter((_, i) => i !== index);
    setEditingInvoice({ ...editingInvoice, lines: newLines });
  };

  const handleSaveInvoiceEdits = () => {
    if (!editingInvoice) return;
    setLocalInvoices(prev => prev.map(inv => inv.id === editingInvoice.id ? editingInvoice : inv));
    setSelectedInvoice(editingInvoice);
    alert('Wijzigingen opgeslagen!');
  };

  // State for Invoice Drawer
  const [isInvoiceDrawerOpen, setIsInvoiceDrawerOpen] = useState(false);
  const [invoiceStep, setInvoiceStep] = useState<'type' | 'form' | 'preview' | 'success'>('type');
  const [invoiceType, setInvoiceType] = useState<'direct' | 'concept'>('direct');
  const [newInvoice, setNewInvoice] = useState({
    invoiceNumber: '',
    description: 'Reparatie intercom systeem',
    paymentTerm: '30 dagen',
    bankAccount: 'NL99 INGB 0987 6543 21',
    lines: [{ description: '', quantity: 1, rate: 0, vatPercentage: 21 }]
  });

  // Effect to generate invoice number when drawer opens
  useEffect(() => {
    if (isInvoiceDrawerOpen && invoiceStep === 'type') {
      setNewInvoice(prev => ({
        ...prev,
        invoiceNumber: `INV-${5000 + localInvoices.length + 1}`
      }));
    }
  }, [isInvoiceDrawerOpen, invoiceStep, localInvoices.length]);




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

  const handleCreateInvoice = (isDraft: boolean) => {
    const newItem: Invoice = {
      id: newInvoice.invoiceNumber,
      dossierId: id!,
      relationId: dossier?.relationId || '',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: isDraft ? 'Concept_Verstuurd' : 'Factuur_Verstuurd',
      description: newInvoice.description,
      isConcept: isDraft,
      invoiceNumber: newInvoice.invoiceNumber || `2025-${4000 + localInvoices.length + 1}`,
      lines: newInvoice.lines,
      bankAccount: newInvoice.bankAccount,
      paymentTerm: newInvoice.paymentTerm,
      logs: [
        { 
          date: new Date().toISOString(), 
          action: isDraft ? 'Concept verstuurd ter beoordeling' : 'Factuur verstuurd', 
          actor: 'Marc de Vriend' 
        }
      ]
    };
    setLocalInvoices([newItem, ...localInvoices]);
    setInvoiceStep('success');
  };

  const handleFinalizeInvoice = (invoiceId: string) => {
    // If we're finalizing the currently edited invoice, use the edited data
    const finalizedData = editingInvoice && editingInvoice.id === invoiceId 
      ? { ...editingInvoice, status: 'Factuur_Verstuurd' as const, isConcept: false }
      : null;

    setLocalInvoices(prev => prev.map(inv => 
      inv.id === invoiceId 
        ? { 
            ...(finalizedData || inv), 
            status: 'Factuur_Verstuurd' as const, 
            isConcept: false, 
            logs: [...(finalizedData?.logs || inv.logs), { date: new Date().toISOString(), action: 'Factuur verstuurd', actor: 'Marc de Vriend' }] 
          }
        : inv
    ));
    setSelectedInvoice(null);
    alert('Factuur verstuurd!');
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

  if (!isLoaded) return <div className="p-8 text-center text-slate-500">Laden...</div>;

  if (!dossier) return (
    <div className="text-center py-20">
      <p className="text-slate-500">Dossier niet gevonden.</p>
      <Link href="/vendor/dossiers" className="text-indigo-600 text-sm mt-2 inline-block">← Terug</Link>
    </div>
  );

  const relation = mockRelations.find(r => r.id === dossier.relationId);
  const project = po ? projects.find(p => p.id === po.projectId) : null;
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
    { id: 'factuur', label: 'Factuur', icon: Receipt },
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
              {tab.id === 'factuur' && localInvoices.length > 0 && <span className="ml-1 bg-slate-200 text-slate-600 rounded-full text-xs px-1.5 py-0.5">{localInvoices.length}</span>}
              {tab.id === 'deelopdrachten' && deelopdrachten.length > 0 && <span className="ml-1 bg-slate-200 text-slate-600 rounded-full text-xs px-1.5 py-0.5">{deelopdrachten.length}</span>}
              {tab.id === 'bijlagen' && attachments.length > 0 && <span className="ml-1 bg-slate-200 text-slate-600 rounded-full text-xs px-1.5 py-0.5">{attachments.length}</span>}
              {tab.id === 'communicatie' && messages.length > 0 && <span className="ml-1 bg-slate-200 text-slate-600 rounded-full text-xs px-1.5 py-0.5">{messages.length}</span>}

            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">

          {/* ── FACTUUR ── */}
          {activeTab === 'factuur' && (
            <div className="space-y-6">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Mijn Facturen</h3>
                  <p className="text-sm text-slate-500 mt-1">Beheer uw facturatie en financiële afhandeling voor dit dossier.</p>
                </div>
                <button
                  onClick={() => {
                    setInvoiceStep('type');
                    setIsInvoiceDrawerOpen(true);
                  }}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                >
                  <Plus size={15} /> Nieuwe factuur
                </button>
              </div>

              {localInvoices.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                  <Receipt size={32} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-600">Nog geen facturen aangemaakt</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">U kunt direct een factuur opstellen of een concept ter controle sturen.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {localInvoices.map((invoice: Invoice) => {
                    const subtotal = invoice.lines.reduce((acc: number, line: InvoiceLine) => acc + (line.quantity * line.rate), 0);
                    return (
                      <div key={invoice.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:border-indigo-300 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${invoice.status === 'Betaald' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                            <Receipt size={20} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[10px] font-mono font-bold text-slate-400">{invoice.id}</span>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${invoice.status === 'Betaald' ? 'bg-emerald-100 text-emerald-700' :
                                  invoice.status === 'Concept_Verstuurd' ? 'bg-amber-100 text-amber-700' :
                                    invoice.status === 'Herziening_Nodig' ? 'bg-red-100 text-red-700' :
                                      'bg-indigo-100 text-indigo-700'
                                }`}>
                                {invoice.status.replace('_', ' ')}
                              </span>
                            </div>
                            <h4 className="font-bold text-slate-900 text-sm">{invoice.description}</h4>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-6">
                          <div>
                            <p className="text-sm font-bold text-slate-900">€{subtotal.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</p>
                            <p className="text-[10px] text-slate-400">Excl. BTW</p>
                          </div>
                          <div className="flex items-center gap-2">
                             {invoice.status === 'Herziening_Nodig' && (
                               <button 
                                 onClick={() => setSelectedInvoice(invoice)}
                                 className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                               >
                                 Herzien
                               </button>
                             )}
                             <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                               <Download size={16} />
                             </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── INVOICE DETAIL / REVIEW MODAL ── */}
          {selectedInvoice && (
            <>
              <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200]" onClick={() => setSelectedInvoice(null)} />
              <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-[201] overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">{selectedInvoice.isConcept ? 'Factuur Herziening' : 'Factuur Details'}</span>
                    <h3 className="text-xl font-bold text-slate-900">{selectedInvoice.id} - {selectedInvoice.description}</h3>
                  </div>
                  <button onClick={() => setSelectedInvoice(null)} className="text-slate-400 hover:text-slate-600"><XCircle size={24} /></button>
                </div>
                
                <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                   {editingInvoice ? (
                     <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Factuurnummer</label>
                              <input 
                                type="text"
                                value={editingInvoice.invoiceNumber}
                                onChange={(e) => handleUpdateEditingInvoice('invoiceNumber', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                              />
                           </div>
                           <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Omschrijving</label>
                              <input 
                                type="text"
                                value={editingInvoice.description}
                                onChange={(e) => handleUpdateEditingInvoice('description', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                              />
                           </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Factuurregels</label>
                                <button 
                                  onClick={handleAddEditingLine}
                                  className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-700"
                                >
                                  <Plus size={14} /> Regel toevoegen
                                </button>
                            </div>
                            <div className="space-y-3">
                                {editingInvoice.lines.map((line, idx) => (
                                  <div key={idx} className="flex gap-3 items-end group">
                                     <div className="flex-1 space-y-1">
                                        <input 
                                          type="text"
                                          placeholder="Omschrijving"
                                          value={line.description}
                                          onChange={(e) => handleUpdateEditingLines(idx, 'description', e.target.value)}
                                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                        />
                                     </div>
                                     <div className="w-20 space-y-1">
                                        <input 
                                          type="number"
                                          placeholder="Aantal"
                                          value={line.quantity}
                                          onChange={(e) => handleUpdateEditingLines(idx, 'quantity', parseFloat(e.target.value) || 0)}
                                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                        />
                                     </div>
                                     <div className="w-28 space-y-1">
                                        <input 
                                          type="number"
                                          placeholder="Tarief"
                                          value={line.rate}
                                          onChange={(e) => handleUpdateEditingLines(idx, 'rate', parseFloat(e.target.value) || 0)}
                                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                        />
                                     </div>
                                     <button 
                                       onClick={() => handleRemoveEditingLine(idx)}
                                       className="p-2 text-slate-300 hover:text-red-500 mb-1"
                                     >
                                        <Trash2 size={16} />
                                     </button>
                                  </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                           <div className="flex justify-between text-slate-500 text-xs">
                              <span>Subtotaal (Excl. BTW)</span>
                              <span>€{editingInvoice.lines.reduce((a, b) => a + (b.quantity * b.rate), 0).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
                           </div>
                           <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-2">
                              <span>Totaalbedrag (Incl. 21% BTW)</span>
                              <span>€{(editingInvoice.lines.reduce((a, b: any) => a + (b.quantity * b.rate), 0) * 1.21).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Bankrekening (IBAN)</label>
                              <input 
                                type="text"
                                value={editingInvoice.bankAccount}
                                onChange={(e) => handleUpdateEditingInvoice('bankAccount', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                              />
                           </div>
                           <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Betaaltermijn</label>
                              <select 
                                value={editingInvoice.paymentTerm}
                                onChange={(e) => handleUpdateEditingInvoice('paymentTerm', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none appearance-none"
                              >
                                <option value="14 dagen">14 dagen</option>
                                <option value="30 dagen">30 dagen</option>
                                <option value="60 dagen">60 dagen</option>
                                <option value="Direct">Direct</option>
                              </select>
                           </div>
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
                              <p className="text-[10px] font-bold text-slate-400 uppercase">Vervaldatum</p>
                              <p className="font-medium text-red-600">{new Date(selectedInvoice.dueDate).toLocaleDateString('nl-NL')}</p>
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
                           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Betalingsgegevens</label>
                           <div className="p-3 bg-slate-50 rounded-lg text-xs grid grid-cols-2 gap-4">
                              <div>
                                 <p className="text-[9px] text-slate-400 uppercase">Rekeningnummer</p>
                                 <p className="font-mono font-bold">{selectedInvoice.bankAccount}</p>
                              </div>
                              <div>
                                 <p className="text-[9px] text-slate-400 uppercase">Termijn</p>
                                 <p className="font-bold">{selectedInvoice.paymentTerm}</p>
                              </div>
                           </div>
                        </div>
                     </>
                   )}

                   <div className="space-y-4 pt-4 border-t border-slate-100">
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
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                    <button onClick={() => setSelectedInvoice(null)} className="px-6 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-white transition-all cursor-pointer">Sluiten</button>
                    {selectedInvoice.status === 'Herziening_Nodig' && (
                      <>
                        <button 
                          onClick={handleSaveInvoiceEdits}
                          className="px-6 py-3 bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 rounded-xl text-sm font-bold transition-all cursor-pointer"
                        >
                          Opslaan
                        </button>
                        <button 
                          onClick={() => handleFinalizeInvoice(selectedInvoice.id)}
                          className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
                        >
                          Definitief maken & Verzenden
                        </button>
                      </>
                    )}
                 </div>
              </div>
            </>
          )}

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
      {/* ── SIDE DRAWER (CREATE INVOICE) ── */}
      {isInvoiceDrawerOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]" onClick={() => setIsInvoiceDrawerOpen(false)} />
          <div className="fixed top-0 right-0 h-screen w-full max-w-xl bg-white shadow-2xl z-[101] flex flex-col animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-indigo-50/30">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                  Stap {invoiceStep === 'type' ? '1' : invoiceStep === 'form' ? '2' : invoiceStep === 'preview' ? '3' : '4'} van 4
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {invoiceStep === 'type' ? 'Kies factuurtype' : 
                   invoiceStep === 'form' ? 'Factuurgegevens invullen' : 
                   invoiceStep === 'preview' ? 'Controleer uw factuur' : 'Factuur verzonden!'}
                </h3>
              </div>
              <button onClick={() => setIsInvoiceDrawerOpen(false)} className="text-slate-400 hover:text-slate-600"><XCircle size={24} /></button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              
              {/* STEP 1: TYPE SELECTION */}
              {invoiceStep === 'type' && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Methodiek</label>
                    <div className="grid grid-cols-1 gap-4">
                      <button 
                        onClick={() => setInvoiceType('direct')}
                        className={`p-5 rounded-2xl border-2 text-left transition-all ${invoiceType === 'direct' ? 'border-indigo-600 bg-indigo-50/50 shadow-lg shadow-indigo-500/10' : 'border-slate-100 bg-slate-50 hover:bg-slate-100'}`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center ${invoiceType === 'direct' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                              <Send size={14} />
                           </div>
                           <p className="font-bold text-sm text-slate-900">Directe Factuur</p>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed pl-11">
                          De werkzaamheden zijn afgerond en er is geen tussentijdse controle nodig. De factuur wordt direct verzonden.
                        </p>
                      </button>
                      <button 
                        onClick={() => setInvoiceType('concept')}
                        className={`p-5 rounded-2xl border-2 text-left transition-all ${invoiceType === 'concept' ? 'border-indigo-600 bg-indigo-50/50 shadow-lg shadow-indigo-500/10' : 'border-slate-100 bg-slate-50 hover:bg-slate-100'}`}
                      >
                         <div className="flex items-center gap-3 mb-2">
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center ${invoiceType === 'concept' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                              <Clock size={14} />
                           </div>
                           <p className="font-bold text-sm text-slate-900">Factuur na controle (Concept)</p>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed pl-11">
                          U wilt de factuur eerst laten controleren door de opdrachtgever. Na goedkeuring wordt de factuur pas definitief.
                        </p>
                      </button>
                    </div>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3 italic">
                    <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      Deze werkwijze vervangt in veel gevallen het traditionele werkorderproces voor een snellere afhandeling.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 2: FORM */}
              {invoiceStep === 'form' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Factuurnummer</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono"
                        value={newInvoice.invoiceNumber}
                        onChange={e => setNewInvoice({...newInvoice, invoiceNumber: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Betalingstermijn</label>
                      <select 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
                        value={newInvoice.paymentTerm}
                        onChange={e => setNewInvoice({...newInvoice, paymentTerm: e.target.value})}
                      >
                        <option>14 dagen</option>
                        <option>30 dagen</option>
                        <option>60 dagen</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Omschrijving</label>
                    <input 
                      type="text" 
                      placeholder="Bijv. Werkzaamheden maart 2025"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                      value={newInvoice.description}
                      onChange={e => setNewInvoice({...newInvoice, description: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Bankgegevens (IBAN)</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono"
                      value={newInvoice.bankAccount}
                      onChange={e => setNewInvoice({...newInvoice, bankAccount: e.target.value})}
                    />
                  </div>

                  <div className="space-y-3 pt-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Factuurregels</label>
                      <button 
                         onClick={() => setNewInvoice({...newInvoice, lines: [...newInvoice.lines, { description: '', quantity: 1, rate: 0, vatPercentage: 21 }]})}
                         className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase"
                      >
                        + Regel toevoegen
                      </button>
                    </div>
                    
                    {newInvoice.lines.map((line, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3 relative group">
                        <input 
                          type="text" 
                          placeholder="Omschrijving werkzaamheden"
                          className="w-full bg-transparent border-b border-slate-200 text-sm py-1 focus:border-indigo-500 outline-none"
                          value={line.description}
                          onChange={e => {
                            const newLines = [...newInvoice.lines];
                            newLines[idx].description = e.target.value;
                            setNewInvoice({...newInvoice, lines: newLines});
                          }}
                        />
                        <div className="grid grid-cols-3 gap-4 font-mono">
                          <div>
                            <input 
                              type="number" 
                              className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs"
                              value={line.quantity}
                              onChange={e => {
                                const newLines = [...newInvoice.lines];
                                newLines[idx].quantity = Number(e.target.value);
                                setNewInvoice({...newInvoice, lines: newLines});
                              }}
                            />
                          </div>
                          <div>
                            <input 
                              type="number" 
                              className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs"
                              value={line.rate}
                              onChange={e => {
                                const newLines = [...newInvoice.lines];
                                newLines[idx].rate = Number(e.target.value);
                                setNewInvoice({...newInvoice, lines: newLines});
                              }}
                            />
                          </div>
                          <div className="text-right">
                             <p className="text-xs font-bold py-1">€{(line.quantity * line.rate).toLocaleString('nl-NL')}</p>
                          </div>
                        </div>
                        {newInvoice.lines.length > 1 && (
                          <button 
                            onClick={() => setNewInvoice({...newInvoice, lines: newInvoice.lines.filter((_, i) => i !== idx)})}
                            className="absolute -right-2 -top-2 w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <XCircle size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: PREVIEW */}
              {invoiceStep === 'preview' && (
                <div className="space-y-6">
                   <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-inner space-y-6 scale-[0.98]">
                      {/* Fake Invoice Header */}
                      <div className="flex justify-between items-start border-b border-slate-200 pb-6">
                         <div>
                            <p className="text-lg font-black text-slate-900 tracking-tighter">FACTUUR</p>
                            <p className="text-xs text-slate-500 mt-1">{newInvoice.invoiceNumber}</p>
                         </div>
                         <div className="text-right">
                            <p className="text-xs font-bold text-slate-900 uppercase">Marc de Vriend</p>
                            <p className="text-[10px] text-slate-500">De Specialist BV</p>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <div className="grid grid-cols-2 gap-4 text-[10px]">
                            <p className="text-slate-400 font-bold uppercase">Factuur tot</p>
                            <p className="text-slate-400 font-bold uppercase text-right">Betaalgegevens</p>
                         </div>
                         <div className="grid grid-cols-2 gap-4 text-xs">
                            <p className="font-bold text-slate-800">{relation?.name || 'De Opdrachtgever'}</p>
                            <p className="font-mono text-right">{newInvoice.bankAccount}</p>
                         </div>
                      </div>

                      <table className="w-full text-[11px]">
                         <thead className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                            <tr>
                               <th className="py-2 text-left">Item</th>
                               <th className="py-2 text-right">Aantal</th>
                               <th className="py-2 text-right">Tarief</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-50">
                            {newInvoice.lines.map((line, i) => (
                              <tr key={i}>
                                 <td className="py-2 text-slate-700">{line.description}</td>
                                 <td className="py-2 text-right">{line.quantity}</td>
                                 <td className="py-2 text-right">€{line.rate.toLocaleString('nl-NL')}</td>
                              </tr>
                            ))}
                         </tbody>
                      </table>

                      <div className="pt-6 border-t border-slate-200 space-y-1.5">
                         <div className="flex justify-between text-xs text-slate-500">
                            <span>Subtotaal</span>
                            <span>€{newInvoice.lines.reduce((a, b: any) => a + (b.quantity * b.rate), 0).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
                         </div>
                         <div className="flex justify-between text-xs text-slate-500">
                            <span>BTW (21%)</span>
                            <span>€{(newInvoice.lines.reduce((a, b: any) => a + (b.quantity * b.rate), 0) * 0.21).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
                         </div>
                         <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-100">
                            <span>Totaal</span>
                            <span>€{(newInvoice.lines.reduce((a, b: any) => a + (b.quantity * b.rate), 0) * 1.21).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
                         </div>
                      </div>
                   </div>
                   <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex gap-3 italic">
                    <CheckCircle size={18} className="text-indigo-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-indigo-800 leading-relaxed">
                      Zodra u bevestigt wordt de factuur als PDF gegenereerd en {invoiceType === 'direct' ? 'verzonden naar de opdrachtgever' : 'ter controle aangeboden'}.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 4: SUCCESS */}
              {invoiceStep === 'success' && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                   <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
                      <CheckCircle size={40} />
                   </div>
                   <div>
                      <h4 className="text-2xl font-bold text-slate-900">Gelukt!</h4>
                      <p className="text-sm text-slate-500 mt-2 max-w-sm">
                        {invoiceType === 'concept' ? 'Concept verzonden ter beoordeling' : 'Factuur definitief verzonden'}.
                      </p>
                   </div>
                   <button 
                     onClick={() => {
                        setIsInvoiceDrawerOpen(false);
                        setActiveTab('factuur');
                     }}
                     className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-xl hover:bg-slate-800 transition-all font-semibold cursor-pointer"
                   >
                     Terug naar overzicht
                   </button>
                </div>
              )}

            </div>

            {/* Drawer Footer */}
            {invoiceStep !== 'success' && (
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                <button 
                  onClick={() => {
                    if (invoiceStep === 'type') setIsInvoiceDrawerOpen(false);
                    else if (invoiceStep === 'form') setInvoiceStep('type');
                    else if (invoiceStep === 'preview') setInvoiceStep('form');
                  }} 
                  className="px-6 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-white transition-all cursor-pointer"
                >
                  {invoiceStep === 'type' ? 'Annuleren' : 'Vorige'}
                </button>
                <button 
                  onClick={() => {
                    if (invoiceStep === 'type') setInvoiceStep('form');
                    else if (invoiceStep === 'form') setInvoiceStep('preview');
                    else if (invoiceStep === 'preview') handleCreateInvoice(invoiceType === 'concept');
                  }}
                  disabled={
                    (invoiceStep === 'form' && (!newInvoice.description || newInvoice.lines.some(l => !l.description || l.rate <= 0)))
                  }
                  className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
                >
                  {invoiceStep === 'type' ? 'Doorgaan naar gegevens' : 
                   invoiceStep === 'form' ? 'Naar preview' : 
                   invoiceType === 'direct' ? 'Factuur Verzenden' : 'Concept Indienen'}
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── SIDE DRAWER (CREATE DEELOPDRACHT) ── */}
      {isCreateDrawerOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]" onClick={() => setIsCreateDrawerOpen(false)} />
          <div className="fixed top-0 right-0 h-screen w-full max-w-xl bg-white shadow-2xl z-[101] flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Nieuwe Werkzaamheid</h3>
              <button onClick={() => setIsCreateDrawerOpen(false)} className="text-slate-400 hover:text-slate-600"><XCircle size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Titel</label>
                <input 
                  type="text" 
                  placeholder="Bijv. Project Plan Fase 1"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  value={newWorkorder.title}
                  onChange={e => setNewWorkorder({...newWorkorder, title: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Omschrijving</label>
                <textarea 
                  rows={4}
                  placeholder="Beschrijf de werkzaamheden..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none"
                  value={newWorkorder.description}
                  onChange={e => setNewWorkorder({...newWorkorder, description: e.target.value})}
                />
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100">
              <button 
                onClick={handleCreateWorkorder}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
              >
                Registreren
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
