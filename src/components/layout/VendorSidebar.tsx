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



const vendorNavItems = [
  { name: "Dashboard", href: "/vendor/dashboard", icon: LayoutDashboard },
  { name: "Projecten", href: "/vendor/projects", icon: FolderKanban },
  { name: "Inkoopopdrachten", href: "/vendor/purchase-orders", icon: ShoppingCart },
  { name: "Samenwerkingen", href: "/vendor/dossiers", icon: Files },
  { name: "Rapportage", href: "/vendor/reporting", icon: BarChart3 },
  { name: "Relaties", href: "/vendor/relations", icon: Users },
];



export function VendorSidebar() {
  const pathname = usePathname();

  return (
    <aside style={{ width: "260px", minWidth: "260px" }} className="flex flex-col h-screen bg-indigo-950 border-r border-indigo-900">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 px-6 h-16 border-b border-indigo-900 hover:bg-indigo-900/50 transition-colors">
        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">h</span>
        </div>
        <span className="text-white font-semibold text-base">helloprofs.nl</span>
      </Link>


      {/* User Profile */}
      <div className="px-4 py-5 border-b border-indigo-900">
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-semibold text-white">Opdrachtnemer</p>
          <span className="text-xs text-indigo-400">Hoofdaccount</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-3 mb-2 text-xs font-semibold text-indigo-500 uppercase tracking-wider">menu</p>
        <div className="space-y-0.5">
          {vendorNavItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-indigo-300 hover:bg-indigo-900 hover:text-white"
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
      <div className="px-3 py-4 border-t border-indigo-900 space-y-1">
        <Link 
          href="/" 
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-indigo-400 hover:text-white hover:bg-indigo-600/10 transition-colors"
        >
          <ArrowLeftRight size={18} className="flex-shrink-0" />
          <span>Wissel van Portaal</span>
        </Link>
      </div>

    </aside>
  );
}
