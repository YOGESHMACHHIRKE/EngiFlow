export type DocumentStatus = 'Approved' | 'Rejected' | 'In Review' | 'Commented';

export type View = 'dashboard' | 'documents' | 'detail' | 'profile' | 'projects' | 'search';

export type ReviewerRole = 'Approver' | 'Commenter' | 'Viewer';

export interface Reviewer {
  email: string;
  role: ReviewerRole;
}

export interface User {
  name: string;
  email: string;
  password?: string;
  photoUrl?: string;
}

export interface HistoryEntry {
  status: DocumentStatus;
  date: string;
  user: string;
  comment: string;
  version: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  lastUpdated: string;
  projectCode: string;
}

export type NewProjectData = Omit<Project, 'id' | 'lastUpdated'>;

export interface Document {
  id: string;
  name:string;
  type: string;
  uploadedBy: User;
  uploadDate: string;
  status: DocumentStatus;
  reviewers: Reviewer[];
  password?: string;
  history: HistoryEntry[];
  reminderDate?: string;
  projectCode?: string;
  version: number;
  isLatest: boolean;
  fileUrl?: string;
}