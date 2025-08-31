import React, { useState, useMemo } from 'react';
import type { Document } from '../types';
import { DocumentCard } from './DocumentCard';
import { SearchIcon } from './icons/SearchIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface DocumentListProps {
  documents: Document[];
  onSelectDocument: (docId: string) => void;
  projectName?: string;
  onBackToProjects?: () => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({ documents, onSelectDocument, projectName, onBackToProjects }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) {
      return documents;
    }
    return documents.filter(doc =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
  }, [documents, searchQuery]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        {projectName && onBackToProjects && (
          <button
            onClick={onBackToProjects}
            className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Projects
          </button>
        )}
        <div className="relative flex-grow">
          <label htmlFor="search-documents" className="sr-only">Search Documents</label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="search-documents"
            type="text"
            placeholder="Search documents by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      
      {filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredDocuments.map(doc => (
            <DocumentCard key={doc.id} document={doc} onSelect={() => onSelectDocument(doc.id)} />
          ))}
        </div>
      ) : (
         <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">No Documents Found</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {searchQuery
                ? `Your search for "${searchQuery}" did not match any documents.`
                : 'Upload a new document to get started.'}
            </p>
          </div>
      )}
    </div>
  );
};