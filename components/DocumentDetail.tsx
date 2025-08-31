import React, { useState, useMemo } from 'react';
import type { Document, DocumentStatus, User } from '../types';
import { LockIcon } from './icons/LockIcon';
import { UserIcon } from './icons/UserIcon';

interface DocumentDetailProps {
  document: Document;
  onUpdateStatus: (docId: string, status: DocumentStatus, user: string, comment?: string) => void;
  onAddComment: (docId: string, comment: string) => void;
  currentUser: User;
}

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
    <p className="mt-1 text-md text-gray-900 dark:text-white">{value}</p>
  </div>
);

const statusStyles: { [key in DocumentStatus]: { bg: string; text: string; dot: string } } = {
  'Approved': { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-200', dot: 'bg-green-500' },
  'Rejected': { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-800 dark:text-red-200', dot: 'bg-red-500' },
  'In Review': { bg: 'bg-amber-100 dark:bg-amber-900', text: 'text-amber-800 dark:text-amber-200', dot: 'bg-amber-500' },
};

export const DocumentDetail: React.FC<DocumentDetailProps> = ({ document, onUpdateStatus, onAddComment, currentUser }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(!document.password);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');

  const userRole = useMemo(() => {
    return document.reviewers.find(r => r.email === currentUser.email)?.role;
  }, [document.reviewers, currentUser.email]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === document.password) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password.');
    }
  };

  const handleAction = (status: DocumentStatus) => {
    if (status === 'Rejected' && !comment.trim()) {
        alert('A comment is required for rejection.');
        return;
    }
    onUpdateStatus(document.id, status, currentUser.name, comment);
    setComment('');
  };

  const handleCommentSubmit = () => {
    if (!comment.trim()) {
      alert('Comment cannot be empty.');
      return;
    }
    onAddComment(document.id, comment);
    setComment('');
  };
  
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg">
          <form onSubmit={handleAuth}>
            <div className="flex flex-col items-center text-center">
              <LockIcon className="w-12 h-12 text-gray-400 mb-4" />
              <h2 className="text-xl font-bold mb-2">Access Required</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">This document is password protected. Please enter the password to view details.</p>
            </div>
            <div className="mb-4">
              <label htmlFor="doc-password" className="sr-only">Password</label>
              <input
                id="doc-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter document password"
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button type="submit" className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Unlock Document
            </button>
          </form>
        </div>
      </div>
    );
  }

  const { bg, text, dot } = statusStyles[document.status];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b dark:border-gray-700">
        <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{document.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">ID: {document.id}</p>
            </div>
             <div className={`px-4 py-2 text-sm font-semibold rounded-full flex items-center ${bg} ${text}`}>
                <span className={`w-2.5 h-2.5 rounded-full mr-2 ${dot}`}></span>
                {document.status}
            </div>
        </div>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DetailItem label="Uploaded By" value={document.uploadedBy.name} />
        <DetailItem label="Upload Date" value={new Date(document.uploadDate).toLocaleString()} />
        <DetailItem label="File Type" value={document.type} />
        <div className="md:col-span-2 lg:col-span-3">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Reviewers</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {document.reviewers.map(reviewer => (
                <span key={reviewer.email} className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                    <UserIcon className="w-4 h-4 text-gray-600 dark:text-gray-300"/>
                    <span className="text-gray-800 dark:text-gray-200">{reviewer.email}</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">({reviewer.role})</span>
                </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 border-t dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Review History</h3>
        <div className="space-y-4">
          {document.history.map((entry, index) => (
            <div key={index} className="flex space-x-3">
              <div className={`w-3 h-3 rounded-full mt-1.5 ${statusStyles[entry.status].dot}`}></div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{entry.status} by {entry.user}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{entry.comment}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{new Date(entry.date).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {document.status === 'In Review' && (userRole === 'Approver' || userRole === 'Commenter') && (
        <div className="p-6 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Take Action</h3>
          <div className="mb-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            ></textarea>
          </div>
          <div className="flex space-x-4">
            {userRole === 'Approver' && (
              <>
                <button onClick={() => handleAction('Approved')} className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">Approve</button>
                <button onClick={() => handleAction('Rejected')} className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">Reject</button>
              </>
            )}
            {userRole === 'Commenter' && (
              <button onClick={handleCommentSubmit} className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">Submit Comment</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};