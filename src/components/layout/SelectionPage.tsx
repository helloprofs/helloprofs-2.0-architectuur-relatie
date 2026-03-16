"use client";

import Link from "next/link";
import { UserCircle, Building2, ArrowRight } from "lucide-react";

export function SelectionPage() {
  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full"></div>

      <div className="z-10 w-full max-w-4xl text-center">
        <div className="mb-12">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20">
            <span className="text-white font-bold text-2xl">h</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Welkom bij <span className="text-blue-500">helloprofs.nl</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
            Kies uw portaal om direct aan de slag te gaan met uw projecten en samenwerkingen.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {/* Client Card */}
          <Link 
            href="/client/dashboard"
            className="group relative p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 backdrop-blur-sm"
          >
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="text-blue-500" />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <UserCircle size={32} className="text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 text-left">Ik ben Opdrachtgever</h3>
            <p className="text-slate-400 text-left leading-relaxed">
              Beheer uw projecten, overzie samenwerkingen en bekijk rapportages van uw ingehuurde professionals.
            </p>
            <div className="mt-8 flex items-center text-blue-400 font-semibold text-sm group-hover:gap-2 transition-all">
              Naar Client Portaal <ArrowRight size={16} className="ml-1" />
            </div>
          </Link>

          {/* Vendor Card */}
          <Link 
            href="/vendor/dashboard"
            className="group relative p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 backdrop-blur-sm"
          >
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="text-indigo-500" />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <Building2 size={32} className="text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 text-left">Ik ben Opdrachtnemer</h3>
            <p className="text-slate-400 text-left leading-relaxed">
              Bekijk openstaande opdrachten, beheer uw beschikbaarheid en handel facturatie direct af.
            </p>
            <div className="mt-8 flex items-center text-indigo-400 font-semibold text-sm group-hover:gap-2 transition-all">
              Naar Vendor Portaal <ArrowRight size={16} className="ml-1" />
            </div>
          </Link>
        </div>

        <p className="mt-16 text-slate-500 text-sm">
          &copy; 2024 helloprofs.nl - De nieuwe standaard in professionele samenwerking.
        </p>
      </div>
    </div>
  );
}
