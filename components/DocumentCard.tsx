
import React from 'react';
import type { Document, DocumentStatus } from '../types';
import { FileIcon } from './icons/FileIcon';
import { UserIcon } from './icons/UserIcon';
import { CalendarIcon } from './icons/CalendarIcon';

interface DocumentCardProps {
  document: Document;
  onSelect: () => void;
}

const statusStyles: { [key in DocumentStatus]: { bg: string; text: string; dot: string } } = {
  'Approved': { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-200', dot: 'bg-green-500' },
  'Rejected': { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-800 dark:text-red-200', dot: 'bg-red-500' },
  'In Review': { bg: 'bg-amber-100 dark:bg-amber-900', text: 'text-amber-800 dark:text-amber-200', dot: 'bg-amber-500' },
};

export const DocumentCard: React.FC<DocumentCardProps> = ({ document, onSelect }) => {
  const { bg, text, dot } = statusStyles[document.status];

  return (
    <div
      onClick={onSelect}
      className="flex flex-col md:flex-row items-center justify-between p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-all duration-200"
    >
      <div className="flex items-center mb-4 md:mb-0">
        <FileIcon className="w-8 h-8 text-blue-500 mr-4" />
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white truncate max-w-xs">{document.name}</h4>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1 space-x-4">
            <span className="flex items-center"><UserIcon className="w-4 h-4 mr-1"/>{document.uploadedBy.name}</span>
            <span className="flex items-center"><CalendarIcon className="w-4 h-4 mr-1"/>{new Date(document.uploadDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <div className={`px-3 py-1 text-sm font-medium rounded-full flex items-center ${bg} ${text}`}>
        <span className={`w-2 h-2 rounded-full mr-2 ${dot}`}></span>
        {document.status}
      </div>
    </div>
  );
};