"use client";

import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";

export function TopNavbar() {
  const pathname = usePathname();
  
  // Basic breadcrumb generation based on URL
  const pathParts = pathname.split('/').filter(Boolean);
  const currentSection = pathParts[pathParts.length - 1] || 'Dashboard';
  
  // Capitalize first letter safely
  const title = currentSection.charAt(0).toUpperCase() + currentSection.slice(1).replace('-', ' ');

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 shrink-0">
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
        <div className="text-xs text-slate-500 font-medium flex gap-2">
          <span>Client</span>
          <span className="text-slate-300">/</span>
          <span className="text-blue-600">{title}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-500 hover:text-slate-700 transition-colors rounded-full hover:bg-slate-100">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border-2 border-white"></span>
        </button>
        <div className="h-8 w-px bg-slate-200"></div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-700">Tim de Ruiter</p>
            <p className="text-xs text-slate-500">tim@opdrachtgever.nl</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-medium text-sm">
            TR
          </div>
        </div>
      </div>
    </header>
  );
}
