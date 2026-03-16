"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  ShoppingCart,
  Files,
  LogOut,
  UserCircle,
  BarChart3,
  ArrowLeftRight
} from "lucide-react";
import { cn } from "@/lib/utils";


const mspNavItems = [
  { name: "Dashboard", href: "/client/dashboard", icon: LayoutDashboard },
  { name: "Projecten", href: "/client/projects", icon: FolderKanban },
  { name: "Inkoopopdrachten", href: "/client/purchase-orders", icon: ShoppingCart },
  { name: "Samenwerkingen", href: "/client/dossiers", icon: Files },
  { name: "Rapportage", href: "/client/reporting", icon: BarChart3 },
  { name: "Relaties", href: "/client/relations", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{ width: "260px", minWidth: "260px" }} className="flex flex-col h-screen bg-slate-900 border-r border-slate-800">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 px-6 h-16 border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">h</span>
        </div>
        <span className="text-white font-semibold text-base">helloprofs.nl</span>
      </Link>


      {/* User Profile */}
      <div className="px-4 py-5 border-b border-slate-800">
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-semibold text-white">Opdrachtgever</p>
          <span className="text-xs text-blue-400">Hoofdaccount</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Menu</p>
        <div className="space-y-0.5">
          {mspNavItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon size={18} className="flex-shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-slate-800 space-y-1">
        <Link 
          href="/" 
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-blue-400 hover:text-white hover:bg-blue-600/10 transition-colors"
        >
          <ArrowLeftRight size={18} className="flex-shrink-0" />
          <span>Wissel van Portaal</span>
        </Link>
      </div>

    </aside>
  );
}
