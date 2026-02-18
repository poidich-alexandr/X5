export type IncidentStatus = 'new' | 'in_progress' | 'resolved';
export type IncidentPriority = 'low' | 'medium' | 'high';

export type Incident = {
  id: string;
  title: string;
  description: string;
  status: IncidentStatus;
  priority: IncidentPriority;
  reporter: string;
  createdAt: string; // ISO
};

export type Note = {
  id: string;
  incidentId: string;
  message: string;
  createdAt: string; // ISO
};



// --------------------
// In-memory store
// --------------------
export const incidentsStore: Incident[] = [
  {
    id: 'INC-1001',
    title: 'Damaged package',
    description: 'Driver reports package damage on arrival.',
    status: 'new',
    priority: 'high',
    reporter: 'Igor',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'INC-1002',
    title: 'Wrong address',
    description: 'Address mismatch in delivery details.',
    status: 'in_progress',
    priority: 'medium',
    reporter: 'Sanya',
    createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
  },
  {
    id: 'INC-1003',
    title: 'Delivery delayed',
    description: 'Driver stuck in traffic, ETA increased.',
    status: 'resolved',
    priority: 'low',
    reporter: 'Dimas',
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
];

export const notesStore: Note[] = [
  {
    id: 'NOTE-1',
    incidentId: 'INC-1002',
    message: 'Позвонили покупателю, уточнили адрес.',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
];