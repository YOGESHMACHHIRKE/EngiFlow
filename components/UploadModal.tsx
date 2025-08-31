import React, { useState, useRef, useEffect } from 'react';
import type { Document, Reviewer, ReviewerRole } from '../types';
import { generateReviewEmail } from '../services/geminiService';
import { UploadIcon } from './icons/UploadIcon';
import { MailIcon } from './icons/MailIcon';
import { LockIcon } from './icons/LockIcon';
import { TrashIcon } from './icons/TrashIcon';

interface UploadModalProps {
  onClose: () => void;
  onAddDocument: (newDocument: Omit<Document, 'id' | 'history' | 'status'>) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onAddDocument }) => {
  const [file, setFile] = useState<File | null>(null);
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [reviewerEmail, setReviewerEmail] = useState('');
  const [reviewerRole, setReviewerRole] = useState<ReviewerRole>('Approver');
  const [password, setPassword] = useState<string>('');
  const [generatedEmail, setGeneratedEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleAddReviewer = () => {
    if (reviewerEmail && !reviewers.some(r => r.email === reviewerEmail)) {
      setReviewers([...reviewers, { email: reviewerEmail, role: reviewerRole }]);
      setReviewerEmail('');
      setReviewerRole('Approver');
    }
  };

  const handleRemoveReviewer = (email: string) => {
    setReviewers(reviewers.filter(r => r.email !== email));
  };

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let newPassword = '';
    for (let i = 0; i < 12; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPassword);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || reviewers.length === 0) return;

    setIsLoading(true);

    const newDocument: Omit<Document, 'id' | 'history' | 'status'> = {
      name: file.name,
      type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
      uploadedBy: 'System Admin', // In a real app, this would be the logged-in user
      uploadDate: new Date().toISOString(),
      reviewers,
      password: password,
    };

    try {
      const emailContent = await generateReviewEmail(newDocument.name, newDocument.reviewers);
      setGeneratedEmail(emailContent);
      onAddDocument(newDocument);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Failed to generate email:", error);
      alert("There was an error processing your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-95 hover:scale-100">
        
        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Upload New Document</h2>
              
              <div className="mb-6">
                <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Document File</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-900 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                        <span>{file ? file.name : 'Upload a file'}</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} required />
                      </label>
                      <p className="pl-1">{!file && 'or drag and drop'}</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">PDF, DWG, DOCX, XLSX up to 25MB</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"><MailIcon className="w-4 h-4 mr-2"/>Reviewers</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="email"
                    value={reviewerEmail}
                    onChange={(e) => setReviewerEmail(e.target.value)}
                    placeholder="e.g., user1@example.com"
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <select
                    value={reviewerRole}
                    onChange={(e) => setReviewerRole(e.target.value as ReviewerRole)}
                    className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Approver">Approver</option>
                    <option value="Commenter">Commenter</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                  <button type="button" onClick={handleAddReviewer} className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">Add</button>
                </div>
                <div className="mt-3 space-y-2">
                  {reviewers.map(r => (
                    <div key={r.email} className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                      <div>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{r.email}</span>
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">({r.role})</span>
                      </div>
                      <button type="button" onClick={() => handleRemoveReviewer(r.email)} className="text-red-500 hover:text-red-700">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                 <label htmlFor="password" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"><LockIcon className="w-4 h-4 mr-2"/>Document Password (Optional)</label>
                 <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter a password or generate one"
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button type="button" onClick={generatePassword} className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700">Generate</button>
                 </div>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 px-8 py-4 flex justify-end space-x-3 rounded-b-2xl">
              <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">Cancel</button>
              <button type="submit" disabled={isLoading} className="px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300">
                {isLoading ? 'Processing...' : 'Upload & Notify'}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Upload Successful!</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">The document has been added to the system and a notification email has been generated for the reviewers.</p>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-left">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Generated Email Content:</h3>
              <pre className="whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-400 font-sans">{generatedEmail}</pre>
            </div>
            <button onClick={onClose} className="mt-8 px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadModal;