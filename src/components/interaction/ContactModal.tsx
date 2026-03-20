'use client';

import React, { useState } from 'react';
import { Phone, MessageCircle, Check, X, PhoneOff, ShieldCheck, ChevronLeft, Zap } from 'lucide-react';

type Step = 'context' | 'call-outcome';
type Outcome = 'Geaccepteerd' | 'Geweigerd' | 'Geen_gehoor';

interface PO {
  id: string;
  title: string;
  type: string;
}

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  relationName?: string;
  phone?: string;
  dossierId: string;
  availablePOs: PO[];
  defaultPOId?: string;
  availableRelations?: { id: string; name: string; phone: string; availablePOs: { id: string; title: string; type: string }[] }[];
  onLog: (params: {
    channel: 'call' | 'whatsapp';
    outcome: Outcome;
    description: string;
    projectLabel: string;
    poId: string;
    reason?: string;
  }) => void;
}

export function ContactModal({
  isOpen, onClose, relationName: relationNameProp, phone: phoneProp, dossierId,
  availablePOs, defaultPOId, availableRelations, onLog
}: ContactModalProps) {
  const [step, setStep] = useState<Step>('context');
  const [channel, setChannel] = useState<'call' | 'whatsapp' | null>(null);
  const [selectedPOId, setSelectedPOId] = useState(defaultPOId || availablePOs[0]?.id || '');
  const [description, setDescription] = useState('');
  const [projectLabel, setProjectLabel] = useState('');
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [reason, setReason] = useState('');
  const [selectedRelationId, setSelectedRelationId] = useState('');

  if (!isOpen) return null;

  const selectedRelation = availableRelations?.find(r => r.id === selectedRelationId);
  const relationName = selectedRelation?.name ?? relationNameProp ?? '';
  const phone = selectedRelation?.phone ?? phoneProp ?? '';
  const activePOs = selectedRelation ? selectedRelation.availablePOs : availablePOs;
  const selectedPO = activePOs.find(p => p.id === selectedPOId);

  const handleReset = () => {
    setStep('context');
    setChannel(null);
    setOutcome(null);
    setReason('');
  };

  const handleClose = () => {
    handleReset();
    setDescription('');
    setProjectLabel('');
    setSelectedRelationId('');
    onClose();
  };

  const handleBellen = () => {
    window.open(`tel:${phone.replace(/[^0-9+]/g, '')}`, '_self');
    setChannel('call');
    setStep('call-outcome');
  };

  const handleWhatsApp = () => {
    const baseUrl = 'https://hp2.nl/m/';
    const token = Math.random().toString(36).substring(7);
    const magicLink = `${baseUrl}${token}`;
    const desc = description || selectedPO?.title || 'een dienst';
    const msg = `Hoi ${relationName}, heb je tijd voor: "${desc}"? Graag hier even bevestigen of weigeren: ${magicLink}`;
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
    onLog({ channel: 'whatsapp', outcome: 'Geaccepteerd', description: desc, projectLabel, poId: selectedPOId });
    handleClose();
  };

  const handleConfirmOutcome = () => {
    if (!outcome) return;
    onLog({ channel: 'call', outcome, description, projectLabel, poId: selectedPOId, reason });
    handleClose();
  };

  const canProceed = description.trim().length > 0;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* ── STAP 1: CONTEXT ── */}
        {step === 'context' && (
          <>
            <div className="px-6 pt-6 pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Dienst toewijzen</span>
                <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                  <X size={18} />
                </button>
              </div>
              <h2 className="text-lg font-bold text-slate-900">{relationName || 'Relatie selecteren'}</h2>
              <p className="text-xs text-slate-500 mt-0.5">Selecteer relatie, context en zet de dienst uit via bellen of WhatsApp</p>
            </div>

            <div className="p-6 space-y-4">
              {/* Selecteer relatie (alleen tonen als availableRelations aanwezig is) */}
              {availableRelations && availableRelations.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selecteer relatie</label>
                  <select
                    value={selectedRelationId}
                    onChange={e => {
                      const relId = e.target.value;
                      setSelectedRelationId(relId);
                      const rel = availableRelations.find(r => r.id === relId);
                      if (rel && rel.availablePOs.length > 0) {
                        setSelectedPOId(rel.availablePOs[0].id);
                      } else {
                        setSelectedPOId('');
                      }
                    }}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all appearance-none"
                  >
                    <option value="">— Selecteer een relatie —</option>
                    {availableRelations.map(rel => (
                      <option key={rel.id} value={rel.id}>{rel.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Inkoopopdracht */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inkoopopdracht</label>
                <select
                  value={selectedPOId}
                  onChange={e => setSelectedPOId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all appearance-none"
                >
                  {activePOs.map(po => (
                    <option key={po.id} value={po.id}>{po.id} — {po.title}</option>
                  ))}
                  <option value="">Ad-hoc (geen IO)</option>
                </select>
              </div>

              {/* Omschrijving */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Omschrijving <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  autoFocus
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Bijv. Spoeddienst spoorherstel Utrecht"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Project label */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Project-label <span className="opacity-50">(optioneel)</span></label>
                <input
                  type="text"
                  value={projectLabel}
                  onChange={e => setProjectLabel(e.target.value)}
                  placeholder="#Project-402"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleBellen}
                  disabled={!canProceed}
                  className="flex flex-col items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer border-none disabled:shadow-none disabled:cursor-not-allowed"
                >
                  <Phone size={20} fill="currentColor" />
                  <span>Bellen & Vastleggen</span>
                </button>
                <button
                  onClick={handleWhatsApp}
                  disabled={!canProceed}
                  className="flex flex-col items-center justify-center gap-2 py-4 bg-[#25D366] hover:bg-[#1ebe5d] disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-bold text-sm shadow-md shadow-green-500/20 transition-all cursor-pointer border-none disabled:shadow-none disabled:cursor-not-allowed"
                >
                  <MessageCircle size={20} />
                  <span>WhatsApp & Vastleggen</span>
                </button>
              </div>

              {!canProceed && (
                <p className="text-center text-xs text-slate-400">Vul een omschrijving in om door te gaan</p>
              )}
            </div>
          </>
        )}

        {/* ── STAP 2: CALL OUTCOME ── */}
        {step === 'call-outcome' && (
          <>
            <div className="px-6 pt-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3 mb-1">
                <button onClick={handleReset} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                  <ChevronLeft size={18} />
                </button>
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Gespreks-outcome</span>
                  <h2 className="text-lg font-bold text-slate-900 leading-tight">Gesprek afgerond?</h2>
                </div>
              </div>
              <p className="text-xs text-slate-500 ml-8">Leg het resultaat vast voor <strong>{relationName}</strong></p>
              {description && (
                <div className="ml-8 mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg">
                  <Zap size={11} className="text-slate-400" />
                  <span className="text-xs font-medium text-slate-600">{description}</span>
                </div>
              )}
            </div>

            <div className="p-6 space-y-3">
              {([
                { value: 'Geaccepteerd', label: 'Geaccepteerd', sub: 'Deelopdracht wordt aangemaakt', color: 'emerald' },
                { value: 'Geweigerd', label: 'Geweigerd', sub: 'Wordt opgeslagen als refusal evidence', color: 'rose' },
                { value: 'Geen_gehoor', label: 'Geen gehoor', sub: 'Poging gelogd in de tijdlijn', color: 'amber' },
              ] as const).map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setOutcome(opt.value)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    outcome === opt.value
                      ? opt.color === 'emerald' ? 'border-emerald-400 bg-emerald-50'
                        : opt.color === 'rose' ? 'border-rose-400 bg-rose-50'
                        : 'border-amber-400 bg-amber-50'
                      : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    outcome === opt.value
                      ? opt.color === 'emerald' ? 'bg-emerald-500 text-white'
                        : opt.color === 'rose' ? 'bg-rose-500 text-white'
                        : 'bg-amber-500 text-white'
                      : 'bg-white text-slate-400 border border-slate-200'
                  }`}>
                    {opt.color === 'emerald' ? <Check size={16} strokeWidth={3} /> : opt.color === 'rose' ? <X size={16} strokeWidth={3} /> : <PhoneOff size={16} />}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-800">{opt.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{opt.sub}</p>
                  </div>
                </button>
              ))}

              {outcome === 'Geweigerd' && (
                <div className="space-y-2 pt-1">
                  <input
                    type="text"
                    autoFocus
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder="Reden van weigering (optioneel)"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                  />
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-xl border border-blue-100">
                    <ShieldCheck size={13} className="text-blue-600 flex-shrink-0" />
                    <p className="text-[10px] text-blue-700 font-medium">Bewijs van ondernemersvrijheid — juridisch relevant bij Belastingdienst audit</p>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button onClick={handleClose} className="px-5 py-3 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors cursor-pointer">
                Annuleren
              </button>
              <button
                onClick={handleConfirmOutcome}
                disabled={!outcome}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 shadow-md shadow-blue-500/20 disabled:shadow-none transition-all cursor-pointer border-none disabled:cursor-not-allowed"
              >
                Vastleggen in dossier
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
