export interface Requests {
  id: number;
  type: RequestType;
  ep_id: string;
  client: string;
  contacts: string;
  description: string;
  address: string;
  comment: string | null;
  status: RequestStatus;
  request_date: string;
  request_updated_at: string;
  request_created_at: string;
  hr: {
    id: number;
    name: string;
    role: string;
    is_active: boolean;
  };
}

export interface EditRequest {
  id: number;
  hr_name?: string;
  ep_id?: string;
  client_id: string;
  client_contacts?: string;
  description: string;
  address: string;
  request_date: string;
  type: RequestType;
  comment?: string;
  status: RequestStatus;
  created_at: string;
  updated_at: string;
}

export interface RequestCreate {
  client_id: string;
  ep_id?: string;
  description: string;
  address: string;
  client_contacts: string;
  request_date: string;
  type: RequestType;
}

export interface RequestUpdate {
  client_id?: string;
  ep_id?: string;
  description?: string;
  address?: string;
  client_contacts?: string;
}

export enum RequestType {
  Default = "Default",
  VIP = "VIP",
  Video = "Video",
  Optical = "Optical",
  Other = "Other",
}

export enum RequestStatus {
  NEW = "NEW",
  IN_PROGRESS = "IN_PROGRESS",
  SUCCESS = "SUCCESS",
  CLOSED = "CLOSED",
  CANCELLED = "CANCELLED",
  MONITORING = "MONITORING",
  POSTPONED = "POSTPONED",
}

export interface UpdateRequestTypeParams {
  id: number;
  new_type: RequestType;
}

export interface UpdateRequestComment {
  comment?: string;
}

export interface UpdateRequestDateParams {
  id: number;
  new_request_date: string;
}

export interface AssignRequestParams {
  request_id: number;
  performer_id: number;
}

export interface Performer {
  id: number;
  name: string;
}

export interface RequestFilterParams {
  type?: RequestType[];
  status?: RequestStatus[];
  executor_id?: number;
  performer_id?: number;
  request_date_from?: string;
  request_date_to?: string;
  updated_at_from?: string;
  updated_at_to?: string;
  page?: number;
  limit?: number;
}

export interface RequestResponse {
  totalPages: number;
  currentPage: number;
  limit: number;
  total: number;
  requests: {
    id: number;
    request: Requests;
    executor: Performer | null;
    performer: Performer | null;
  }[];
}
