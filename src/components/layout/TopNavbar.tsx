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
    <header className="h-[80px] border-b border-slate-200/60 bg-white/80 backdrop-blur-xl flex items-center justify-between px-8 shrink-0 sticky top-0 z-10">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
        <div className="text-[13px] text-slate-500 font-medium flex gap-2 items-center mt-0.5">
          <span className="hover:text-slate-700 cursor-pointer transition-colors">Workspace</span>
          <span className="text-slate-300">/</span>
          <span className="text-blue-600">{title}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="relative p-2.5 text-slate-400 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-100">
          <Bell size={20} strokeWidth={2.5} />
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
        </button>
        <div className="h-8 w-px bg-slate-200"></div>
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-[14px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Tim de Ruiter</p>
            <p className="text-[12px] font-medium text-slate-500">tim@opdrachtgever.nl</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[13px] shadow-sm transform group-hover:scale-105 transition-transform">
            TR
          </div>
        </div>
      </div>
    </header>
  );
}
