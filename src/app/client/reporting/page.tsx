"use client";

import { useState } from "react";
import { 
  mockDossiers, 
  mockRelations, 
  mockInvoices, 
  DossierStatus, 
  InvoiceStatus,
  mockPurchaseOrders
} from "@/lib/mock-data";
import { 
  BarChart3, 
  Files, 
  Receipt, 
  CheckCircle, 
  AlertTriangle, 
  Search, 
  Filter, 
  Download,
  ArrowRight,
  Clock,
  User
} from "lucide-react";
import Link from "next/link";

export default function ReportingPage() {
  const [activeView, setActiveView] = useState<'aanbiedingen' | 'contracten' | 'facturen'>('aanbiedingen');
  const [searchTerm, setSearchTerm] = useState("");

  // Stats calculation
  const openContracts = mockDossiers.filter(d => d.status === 'Contract_Lopend').length;
  const pendingInvoices = mockInvoices.filter(i => i.status === 'In_Afwachting' || i.status === 'Te_Beoordelen').length;
  const invoicesToReview = mockInvoices.filter(i => i.status === 'Te_Beoordelen').length;
  const expiredContracts = mockDossiers.filter(d => d.status === 'Contract_Verlopen').length;

  const filteredDossiers = mockDossiers.filter(d => {
    const relation = mockRelations.find(r => r.id === d.relationId);
    const po = mockPurchaseOrders.find(p => p.id === d.purchaseOrderId);
    const matchesSearch = (relation?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           po?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           d.id.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (!matchesSearch) return false;

    if (activeView === 'contracten') {
      return d.status === 'Contract_Lopend' || d.status === 'Contract_Verlopen';
    }
    if (activeView === 'aanbiedingen') {
      return d.status !== 'Contract_Lopend' && d.status !== 'Contract_Verlopen';
    }
    return false;
  });

  const filteredInvoices = mockInvoices.filter(i => {
    const relation = mockRelations.find(r => r.id === i.relationId);
    const matchesSearch = (relation?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           i.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           i.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Rapportage</h2>
        <p className="text-slate-500 mt-1">Direct inzicht in alle lopende processen, contracten en financiën.</p>
      </div>



      {/* Filters & View Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
            {[
              { id: 'aanbiedingen', label: 'Aanbiedingen' },
              { id: 'contracten', label: 'Contracten' },
              { id: 'facturen', label: 'Facturen' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeView === tab.id ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 cursor-pointer'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Zoeken op naam, ID of titel..."
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all cursor-pointer">
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeView !== 'facturen' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dossier</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Inkoopopdracht</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Opdrachtnemer</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Acties</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDossiers.length === 0 ? (
                   <tr>
                     <td colSpan={5} className="px-6 py-10 text-center text-slate-400 text-sm italic">
                       Geen {activeView} gevonden overeenkomend met uw zoekterm.
                     </td>
                   </tr>
                ) : filteredDossiers.map(d => {
                  const relation = mockRelations.find(r => r.id === d.relationId);
                  const po = mockPurchaseOrders.find(p => p.id === d.purchaseOrderId);
                  return (
                    <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{d.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-800">{po?.title}</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{po?.type}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-700">{relation?.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <DossierStatusBadge status={d.status} />
                      </td>
                      <td className="px-6 py-4">
                        <Link 
                          href={`/client/dossiers/${d.id}${activeView === 'aanbiedingen' ? '?tab=aanbod' : ''}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          {activeView === 'aanbiedingen' ? 'Bekijk aanbod' : 'Bekijk dossier'} <ArrowRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Factuurnummer</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Relatie</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bedrag</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vervaldatum</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Acties</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map(i => {
                  const relation = mockRelations.find(r => r.id === i.relationId);
                  return (
                    <tr key={i.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-800">{i.id}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{i.description}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-700">{relation?.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900">€{i.amount.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-slate-500 font-medium">{new Date(i.dueDate).toLocaleDateString('nl-NL')}</p>
                      </td>
                      <td className="px-6 py-4">
                        <InvoiceStatusBadge status={i.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        {i.status === 'Te_Beoordelen' ? (
                          <button className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all cursor-pointer">
                            Beoordelen
                          </button>
                        ) : (
                          <button className="text-slate-400 hover:text-slate-600 p-2 cursor-pointer">
                            <Download size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Internal Helper Components ---



function DossierStatusBadge({ status }: { status: DossierStatus }) {
  const map: Record<DossierStatus, { label: string; cls: string }> = {
    'Inkoopopdracht_Verstuurd': { label: 'PO Verstuurd', cls: 'bg-blue-100 text-blue-700' },
    'Niet_Gereageerd': { label: 'Geen Reactie', cls: 'bg-orange-100 text-orange-700' },
    'Inkoopopdracht_Geweigerd': { label: 'Geweigerd', cls: 'bg-red-100 text-red-700' },
    'Aanbod_Verstuurd': { label: 'Aanbod Ontvangen', cls: 'bg-purple-100 text-purple-700' },
    'Aanbod_Geaccepteerd': { label: 'Aanbod Geaccepteerd', cls: 'bg-teal-100 text-teal-700' },
    'Contract_Lopend': { label: 'Contract Lopend', cls: 'bg-emerald-100 text-emerald-700' },
    'Contract_Verlopen': { label: 'Voltooid / Verlopen', cls: 'bg-slate-100 text-slate-500' },
  };
  const { label, cls } = map[status] || { label: status, cls: 'bg-slate-100' };
  return <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${cls}`}>{label}</span>;
}

function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const map: Record<InvoiceStatus, { label: string; cls: string }> = {
    'In_Afwachting': { label: 'In Afwachting', cls: 'bg-slate-100 text-slate-600' },
    'Geaccepteerd': { label: 'Goedgekeurd', cls: 'bg-blue-100 text-blue-700' },
    'Betaald': { label: 'Betaald', cls: 'bg-emerald-100 text-emerald-700' },
    'Afgewezen': { label: 'Afgewezen', cls: 'bg-red-100 text-red-700' },
    'Te_Beoordelen': { label: 'Te Beoordelen', cls: 'bg-amber-100 text-amber-700 animate-pulse' },
  };
  const { label, cls } = map[status];
  return <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${cls}`}>{label}</span>;
}
