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

const NUMBER_OF_INCIDENTS = 45;
const incidentStatuses: Array<Incident['status']> = ['new', 'in_progress', 'resolved'];
const incidentPriorities: Array<Incident['priority']> = ['low', 'medium', 'high'];

const reporters = ['Igor', 'Sanya', 'Dimas', 'Nastya', 'Oleg', 'Masha', 'Sergey', 'Anna'];

const titles = [
  'Damaged package',
  'Wrong address',
  'Delivery delayed',
  'Payment verification issue',
  'Missing item in order',
  'Customer not responding',
  'Pickup point closed',
  'Driver app crash',
  'Route recalculation',
  'Temperature control alert',
];

const descriptions = [
  'Driver reports an issue during delivery. Please investigate and update triage.',
  'Customer claims details mismatch. Need verification and possible reroute.',
  'ETA changed due to traffic. Check SLA impact and notify customer if needed.',
  'System flagged payment verification. Confirm and proceed accordingly.',
  'Order contents do not match. Clarify with warehouse and update incident.',
  'No response from customer. Attempt contact and plan next steps.',
  'Pickup point is closed unexpectedly. Arrange alternative location.',
  'Driver reports app crash. Collect logs and advise workaround.',
  'Route recalculated unexpectedly. Validate address and driver navigation.',
  'Temperature sensor alert triggered. Ensure product safety compliance.',
];

const createIncidentId = (index: number) => `INC-${1000 + index}`;

const pickCycled = <T>(items: T[], index: number): T => items[index % items.length]; //зацикливаю индекс внутри массива и достаю существующее значение

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60 * 1000).toISOString();

const createIncident = (index: number): Incident => {
  const status = pickCycled(incidentStatuses, index);
  const priority = pickCycled(incidentPriorities, index + 1);

  // каждый следующий делаю на 7 минут старше
  const createdAt = minutesAgo(10 + index * 7);

  return {
    id: createIncidentId(index),
    title: pickCycled(titles, index),
    description: pickCycled(descriptions, index),
    status,
    priority,
    reporter: pickCycled(reporters, index),
    createdAt,
  };
};

export const incidentsStore: Incident[] = [...Array(NUMBER_OF_INCIDENTS)].map((_item, index) =>
  createIncident(index + 1)
);

export const notesStore: Note[] = [
  {
    id: 'NOTE-1',
    incidentId: 'INC-1002',
    message: 'Позвонили покупателю, уточнили адрес.',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
];
