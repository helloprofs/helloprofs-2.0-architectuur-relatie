import { VendorSidebar } from "@/components/layout/VendorSidebar";
import { VendorTopNavbar } from "@/components/layout/VendorTopNavbar";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      <VendorSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <VendorTopNavbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar text-slate-800">
          {children}
        </main>
      </div>
    </div>
  );
}
