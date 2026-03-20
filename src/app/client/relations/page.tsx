"use client";

import { useState, useMemo } from "react";
import { mockRelations, mockDossiers, mockPurchaseOrders, RelationStatus, ComplianceStatus } from "@/lib/mock-data";
import { Search, Filter, Plus, User, Building2, ShieldCheck, ShieldAlert, ShieldX, X, Zap, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { ContactModal } from "@/components/interaction/ContactModal";

// 4-stage flow: Uitgenodigd → Screening → Actieve Samenwerking → Beëindigd
function StatusBadge({ status }: { status: RelationStatus }) {
  const map: Record<RelationStatus, { label: string; cls: string }> = {
    'Uitgenodigd':            { label: 'Uitgenodigd',         cls: 'bg-slate-100 text-slate-600' },
    'Aangemeld':              { label: 'Screening',           cls: 'bg-blue-100 text-blue-700' },
    'Goedgekeurd':            { label: 'Screening',           cls: 'bg-blue-100 text-blue-700' },
    'Samenwerking_Actief':    { label: 'Actieve Samenwerking', cls: 'bg-emerald-100 text-emerald-700' },
    'Samenwerking_Beeindigd': { label: 'Beëindigd',           cls: 'bg-slate-100 text-slate-500' },
    'Gearchiveerd':           { label: 'Beëindigd',           cls: 'bg-slate-100 text-slate-500' },
  };
  const { label, cls } = map[status];
  return (
    <span className={`cursor-pointer px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
}

function ComplianceBadge({ status }: { status: ComplianceStatus }) {
  const configs: Record<ComplianceStatus, { color: string; icon: React.ElementType; label: string }> = {
    'Groen':  { color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: ShieldCheck, label: 'Compliant' },
    'Oranje': { color: 'text-amber-600 bg-amber-50 border-amber-100',       icon: ShieldAlert, label: 'Actie Vereist' },
    'Rood':   { color: 'text-rose-600 bg-rose-50 border-rose-100',          icon: ShieldX,     label: 'Non-Compliant' },
  };
  const { color, icon: Icon, label } = configs[status];
  return (
    <div className={`cursor-pointer inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs font-medium ${color}`}>
      <Icon size={14} />
      <span>{label}</span>
    </div>
  );
}

function InviteModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'email'>('whatsapp');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-bold text-slate-900">Relatie Uitnodigen</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="px-6 pt-4">
          <div className="flex gap-2 border-b border-slate-100 pb-0">
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${activeTab === 'whatsapp' ? 'text-blue-700 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-800'}`}
            >Via WhatsApp</button>
            <button
              onClick={() => setActiveTab('email')}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${activeTab === 'email' ? 'text-blue-700 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-800'}`}
            >Via Email</button>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {activeTab === 'whatsapp' ? (
            <>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Telefoonnummer</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="06 12345678"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" />
              </div>
              <button
                onClick={() => window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hoi! Je bent uitgenodigd om samen te werken via HelloProfs. Registreer je hier: https://helloprofs.nl/registreer')}`, '_blank')}
                disabled={!phone.trim()}
                className="w-full py-2.5 bg-[#25D366] hover:bg-[#1ebe5d] disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-sm font-semibold transition-all cursor-pointer border-none disabled:cursor-not-allowed"
              >Verstuur WhatsApp Uitnodiging</button>
            </>
          ) : (
            <>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">E-mailadres</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="naam@bedrijf.nl"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" />
              </div>
              <button
                onClick={() => alert(`E-mail verstuurd naar ${email}`)}
                disabled={!email.trim()}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-sm font-semibold transition-all cursor-pointer border-none disabled:cursor-not-allowed"
              >Verstuur Email</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RelationsPage() {
  const router = useRouter();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [dienstModalRelationId, setDienstModalRelationId] = useState<string | null>(null);

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<RelationStatus | ''>('');
  const [filterCompliance, setFilterCompliance] = useState<ComplianceStatus | ''>('');
  const [filterPO, setFilterPO] = useState('');

  // Build per-relation PO map
  const relationPOMap = useMemo(() => {
    const map = new Map<string, { id: string; title: string; type: string }[]>();
    mockRelations.forEach(relation => {
      const pos = mockDossiers
        .filter(d => d.relationId === relation.id)
        .flatMap(d => {
          const po = mockPurchaseOrders.find(p => p.id === d.purchaseOrderId);
          return po ? [{ id: po.id, title: po.title, type: po.type as string }] : [];
        });
      map.set(relation.id, pos);
    });
    return map;
  }, []);

  // Filtered relations
  const filteredRelations = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return mockRelations.filter(r => {
      if (q && !r.name.toLowerCase().includes(q) && !(r.kvk || '').includes(q) && !r.email.toLowerCase().includes(q)) return false;
      if (filterStatus && r.status !== filterStatus) return false;
      if (filterCompliance && r.complianceStatus !== filterCompliance) return false;
      if (filterPO) {
        const pos = relationPOMap.get(r.id) || [];
        if (!pos.some(p => p.id === filterPO)) return false;
      }
      return true;
    });
  }, [searchQuery, filterStatus, filterCompliance, filterPO, relationPOMap]);

  const dienstRelation = dienstModalRelationId ? mockRelations.find(r => r.id === dienstModalRelationId) : null;
  const dienstPOs = dienstModalRelationId ? (relationPOMap.get(dienstModalRelationId) || []) : [];
  const activeFiltersCount = [filterStatus, filterCompliance, filterPO].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Relaties</h2>
          <p className="text-slate-500 mt-1">Beheer alle connecties en samenwerkingen met relaties.</p>
        </div>
        <button
          onClick={() => setInviteOpen(true)}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
        >
          <Plus size={16} />
          <span>Relatie Uitnodigen</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 space-y-3">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Zoeken op naam, KVK of email..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors cursor-pointer ${showFilters || activeFiltersCount > 0 ? 'bg-blue-50 border-blue-200 text-blue-700' : 'text-slate-600 bg-white border-slate-200 hover:bg-slate-50'}`}
            >
              <Filter size={16} />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">{activeFiltersCount}</span>
              )}
              <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="flex flex-wrap gap-3 pt-1">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</label>
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value as RelationStatus | '')}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
                >
                  <option value="">Alle statussen</option>
                  <option value="Uitgenodigd">Uitgenodigd</option>
                  <option value="Aangemeld">Screening</option>
                  <option value="Goedgekeurd">Screening (goedgekeurd)</option>
                  <option value="Samenwerking_Actief">Actieve Samenwerking</option>
                  <option value="Samenwerking_Beeindigd">Beëindigd</option>
                  <option value="Gearchiveerd">Gearchiveerd</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Compliance</label>
                <select
                  value={filterCompliance}
                  onChange={e => setFilterCompliance(e.target.value as ComplianceStatus | '')}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
                >
                  <option value="">Alle compliance</option>
                  <option value="Groen">Compliant</option>
                  <option value="Oranje">Actie Vereist</option>
                  <option value="Rood">Non-Compliant</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inkoopopdracht</label>
                <select
                  value={filterPO}
                  onChange={e => setFilterPO(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
                >
                  <option value="">Alle inkoopopdrachten</option>
                  {mockPurchaseOrders.map(po => (
                    <option key={po.id} value={po.id}>{po.id} — {po.title}</option>
                  ))}
                </select>
              </div>
              {activeFiltersCount > 0 && (
                <div className="flex items-end">
                  <button
                    onClick={() => { setFilterStatus(''); setFilterCompliance(''); setFilterPO(''); }}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <X size={14} />
                    <span>Wis filters</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Relatie</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">KVK</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Compliance</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">IO&apos;s</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRelations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                    Geen relaties gevonden voor deze zoekopdracht of filters.
                  </td>
                </tr>
              ) : filteredRelations.map((relation) => {
                const canAssign = relation.status === 'Samenwerking_Actief' && relation.complianceStatus === 'Groen';
                return (
                  <tr
                    key={relation.id}
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    onClick={() => router.push(`/client/relations/${relation.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 group-hover:border-blue-200 transition-colors">
                          {relation.type === 'ZZP' ? <User size={16} className="text-slate-500" /> : <Building2 size={16} className="text-slate-500" />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">{relation.name}</p>
                          <p className="text-xs text-slate-500">{relation.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-sm text-slate-500 font-mono">{relation.kvk || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={relation.status} />
                    </td>
                    <td className="px-6 py-4">
                      <ComplianceBadge status={relation.complianceStatus} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                        {relation.activeDossiersCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {canAssign ? (
                        <button
                          onClick={e => { e.stopPropagation(); setDienstModalRelationId(relation.id); }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm shadow-blue-500/20"
                        >
                          <Zap size={13} />
                          <span>Dienst Toewijzen</span>
                        </button>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
          <span className="text-sm text-slate-500">
            {filteredRelations.length === mockRelations.length
              ? `Totaal ${mockRelations.length} relaties`
              : `${filteredRelations.length} van ${mockRelations.length} relaties`}
          </span>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 rounded border border-slate-200 bg-white text-sm hover:bg-slate-50 disabled:opacity-50 cursor-pointer" disabled>Vorige</button>
            <button className="px-3 py-1.5 rounded border border-slate-200 bg-white text-sm hover:bg-slate-50 cursor-pointer">Volgende</button>
          </div>
        </div>
      </div>

      <InviteModal isOpen={inviteOpen} onClose={() => setInviteOpen(false)} />
      {dienstRelation && (
        <ContactModal
          isOpen={!!dienstModalRelationId}
          onClose={() => setDienstModalRelationId(null)}
          dossierId=""
          relationName={dienstRelation.name}
          phone={dienstRelation.phone || ''}
          availablePOs={dienstPOs}
          onLog={() => setDienstModalRelationId(null)}
        />
      )}
    </div>
  );
}
