"use client";

import { HelpCircle, MessageSquare, Phone, Mail, ExternalLink } from "lucide-react";

export default function SupportPage() {
  const supportOptions = [
    {
      title: "Contact Chat",
      description: "Direct contact met ons support team via de chat.",
      icon: MessageSquare,
      action: "Start Chat",
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Email",
      description: "Stuur ons een email met uw vraag of probleem.",
      icon: Mail,
      action: "support@helloprofs.nl",
      color: "bg-indigo-50 text-indigo-600"
    },
    {
      title: "Telefonisch",
      description: "Wij zijn bereikbaar op werkdagen van 09:00 tot 17:00.",
      icon: Phone,
      action: "088 - 123 4567",
      color: "bg-emerald-50 text-emerald-600"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Ondersteuning</h2>
        <p className="text-slate-500 mt-1">Hulp nodig bij het gebruik van helloprofs.nl? We staan voor u klaar.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {supportOptions.map((option) => (
          <div key={option.title} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
            <div className={`p-4 rounded-2xl ${option.color} mb-4`}>
              <option.icon size={24} />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">{option.title}</h3>
            <p className="text-sm text-slate-500 mb-6 flex-1">{option.description}</p>
            <button className="w-full py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              {option.action}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-900">Veelgestelde vragen</h3>
          <button className="text-sm text-blue-600 font-semibold hover:underline flex items-center gap-1">
            Bekijk alle FAQ <ExternalLink size={14} />
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            "Hoe kan ik een nieuwe inkoopopdracht aanmaken?",
            "Hoe nodig ik een relatie uit?",
            "Waar kan ik mijn facturen inzien?",
            "Hoe wijzig ik mijn accountgegevens?"
          ].map((q) => (
            <div key={q} className="p-6 hover:bg-slate-50 transition-colors cursor-pointer group flex justify-between items-center">
              <p className="text-sm text-slate-700 font-medium group-hover:text-blue-700 transition-colors">{q}</p>
              <ArrowRight size={14} className="text-slate-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ArrowRight({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
