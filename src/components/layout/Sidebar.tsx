"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  ShoppingCart,
  Files,
  HelpCircle,
  LogOut,
  UserCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const mspNavItems = [
  { name: "Dashboard", href: "/client/dashboard", icon: LayoutDashboard },
  { name: "Projecten", href: "/client/projects", icon: FolderKanban },
  { name: "Inkoopopdrachten", href: "/client/purchase-orders", icon: ShoppingCart },
  { name: "Samenwerkingen", href: "/client/dossiers", icon: Files },
  { name: "Relaties", href: "/client/relations", icon: Users },
  { name: "Ondersteuning", href: "/client/support", icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{ width: "260px", minWidth: "260px" }} className="flex flex-col h-screen bg-slate-900 border-r border-slate-800">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">h</span>
        </div>
        <span className="text-white font-semibold text-base">helloprofs.nl</span>
      </div>

      {/* User Profile */}
      <div className="px-4 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
            <UserCircle size={20} className="text-slate-300" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">Opdrachtgever B.V.</p>
            <span className="text-xs text-blue-400">Hoofdaccount</span>
          </div>
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
      <div className="px-3 py-4 border-t border-slate-800">
        <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
          <LogOut size={18} className="flex-shrink-0" />
          <span>Uitloggen</span>
        </button>
      </div>
    </aside>
  );
}
