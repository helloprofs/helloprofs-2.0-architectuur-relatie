"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Layout, MapPin, Calendar, AlignLeft } from "lucide-react";
import Link from "next/link";
import { useDynamicState } from "@/hooks/use-dynamic-state";

export default function NewProjectPage() {
  const router = useRouter();
  const { addProject } = useDynamicState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    setIsSubmitting(true);
    
    const project = {
      name: formData.get("name"),
      location: formData.get("location"),
      description: formData.get("description"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
    };

    // Simulate API call
    setTimeout(() => {
      addProject(project);
      setIsSubmitting(false);
      router.push("/client/projects");
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <Link
        href="/client/projects"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft size={15} />
        Terug naar Projecten
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Layout size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Nieuw Project Aanmaken</h2>
          </div>
          <p className="text-sm text-slate-500">Definieer een nieuw project om inkoopopdrachten aan te koppelen.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Project Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-semibold text-slate-700">Projectnaam</label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  required
                  type="text"
                  placeholder="Bijv. Renovatie Hoofdkantoor"
                  className="w-full pl-3 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-semibold text-slate-700">Locatie</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  id="location"
                  name="location"
                  required
                  type="text"
                  placeholder="Stad of Adres"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="startDate" className="text-sm font-semibold text-slate-700">Startdatum</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    id="startDate"
                    name="startDate"
                    required
                    type="date"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="endDate" className="text-sm font-semibold text-slate-700">Einddatum (Optioneel)</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-semibold text-slate-700">Beschrijving</label>
              <div className="relative">
                <AlignLeft className="absolute left-3 top-3 text-slate-400" size={16} />
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  placeholder="Korte omschrijving van het project en de doelstellingen..."
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              href="/client/projects"
              className="px-6 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Annuleren
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <Save size={18} />
              {isSubmitting ? 'Bezig met opslaan...' : 'Project Aanmaken'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
