// c:\Projects\helloprofs-2.0-architectuur\src\lib\mock-data.ts

// --- 1. RELATIELAAG ---
export type RelationStatus = 
  | 'Uitgenodigd' 
  | 'Aangemeld' 
  | 'Goedgekeurd' 
  | 'Samenwerking_Actief' 
  | 'Samenwerking_Beeindigd' 
  | 'Gearchiveerd';

export interface Relation {
  id: string;
  type: 'ZZP' | 'B2B_MKB';
  name: string;
  kvk?: string;
  email: string;
  status: RelationStatus;
  labels: string[]; // Vervanging voor Werkgroepen
  dateAdded: string;
  activeDossiersCount: number;
}

export const mockRelations: Relation[] = [
  {
    id: 'R-001',
    type: 'ZZP',
    name: 'Jan de Bouwer (Timmerwerken)',
    kvk: '12345678',
    email: 'jan@jandebouwer.nl',
    status: 'Samenwerking_Actief',
    labels: ['Timmerman', 'Bouw'],
    dateAdded: '2025-01-10',
    activeDossiersCount: 2
  },
  {
    id: 'R-002',
    type: 'B2B_MKB',
    name: 'Electra Fix BV',
    kvk: '87654321',
    email: 'info@electrafix.nl',
    status: 'Goedgekeurd', // Nog geen lopend dossier
    labels: ['Elektricien', 'Installatietechniek'],
    dateAdded: '2025-02-15',
    activeDossiersCount: 0
  },
  {
    id: 'R-003',
    type: 'ZZP',
    name: 'Schildersbedrijf Van der Kleij',
    email: 'peter@vdkleij.nl',
    status: 'Uitgenodigd', // Enkel invited, geen KVK nog
    labels: ['Schilder'],
    dateAdded: '2025-03-01',
    activeDossiersCount: 0
  }
];

// --- 2. PROJECTLAAG ---
export interface Project {
  id: string;
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate?: string;
  status: 'Draft' | 'Actief' | 'Afgerond';
}

export const mockProjects: Project[] = [
  {
    id: 'P-100',
    name: 'Nieuwbouw 25 Woningen Almere',
    description: 'Realisatie van 25 eengezinswoningen in Almere Poort.',
    location: 'Almere Poort',
    startDate: '2025-04-01',
    status: 'Actief'
  },
  {
    id: 'P-101',
    name: 'Onderhoudscontract Woningbouwvereniging Y',
    description: 'Langdurig (raam)onderhoud voor huurwoningen in regio Utrecht.',
    location: 'Regio Utrecht',
    startDate: '2025-01-01',
    endDate: '2026-12-31',
    status: 'Actief'
  }
];

// --- 3. INKOOPOPDRACHTLAAG ---
export type PurchaseOrderType = 'Overeenkomst' | 'Raamopdracht';

export interface PurchaseOrder {
  id: string;
  projectId: string;
  title: string;
  description: string;
  type: PurchaseOrderType;
  budget?: number;
  dateCreated: string;
  status: 'Concept' | 'Verstuurd' | 'Geannuleerd' | 'Afgerond';
  invitedRelationIds: string[]; // De relaties waar dit naartoe gestuurd is
}

export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO-2001',
    projectId: 'P-100', // Koppel aan Almere
    title: 'Aftimmeren kozijnen fase 1',
    description: 'Het volledig aftimmeren van alle houten kozijnen op begane grond van kavel 1 t/m 10.',
    type: 'Overeenkomst',
    budget: 15000,
    dateCreated: '2025-03-05',
    status: 'Verstuurd',
    invitedRelationIds: ['R-001', 'R-003'] // Jan de Bouwer & Peter
  },
  {
    id: 'PO-2002',
    projectId: 'P-101', // Koppel aan Onderhoud
    title: 'Raamovereenkomst Elektra Storingen',
    description: '24/7 bereikbaarheid voor elektra storingen. Facturatie via deelopdrachten.',
    type: 'Raamopdracht',
    dateCreated: '2025-01-10',
    status: 'Verstuurd',
    invitedRelationIds: ['R-002'] // Electra Fix
  }
];

// --- 4. DOSSIERLAAG ---
export type DossierStatus = 
  | 'Inkoopopdracht_Verstuurd'
  | 'Niet_Gereageerd'
  | 'Inkoopopdracht_Geweigerd'
  | 'Aanbod_Verstuurd'
  | 'Aanbod_Geaccepteerd'
  | 'Contract_Lopend'
  | 'Contract_Verlopen';

export interface Dossier {
  id: string;
  purchaseOrderId: string;
  relationId: string; // Degene met wie het dossier is gesloten
  status: DossierStatus;
  historyCount: number;
}

// Resultaat van de Purchase Orders die verstuurd zijn
export const mockDossiers: Dossier[] = [
  // PO-2001 was verstuurd naar Jan (R-001) en Peter (R-003) -> 2 Dossiers
  {
    id: 'D-3001',
    purchaseOrderId: 'PO-2001',
    relationId: 'R-001', // Jan de Bouwer
    status: 'Aanbod_Verstuurd', // Jan heeft gereageerd
    historyCount: 3
  },
  {
    id: 'D-3002',
    purchaseOrderId: 'PO-2001',
    relationId: 'R-003', // Peter de Schilder
    status: 'Inkoopopdracht_Geweigerd', // Heeft afgezegd, maar dossier BLIJFT bestaan (Audittrail)
    historyCount: 2
  },
  // PO-2002 was verstuurd naar Electra Fix (R-002)
  {
    id: 'D-3003',
    purchaseOrderId: 'PO-2002',
    relationId: 'R-002', // Electra Fix
    status: 'Inkoopopdracht_Verstuurd', // Wacht nog op antwoord
    historyCount: 1
  }
];
