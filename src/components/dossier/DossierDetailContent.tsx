"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useDynamicState } from "@/hooks/use-dynamic-state";
import {
  mockRelations,
  mockDossierEvents, mockDossierAttachments, mockDossierMessages, mockDeelopdrachten,
  mockInvoices, mockRelationChains,
  DossierStatus, EventType, Invoice, InvoiceLine, RelationChain, ComplianceStatus
} from "@/lib/mock-data";
import {
  ArrowLeft, ArrowRight, Clock, FileText, FileCheck, Hammer, Receipt,
  Paperclip, MessageSquare, Download, Plus, CheckCircle, ChevronRight,
  XCircle, Send, AlertTriangle, File as FileIcon, User, Phone, MessageCircle,
  ShieldCheck, ShieldAlert, ShieldX, FolderKanban, Users, Building2
} from "lucide-react";

import { ContactModal } from "@/components/interaction/ContactModal";

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

function StatusBadge({ status }: { status: DossierStatus }) {
  const map: Record<DossierStatus, { label: string; cls: string }> = {
    'Inkoopopdracht_Verstuurd': { label: 'Inkoopopdracht Verstuurd', cls: 'bg-blue-100 text-blue-700' },
    'Niet_Gereageerd': { label: 'Niet Gereageerd', cls: 'bg-orange-100 text-orange-700' },
    'Inkoopopdracht_Geweigerd': { label: 'Geweigerd', cls: 'bg-red-100 text-red-700' },
    'Aanbod_Verstuurd': { label: 'Aanbod Verstuurd', cls: 'bg-purple-100 text-purple-700' },
    'Aanbod_Geaccepteerd': { label: 'Aanbod Geaccepteerd', cls: 'bg-teal-100 text-teal-700' },
    'Contract_Lopend': { label: 'Contract Lopend', cls: 'bg-emerald-100 text-emerald-700' },
    'Contract_Verlopen': { label: 'Contract Verlopen', cls: 'bg-slate-100 text-slate-500' },
    'Compliance_Freeze': { label: 'Compliance Freeze', cls: 'bg-rose-100 text-rose-700 animate-pulse' },
  };
  const { label, cls } = map[status];
  return <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${cls}`}>{label}</span>;
}

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
    'contact_call': { icon: <Phone size={14} />, cls: 'bg-blue-100 text-blue-600' },
    'contact_whatsapp': { icon: <MessageCircle size={14} />, cls: 'bg-emerald-100 text-emerald-600' },
    'refusal_evidence': { icon: <XCircle size={14} />, cls: 'bg-rose-100 text-rose-600' },
    'compliance_check': { icon: <ShieldCheck size={14} />, cls: 'bg-indigo-100 text-indigo-600' },
  };
  const { icon, cls } = map[type];
  return <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${cls}`}>{icon}</div>;
}

interface DossierDetailContentProps {
  dossierId: string;
  /** Toon de breadcrumb-navigatie bovenaan */
  showBreadcrumb?: boolean;
}

