

import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { DocumentList } from './components/DocumentList';
import UploadModal from './components/UploadModal';
import { DocumentDetail } from './components/DocumentDetail';
import type { Document, View, DocumentStatus, User, Project, NewProjectData, HistoryEntry } from './types';
import { INITIAL_DOCUMENTS, USERS, USER_ALICE, INITIAL_PROJECTS } from './constants';
import { PlusIcon } from './components/icons/PlusIcon';
import { generateStatusUpdateEmail } from './services/geminiService';
import { ArrowLeftIcon } from './components/icons/ArrowLeftIcon';
import { Profile } from './components/Profile';
import { Projects } from './components/Projects';
import AddProjectModal from './components/AddProjectModal';
import { GlobalSearch } from './components/GlobalSearch';
import ESignModal from './components/ESignModal';

type ESignAction = {
  type: 'statusUpdate';
  docId: string;
  status: DocumentStatus;
  comment: string;
} | {
  type: 'comment';
  docId: string;
  comment: string;
};

const safeJsonParse = <T,>(key: string, fallback: T): T => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const item = window.localStorage.getItem(key);
    if (item) {
      try {
        return JSON.parse(item);
      } catch (e) {
        console.error(`Error parsing JSON from localStorage key "${key}":`, e);
        return fallback;
      }
    }
  }
  return fallback;
};


