import type { Document, User } from './types';

export const APP_NAME = "EngiFlow";

export const USER_ALICE: User = { name: 'Alice Johnson', email: 'alice.johnson@example.com' };
export const USER_BOB: User = { name: 'Bob Manager', email: 'bob.manager@example.com' };
export const USER_CHARLIE: User = { name: 'Charlie Lead', email: 'charlie.lead@example.com' };
export const USER_DAVID: User = { name: 'David Chen', email: 'david.chen@example.com' };

export const CURRENT_USER: User = USER_BOB;

export const INITIAL_DOCUMENTS: Document[] = [
  {
    id: 'doc-1',
    name: 'Structural_Analysis_Report_Q3.pdf',
    type: 'PDF',
    uploadedBy: USER_ALICE,
    uploadDate: '2023-10-26T10:00:00Z',
    status: 'Approved',
    reviewers: [
      { email: USER_BOB.email, role: 'Approver' },
      { email: USER_CHARLIE.email, role: 'Viewer' }
    ],
    password: 'password123',
    history: [
      { status: 'In Review', date: '2023-10-26T10:05:00Z', user: USER_ALICE.name, comment: 'Initial review request.' },
      { status: 'Approved', date: '2023-10-27T14:30:00Z', user: USER_BOB.name, comment: 'Looks good, approved.' },
    ],
  },
  {
    id: 'doc-2',
    name: 'Mechanical_Blueprint_A113.dwg',
    type: 'DWG',
    uploadedBy: USER_DAVID,
    uploadDate: '2023-10-28T11:20:00Z',
    status: 'In Review',
    reviewers: [
      { email: USER_ALICE.email, role: 'Commenter' },
      { email: USER_CHARLIE.email, role: 'Approver' }
    ],
    password: 'password456',
    history: [
      { status: 'In Review', date: '2023-10-28T11:25:00Z', user: USER_DAVID.name, comment: 'Please review the updated schematics.' },
    ],
  },
  {
    id: 'doc-3',
    name: 'Electrical_Schematics_Rev4.docx',
    type: 'DOCX',
    uploadedBy: USER_BOB,
    uploadDate: '2023-10-29T09:00:00Z',
    status: 'Rejected',
    reviewers: [
        { email: USER_DAVID.email, role: 'Approver' }
    ],
    password: 'password789',
    history: [
       { status: 'In Review', date: '2023-10-29T09:05:00Z', user: USER_BOB.name, comment: 'Final check before production.' },
       { status: 'Rejected', date: '2023-10-29T16:45:00Z', user: USER_DAVID.name, comment: 'Incorrect voltage specifications on page 3. Please revise.' },
    ],
  },
    {
    id: 'doc-4',
    name: 'Project_Timeline_Gantt_Chart.xlsx',
    type: 'XLSX',
    uploadedBy: USER_CHARLIE,
    uploadDate: '2023-10-30T15:00:00Z',
    status: 'In Review',
    reviewers: [
      { email: USER_ALICE.email, role: 'Viewer' },
      { email: USER_BOB.email, role: 'Approver' }
    ],
    password: 'password101',
    history: [
      { status: 'In Review', date: '2023-10-30T15:05:00Z', user: USER_CHARLIE.name, comment: 'Review of project milestones.' },
    ],
  },
];