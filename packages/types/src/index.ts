export type Mood = 'happy' | 'ok' | 'sad';

export interface ApiContextUser {
  id: string;
  role: 'CHILD' | 'PARENT' | 'CAREGIVER' | 'ADMIN';
  email?: string;
  parentId?: string;
  caregiverId?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface VisitSummary {
  id: string;
  parentId: string;
  caregiverId?: string;
  scheduledAt: string;
  status: string;
  type: string;
}

export interface CheckInSummary {
  id: string;
  mood: Mood;
  note?: string;
  createdAt: string;
}

export interface AlertSummary {
  id: string;
  type: 'sos' | 'missed_checkin';
  createdAt: string;
  resolved: boolean;
}

export interface ParentTimelineEntry {
  type: 'checkin' | 'visit' | 'alert';
  timestamp: string;
  data: Record<string, unknown>;
}
