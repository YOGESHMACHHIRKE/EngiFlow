
import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { DocumentList } from './components/DocumentList';
import UploadModal from './components/UploadModal';
import { DocumentDetail } from './components/DocumentDetail';
import type { Document, View, DocumentStatus } from './types';
import { INITIAL_DOCUMENTS, CURRENT_USER } from './constants';
import { PlusIcon } from './components/icons/PlusIcon';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [documents, setDocuments] = useState<Document[]>(INITIAL_DOCUMENTS);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleViewChange = (newView: View) => {
    setSelectedDocumentId(null);
    setView(newView);
  };

  const handleSelectDocument = (docId: string) => {
    setSelectedDocumentId(docId);
    setView('detail');
  };

  const handleUpdateDocumentStatus = (docId: string, status: DocumentStatus, user: string, comment?: string) => {
    setDocuments(docs =>
      docs.map(doc =>
        doc.id === docId
          ? {
              ...doc,
              status,
              history: [
                ...doc.history,
                {
                  status,
                  date: new Date().toISOString(),
                  user,
                  comment: comment || `Status changed to ${status}`,
                },
              ],
            }
          : doc
      )
    );
    handleViewChange('documents');
  };

  const handleAddComment = (docId: string, comment: string) => {
    setDocuments(docs =>
      docs.map(doc =>
        doc.id === docId
          ? {
              ...doc,
              history: [
                ...doc.history,
                {
                  status: 'In Review',
                  date: new Date().toISOString(),
                  user: CURRENT_USER.name,
                  comment,
                },
              ],
            }
          : doc
      )
    );
  };

  const handleAddDocument = (newDocument: Omit<Document, 'id' | 'history' | 'status'>) => {
    const docToAdd: Document = {
      ...newDocument,
      id: `doc-${Date.now()}`,
      status: 'In Review',
      history: [
        {
          status: 'In Review',
          date: new Date().toISOString(),
          user: 'Uploader',
          comment: 'Document created and sent for review.',
        },
      ],
    };
    setDocuments(prevDocs => [docToAdd, ...prevDocs]);
  };
  
  const selectedDocument = useMemo(() => {
    return documents.find(doc => doc.id === selectedDocumentId) || null;
  }, [selectedDocumentId, documents]);

  const renderContent = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard documents={documents} onViewDocument={handleSelectDocument} />;
      case 'documents':
        return <DocumentList documents={documents} onSelectDocument={handleSelectDocument} />;
      case 'detail':
        if (selectedDocument) {
          return (
            <DocumentDetail
              document={selectedDocument}
              onUpdateStatus={handleUpdateDocumentStatus}
              onAddComment={handleAddComment}
              currentUser={CURRENT_USER}
            />
          );
        }
        return <DocumentList documents={documents} onSelectDocument={handleSelectDocument} />;
      default:
        return <Dashboard documents={documents} onViewDocument={handleSelectDocument} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
      <Sidebar currentView={view} setView={handleViewChange} />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white capitalize">{view === 'detail' ? 'Document Details' : view}</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Upload Document
          </button>
        </div>
        {renderContent()}
      </main>
      {isModalOpen && <UploadModal onClose={() => setIsModalOpen(false)} onAddDocument={handleAddDocument} />}
    </div>
  );
};

export default App;