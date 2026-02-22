
export type TIncidentPriorityDTO = 'low' | 'medium' | 'high';
export type TIncidentStatusDTO = 'new' | 'in_progress' | 'resolved';
export type TPrioritySortDTO = 'newest' | 'oldest';


// ----------------------------------------
//Response

export type TIncidentsListResponse = {
  items: { id: string; title: string }[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

export type TIncidentDetailsResponse = {
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
};




// ----------------------------------------
//Request

export type TIncidentsRequest = {
  query?: string;
  status?: TIncidentStatusDTO;
  priority?: TIncidentPriorityDTO;
  sort?: TPrioritySortDTO;
  page?: string;
  limit?: string;
};
