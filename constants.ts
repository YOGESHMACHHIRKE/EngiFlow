import type { Document, User } from './types';

export const APP_NAME = "EngiFlow";

export const CURRENT_USER: User = {
  name: 'Bob Manager',
  email: 'bob.manager@example.com',
};

export const INITIAL_DOCUMENTS: Document[] = [
  {
    id: 'doc-1',
    name: 'Structural_Analysis_Report_Q3.pdf',
    type: 'PDF',
    uploadedBy: 'Alice Johnson',
    uploadDate: '2023-10-26T10:00:00Z',
    status: 'Approved',
    reviewers: [
      { email: 'bob.manager@example.com', role: 'Approver' },
      { email: 'charlie.lead@example.com', role: 'Viewer' }
    ],
    password: 'password123',
    history: [
      { status: 'In Review', date: '2023-10-26T10:05:00Z', user: 'Alice Johnson', comment: 'Initial review request.' },
      { status: 'Approved', date: '2023-10-27T14:30:00Z', user: 'Bob Manager', comment: 'Looks good, approved.' },
    ],
  },
  {
    id: 'doc-2',
    name: 'Mechanical_Blueprint_A113.dwg',
    type: 'DWG',
    uploadedBy: 'David Chen',
    uploadDate: '2023-10-28T11:20:00Z',
    status: 'In Review',
    reviewers: [
      { email: 'alice.johnson@example.com', role: 'Commenter' },
      { email: 'charlie.lead@example.com', role: 'Approver' }
    ],
    password: 'password456',
    history: [
      { status: 'In Review', date: '2023-10-28T11:25:00Z', user: 'David Chen', comment: 'Please review the updated schematics.' },
    ],
  },
  {
    id: 'doc-3',
    name: 'Electrical_Schematics_Rev4.docx',
    type: 'DOCX',
    uploadedBy: 'Bob Manager',
    uploadDate: '2023-10-29T09:00:00Z',
    status: 'Rejected',
    reviewers: [
        { email: 'david.chen@example.com', role: 'Approver' }
    ],
    password: 'password789',
    history: [
       { status: 'In Review', date: '2023-10-29T09:05:00Z', user: 'Bob Manager', comment: 'Final check before production.' },
       { status: 'Rejected', date: '2023-10-29T16:45:00Z', user: 'David Chen', comment: 'Incorrect voltage specifications on page 3. Please revise.' },
    ],
  },
    {
    id: 'doc-4',
    name: 'Project_Timeline_Gantt_Chart.xlsx',
    type: 'XLSX',
    uploadedBy: 'Charlie Lead',
    uploadDate: '2023-10-30T15:00:00Z',
    status: 'In Review',
    reviewers: [
      { email: 'alice.johnson@example.com', role: 'Viewer' },
      { email: 'bob.manager@example.com', role: 'Approver' }
    ],
    password: 'password101',
    history: [
      { status: 'In Review', date: '2023-10-30T15:05:00Z', user: 'Charlie Lead', comment: 'Review of project milestones.' },
    ],
  },
];