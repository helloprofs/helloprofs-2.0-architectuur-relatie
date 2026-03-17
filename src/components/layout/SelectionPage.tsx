"use client";

import Link from "next/link";
import { UserCircle, Building2, ArrowRight } from "lucide-react";

export function SelectionPage() {
  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-6 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px]">
      <div className="z-10 w-full max-w-4xl text-center">
        <div className="mb-16">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
            <span className="text-white font-bold text-xl">h</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Welkom bij <span className="text-blue-600">helloprofs.nl</span>
          </h1>
          <p className="text-slate-600 text-lg max-w-xl mx-auto">
            Kies uw portaal om direct aan de slag te gaan met uw projecten en samenwerkingen.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Client Card */}
          <Link 
            href="/client/dashboard"
            className="group p-8 rounded-2xl bg-white border border-slate-200 hover:border-blue-500/50 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 text-left"
          >
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
              <UserCircle size={24} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Ik ben Opdrachtgever</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Beheer uw projecten, overzie samenwerkingen en bekijk rapportages van uw ingehuurde professionals.
            </p>
            <div className="flex items-center text-blue-600 font-medium text-sm">
              Naar Client Portaal <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Vendor Card */}
          <Link 
            href="/vendor/dashboard"
            className="group p-8 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 text-left"
          >
            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center mb-6 group-hover:bg-slate-200 transition-colors">
              <Building2 size={24} className="text-slate-700" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Ik ben Opdrachtnemer</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Bekijk openstaande opdrachten, beheer uw beschikbaarheid en handel facturatie direct af.
            </p>
            <div className="flex items-center text-slate-700 font-medium text-sm">
              Naar Vendor Portaal <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        <p className="mt-20 text-slate-400 text-xs font-medium uppercase tracking-widest">
          &copy; 2024 helloprofs.nl
        </p>
      </div>
    </div>
  );
}
