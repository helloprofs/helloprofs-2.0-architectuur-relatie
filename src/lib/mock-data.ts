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
  relationId: string;
  status: DossierStatus;
  historyCount: number;
}

export const mockDossiers: Dossier[] = [
  {
    id: 'D-3001',
    purchaseOrderId: 'PO-2001',
    relationId: 'R-001',
    status: 'Aanbod_Verstuurd',
    historyCount: 3
  },
  {
    id: 'D-3002',
    purchaseOrderId: 'PO-2001',
    relationId: 'R-003',
    status: 'Inkoopopdracht_Geweigerd',
    historyCount: 2
  },
  {
    id: 'D-3003',
    purchaseOrderId: 'PO-2002',
    relationId: 'R-002',
    status: 'Inkoopopdracht_Verstuurd',
    historyCount: 1
  }
];

// --- TIJDLIJN EVENTS ---
export type EventType =
  | 'inkoopopdracht_verstuurd'
  | 'inkoopopdracht_geaccepteerd'
  | 'inkoopopdracht_geweigerd'
  | 'aanbod_verstuurd'
  | 'aanbod_geaccepteerd'
  | 'aanbod_afgewezen'
  | 'contract_ondertekend'
  | 'bijlage_toegevoegd'
  | 'bericht_verstuurd'
  | 'controle_vastgelegd';

export interface DossierEvent {
  id: string;
  dossierId: string;
  type: EventType;
  date: string;
  description: string;
  actor: string; // wie heeft de actie uitgevoerd
  linkedSection?: string; // tab om naar te linken
}

export const mockDossierEvents: DossierEvent[] = [
  // D-3001 (Jan de Bouwer - Aanbod Verstuurd)
  { id: 'E-001', dossierId: 'D-3001', type: 'inkoopopdracht_verstuurd', date: '2025-03-05T09:00:00', description: 'Inkoopopdracht verstuurd naar Jan de Bouwer (Timmerwerken)', actor: 'Tim de Ruiter', linkedSection: 'inkoopopdracht' },
  { id: 'E-002', dossierId: 'D-3001', type: 'inkoopopdracht_geaccepteerd', date: '2025-03-06T14:30:00', description: 'Inkoopopdracht geaccepteerd door opdrachtnemer', actor: 'Jan de Bouwer', linkedSection: 'inkoopopdracht' },
  { id: 'E-003', dossierId: 'D-3001', type: 'bijlage_toegevoegd', date: '2025-03-07T10:15:00', description: 'Tekening kozijnen fase 1.pdf toegevoegd', actor: 'Tim de Ruiter', linkedSection: 'bijlagen' },
  { id: 'E-004', dossierId: 'D-3001', type: 'aanbod_verstuurd', date: '2025-03-10T11:00:00', description: 'Aanbod verstuurd: €13.750 excl. BTW voor alle kozijnen kavel 1-10', actor: 'Jan de Bouwer', linkedSection: 'aanbod' },

  // D-3002 (Peter de Schilder - Geweigerd)
  { id: 'E-005', dossierId: 'D-3002', type: 'inkoopopdracht_verstuurd', date: '2025-03-05T09:00:00', description: 'Inkoopopdracht verstuurd naar Schildersbedrijf Van der Kleij', actor: 'Tim de Ruiter', linkedSection: 'inkoopopdracht' },
  { id: 'E-006', dossierId: 'D-3002', type: 'inkoopopdracht_geweigerd', date: '2025-03-08T16:00:00', description: 'Inkoopopdracht geweigerd. Reden: "Te weinig capaciteit in deze periode."', actor: 'Peter van der Kleij', linkedSection: 'inkoopopdracht' },

  // D-3003 (Electra Fix - Verstuurd)
  { id: 'E-007', dossierId: 'D-3003', type: 'inkoopopdracht_verstuurd', date: '2025-01-10T08:00:00', description: 'Raamovereenkomst verstuurd naar Electra Fix BV', actor: 'Tim de Ruiter', linkedSection: 'inkoopopdracht' },
];

// --- BIJLAGEN ---
export interface DossierAttachment {
  id: string;
  dossierId: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  date: string;
}

export const mockDossierAttachments: DossierAttachment[] = [
  { id: 'A-001', dossierId: 'D-3001', name: 'Tekening kozijnen fase 1.pdf', type: 'PDF', size: '2.4 MB', uploadedBy: 'Tim de Ruiter', date: '2025-03-07' },
  { id: 'A-002', dossierId: 'D-3001', name: 'Inkoopopdracht PO-2001.pdf', type: 'PDF', size: '340 KB', uploadedBy: 'Systeem', date: '2025-03-05' },
];

// --- BERICHTEN ---
export interface DossierMessage {
  id: string;
  dossierId: string;
  author: string;
  role: 'opdrachtgever' | 'opdrachtnemer';
  message: string;
  date: string;
}

export const mockDossierMessages: DossierMessage[] = [
  { id: 'M-001', dossierId: 'D-3001', author: 'Tim de Ruiter', role: 'opdrachtgever', message: 'Goedemiddag Jan, heb je de tekeningen ontvangen? Graag een reactie voor vrijdag.', date: '2025-03-07T11:00:00' },
  { id: 'M-002', dossierId: 'D-3001', author: 'Jan de Bouwer', role: 'opdrachtnemer', message: 'Ja ontvangen, dank. Ik stuur mijn aanbod maandag op.', date: '2025-03-07T13:45:00' },
  { id: 'M-003', dossierId: 'D-3001', author: 'Jan de Bouwer', role: 'opdrachtnemer', message: 'Aanbod verstuurd. Laat me weten of er vragen zijn.', date: '2025-03-10T11:05:00' },
];

