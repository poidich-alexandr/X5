export type TIncidentPriorityDTO = 'low' | 'medium' | 'high';
export type TIncidentStatusDTO = 'new' | 'in_progress' | 'resolved';
export type TIncidentSortDTO = 'newest' | 'oldest';

// ----------------------------------------
//Response

export interface IIncidentsListResponse {
  items: { id: string; title: string }[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface IIncidentDetailsResponse {
  incident: {
    id: string;
    title: string;
    description: string;
    status: TIncidentStatusDTO;
    priority: TIncidentPriorityDTO;
    createdAt: string;
    reporter: string;
  };
  notes: { id: string; message: string; createdAt: string }[];
}

export interface IUpdateIncidentStatusResponse {
  incident: {
    id: string;
    status: TIncidentStatusDTO;
    // можно не перечислять всё — но лучше типизировать через общий Incident DTO если он есть
  };
}

export interface IUpdateIncidentPriorityResponse {
  incident: {
    id: string;
    priority: TIncidentPriorityDTO;
  };
}

export interface IAddNoteResponse {
  note: {
    id: string;
    message: string;
    createdAt: string;
  };
}

// ----------------------------------------
//Request

export interface IIncidentsRequest {
  query?: string;
  status?: TIncidentStatusDTO;
  priority?: TIncidentPriorityDTO;
  sort?: TIncidentSortDTO;
  page?: string;
  limit?: string;
}
