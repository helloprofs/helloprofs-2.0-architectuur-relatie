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

export default function VendorReportingPage() {
  const [activeView, setActiveView] = useState<'aanbiedingen' | 'contracten' | 'facturen'>('aanbiedingen');
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleExport = () => {
    let csvContent = "ID,Naam,Bedrag,Status\n";
    // Simplified export for demo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", `export_${activeView}.csv`);
    link.click();
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Mijn Rapportages</h2>
        <p className="text-slate-500 mt-1">Inzicht in uw opdrachten, contracten en facturatie status.</p>
      </div>

      {/* Filters & View Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-slate-800">
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
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeView === tab.id ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 cursor-pointer'}`}
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
                placeholder="Zoeken..."
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all cursor-pointer"
            >
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
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Klant</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Acties</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDossiers.map(d => {
                  const relation = mockRelations.find(r => r.id === d.relationId);
                  const po = mockPurchaseOrders.find(p => p.id === d.purchaseOrderId);
                  return (
                    <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{d.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900">{po?.title}</p>
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
                          href={`/vendor/dossiers/${d.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          Bekijk dossier <ArrowRight size={14} />
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
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Factuur</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Klant</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bedrag</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Datum</th>
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
                        <p className="text-sm font-bold text-slate-900">{i.id}</p>
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
                        <button className="text-slate-400 hover:text-slate-600 p-2 cursor-pointer">
                          <Download size={16} />
                        </button>
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

function DossierStatusBadge({ status }: { status: DossierStatus }) {
  const map: Record<DossierStatus, { label: string; cls: string }> = {
    'Inkoopopdracht_Verstuurd': { label: 'Ontvangen', cls: 'bg-indigo-100 text-indigo-700' },
    'Niet_Gereageerd': { label: 'Geen Actie', cls: 'bg-orange-100 text-orange-700' },
    'Inkoopopdracht_Geweigerd': { label: 'Geweigerd', cls: 'bg-red-100 text-red-700' },
    'Aanbod_Verstuurd': { label: 'Aanbod Verstuurd', cls: 'bg-purple-100 text-purple-700' },
    'Aanbod_Geaccepteerd': { label: 'Geaccepteerd', cls: 'bg-teal-100 text-teal-700' },
    'Contract_Lopend': { label: 'Actief', cls: 'bg-emerald-100 text-emerald-700' },
    'Contract_Verlopen': { label: 'Afgerond', cls: 'bg-slate-100 text-slate-500' },
  };
  const { label, cls } = map[status] || { label: status, cls: 'bg-slate-100' };
  return <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${cls}`}>{label}</span>;
}

function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const map: Record<InvoiceStatus, { label: string; cls: string }> = {
    'In_Afwachting': { label: 'Verstuurd', cls: 'bg-slate-100 text-slate-600' },
    'Geaccepteerd': { label: 'Goedgekeurd', cls: 'bg-indigo-100 text-indigo-700' },
    'Betaald': { label: 'Betaald', cls: 'bg-emerald-100 text-emerald-700' },
    'Afgewezen': { label: 'Afgewezen', cls: 'bg-red-100 text-red-700' },
    'Te_Beoordelen': { label: 'In Beoordeling', cls: 'bg-amber-100 text-amber-700' },
  };
  const { label, cls } = map[status];
  return <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${cls}`}>{label}</span>;
}
