"use client";

import { MessageSquare, Phone, Mail, ExternalLink } from "lucide-react";

export default function VendorSupportPage() {
  const supportOptions = [
    {
      title: "Contact Chat",
      description: "Direct contact met ons support team via de chat.",
      icon: MessageSquare,
      action: "Start Chat",
      color: "bg-indigo-50 text-indigo-600"
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
      color: "bg-indigo-50 text-indigo-600"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-slate-800">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Ondersteuning voor Opdrachtnemers</h2>
        <p className="text-slate-500 mt-1">Vragen over facturatie, opdrachten of het gebruik van het portaal?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {supportOptions.map((option) => (
          <div key={option.title} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
            <div className={`p-4 rounded-2xl ${option.color} mb-4`}>
              <option.icon size={24} />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">{option.title}</h3>
            <p className="text-sm text-slate-500 mb-6 flex-1">{option.description}</p>
            <button className="w-full py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors">
              {option.action}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-900">Veelgestelde vragen (Opdrachtnemer)</h3>
          <button className="text-sm text-indigo-600 font-semibold hover:underline flex items-center gap-1">
            Bekijk alle FAQ <ExternalLink size={14} />
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            "Wanneer wordt mijn factuur betaald?",
            "Hoe upload ik mijn urenstaat?",
            "Hoe kan ik op een nieuwe inkoopopdracht reageren?",
            "Mijn dossier-status klopt niet, wat nu?"
          ].map((q) => (
            <div key={q} className="p-6 hover:bg-slate-50 transition-colors cursor-pointer group flex justify-between items-center text-slate-700">
              <p className="text-sm font-medium group-hover:text-indigo-700 transition-colors">{q}</p>
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