// Fix: Add return statement with JSX to the component and export it as default.
const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(() => safeJsonParse('engiFlowUsers', USERS));
  
  const [currentUser, setCurrentUser] = useState<User>(() => {
    // Initialize from the same source as users to ensure consistency on first render
    const initialUsers = safeJsonParse('engiFlowUsers', USERS);
    return initialUsers.find(u => u.email === USER_ALICE.email) || USER_ALICE;
  });

  const [view, setView] = useState<View>('dashboard');
  const [previousView, setPreviousView] = useState<View>('dashboard');
  const [documents, setDocuments] = useState<Document[]>(() => safeJsonParse('engiFlowDocuments', INITIAL_DOCUMENTS));
  const [projects, setProjects] = useState<Project[]>(() => safeJsonParse('engiFlowProjects', INITIAL_PROJECTS));
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [selectedProjectCode, setSelectedProjectCode] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState<boolean>(false);
  const [isESignModalOpen, setIsESignModalOpen] = useState<boolean>(false);
  const [eSignAction, setESignAction] = useState<ESignAction | null>(null);
  
  const getInitialTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedPrefs = window.localStorage.getItem('theme');
      if (typeof storedPrefs === 'string') {
        return storedPrefs as 'light' | 'dark';
      }
      const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
      if (userMedia.matches) {
        return 'dark';
      }
    }
    return 'light';
  };

  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // Persist state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('engiFlowDocuments', JSON.stringify(documents));
    }
  }, [documents]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('engiFlowProjects', JSON.stringify(projects));
    }
  }, [projects]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('engiFlowUsers', JSON.stringify(users));
    }
  }, [users]);

  const handleViewChange = (newView: View) => {
    setSelectedDocumentId(null);
    if (newView !== 'documents') {
      setSelectedProjectCode(null);
    }
    setView(newView);
  };
  
  const handleSelectProject = (projectCode: string) => {
    setSelectedProjectCode(projectCode);
    setView('documents');
  };

  const handleSelectDocument = (docId: string) => {
    setPreviousView(view);
    setSelectedDocumentId(docId);
    setView('detail');
  };
  
  const handleBack = () => {
    setSelectedDocumentId(null);
    setView(previousView);
  };

  const handleRequestESign = (action: ESignAction) => {
    if (action.type === 'statusUpdate' && action.status === 'Rejected' && !action.comment.trim()) {
        alert('A comment is required for rejection.');
        return;
    }
     if ((action.type === 'comment' || (action.type === 'statusUpdate' && action.status !== 'Approved')) && !action.comment.trim()) {
      alert('Comment cannot be empty.');
      return;
    }
    setESignAction(action);
    setIsESignModalOpen(true);
  };

  const handleConfirmESign = async (password: string) => {
    if (!eSignAction || !currentUser.password) return;

    if (password !== currentUser.password) {
      alert('Invalid password. Please try again.');
      return;
    }

    const docToUpdate = documents.find(doc => doc.id === eSignAction.docId);
    if (!docToUpdate) {
        console.error("Document not found for e-sign action");
        setIsESignModalOpen(false);
        setESignAction(null);
        return;
    }
    
    if (eSignAction.type === 'statusUpdate') {
      const { docId, status, comment } = eSignAction;
      const newHistoryEntry: HistoryEntry = {
        status,
        date: new Date().toISOString(),
        user: currentUser.name,
        comment: `[E-signed] ${comment || `Status changed to ${status}`}`,
        version: docToUpdate.version,
      };
      
      setDocuments(docs =>
        docs.map(doc =>
          doc.id === docId ? { ...doc, status, history: [...doc.history, newHistoryEntry] } : doc
        )
      );
    } else if (eSignAction.type === 'comment') {
      const { docId, comment } = eSignAction;
      const userRole = docToUpdate.reviewers.find(r => r.email === currentUser.email)?.role;
      const newStatus = userRole === 'Commenter' ? 'Commented' : docToUpdate.status;

      const newHistoryEntry: HistoryEntry = {
        status: newStatus,
        date: new Date().toISOString(),
        user: currentUser.name,
        comment: `[E-signed] ${comment}`,
        version: docToUpdate.version,
      };
      setDocuments(docs =>
        docs.map(doc =>
          doc.id === docId ? { ...doc, status: newStatus, history: [...doc.history, newHistoryEntry] } : doc
        )
      );
    }

    // Send notifications for any confirmed action
    try {
        const participants = [
            docToUpdate.uploadedBy.email,
            ...docToUpdate.reviewers.map(r => r.email)
        ];
        const uniqueParticipants = [...new Set(participants)];

        let notificationStatus: DocumentStatus;
        if (eSignAction.type === 'statusUpdate') {
            notificationStatus = eSignAction.status;
        } else { // 'comment'
            const userRole = docToUpdate.reviewers.find(r => r.email === currentUser.email)?.role;
            notificationStatus = userRole === 'Commenter' ? 'Commented' : docToUpdate.status;
        }

        const notificationComment = eSignAction.comment;

        const emailContent = await generateStatusUpdateEmail(
            docToUpdate.name,
            notificationStatus,
            currentUser.name,
            notificationComment,
            uniqueParticipants
        );
        alert(`Action successful! Notifications sent to all participants.\n\n--- Simulated Email Content ---\n${emailContent}`);
    } catch (error) {
        console.error("Failed to generate status update email:", error);
        alert("Action successful, but there was an error sending notifications.");
    }

    setIsESignModalOpen(false);
    setESignAction(null);

    if (eSignAction.type === 'statusUpdate') {
      setSelectedDocumentId(null);
      if (selectedProjectCode) {
        setView('documents');
      } else {
        handleViewChange('documents');
      }
    }
  };


  const handleAddDocument = (newDocumentData: Omit<Document, 'id' | 'history' | 'status' | 'version' | 'isLatest'>) => {
    // Find existing documents with the same name and project to handle versioning
    const existingDocs = documents.filter(
      doc => doc.name === newDocumentData.name && doc.projectCode === newDocumentData.projectCode
    );

    const maxVersion = Math.max(0, ...existingDocs.map(d => d.version));
    const newVersion = maxVersion + 1;

    const docToAdd: Document = {
      ...newDocumentData,
      id: `doc-${Date.now()}`,
      status: 'In Review',
      history: [
        {
          status: 'In Review',
          date: new Date().toISOString(),
          user: newDocumentData.uploadedBy.name,
          comment: `Document v${newVersion} created and sent for review.`,
          version: newVersion,
        },
      ],
      version: newVersion,
      isLatest: true,
    };
    
    // Mark all older versions of this document as not latest
    const updatedDocuments = documents.map(doc => {
        if (existingDocs.some(existing => existing.id === doc.id)) {
            return { ...doc, isLatest: false };
        }
        return doc;
    });

    setDocuments([docToAdd, ...updatedDocuments]);
  };
  
  const handleAddProject = (projectData: NewProjectData) => {
    if (projects.some(p => p.projectCode.toLowerCase() === projectData.projectCode.toLowerCase())) {
        alert('Error: Project Code must be unique.');
        return;
    }
    const newProject: Project = {
        ...projectData,
        id: `proj-${Date.now()}`,
        lastUpdated: new Date().toISOString(),
    };
    setProjects(prevProjects => [newProject, ...prevProjects]);
    setIsAddProjectModalOpen(false);
  };
  
  const handleSetReminder = (docId: string, date: string) => {
    setDocuments(docs =>
      docs.map(doc =>
        doc.id === docId ? { ...doc, reminderDate: date } : doc
      )
    );
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(currentUsers =>
      currentUsers.map(u => (u.email === currentUser.email ? updatedUser : u))
    );
    setCurrentUser(updatedUser);
    setDocuments(docs =>
      docs.map(doc => {
        const newUploadedBy =
          doc.uploadedBy.email === currentUser.email
            ? { ...doc.uploadedBy, name: updatedUser.name }
            : doc.uploadedBy;
        const newHistory = doc.history.map(h =>
          h.user === currentUser.name ? { ...h, user: updatedUser.name } : h
        );
        return { ...doc, uploadedBy: newUploadedBy, history: newHistory };
      })
    );
    alert('Profile updated successfully!');
  };

  const userDocuments = useMemo(() => {
    return documents.filter(doc => 
        doc.isLatest && // Only show the latest version in lists
        (doc.uploadedBy.email === currentUser.email ||
        doc.reviewers.some(r => r.email === currentUser.email))
    );
  }, [documents, currentUser]);

  const documentsForView = useMemo(() => {
    if (selectedProjectCode) {
      return userDocuments.filter(doc => doc.projectCode === selectedProjectCode);
    }
    return userDocuments;
  }, [userDocuments, selectedProjectCode]);

  const handleUpdateStatus = (docId: string, status: DocumentStatus, _user: string, comment: string = '') => {
    handleRequestESign({ type: 'statusUpdate', docId, status, comment });
  };
  
  const handleAddComment = (docId: string, comment: string) => {
    handleRequestESign({ type: 'comment', docId, comment });
  };

  const selectedDocument = useMemo(() => {
    return documents.find(doc => doc.id === selectedDocumentId);
  }, [documents, selectedDocumentId]);

  const selectedProject = useMemo(() => {
    return projects.find(p => p.projectCode === selectedProjectCode);
  }, [projects, selectedProjectCode]);

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard documents={userDocuments} onViewDocument={handleSelectDocument} theme={theme} />;
      case 'projects':
        return <Projects projects={projects} onSelectProject={handleSelectProject} onAddNewProject={() => setIsAddProjectModalOpen(true)} />;
      case 'documents':
        return (
          <DocumentList
            documents={documentsForView}
            onSelectDocument={handleSelectDocument}
            projectName={selectedProject?.name}
            onBackToProjects={selectedProjectCode ? () => handleViewChange('projects') : undefined}
          />
        );
      case 'detail':
        if (selectedDocument) {
           const documentRevisions = documents
            .filter(d => d.name === selectedDocument.name && d.projectCode === selectedDocument.projectCode)
            .sort((a, b) => b.version - a.version);

          return (
            <DocumentDetail
              document={selectedDocument}
              onUpdateStatus={handleUpdateStatus}
              onAddComment={handleAddComment}
              onSetReminder={handleSetReminder}
              currentUser={currentUser}
              users={users}
              revisions={documentRevisions}
              onSelectRevision={handleSelectDocument}
            />
          );
        }
        return null;
      case 'profile':
        return <Profile currentUser={currentUser} onUpdateUser={handleUpdateUser} />;
      case 'search':
        return <GlobalSearch documents={documents} users={users} projects={projects} onSelectDocument={handleSelectDocument} />;
      default:
        return null;
    }
  };

  const getHeaderText = () => {
    if (view === 'detail' && selectedDocument) {
      return 'Document Details';
    }
    if (view === 'documents' && selectedProject) {
      return `Project: ${selectedProject.name}`;
    }
    switch (view) {
      case 'dashboard': return 'Dashboard';
      case 'projects': return 'Projects';
      case 'documents': return 'All Documents';
      case 'profile': return 'User Profile';
      case 'search': return 'Global Search';
      default: return 'EngiFlow';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-sans">
      <Sidebar 
        currentView={view} 
        setView={handleViewChange} 
        theme={theme} 
        onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b dark:border-gray-700 shadow-sm">
          <div className="flex items-center">
            {view === 'detail' && (
              <button onClick={handleBack} className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
            )}
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">{getHeaderText()}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              <span>Upload Document</span>
            </button>
             <div className="flex items-center space-x-2">
                <img
                    src={currentUser.photoUrl || `https://i.pravatar.cc/150?u=${currentUser.email}`}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full"
                />
                <div>
                    <div className="font-semibold">{currentUser.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{currentUser.email}</div>
                </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {renderView()}
        </div>
      </main>

      {isModalOpen && (
        <UploadModal
          onClose={() => setIsModalOpen(false)}
          onAddDocument={handleAddDocument}
          currentUser={currentUser}
          projects={projects}
          projectCode={selectedProjectCode}
        />
      )}
      {isAddProjectModalOpen && (
        <AddProjectModal
            onClose={() => setIsAddProjectModalOpen(false)}
            onAddProject={handleAddProject}
        />
      )}
      {isESignModalOpen && eSignAction && (
        <ESignModal
          isOpen={isESignModalOpen}
          onClose={() => setIsESignModalOpen(false)}
          onConfirm={handleConfirmESign}
          actionType={eSignAction.type === 'statusUpdate' ? `${eSignAction.status}` : 'Comment'}
        />
      )}
    </div>
  );
};

export default App;