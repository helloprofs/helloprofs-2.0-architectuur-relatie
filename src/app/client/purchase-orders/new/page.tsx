"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Send, FileText, Tag, Euro, Layout, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useDynamicState } from "@/hooks/use-dynamic-state";

function NewPurchaseOrderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { projects, addPurchaseOrder, isLoaded } = useDynamicState();
  
  const projectIdFromQuery = searchParams.get("projectId");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(projectIdFromQuery || "");
  const [selectedRelationIds, setSelectedRelationIds] = useState<string[]>(["R-001"]);

  if (!isLoaded) return <div className="p-8 text-center text-slate-500">Laden...</div>;

  const toggleRelation = (id: string) => {
    setSelectedRelationIds(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    setIsSubmitting(true);
    
    const po = {
      title: formData.get("title"),
      projectId: selectedProjectId,
      type: formData.get("type"),
      budget: Number(formData.get("budget")),
      invitedRelationIds: selectedRelationIds
    };

    // Simulate API call
    setTimeout(() => {
      addPurchaseOrder(po);
      setIsSubmitting(false);
      router.push("/client/purchase-orders");
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <Link
        href="/client/purchase-orders"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft size={15} />
        Terug naar Inkoopopdrachten
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-slate-800">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <FileText size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Nieuwe Inkoopopdracht</h2>
          </div>
          <p className="text-sm text-slate-500">Stuur een nieuwe inkoopopdracht (PO) uit naar één of meerdere relaties.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-semibold text-slate-700">Titel Inkoopopdracht</label>
              <input
                id="title"
                name="title"
                required
                type="text"
                placeholder="Bijv. Installatiewerkzaamheden Blok A"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Project Selection */}
            <div className="space-y-2">
              <label htmlFor="project" className="text-sm font-semibold text-slate-700">Project Koppelen</label>
              <div className="relative">
                <Layout className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select
                  id="project"
                  name="project"
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white appearance-none"
                >
                  <option value="">Selecteer een project...</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Type */}
              <div className="space-y-2">
                <label htmlFor="type" className="text-sm font-semibold text-slate-700">Type Opdracht</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <select
                    id="type"
                    name="type"
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white appearance-none"
                  >
                    <option value="Overeenkomst">Overeenkomst (Project)</option>
                    <option value="Raamopdracht">Raamopdracht (Doorlopend)</option>
                  </select>
                </div>
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <label htmlFor="budget" className="text-sm font-semibold text-slate-700">Budget Indicatie (€)</label>
                <div className="relative">
                  <Euro className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    id="budget"
                    name="budget"
                    type="number"
                    placeholder="0,00"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Recipients (Multi-select simulation) */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Ontvangers (Relaties)</label>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div 
                  className={`flex items-center gap-3 p-3 bg-white border rounded-lg cursor-pointer transition-colors ${selectedRelationIds.includes("R-001") ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-200'}`}
                  onClick={() => toggleRelation("R-001")}
                >
                  <input 
                    type="checkbox" 
                    readOnly 
                    checked={selectedRelationIds.includes("R-001")} 
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-800">Jan de Bouwer (Timmerwerken)</p>
                    <p className="text-xs text-slate-500">Relatie ID: R-001</p>
                  </div>
                </div>
                <div 
                  className={`flex items-center gap-3 p-3 bg-white border rounded-lg cursor-pointer transition-colors ${selectedRelationIds.includes("R-002") ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-200'}`}
                  onClick={() => toggleRelation("R-002")}
                >
                  <input 
                    type="checkbox" 
                    readOnly 
                    checked={selectedRelationIds.includes("R-002")} 
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-800">Electra Fix BV</p>
                    <p className="text-xs text-slate-500">Relatie ID: R-002</p>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <AlertCircle size={10} />
                  Voor elke geselecteerde partij wordt na acceptatie een apart dossier aangemaakt.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              href="/client/purchase-orders"
              className="px-6 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Annuleren
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center gap-2 px-8 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <Send size={18} />
              {isSubmitting ? 'Bezig met verzenden...' : 'Inkoopopdracht Versturen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NewPurchaseOrderPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Laden...</div>}>
      <NewPurchaseOrderContent />
    </Suspense>
  );
}
