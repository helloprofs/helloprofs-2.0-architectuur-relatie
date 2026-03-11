"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";

const sectionNames: Record<string, string> = {
  dashboard: "Dashboard",
  relations: "Relaties",
  projects: "Projecten",
  "purchase-orders": "Inkoopopdrachten",
  dossiers: "Samenwerkingsdossiers",
  support: "Ondersteuning",
};

export function TopNavbar() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const currentSection = segments[segments.length - 1] || "dashboard";
  const title = sectionNames[currentSection] || currentSection.charAt(0).toUpperCase() + currentSection.slice(1);

  return (
    <header className="flex items-center justify-between h-16 px-8 bg-white border-b border-slate-200 flex-shrink-0">
      <div>
        <p className="text-xs font-medium text-slate-400">helloprofs.nl / {title}</p>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-800">Tim de Ruiter</p>
            <p className="text-xs text-slate-500">tim@opdrachtgever.nl</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
            TR
          </div>
        </div>
      </div>
    </header>
  );
}
