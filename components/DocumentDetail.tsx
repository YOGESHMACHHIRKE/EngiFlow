
import React, { useState, useMemo, useEffect } from 'react';
import type { Document, DocumentStatus, User, Organization } from '../types';
import { LockIcon } from './icons/LockIcon';
import { UserIcon } from './icons/UserIcon';
import { BellIcon } from './icons/BellIcon';
import { generateDocumentSummary } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';
import { InlineFileViewer } from './InlineFileViewer';
import { SignatureIcon } from './icons/SignatureIcon';
import { ClockIcon } from './icons/ClockIcon';
import { ListIcon } from './icons/ListIcon';
import { LockClosedIcon } from './icons/LockClosedIcon';
import { ActiveViewers } from './ActiveViewers';
import { CollaborativeScratchpad } from './CollaborativeScratchpad';
import { CollaborationUpsell } from './CollaborationUpsell';

interface DocumentDetailProps {
  document: Document;
  onUpdateStatus: (docId: string, status: DocumentStatus, user: string, comment?: string) => void;
  onAddComment: (docId: string, comment: string) => void;
  onSetReminder: (docId: string, date: string) => void;
  currentUser: User;
  users: User[];
  revisions: Document[];
  onSelectRevision: (docId: string) => void;
  currentOrganization: Organization;
  activeCollaborators: { user: User; isTypingComment?: boolean }[];
  onUpdateScratchpad: (docId: string, content: string) => void;
}

const DetailItem: React.FC<{ label: string; value: string | undefined }> = ({ label, value }) => (
  <div>
    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tight">{label}</p>
    <p className="mt-0.5 text-sm md:text-md text-gray-900 dark:text-white font-medium">{value || 'N/A'}</p>
  </div>
);