// --- DEELOPDRACHTEN (Sub-assignments for Frameworks) ---
export interface Deelopdracht {
  id: string;
  dossierId: string;
  title: string;
  description: string;
  startDate: string;
  expectedResult: string;
  responsibility: string; // e.g. "Aannemer", "Gezamenlijk"
  status: 'In_Voorbereiding' | 'In_Uitvoering' | 'Herstel_Nodig' | 'Opgeleverd' | 'Geannuleerd';
  location?: string;
  historyCount: number;
}

export const mockDeelopdrachten: Deelopdracht[] = [
  // Link to D-3003 (Electra Fix - Raamovereenkomst)
  {
    id: 'DO-4001',
    dossierId: 'D-3003',
    title: 'Storingsmelding Lift hal 2',
    description: 'Lift in hal 2 geeft storingscode E-40. Diagnose en reparatie vereist conform SLA.',
    startDate: '2025-03-10',
    expectedResult: 'Lift is storingsvrij en operationeel met meetrapport',
    responsibility: 'Opdrachtnemer (Volledig)',
    status: 'In_Uitvoering',
    historyCount: 2
  },
  {
    id: 'DO-4002',
    dossierId: 'D-3003',
    title: 'Vervanging Noodverlichting Galerij',
    description: '10 armaturen noodverlichting vallen buiten de keuring en moeten preventief vervangen worden.',
    startDate: '2025-02-15',
    expectedResult: 'Werkende noodverlichting incl. nieuw certificaat',
    responsibility: 'Opdrachtnemer (Volledig)',
    status: 'Opgeleverd',
    historyCount: 4
  },
  {
    id: 'DO-4003',
    dossierId: 'D-3003',
    title: 'Reparatie intercom systeem',
    description: 'Intercom unit appartement 4b functioneert niet. Microfoon defect geconstateerd door bewoner.',
    startDate: '2025-03-05',
    expectedResult: 'Intercom unit getest en werkt aan beide kanten',
    responsibility: 'Opdrachtnemer (Volledig)',
    status: 'Herstel_Nodig',
    historyCount: 3
  }
];

// --- 6. FACTUREN (Invoices) ---
export type InvoiceStatus = 
  | 'Factuur_Aangemaakt' 
  | 'Concept_Verstuurd' 
  | 'Herziening_Nodig' 
  | 'Factuur_Verstuurd' 
  | 'Betaald' 
  | 'Gecrediteerd';

export interface InvoiceLine {
  description: string;
  quantity: number;
  rate: number;
  vatPercentage: number;
}

export interface InvoiceLog {
  date: string;
  action: string;
  actor: string;
}

export interface Invoice {
  id: string;
  dossierId: string;
  relationId: string;
  date: string;
  dueDate: string;
  status: InvoiceStatus;
  description: string;
  isConcept: boolean;
  invoiceNumber: string;
  lines: InvoiceLine[];
  bankAccount: string;
  paymentTerm: string;
  logs: InvoiceLog[];
}

export const mockInvoices: Invoice[] = [
  {
    id: 'INV-1001',
    dossierId: 'D-3001',
    relationId: 'R-001',
    date: '2025-03-12',
    dueDate: '2025-04-11',
    status: 'Factuur_Verstuurd',
    description: 'Factuur voor voltooiing kozijnen fase 1',
    isConcept: false,
    invoiceNumber: '2025-001',
    bankAccount: 'NL01 ABNA 0123 4567 89',
    paymentTerm: '30 dagen',
    lines: [
      { description: 'Aftimmeren kozijnen kavel 1-5', quantity: 5, rate: 1500, vatPercentage: 21 },
      { description: 'Aftimmeren kozijnen kavel 6-10', quantity: 5, rate: 1500, vatPercentage: 21 },
      { description: 'Materiaalkosten profielen', quantity: 1, rate: 2500, vatPercentage: 21 }
    ],
    logs: [
      { date: '2025-03-12T10:00:00', action: 'Factuur aangemaakt', actor: 'Jan de Bouwer' },
      { date: '2025-03-12T10:05:00', action: 'Factuur verzonden naar opdrachtgever', actor: 'Jan de Bouwer' }
    ]
  },
  {
    id: 'INV-1002',
    dossierId: 'D-3003',
    relationId: 'R-002',
    date: '2025-02-20',
    dueDate: '2025-03-20',
    status: 'Betaald',
    description: 'Vervanging noodverlichting galerij',
    isConcept: false,
    invoiceNumber: '2025-002',
    bankAccount: 'NL99 INGB 0987 6543 21',
    paymentTerm: '30 dagen',
    lines: [
      { description: 'Vervanging armaturen galerij', quantity: 10, rate: 85, vatPercentage: 21 }
    ],
    logs: [
      { date: '2025-02-20T09:00:00', action: 'Factuur aangemaakt', actor: 'Marc de Vriend' },
      { date: '2025-03-15T14:00:00', action: 'Betaling geregistreerd', actor: 'Systeem' }
    ]
  },
  {
    id: 'INV-1003',
    dossierId: 'D-3003',
    relationId: 'R-002',
    date: '2025-03-11',
    dueDate: '2025-04-10',
    status: 'Herziening_Nodig',
    description: 'Reparatie intercom systeem',
    isConcept: true,
    invoiceNumber: '2025-003',
    bankAccount: 'NL99 INGB 0987 6543 21',
    paymentTerm: '30 dagen',
    lines: [
      { description: 'Diagnose & Reparatie intercom 4b', quantity: 1, rate: 450, vatPercentage: 21 }
    ],
    logs: [
      { date: '2025-03-11T11:00:00', action: 'Conceptfactuur aangemaakt voor controle', actor: 'Marc de Vriend' }
    ]
  }
];

