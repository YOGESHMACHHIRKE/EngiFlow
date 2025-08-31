export type DocumentStatus = 'Approved' | 'Rejected' | 'In Review';

export type View = 'dashboard' | 'documents' | 'detail';

export type ReviewerRole = 'Approver' | 'Commenter' | 'Viewer';

export interface Reviewer {
  email: string;
  role: ReviewerRole;
}

export interface User {
  name: string;
  email: string;
}

export interface HistoryEntry {
  status: DocumentStatus;
  date: string;
  user: string;
  comment: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  uploadedBy: string;
  uploadDate: string;
  status: DocumentStatus;
  reviewers: Reviewer[];
  password?: string;
  history: HistoryEntry[];
}