'use client';

import React, { useState } from 'react';
import { Check, X, PhoneOff, MessageSquare, ShieldCheck } from 'lucide-react';
import { clsx } from 'clsx';

interface OutcomeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (outcome: 'Geaccepteerd' | 'Geweigerd' | 'Geen_gehoor', reason?: string) => void;
  relationName: string;
}

export function OutcomeOverlay({ isOpen, onClose, onSelect, relationName }: OutcomeOverlayProps) {
  const [selected, setSelected] = useState<'Geaccepteerd' | 'Geweigerd' | 'Geen_gehoor' | null>(null);
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selected) {
      onSelect(selected, reason);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 text-center border-b border-gray-100">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <PhoneOff className="text-blue-600 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Gesprek afgerond</h2>
          <p className="text-gray-500 text-sm">Leg het resultaat vast voor <strong>{relationName}</strong></p>
        </div>

        <div className="p-6 space-y-4">
          <button
            onClick={() => setSelected('Geaccepteerd')}
            className={clsx(
              "w-full flex items-center p-4 rounded-2xl border-2 transition-all duration-200",
              selected === 'Geaccepteerd' 
                ? "border-green-500 bg-green-50 text-green-900" 
                : "border-gray-100 bg-gray-50 text-gray-700 hover:border-gray-200"
            )}
          >
            <div className={clsx(
              "w-10 h-10 rounded-full flex items-center justify-center mr-4",
              selected === 'Geaccepteerd' ? "bg-green-500 text-white" : "bg-white text-green-500"
            )}>
              <Check className="w-6 h-6" />
            </div>
            <div className="text-left">
              <span className="block font-bold">Geaccepteerd</span>
              <span className="text-xs opacity-70">ZZP'er gaat akkoord met het aanbod</span>
            </div>
          </button>

          <button
            onClick={() => setSelected('Geweigerd')}
            className={clsx(
              "w-full flex items-center p-4 rounded-2xl border-2 transition-all duration-200",
              selected === 'Geweigerd' 
                ? "border-red-500 bg-red-50 text-red-900" 
                : "border-gray-100 bg-gray-50 text-gray-700 hover:border-gray-200"
            )}
          >
            <div className={clsx(
              "w-10 h-10 rounded-full flex items-center justify-center mr-4",
              selected === 'Geweigerd' ? "bg-red-500 text-white" : "bg-white text-red-500"
            )}>
              <X className="w-6 h-6" />
            </div>
            <div className="text-left">
              <span className="block font-bold">Geweigerd</span>
              <span className="text-xs opacity-70">Wordt gelogd als Refusal Evidence</span>
            </div>
          </button>

          <button
            onClick={() => setSelected('Geen_gehoor')}
            className={clsx(
              "w-full flex items-center p-4 rounded-2xl border-2 transition-all duration-200",
              selected === 'Geen_gehoor' 
                ? "border-yellow-500 bg-yellow-50 text-yellow-900" 
                : "border-gray-100 bg-gray-50 text-gray-700 hover:border-gray-200"
            )}
          >
            <div className={clsx(
              "w-10 h-10 rounded-full flex items-center justify-center mr-4",
              selected === 'Geen_gehoor' ? "bg-yellow-500 text-white" : "bg-white text-yellow-500"
            )}>
              <PhoneOff className="w-6 h-6" />
            </div>
            <div className="text-left">
              <span className="block font-bold">Geen gehoor</span>
              <span className="text-xs opacity-70">Poging gelogd in de tijdlijn</span>
            </div>
          </button>

          {selected === 'Geweigerd' && (
            <div className="animate-in slide-in-from-top duration-300">
              <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase letter-spacing-wider">Reden van weigering (Optioneel)</label>
              <textarea 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Bijv. Te druk, tarief te laag..."
                className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm"
                rows={2}
              />
              <div className="mt-2 flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <p className="text-[10px] text-blue-800 leading-tight">
                  Dit bewijs ondersteunt de zelfstandigheid van de ZZP'er bij een Belastingdienst audit.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-4 font-bold text-gray-500 hover:text-gray-700 transition-colors"
          >
            Annuleren
          </button>
          <button 
            disabled={!selected}
            onClick={handleConfirm}
            className={clsx(
              "flex-[2] py-4 rounded-2xl font-bold text-white shadow-lg transition-all duration-200 transform",
              selected ? "bg-blue-600 hover:bg-blue-700 scale-100" : "bg-gray-300 cursor-not-allowed scale-95"
            )}
          >
            Vastleggen
          </button>
        </div>
      </div>
    </div>
  );
}
