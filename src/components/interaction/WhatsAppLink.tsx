'use client';

import React, { useState } from 'react';
import { MessageSquare, ExternalLink, Send, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

interface WhatsAppLinkProps {
  phone: string;
  relationName: string;
  dossierId: string;
  type: 'Aanbod' | 'Herinnering' | 'Vraag';
}

export function WhatsAppLink({ phone, relationName, dossierId, type }: WhatsAppLinkProps) {
  const [isSent, setIsSent] = useState(false);

  const getMessage = () => {
    const baseUrl = "https://hp2.nl/m/"; // Mocked magic link base
    const token = Math.random().toString(36).substring(7);
    const magicLink = `${baseUrl}${token}`;

    switch (type) {
      case 'Aanbod':
        return `Dag ${relationName}, we hebben een nieuw werkaanbod voor je klaargezet. Bekijk het direct en laat weten of je kunt: ${magicLink}`;
      case 'Herinnering':
        return `Hoi ${relationName}, we hebben nog geen reactie op het openstaande dossier ${dossierId}. Kun je hier even naar kijken? ${magicLink}`;
      default:
        return `Contact vanuit HelloProfs voor dossier ${dossierId}: ${magicLink}`;
    }
  };

  const handleSend = () => {
    const encodedMsg = encodeURIComponent(getMessage());
    const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodedMsg}`;
    
    window.open(whatsappUrl, '_blank');
    setIsSent(true);
    
    // In a real app, this would also trigger a server-side log
    console.log(`Log: WhatsApp link sent to ${phone} for dossier ${dossierId}`);
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleSend}
        className={clsx(
          "flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all duration-300 shadow-md",
          isSent 
            ? "bg-green-100 text-green-700 border-2 border-green-200" 
            : "bg-[#25D366] hover:bg-[#128C7E] text-white hover:scale-[1.02] active:scale-95"
        )}
      >
        {isSent ? (
          <>
            <CheckCircle2 className="w-5 h-5" />
            <span>Link verzonden via WhatsApp</span>
          </>
        ) : (
          <>
            <MessageSquare className="w-5 h-5" />
            <span>Stuur WhatsApp Magic Link</span>
          </>
        )}
      </button>
      
      {!isSent && (
        <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">
          No-Login Strategy: ZZP'er acteert via Magic Link
        </p>
      )}
    </div>
  );
}
