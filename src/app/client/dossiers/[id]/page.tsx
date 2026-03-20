"use client";

import { useParams } from "next/navigation";
import { DossierDetailContent } from "@/components/dossier/DossierDetailContent";

export default function DossierDetailPage() {
  const { id } = useParams<{ id: string }>();
  return <DossierDetailContent dossierId={id} showBreadcrumb={true} />;
}
