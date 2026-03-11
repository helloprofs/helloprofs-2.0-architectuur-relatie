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
    <div className="flex flex-col w-64 h-screen bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0">
      {/* Logo Area */}
      <div className="flex items-center h-16 px-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg leading-none">h</span>
          </div>
          <span className="text-white font-semibold tracking-wide">helloprofs.nl</span>
        </div>
      </div>

      {/* User Profile Summary */}
      <div className="p-6 border-b border-slate-800 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mb-3 ring-2 ring-slate-800">
          <UserCircle size={32} className="text-slate-400" />
        </div>
        <p className="text-white font-medium text-sm">Opdrachtgever B.V.</p>
        <p className="text-xs text-slate-500 mt-1">Hoofdaccount</p>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <nav className="space-y-1 px-3">
          {mspNavItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-200",
                  isActive 
                    ? "bg-blue-600/10 text-blue-400 font-medium" 
                    : "hover:bg-slate-800/50 hover:text-white"
                )}
              >
                <item.icon size={18} className={cn(isActive && "text-blue-500")} />
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
