import type { Document, User, Project } from './types';

export const APP_NAME = "EngiFlow";

export const USER_ALICE: User = { name: 'Alice Johnson', email: 'alice.johnson@example.com', password: 'password123', photoUrl: 'https://i.pravatar.cc/150?u=alice.johnson@example.com' };
export const USER_BOB: User = { name: 'Bob Manager', email: 'bob.manager@example.com', password: 'password123', photoUrl: 'https://i.pravatar.cc/150?u=bob.manager@example.com' };
export const USER_CHARLIE: User = { name: 'Charlie Lead', email: 'charlie.lead@example.com', password: 'password123', photoUrl: 'https://i.pravatar.cc/150?u=charlie.lead@example.com' };
export const USER_DAVID: User = { name: 'David Chen', email: 'david.chen@example.com', password: 'password123', photoUrl: 'https://i.pravatar.cc/150?u=david.chen@example.com' };

export const USERS: User[] = [USER_ALICE, USER_BOB, USER_CHARLIE, USER_DAVID];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Project Phoenix',
    description: 'A next-generation structural engineering initiative focusing on sustainable materials.',
    lastUpdated: '2023-10-30T15:05:00Z',
    projectCode: 'PNX-001',
  },
  {
    id: 'proj-2',
    name: 'Project Neptune',
    description: 'Development of advanced mechanical systems for underwater exploration vehicles.',
    lastUpdated: '2023-10-29T16:45:00Z',
    projectCode: 'NPT-002',
  },
   {
    id: 'proj-3',
    name: 'Project Titan',
    description: 'Electrical grid modernization and schematic planning for urban redevelopment.',
    lastUpdated: '2023-10-29T09:05:00Z',
    projectCode: 'TTN-003',
  },
];

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
      { status: 'In Review', date: '2023-10-26T10:05:00Z', user: USER_ALICE.name, comment: 'Initial review request.', version: 1 },
      { status: 'Approved', date: '2023-10-27T14:30:00Z', user: USER_BOB.name, comment: 'Looks good, approved.', version: 1 },
    ],
    projectCode: 'PNX-001',
    version: 1,
    isLatest: true,
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
      { status: 'In Review', date: '2023-10-28T11:25:00Z', user: USER_DAVID.name, comment: 'Please review the updated schematics.', version: 1 },
    ],
    projectCode: 'NPT-002',
    version: 1,
    isLatest: true,
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
       { status: 'In Review', date: '2023-10-29T09:05:00Z', user: USER_BOB.name, comment: 'Final check before production.', version: 1 },
       { status: 'Rejected', date: '2023-10-29T16:45:00Z', user: USER_DAVID.name, comment: 'Incorrect voltage specifications on page 3. Please revise.', version: 1 },
    ],
    projectCode: 'TTN-003',
    version: 1,
    isLatest: true,
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
      { status: 'In Review', date: '2023-10-30T15:05:00Z', user: USER_CHARLIE.name, comment: 'Review of project milestones.', version: 1 },
    ],
    projectCode: 'PNX-001',
    version: 1,
    isLatest: true,
  },
];