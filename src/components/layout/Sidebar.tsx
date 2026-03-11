"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  UserCircle, 
  LayoutDashboard, 
  Users, 
  Tags, 
  FolderKanban, 
  ShoppingCart, 
  Files, 
  BadgePercent, 
  FileSignature, 
  Hammer, 
  Receipt, 
  ReceiptText, 
  HelpCircle,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

const mspNavItems = [
  { name: "Mijn gegevens", href: "/client/profile", icon: UserCircle },
  { name: "Dashboard", href: "/client/dashboard", icon: LayoutDashboard },
  { name: "Relaties", href: "/client/relations", icon: Users },
  { name: "Labels", href: "/client/labels", icon: Tags },
  { name: "Projecten", href: "/client/projects", icon: FolderKanban },
  { name: "Inkoopopdrachten", href: "/client/purchase-orders", icon: ShoppingCart },
  { name: "Dossiers", href: "/client/dossiers", icon: Files },
  { name: "Aanbiedingen", href: "/client/offers", icon: BadgePercent },
  { name: "Contracten", href: "/client/contracts", icon: FileSignature },
  { name: "Werkorders", href: "/client/work-orders", icon: Hammer },
  { name: "Facturen", href: "/client/invoices", icon: Receipt },
  { name: "Creditfacturen", href: "/client/credit-invoices", icon: ReceiptText },
  { name: "Ondersteuning", href: "/client/support", icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-[280px] h-screen bg-[#0A0F1C] text-slate-300 border-r border-[#1E293B] shrink-0 font-sans shadow-2xl z-20">
      {/* Logo Area */}
      <div className="flex items-center h-20 px-8 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <span className="text-white font-bold text-lg leading-none select-none">h</span>
          </div>
          <span className="text-white font-bold tracking-wide text-lg select-none">helloprofs.nl</span>
        </div>
      </div>

      {/* User Profile Summary */}
      <div className="p-8 border-b border-white/5 flex flex-col items-center justify-center bg-white/[0.01]">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center mb-4 ring-2 ring-white/10 shadow-lg relative cursor-pointer overflow-hidden group">
           <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <UserCircle size={40} className="text-slate-300" strokeWidth={1.5} />
        </div>
        <p className="text-white font-semibold text-[15px] tracking-wide">Opdrachtgever B.V.</p>
        <span className="px-2.5 py-1 mt-2 text-[11px] font-bold tracking-widest uppercase text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-full">
          Hoofdaccount
        </span>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 custom-scrollbar px-4">
        <p className="px-4 text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-3 select-none">Workspace</p>
        <nav className="space-y-1">
          {mspNavItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 group relative",
                  isActive 
                    ? "text-white bg-blue-600/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] border border-blue-500/20" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.7)]"></div>
                )}
                <item.icon 
                   size={18} 
                   strokeWidth={isActive ? 2.5 : 2} 
                   className={cn(
                     "transition-colors duration-200", 
                     isActive ? "text-blue-500" : "text-slate-500 group-hover:text-slate-300"
                   )} 
                 />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-800">
         <button className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm text-slate-400 hover:text-white transition-colors hover:bg-slate-800/50">
            <LogOut size={18} />
            <span>Uitloggen</span>
         </button>
      </div>
    </div>
  );
}
