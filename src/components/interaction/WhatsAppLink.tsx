'use client';

import React, { useState } from 'react';
import { MessageCircle, CheckCircle2 } from 'lucide-react';

interface WhatsAppLinkProps {
  phone: string;
  relationName: string;
  dossierId: string;
  type: 'Aanbod' | 'Herinnering' | 'Vraag';
}

export function WhatsAppLink({ phone, relationName, dossierId, type }: WhatsAppLinkProps) {
  const [isSent, setIsSent] = useState(false);

  const getMessage = () => {
    const baseUrl = "https://hp2.nl/m/";
    const token = Math.random().toString(36).substring(7);
    const magicLink = `${baseUrl}${token}`;
    switch (type) {
      case 'Aanbod':
        return `Dag ${relationName}, we hebben een nieuw werkaanbod voor je klaargezet. Bekijk het direct: ${magicLink}`;
      case 'Herinnering':
        return `Hoi ${relationName}, we hebben nog geen reactie op dossier ${dossierId}. Kun je hier even naar kijken? ${magicLink}`;
      default:
        return `Contact vanuit HelloProfs voor dossier ${dossierId}: ${magicLink}`;
    }
  };

  const handleSend = () => {
    const encodedMsg = encodeURIComponent(getMessage());
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodedMsg}`, '_blank');
    setIsSent(true);
  };

  return (
    <button
      onClick={handleSend}
      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
        isSent
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          : 'bg-[#25D366] hover:bg-[#1ebe5d] text-white shadow-md shadow-green-500/20'
      }`}
    >
      {isSent ? (
        <>
          <CheckCircle2 size={15} />
          <span>Verstuurd</span>
        </>
      ) : (
        <>
          <MessageCircle size={15} />
          <span>WhatsApp Magic Link</span>
        </>
      )}
    </button>
  );
}