const statusStyles: { [key in DocumentStatus]: { bg: string; text: string; dot: string } } = {
  'Approved': { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-800 dark:text-green-200', dot: 'bg-green-500' },
  'Rejected': { bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-800 dark:text-red-200', dot: 'bg-red-500' },
  'In Review': { bg: 'bg-amber-100 dark:bg-amber-900/50', text: 'text-amber-800 dark:text-amber-200', dot: 'bg-amber-500' },
  'In Progress': { bg: 'bg-teal-100 dark:bg-teal-900/50', text: 'text-teal-800 dark:text-teal-200', dot: 'bg-teal-500' },
  'Commented': { bg: 'bg-violet-100 dark:bg-violet-900/50', text: 'text-violet-800 dark:text-violet-200', dot: 'bg-violet-500' },
};

export const DocumentDetail: React.FC<DocumentDetailProps> = ({ document, onUpdateStatus, onAddComment, onSetReminder, currentUser, users, revisions, onSelectRevision, currentOrganization, activeCollaborators, onUpdateScratchpad }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(!document.password);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const typingTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const userRole = useMemo(() => {
    return document.reviewers.find(r => r.email === currentUser.email)?.role;
  }, [document.reviewers, currentUser.email]);
  
  const isProPlan = currentOrganization.subscription.plan === 'Pro';

  useEffect(() => {
    if (!isAuthenticated || !isProPlan) return;
    
    const joinEvent = { type: 'doc-join', docId: document.id, user: currentUser };
    localStorage.setItem('engiFlowCollaborationEvent', JSON.stringify(joinEvent));

    return () => {
      const leaveEvent = { type: 'doc-leave', docId: document.id, user: currentUser };
      localStorage.setItem('engiFlowCollaborationEvent', JSON.stringify(leaveEvent));
    };
  }, [document.id, currentUser, isAuthenticated, isProPlan]);

  const handleCommentTyping = (isTyping: boolean) => {
    if (!isProPlan) return;
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    const broadcastTypingState = (typingState: boolean) => {
      const typingEvent = { 
          type: 'doc-comment-typing', 
          docId: document.id, 
          user: currentUser,
          content: { isTyping: typingState }
      };
      localStorage.setItem('engiFlowCollaborationEvent', JSON.stringify(typingEvent));
    };

    if(isTyping) {
      broadcastTypingState(true);
      typingTimeoutRef.current = setTimeout(() => {
        broadcastTypingState(false);
      }, 2000);
    } else {
      broadcastTypingState(false);
    }
  };


  const hasCurrentUserSignedThisRevision = useMemo(() => {
    return document.history.some(
      entry => entry.userEmail === currentUser.email && 
             entry.comment.startsWith('[E-signed]') && 
             entry.version === document.version
    );
  }, [document, currentUser]);

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
    handleCommentTyping(false);
  };

  const handleCommentSubmit = () => {
    if (!comment.trim()) {
      alert('Comment cannot be empty.');
      return;
    }
    onAddComment(document.id, comment);
    setComment('');
    handleCommentTyping(false);
  };

  const handleSetReminder = () => {
    if (!reminderDate) {
      alert('Please select a date for the reminder.');
      return;
    }
    onSetReminder(document.id, reminderDate);
  };

  const handleSummarize = async () => {
    if (!isProPlan) {
      alert("AI Summary is a Pro feature. Please upgrade your plan.");
      return;
    }
    setIsSummarizing(true);
    setSummary(null);
    try {
      const result = await generateDocumentSummary(document.name, document.history);
      setSummary(result);
    } catch (error) {
      console.error("Failed to generate summary:", error);
      alert("There was an error generating the document summary.");
    } finally {
      setIsSummarizing(false);
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg border dark:border-gray-700">
          <form onSubmit={handleAuth}>
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                <LockIcon className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-xl font-bold mb-2">Password Protected</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 px-4">This sensitive document requires a unique password to access its details and history.</p>
            </div>
            <div className="mb-4">
              <label htmlFor="doc-password" className="sr-only">Password</label>
              <input
                id="doc-password"
                type="password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Enter password"
              />
            </div>
            {error && <p className="text-red-500 text-xs mb-4 text-center font-bold">{error}</p>}
            <button type="submit" className="w-full py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition shadow-lg">
              Unlock Secure Access
            </button>
          </form>
        </div>
      </div>
    );
  }

  const { bg, text, dot } = statusStyles[document.status];
  
  const SummarizeButton = () => {
    const buttonContent = (
      <>
        {!isProPlan && <LockClosedIcon className="w-4 h-4 mr-2" />}
        {isSummarizing ? 'Generating...' : (summary ? 'Regenerate' : 'AI Summary')}
      </>
    );

    const buttonProps = {
      onClick: handleSummarize,
      disabled: isSummarizing || !isProPlan,
      className: `flex items-center justify-center bg-blue-600 text-white font-bold py-1.5 px-3 rounded-lg shadow-md transition-all transform hover:scale-105 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed text-xs md:text-sm ${!isProPlan ? 'bg-gray-500 hover:bg-gray-500' : 'hover:bg-blue-700'}`,
    };

    if (isProPlan) {
      return <button {...buttonProps}>{buttonContent}</button>;
    }

    return (
      <div className="relative group">
        <button {...buttonProps}>{buttonContent}</button>
        <div className="absolute bottom-full mb-2 w-60 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 shadow-xl border border-white/10">
          AI Summary is a Pro feature. Please contact your administrator to upgrade your plan.
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
        </div>
      </div>
    );
  };

  const otherCollaboratorsTyping = activeCollaborators.filter(c => c.isTypingComment);

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-5 gap-6 md:gap-8 pb-10">
      {/* Top/Left Section: Primary Document Information and Viewer */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border dark:border-gray-700 p-4 md:p-6">
           <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center flex-wrap gap-2 mb-1">
                    <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white break-all leading-tight">
                        {document.name}
                    </h2>
                    <span className="px-2 py-0.5 text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md">
                        Rev {document.version}
                    </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono tracking-tighter">ID: {document.id}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                  {hasCurrentUserSignedThisRevision && (
                    <div title="You have signed this revision" className="p-2.5 rounded-full bg-blue-100 dark:bg-blue-900/50">
                      <SignatureIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  )}
                  <div className={`px-4 py-2 text-sm font-bold rounded-lg flex items-center shadow-sm ${bg} ${text}`}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${dot}`}></span>
                      {document.status}
                  </div>
              </div>
          </div>

          {isProPlan && (
              <div className="mt-4 pt-4 border-t dark:border-gray-800 flex items-center justify-between">
                  <ActiveViewers users={[currentUser, ...activeCollaborators.map(c => c.user)]} />
              </div>
          )}
        </div>

        <div className="overflow-hidden rounded-xl shadow-xl border dark:border-gray-700 bg-gray-100 dark:bg-gray-800 h-[300px] md:h-auto min-h-[400px]">
          <InlineFileViewer documentType={document.type} documentName={document.name} fileUrl={document.fileUrl} />
        </div>

         <div className="hidden md:block">
          {isProPlan ? (
              <CollaborativeScratchpad 
                  documentId={document.id}
                  content={document.scratchpadContent || ''}
                  onUpdate={onUpdateScratchpad}
              />
          ) : (
              <CollaborationUpsell featureName="Collaborative Scratchpad" />
          )}
        </div>
      </div>

      {/* Right Column: Details, History & Actions */}
      <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border dark:border-gray-700 overflow-hidden flex flex-col">
            
            <div className="p-5 md:p-6 grid grid-cols-2 gap-y-6 gap-x-4 border-b dark:border-gray-700">
              <DetailItem label="Uploader" value={document.uploadedBy.name} />
              <DetailItem label="Project" value={document.projectCode} />
              <DetailItem label="Upload Date" value={new Date(document.uploadDate).toLocaleDateString()} />
              <DetailItem label="Discipline" value={document.discipline} />
              <div className="col-span-2">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-tight">Assigned Reviewers</p>
                <div className="flex flex-wrap gap-1.5">
                  {document.reviewers.map(reviewer => (
                      <span key={reviewer.email} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-lg text-xs font-medium">
                          <UserIcon className="w-3.5 h-3.5 text-gray-400"/>
                          <span className="text-gray-800 dark:text-gray-200 truncate max-w-[120px]" title={reviewer.email}>{reviewer.email.split('@')[0]}</span>
                          <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase">{reviewer.role[0]}</span>
                      </span>
                  ))}
                </div>
              </div>
            </div>
            
             <div className="p-5 md:p-6 border-b dark:border-gray-700 bg-blue-50/30 dark:bg-blue-900/10">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center">
                    <SparklesIcon className="w-4 h-4 mr-2 text-blue-500" />
                    AI Summary
                  </h3>
                  <SummarizeButton />
                </div>
                {isSummarizing && (
                  <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border dark:border-gray-700 animate-pulse">
                    <p className="text-xs text-gray-500 font-medium italic">Analyzing review history and comments...</p>
                  </div>
                )}
                {summary && !isSummarizing && (
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700 shadow-sm">
                    <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed italic">"{summary}"</p>
                  </div>
                )}
              </div>

            <div className="p-5 md:p-6 border-b dark:border-gray-700">
              <h3 className="text-sm font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                <ListIcon className="w-4 h-4 mr-2 text-gray-500" />
                Revision Control
              </h3>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1.5 custom-scrollbar">
                {revisions.map(rev => {
                    const isCurrent = rev.id === document.id;
                    return (
                        <div 
                            key={rev.id} 
                            onClick={!isCurrent ? () => onSelectRevision(rev.id) : undefined}
                            className={`p-2.5 rounded-lg flex justify-between items-center transition-all ${isCurrent ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer border dark:border-gray-800'}`}
                        >
                            <div className="min-w-0">
                                <p className={`font-bold text-xs ${isCurrent ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                                    Revision {rev.version}
                                </p>
                                <p className={`text-[10px] truncate ${isCurrent ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>Uploaded {new Date(rev.uploadDate).toLocaleDateString()}</p>
                            </div>
                            <div className={`px-2 py-0.5 text-[10px] font-black rounded uppercase ${isCurrent ? 'bg-white/20 text-white' : statusStyles[rev.status].bg + ' ' + statusStyles[rev.status].text}`}>
                                {rev.status}
                            </div>
                        </div>
                    );
                })}
              </div>
            </div>

            <div className="p-5 md:p-6 border-b dark:border-gray-700">
              <h3 className="text-sm font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                <ClockIcon className="w-4 h-4 mr-2 text-gray-500" />
                Timeline & Review History
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1.5 custom-scrollbar">
                {document.history.map((entry, index) => {
                  const isSigned = entry.comment.startsWith('[E-signed]');
                  const displayComment = isSigned ? entry.comment.substring('[E-signed] '.length) : entry.comment;
                  const entryUser = users.find(u => u.email === entry.userEmail);
                  const userAvatarUrl = entryUser?.photoUrl || `https://i.pravatar.cc/150?u=${entry.userEmail}`;
                  const { bg: statusBg, text: statusText, dot: statusDot } = statusStyles[entry.status];

                  return (
                    <div 
                      key={index} 
                      className="group p-3 rounded-lg border dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      role="button"
                    >
                      <div className="flex items-start space-x-3">
                        <img 
                            src={userAvatarUrl} 
                            alt={entry.user} 
                            className="w-8 h-8 rounded-full flex-shrink-0 border-2 border-gray-100 dark:border-gray-700" 
                        />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <p className="font-bold text-xs text-gray-800 dark:text-gray-200 flex items-center truncate">
                                    <span className="truncate">{entry.user}</span>
                                    {isSigned && (
                                        <span title="Electronically Signed" className="ml-1.5 text-blue-500">
                                          <SignatureIcon className="w-3 h-3" />
                                        </span>
                                    )}
                                </p>
                                <div className={`px-2 py-0.5 text-[10px] font-black rounded-full flex items-center flex-shrink-0 ${statusBg} ${statusText}`}>
                                    {entry.status}
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-normal line-clamp-3">{displayComment}</p>
                            <div className="flex items-center justify-between mt-2">
                               <p className="text-[10px] text-gray-400 font-medium">{new Date(entry.date).toLocaleDateString()} {new Date(entry.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                    Rev {entry.version}
                                </span>
                            </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {(document.status === 'In Review' || document.status === 'In Progress') && (userRole === 'Approver' || userRole === 'Commenter') && (
              <div className="p-5 md:p-6 bg-gray-50 dark:bg-gray-800/80 border-t dark:border-gray-700">
                <h3 className="text-sm font-bold mb-4 text-gray-900 dark:text-white uppercase tracking-widest text-center">Take Action</h3>
                <div className="mb-3">
                  <textarea
                    value={comment}
                    onChange={(e) => { setComment(e.target.value); handleCommentTyping(true); }}
                    onBlur={() => handleCommentTyping(false)}
                    placeholder="Add feedback or notes here..."
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition shadow-inner"
                    rows={3}
                  ></textarea>
                </div>
                 {otherCollaboratorsTyping.length > 0 && (
                  <div className="text-[10px] text-blue-500 font-bold h-4 mb-2 italic animate-pulse">
                    {otherCollaboratorsTyping.map(c => c.user.name).join(', ')} typing...
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  {userRole === 'Approver' && (
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => handleAction('Approved')} className="py-3 px-4 text-xs font-black rounded-lg text-white bg-green-600 hover:bg-green-700 shadow-lg active:scale-95 transition-transform uppercase">Approve</button>
                      <button onClick={() => handleAction('Rejected')} className="py-3 px-4 text-xs font-black rounded-lg text-white bg-red-600 hover:bg-red-700 shadow-lg active:scale-95 transition-transform uppercase">Reject</button>
                      {document.status === 'In Review' && (
                        <button onClick={() => handleAction('In Progress')} className="col-span-2 py-3 px-4 text-xs font-black rounded-lg text-white bg-teal-600 hover:bg-teal-700 shadow-lg active:scale-95 transition-transform uppercase">Set In Progress</button>
                      )}
                    </div>
                  )}
                  {userRole === 'Commenter' && (
                    <button onClick={handleCommentSubmit} className="w-full py-3 px-4 text-xs font-black rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-lg active:scale-95 transition-transform uppercase">Submit Feedback</button>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Mobile only scratchpad */}
          <div className="md:hidden">
              {isProPlan ? (
                  <CollaborativeScratchpad 
                      documentId={document.id}
                      content={document.scratchpadContent || ''}
                      onUpdate={onUpdateScratchpad}
                  />
              ) : (
                  <CollaborationUpsell featureName="Collaborative Scratchpad" />
              )}
          </div>
      </div>
    </div>
  );
};
