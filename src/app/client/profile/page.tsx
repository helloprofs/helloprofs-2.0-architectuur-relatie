"use client";

import { User, Shield, CheckCircle2 } from "lucide-react";

export default function ClientProfilePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mijn Profiel</h1>
        <p className="text-slate-500">Beheer uw accountgegevens en instellingen.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-slate-800 text-white flex items-center justify-center text-3xl font-bold">
            TR
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Tim de Ruiter</h2>
            <p className="text-slate-500">tim@opdrachtgever.nl</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">Hoofdaccount</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 flex items-center gap-1">
                <Shield size={12} /> Geverifieerd
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-slate-800">
                <User size={18} className="text-blue-500" />
                Persoonlijke Informatie
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Organisatie</label>
                  <p className="text-sm font-medium text-slate-800">Opdrachtgever B.V.</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Rol</label>
                  <p className="text-sm font-medium text-slate-800">Inkoop Manager</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 text-slate-800">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-blue-500" />
                Account Status
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase text-slate-500">Lid sinds</label>
                  <p className="text-sm font-medium text-slate-800">Januari 2024</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase text-slate-500">Laatste Login</label>
                  <p className="text-sm font-medium text-slate-800">Vandaag, 10:45</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
