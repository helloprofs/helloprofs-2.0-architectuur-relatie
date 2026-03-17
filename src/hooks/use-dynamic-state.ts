"use client";

import { useState, useEffect } from "react";
import { 
  mockProjects, 
  mockPurchaseOrders, 
  mockDossiers,
  Project, 
  PurchaseOrder,
  Dossier
} from "@/lib/mock-data";

export function useDynamicState() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [dossiers, setDossiers] = useState<Dossier[]>(mockDossiers);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedProjects = localStorage.getItem("custom_projects");
    const savedPOs = localStorage.getItem("custom_purchase_orders");
    const savedDossiers = localStorage.getItem("custom_dossiers");

    let updatedProjects = [...mockProjects];
    let updatedPOs = [...mockPurchaseOrders];
    let updatedDossiers = [...mockDossiers];

    if (savedProjects) {
      const parsed = JSON.parse(savedProjects);
      updatedProjects = [...updatedProjects, ...parsed];
    }

    if (savedPOs) {
      const parsed = JSON.parse(savedPOs);
      updatedPOs = [...updatedPOs, ...parsed];
    }

    if (savedDossiers) {
      const parsed = JSON.parse(savedDossiers);
      updatedDossiers = [...updatedDossiers, ...parsed];
    }

    setProjects(updatedProjects);
    setPurchaseOrders(updatedPOs);
    setDossiers(updatedDossiers);
    setIsLoaded(true);
  }, []);

  const addProject = (project: any) => {
    const newProject: Project = {
      id: `PROJ-NEW-${Math.floor(Math.random() * 1000)}`,
      status: "Actief",
      startDate: new Date().toISOString(),
      ...project,
    };

    const saved = localStorage.getItem("custom_projects");
    const current = saved ? JSON.parse(saved) : [];
    const updated = [...current, newProject];
    
    localStorage.setItem("custom_projects", JSON.stringify(updated));
    setProjects([...projects, newProject]);
    return newProject;
  };

  const addPurchaseOrder = (po: any) => {
    const poId = `PO-${Math.floor(Math.random() * 9000) + 1000}`;
    const invitedRelationIds = po.invitedRelationIds || ["R-001"]; 
    
    const newPO: PurchaseOrder = {
      id: poId,
      status: "Verstuurd",
      dateCreated: new Date().toISOString(),
      invitedRelationIds,
      projectId: po.projectId,
      title: po.title,
      description: po.description || "",
      type: po.type,
      budget: po.budget,
    };

    console.log("Saving new PO:", newPO);

    // Create dossiers for each recipient
    const newDossiers: Dossier[] = invitedRelationIds.map((relId: string) => ({
      id: `D-${Math.floor(Math.random() * 9000) + 3000}`,
      purchaseOrderId: poId,
      relationId: relId,
      status: "Inkoopopdracht_Verstuurd",
      historyCount: 1,
    }));

    console.log("Saving new Dossiers:", newDossiers);

    // Save PO
    const savedPOs = localStorage.getItem("custom_purchase_orders");
    const currentPOs = savedPOs ? JSON.parse(savedPOs) : [];
    localStorage.setItem("custom_purchase_orders", JSON.stringify([...currentPOs, newPO]));

    // Save Dossiers
    const savedDossiers = localStorage.getItem("custom_dossiers");
    const currentDossiers = savedDossiers ? JSON.parse(savedDossiers) : [];
    localStorage.setItem("custom_dossiers", JSON.stringify([...currentDossiers, ...newDossiers]));

    setPurchaseOrders(prev => [...prev, newPO]);
    setDossiers(prev => [...prev, ...newDossiers]);
    
    return { po: newPO, dossiers: newDossiers };
  };

  return {
    projects,
    purchaseOrders,
    dossiers,
    isLoaded,
    addProject,
    addPurchaseOrder
  };
}