export function DossierDetailContent({ dossierId, showBreadcrumb = false }: DossierDetailContentProps) {
  const id = dossierId;
  const { projects, purchaseOrders, dossiers, isLoaded } = useDynamicState();

  const dossier = dossiers.find(d => d.id === id);
  const po = purchaseOrders.find(p => p.id === dossier?.purchaseOrderId);
  const isRaamopdracht = po?.type === 'Raamopdracht';

  const [activeTab, setActiveTab] = useState(isRaamopdracht ? 'deelopdrachten' : 'tijdlijn');
  const [filterStatus, setFilterStatus] = useState<string>('In_Uitvoering');
  const [chatMessage, setChatMessage] = useState('');
  const [messagesList, setMessagesList] = useState(mockDossierMessages.filter(m => m.dossierId === id));
  const [localEvents, setLocalEvents] = useState(mockDossierEvents.filter(e => e.dossierId === id));
  const [localInvoices, setLocalInvoices] = useState<Invoice[]>(mockInvoices.filter(i => (i as Invoice).dossierId === id));
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isRequestingChanges, setIsRequestingChanges] = useState(false);
  const [changeReason, setChangeReason] = useState("");
  const [selectedDeelopdracht, setSelectedDeelopdracht] = useState<typeof mockDeelopdrachten[0] | null>(null);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [newWorkorder, setNewWorkorder] = useState({
    title: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    responsibility: 'Relatie (Volledig)',
    expectedResult: '',
    location: ''
  });
  const [localDeelopdrachten, setLocalDeelopdrachten] = useState(mockDeelopdrachten.filter(d => d.dossierId === id));
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'communicatie') {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesList, activeTab]);

  // Reset active tab when dossier changes
  useEffect(() => {
    setActiveTab(isRaamopdracht ? 'deelopdrachten' : 'tijdlijn');
    setMessagesList(mockDossierMessages.filter(m => m.dossierId === id));
    setLocalEvents(mockDossierEvents.filter(e => e.dossierId === id));
    setLocalInvoices(mockInvoices.filter(i => (i as Invoice).dossierId === id));
    setLocalDeelopdrachten(mockDeelopdrachten.filter(d => d.dossierId === id));
  }, [id]);

  const handleCreateWorkorder = () => {
    const newItem = {
      id: `DO-${4000 + localDeelopdrachten.length + 1}`,
      dossierId: id,
      ...newWorkorder,
      status: 'In_Uitvoering' as const,
      historyCount: 0
    };
    setLocalDeelopdrachten([newItem, ...localDeelopdrachten]);
    setIsCreateDrawerOpen(false);
    setNewWorkorder({ title: '', description: '', startDate: new Date().toISOString().split('T')[0], responsibility: 'Relatie (Volledig)', expectedResult: '', location: '' });
  };

  const handleCancelWorkorder = (workId: string) => {
    if (confirm('Weet u zeker dat u deze werkorder wilt annuleren?')) {
      setLocalDeelopdrachten(prev => prev.map(d => d.id === workId ? { ...d, status: 'Geannuleerd' } : d));
      setSelectedDeelopdracht(null);
    }
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    setMessagesList([...messagesList, {
      id: `msg-${Date.now()}`,
      dossierId: id,
      author: 'Tim de Ruiter',
      role: 'opdrachtgever' as const,
      message: chatMessage,
      date: new Date().toISOString(),
    }]);
    setChatMessage('');
  };

  const handleApproveInvoice = (invoiceId: string) => {
    const invoice = localInvoices.find(i => i.id === invoiceId);
    if (!invoice) return;
    setLocalInvoices(prev => prev.map(inv =>
      inv.id === invoiceId ? { ...inv, status: 'Factuur_Verstuurd', isConcept: false, logs: [...inv.logs, { date: new Date().toISOString(), action: 'Factuur goedgekeurd', actor: 'Tim de Ruiter' }] } : inv
    ));
    setLocalEvents([{ id: `ev-${Date.now()}`, dossierId: id, type: 'inkoopopdracht_geaccepteerd' as any, description: `Factuur ${invoice.invoiceNumber} goedgekeurd`, date: new Date().toISOString(), actor: 'Tim de Ruiter', linkedSection: 'factuur' }, ...localEvents]);
    setSelectedInvoice(null);
  };

  const handleRequestChanges = (invoiceId: string) => {
    const invoice = localInvoices.find(i => i.id === invoiceId);
    if (!invoice) return;
    if (!isRequestingChanges) { setIsRequestingChanges(true); return; }
    if (!changeReason.trim()) return;
    setLocalInvoices(prev => prev.map(inv =>
      inv.id === invoiceId ? { ...inv, status: 'Herziening_Nodig', logs: [...inv.logs, { date: new Date().toISOString(), action: `Aanpassing gevraagd: ${changeReason}`, actor: 'Tim de Ruiter' }] } : inv
    ));
    setLocalEvents([{ id: `ev-${Date.now()}`, dossierId: id, type: 'inkoopopdracht_geweigerd' as any, description: `Aanpassingen gevraagd voor factuur ${invoice.invoiceNumber}: ${changeReason}`, date: new Date().toISOString(), actor: 'Tim de Ruiter', linkedSection: 'factuur' }, ...localEvents]);
    setSelectedInvoice(null);
    setIsRequestingChanges(false);
    setChangeReason("");
  };

  const handleExport = () => {
    if (!dossier) return;
    const sections: string[][] = [];
    sections.push(['DOSSIER EXPORT - ' + dossier.id]);
    sections.push(['Titel', po?.title || dossier.id]);
    sections.push(['Status', dossier.status]);
    sections.push(['Datum Export', new Date().toLocaleString('nl-NL')]);
    sections.push([]);
    const csvContent = sections.map(row => row.map(cell => `"${cell || ''}"`).join(',')).join('\n');
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
  if (!dossier) return <div className="p-8 text-center text-slate-500">Dossier niet gevonden.</div>;

  const relation = mockRelations.find(r => r.id === dossier.relationId);
  const project = po ? projects.find(p => p.id === po.projectId) : null;
  const events = [...localEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const attachments = mockDossierAttachments.filter(a => a.dossierId === id);
  const messages = messagesList;
  const deelopdrachten = mockDeelopdrachten.filter(d => d.dossierId === id);
  const invoices = localInvoices;

  const visibleTabs = [
    ...(isRaamopdracht ? [{ id: 'deelopdrachten', label: 'Deelopdrachten', icon: Hammer }] : []),
    { id: 'tijdlijn', label: 'Tijdlijn', icon: Clock },
    { id: 'inkoopopdracht', label: 'Inkoopopdracht', icon: FileText },
    { id: 'aanbod', label: 'Aanbod', icon: FileCheck },
    { id: 'factuur', label: 'Facturen', icon: Receipt },
    { id: 'contract', label: 'Contract', icon: FileCheck },
    { id: 'bijlagen', label: 'Bijlagen', icon: Paperclip },
    { id: 'keten', label: 'Keten-Inzicht', icon: Users },
  ];

  return (
    <div className="space-y-6">
      {showBreadcrumb && (
        <nav className="flex items-center gap-2 text-sm text-slate-500">
          <Link href="/client/relations" className="hover:text-slate-800 transition-colors font-medium">Relaties</Link>
          <ChevronRight size={14} />
          <Link href={`/client/relations/${relation?.id}`} className="hover:text-slate-800 transition-colors font-medium">{relation?.name}</Link>
          <ChevronRight size={14} />
          <span className="text-slate-900 font-bold">{po?.title}</span>
        </nav>
      )}

      {/* Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{dossier.id}</span>
              {po && <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-medium">{po.type}</span>}
              {relation && <ComplianceBadge status={relation.complianceStatus} />}
            </div>
            <h2 className="text-2xl font-bold text-slate-800 break-words">{po?.title || dossier.id}</h2>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">
              {project && <span className="flex items-center gap-1.5"><FolderKanban size={14} className="text-slate-400" /> {project.name}</span>}
              {relation && <span className="flex items-center gap-1.5"><User size={14} className="text-slate-400" /> {relation.name}</span>}
              <span className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400" /> Gestart op {new Date(dossier.id === 'D-3001' ? '2025-03-05' : '2025-01-10').toLocaleDateString('nl-NL')}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-500/25 transition-all cursor-pointer border-none"
            >
              <Phone size={15} fill="currentColor" />
              <span>Contact & Loggen</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
            >
              <Download size={15} /> Audit Export
            </button>
          </div>
        </div>
      </div>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        relationName={relation?.name || 'Relatie'}
        phone={relation?.phone || '0612345678'}
        dossierId={dossier.id}
        availablePOs={po ? [{ id: po.id, title: po.title, type: po.type }] : []}
        defaultPOId={po?.id}
        onLog={({ channel, outcome, description, reason }) => {
          const eventType = outcome === 'Geweigerd'
            ? 'refusal_evidence'
            : channel === 'whatsapp' ? 'contact_whatsapp' : 'contact_call';
          const desc = outcome === 'Geweigerd'
            ? `Refusal Evidence (${channel === 'call' ? 'Telefoon' : 'WhatsApp'}): "${description}" — geweigerd${reason ? `. Reden: ${reason}` : ''}`
            : `${channel === 'call' ? 'Telefoon' : 'WhatsApp'}: "${description}" — ${outcome.replace('_', ' ')}`;
          setLocalEvents([{
            id: `ev-${channel}-${Date.now()}`,
            dossierId: id,
            type: eventType as any,
            description: desc,
            date: new Date().toISOString(),
            actor: 'Tim de Ruiter',
            metadata: { outcome, reason, channel } as any
          }, ...localEvents]);
        }}
      />

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

        <div className="p-6">

          {/* ── KETEN-INZICHT ── */}
          {activeTab === 'keten' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Keten-Inzicht (WKA)</h3>
                <p className="text-sm text-slate-500 mt-1">Status van alle onderaannemers in de keten van {relation?.name}.</p>
              </div>
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <User size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{relation?.name} <span className="text-xs text-slate-400 font-medium ml-2">(Relatie B)</span></h4>
                    <p className="text-xs text-slate-500">Hoofdaannemer in dit dossier</p>
                  </div>
                  <div className="ml-auto">{relation && <ComplianceBadge status={relation.complianceStatus} />}</div>
                </div>
                <div className="relative pl-8 pt-4 space-y-4">
                  <div className="absolute left-6 top-0 bottom-4 w-0.5 bg-blue-100" />
                  {mockRelationChains.filter((c: RelationChain) => c.parentId === relation?.id).length === 0 ? (
                    <div className="text-xs text-slate-400 italic py-4">Geen actieve onderaannemers geregistreerd.</div>
                  ) : (
                    mockRelationChains.filter((c: RelationChain) => c.parentId === relation?.id).map((chain: RelationChain, idx: number) => {
                      const child = mockRelations.find(r => r.id === chain.childId);
                      if (!child) return null;
                      return (
                        <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative group hover:border-blue-200 transition-all">
                          <div className="absolute -left-[2.25rem] top-1/2 -translate-y-1/2 w-4 h-0.5 bg-blue-100 group-hover:bg-blue-300" />
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                {child.type === 'ZZP' ? <User size={16} /> : <Building2 size={16} />}
                              </div>
                              <div>
                                <h5 className="text-sm font-bold text-slate-800">{child.name}</h5>
                                <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Onderaannemer van {relation?.name}</p>
                              </div>
                            </div>
                            <ComplianceBadge status={child.complianceStatus} />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="mt-8 p-4 bg-slate-800 text-white rounded-xl shadow-inner">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-blue-400" />
                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-widest">Privacy Guardrail</h5>
                      <p className="text-[10px] text-slate-400 mt-0.5">Financiële afspraken zijn strikt afgeschermd.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── FACTUUR ── */}
          {activeTab === 'factuur' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Facturatie</h3>
                <p className="text-sm text-slate-500 mt-1">Overzicht van alle financiële vastleggingen binnen dit dossier.</p>
              </div>
              {relation?.complianceStatus !== 'Groen' && (
                <div className="p-5 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-4 animate-pulse">
                  <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center flex-shrink-0 border border-rose-200">
                    <ShieldX size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-rose-800 uppercase tracking-tight text-sm">Facturatie-Blokkade Actief</h4>
                    <p className="text-xs text-rose-600 mt-1 leading-relaxed">De relatie <span className="font-bold">{relation?.name}</span> is momenteel niet volledig compliant.</p>
                  </div>
                </div>
              )}
              {invoices.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                  <Receipt size={32} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-600">Nog geen facturen beschikbaar</p>
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
                            <div className={`p-3 rounded-lg ${invoice.status === 'Betaald' ? 'bg-emerald-50 text-emerald-600' : invoice.status === 'Concept_Verstuurd' ? 'bg-amber-50 text-amber-600' : invoice.status === 'Herziening_Nodig' ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}>
                              <Receipt size={24} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-mono font-bold text-slate-400">{invoice.id}</span>
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${invoice.status === 'Betaald' ? 'bg-emerald-100 text-emerald-700' : invoice.status === 'Concept_Verstuurd' ? 'bg-amber-100 text-amber-700' : invoice.status === 'Herziening_Nodig' ? 'bg-red-100 text-red-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                  {invoice.status === 'Factuur_Verstuurd' ? 'Factuur ontvangen' : invoice.status === 'Concept_Verstuurd' ? 'Controle gevraagd' : invoice.status === 'Herziening_Nodig' ? 'Aanpassing gevraagd' : invoice.status.replace('_', ' ')}
                                </span>
                              </div>
                              <h4 className="font-bold text-slate-800">{invoice.description}</h4>
                              <p className="text-xs text-slate-500 mt-1">Factuurdatum: {new Date(invoice.date).toLocaleDateString('nl-NL')}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-slate-900">€{total.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</p>
                            <div className="mt-3 flex gap-2 justify-end">
                              {invoice.status === 'Concept_Verstuurd' && (
                                <button onClick={() => setSelectedInvoice(invoice)} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer">Controleren</button>
                              )}
                              <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"><Download size={14} /> PDF</button>
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

          {/* ── INVOICE REVIEW MODAL ── */}
          {selectedInvoice && (
            <>
              <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200]" onClick={() => { setSelectedInvoice(null); setIsRequestingChanges(false); setChangeReason(""); }} />
              <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-[201] overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-blue-50/50">
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{selectedInvoice.status === 'Concept_Verstuurd' ? 'Controle gevraagd' : 'Factuur Details'}</span>
                    <h3 className="text-xl font-bold text-slate-900">{selectedInvoice.id} - {selectedInvoice.description}</h3>
                  </div>
                  <button onClick={() => { setSelectedInvoice(null); setIsRequestingChanges(false); setChangeReason(""); }} className="text-slate-400 hover:text-slate-600 cursor-pointer"><XCircle size={24} /></button>
                </div>
                <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                  {isRequestingChanges ? (
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reden voor aanpassing</label>
                      <textarea autoFocus rows={6} placeholder="Bijv. Het uurtarief wijkt af..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all" value={changeReason} onChange={(e) => setChangeReason(e.target.value)} />
                    </div>
                  ) : (
                    <>
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
                        <div className="flex justify-between text-slate-500 text-xs"><span>Subtotaal</span><span>€{selectedInvoice.lines.reduce((a, b: any) => a + (b.quantity * b.rate), 0).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span></div>
                        <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-2"><span>Totaal incl. BTW</span><span>€{(selectedInvoice.lines.reduce((a, b: any) => a + (b.quantity * b.rate), 0) * 1.21).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span></div>
                      </div>
                    </>
                  )}
                </div>
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                  {isRequestingChanges ? (
                    <>
                      <button onClick={() => { setIsRequestingChanges(false); setChangeReason(""); }} className="px-6 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-white transition-all cursor-pointer">Annuleren</button>
                      <button onClick={() => handleRequestChanges(selectedInvoice.id)} disabled={!changeReason.trim()} className={`flex-1 px-6 py-3 rounded-xl text-sm font-bold shadow-lg transition-all cursor-pointer border-none ${!changeReason.trim() ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'}`}>Bevestigen</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { setSelectedInvoice(null); setIsRequestingChanges(false); setChangeReason(""); }} className="px-6 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-white transition-all cursor-pointer">Sluiten</button>
                      {selectedInvoice.status === 'Concept_Verstuurd' && (
                        <div className="flex-1 flex gap-3">
                          <button onClick={() => handleRequestChanges(selectedInvoice.id)} className="flex-1 px-6 py-3 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-sm font-bold transition-all cursor-pointer">Aanpassing vragen</button>
                          <button onClick={() => handleApproveInvoice(selectedInvoice.id)} className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all cursor-pointer border-none">Accorderen</button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ── DEELOPDRACHTEN ── */}
          {activeTab === 'deelopdrachten' && isRaamopdracht && (
            <div className="space-y-4">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Deelopdrachten</h3>
                  <p className="text-sm text-slate-500 mt-1">Geregistreerde werkzaamheden binnen de kaders van dit raamcontract.</p>
                </div>
                <button onClick={() => setIsCreateDrawerOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer">
                  <Plus size={15} /> Deelopdracht toevoegen
                </button>
              </div>
              {localDeelopdrachten.length > 0 && (
                <div className="flex items-center gap-2 mb-2 pb-4 border-b border-slate-100 overflow-x-auto">
                  {['In_Uitvoering', 'Herstel_Nodig', 'Opgeleverd', 'Geannuleerd', 'Alle'].map(f => (
                    <button key={f} onClick={() => setFilterStatus(f)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${filterStatus === f ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                      {f === 'Alle' ? `Alle (${localDeelopdrachten.length})` : `${f.replace('_', ' ')} (${localDeelopdrachten.filter(d => d.status === f).length})`}
                    </button>
                  ))}
                </div>
              )}
              {localDeelopdrachten.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                  <Hammer size={32} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-600">Nog geen deelopdrachten geregistreerd</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {localDeelopdrachten.filter(werk => filterStatus === 'Alle' || werk.status === filterStatus).map(werk => (
                    <div key={werk.id} onClick={() => setSelectedDeelopdracht(werk)} className="bg-white rounded-2xl border border-black/5 shadow-sm hover:shadow-md hover:border-blue-500/20 transition-all flex flex-col group cursor-pointer">
                      <div className="p-5 border-b border-black/[0.03]">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{werk.id}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${werk.status === 'In_Uitvoering' ? 'bg-blue-100 text-blue-700' : werk.status === 'Herstel_Nodig' ? 'bg-amber-100 text-amber-700' : werk.status === 'Opgeleverd' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{werk.status.replace('_', ' ')}</span>
                        </div>
                        <h4 className="font-bold text-slate-800 leading-tight group-hover:text-blue-700 transition-colors uppercase tracking-tight text-sm">{werk.title}</h4>
                      </div>
                      <div className="px-5 py-3 border-t border-black/[0.03] flex items-center justify-between bg-white rounded-b-2xl">
                        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5"><Clock size={12} /> {new Date(werk.startDate).toLocaleDateString('nl-NL')}</span>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600">Details <ArrowRight size={13} /></div>
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
                              <button onClick={() => setActiveTab(event.linkedSection!)} className="text-xs text-blue-600 hover:underline flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">Bekijk →</button>
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
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100"><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">PO Nummer</p><p className="text-sm font-bold text-slate-700 font-mono">{po.id}</p></div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100"><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Type</p><p className="text-sm font-bold text-slate-700">{po.type}</p></div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100"><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Status</p><p className="text-sm font-bold text-slate-700">{po.status}</p></div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100"><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Budget</p><p className="text-sm font-bold text-slate-700">{po.budget ? `€${po.budget.toLocaleString('nl-NL')}` : 'Niet opgegeven'}</p></div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100"><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Omschrijving</p><p className="text-sm text-slate-700 leading-relaxed">{po.description}</p></div>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100"><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Project</p><p className="text-sm font-bold text-slate-700">{project?.name || po.projectId}</p></div>
            </div>
          )}

          {/* ── AANBOD ── */}
          {activeTab === 'aanbod' && (
            <div className="space-y-4">
              {dossier.status === 'Inkoopopdracht_Verstuurd' || dossier.status === 'Niet_Gereageerd' || dossier.status === 'Inkoopopdracht_Geweigerd' ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
                  <FileCheck size={32} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-500">Nog geen aanbod ontvangen</p>
                  <p className="text-xs text-slate-400 mt-1">Het aanbod verschijnt hier zodra de relatie reageert.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100"><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Bedrag</p><p className="text-2xl font-bold text-slate-800">€13.750</p><p className="text-xs text-slate-400 mt-0.5">excl. BTW</p></div>
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100"><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Uitvoeringstermijn</p><p className="text-sm font-bold text-slate-700">4 weken</p></div>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-2.5 text-sm font-semibold transition-colors cursor-pointer">Aanbod Accepteren</button>
                    <button className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg py-2.5 text-sm font-semibold transition-colors cursor-pointer">Aanbod Afwijzen</button>
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
            </div>
          )}

          {/* ── BIJLAGEN ── */}
          {activeTab === 'bijlagen' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{attachments.length} bijlagen</p>
                <button className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 border border-blue-200 rounded-lg px-3 py-1.5 hover:bg-blue-50 transition-colors cursor-pointer"><Plus size={14} /> Bijlage toevoegen</button>
              </div>
              {attachments.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl"><Paperclip size={32} className="text-slate-300 mx-auto mb-3" /><p className="text-sm text-slate-400">Nog geen bijlagen</p></div>
              ) : (
                <div className="space-y-2">
                  {attachments.map(att => (
                    <div key={att.id} className="flex items-center gap-4 p-3.5 bg-slate-50 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-white transition-colors">
                      <div className="p-2 bg-red-50 rounded-lg"><FileIcon size={18} className="text-red-500" /></div>
                      <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-slate-800 truncate">{att.name}</p><p className="text-xs text-slate-400">{att.size} · {att.uploadedBy} · {new Date(att.date).toLocaleDateString('nl-NL')}</p></div>
                      <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"><Download size={15} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── COMMUNICATIE ── */}
          {activeTab === 'communicatie' && (
            <div className="flex flex-col h-[500px]">
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4">
                {messages.length === 0 ? (
                  <div className="text-center py-10"><p className="text-sm text-slate-400 italic">Nog geen berichten gewisseld.</p></div>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.role === 'opdrachtgever' ? 'justify-end' : 'justify-start'}`}>
                      <div className="max-w-[80%]">
                        <div className={`flex items-center gap-2 mb-1 ${msg.role === 'opdrachtgever' ? 'flex-row-reverse' : ''}`}>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{msg.author}</span>
                        </div>
                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'opdrachtgever' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none border border-black/5'}`}>
                          <p>{msg.message}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="pt-4 border-t border-black/[0.03]">
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-2">
                  <input type="text" value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} placeholder="Typ uw bericht..." className="flex-1 px-4 py-3 bg-black/[0.03] border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all" />
                  <button type="submit" disabled={!chatMessage.trim()} className="w-11 h-11 flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all shrink-0 cursor-pointer">
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── DRAWER: CREATE WORKORDER ── */}
      {isCreateDrawerOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]" onClick={() => setIsCreateDrawerOpen(false)} />
          <div className="fixed top-0 right-0 h-screen w-full max-w-lg bg-white shadow-2xl z-[101] flex flex-col border-l border-black/5">
            <div className="p-6 border-b border-black/[0.03] flex items-center justify-between bg-slate-50/50">
              <div><span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Nieuwe Deelopdracht</span><h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Deelopdracht toevoegen</h3></div>
              <button onClick={() => setIsCreateDrawerOpen(false)} className="p-2 hover:bg-black/5 rounded-full text-slate-400 cursor-pointer"><XCircle size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Titel</label>
                <input type="text" placeholder="Bijv. Kozijnplaatsing Sector A" className="w-full px-4 py-3 bg-slate-50 border border-black/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium" value={newWorkorder.title} onChange={e => setNewWorkorder({...newWorkorder, title: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Omschrijving</label>
                <textarea rows={4} placeholder="Beschrijf de specifieke taken..." className="w-full px-4 py-3 bg-slate-50 border border-black/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium resize-none" value={newWorkorder.description} onChange={e => setNewWorkorder({...newWorkorder, description: e.target.value})} />
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-black/[0.03] flex justify-between gap-3">
              <button onClick={() => setIsCreateDrawerOpen(false)} className="px-6 py-3 bg-white border border-black/10 hover:bg-slate-100 text-slate-600 rounded-xl text-sm font-semibold transition-all cursor-pointer">Annuleren</button>
              <button onClick={handleCreateWorkorder} disabled={!newWorkorder.title || !newWorkorder.description} className="px-10 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all cursor-pointer">Opslaan</button>
            </div>
          </div>
        </>
      )}

      {/* ── DRAWER: DEELOPDRACHT DETAILS ── */}
      {selectedDeelopdracht && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]" onClick={() => setSelectedDeelopdracht(null)} />
          <div className="fixed top-0 right-0 h-screen w-full max-w-lg bg-white shadow-2xl z-[101] flex flex-col border-l border-black/5">
            <div className="p-6 border-b border-black/[0.03] flex items-center justify-between bg-slate-50/50">
              <div><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{selectedDeelopdracht.id}</span><h3 className="text-lg font-bold text-slate-800 leading-tight uppercase tracking-tight">{selectedDeelopdracht.title}</h3></div>
              <button onClick={() => setSelectedDeelopdracht(null)} className="p-2 hover:bg-black/5 rounded-full text-slate-400 cursor-pointer"><XCircle size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="p-5 rounded-2xl bg-slate-50 border border-black/5"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-2">Omschrijving</p><p className="text-sm text-slate-600 leading-relaxed">{selectedDeelopdracht.description}</p></div>
              <div className="p-5 rounded-2xl bg-blue-50 border border-blue-500/10"><p className="text-[10px] font-bold text-blue-600/60 uppercase tracking-tight mb-2">Verwacht Resultaat (SLA)</p><p className="text-sm font-medium text-blue-900 leading-relaxed">{selectedDeelopdracht.expectedResult}</p></div>
            </div>
            <div className="p-6 bg-slate-50/50 border-t border-black/[0.03] flex justify-end gap-3">
              {selectedDeelopdracht.status !== 'Geannuleerd' && selectedDeelopdracht.status !== 'Opgeleverd' && (
                <button onClick={() => handleCancelWorkorder(selectedDeelopdracht.id)} className="px-6 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 cursor-pointer"><XCircle size={14} /> Annuleren</button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
