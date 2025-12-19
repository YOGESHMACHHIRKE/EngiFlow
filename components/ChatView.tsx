
import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { User, ChatMessage } from '../types';
import { SendIcon } from './icons/SendIcon';
import { ChatIcon } from './icons/ChatIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { SearchIcon } from './icons/SearchIcon';

interface ChatViewProps {
  currentUser: User;
  users: User[];
  messages: ChatMessage[];
  onSendMessage: (receiverEmail: string, text: string) => void;
  onInitiateCall: (user: User) => void;
}

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const ChatView: React.FC<ChatViewProps> = ({ currentUser, users, messages, onSendMessage, onInitiateCall }) => {
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const otherUsers = useMemo(() => {
    return users.filter(user => user.email !== currentUser.email);
  }, [users, currentUser]);

  const filteredUsers = useMemo(() => {
    const trimmedSearch = searchTerm.toLowerCase().trim();
    if (!trimmedSearch) {
      return otherUsers;
    }
    return otherUsers.filter(user => 
        user.name.toLowerCase().includes(trimmedSearch) ||
        user.email.toLowerCase().includes(trimmedSearch)
    );
  }, [otherUsers, searchTerm]);

  const selectedUser = useMemo(() => {
    return users.find(user => user.email === selectedUserEmail);
  }, [users, selectedUserEmail]);
  
  const conversation = useMemo(() => {
    if (!selectedUserEmail) return [];
    return messages
      .filter(msg => 
        (msg.senderEmail === currentUser.email && msg.receiverEmail === selectedUserEmail) ||
        (msg.senderEmail === selectedUserEmail && msg.receiverEmail === currentUser.email)
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [messages, currentUser.email, selectedUserEmail]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && selectedUserEmail) {
      onSendMessage(selectedUserEmail, newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="flex h-full gap-4 md:gap-6 relative overflow-hidden">
      {/* User List Sidebar */}
      <aside className={`${selectedUserEmail ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 lg:w-1/4 flex-col bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 border dark:border-gray-800`}>
        <div className="border-b dark:border-gray-800 pb-3 mb-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white px-2">Team</h2>
            <div className="relative mt-3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>
        </div>
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-2 custom-scrollbar">
          {filteredUsers.map(user => (
            <div
              key={user.email}
              onClick={() => setSelectedUserEmail(user.email)}
              className={`flex items-center p-3 rounded-xl cursor-pointer transition-all ${
                selectedUserEmail === user.email
                  ? 'bg-blue-600 text-white shadow-lg scale-[1.02]'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <div className="relative mr-3 flex-shrink-0">
                <img
                  src={user.photoUrl || `https://i.pravatar.cc/150?u=${user.email}`}
                  alt={user.name}
                  className={`w-10 h-10 rounded-full border-2 ${selectedUserEmail === user.email ? 'border-white' : 'border-transparent'}`}
                />
                <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ${selectedUserEmail === user.email ? 'ring-blue-600' : 'ring-white dark:ring-gray-900'} ${user.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              </div>
              <div className="min-w-0 flex-1">
                <p className={`font-bold text-sm truncate ${selectedUserEmail === user.email ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                    {user.name}
                </p>
                <p className={`text-[10px] truncate ${selectedUserEmail === user.email ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                    {user.email}
                </p>
              </div>
            </div>
          ))}
          {filteredUsers.length === 0 && (
              <div className="text-center py-10">
                  <p className="text-xs text-gray-500 italic">No members found.</p>
              </div>
          )}
        </div>
      </aside>

      {/* Chat Content Panel */}
      <main className={`${selectedUserEmail ? 'flex' : 'hidden'} md:flex flex-1 flex-col bg-white dark:bg-gray-900 rounded-xl shadow-md border dark:border-gray-800 overflow-hidden`}>
        {selectedUser ? (
          <>
            <header className="flex items-center justify-between p-3 md:p-4 border-b dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-10 sticky top-0">
              <div className="flex items-center min-w-0">
                 <button 
                    onClick={() => setSelectedUserEmail(null)} 
                    className="md:hidden mr-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                    aria-label="Back to team list"
                 >
                    <ArrowLeftIcon className="w-5 h-5" />
                 </button>
                <div className="relative mr-3 flex-shrink-0">
                  <img
                    src={selectedUser.photoUrl || `https://i.pravatar.cc/150?u=${selectedUser.email}`}
                    alt={selectedUser.name}
                    className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700"
                  />
                  <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-gray-900 ${selectedUser.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                </div>
                <div className="min-w-0">
                    <h3 className="text-sm md:text-md font-black text-gray-900 dark:text-white truncate uppercase tracking-tight">{selectedUser.name}</h3>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase">{selectedUser.status === 'active' ? 'Online' : 'Away'}</p>
                </div>
              </div>
              <button
                onClick={() => onInitiateCall(selectedUser)}
                className="p-2.5 rounded-full text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all active:scale-90"
                aria-label={`Call ${selectedUser.name}`}
                disabled={selectedUser.status !== 'active'}
              >
                <PhoneIcon className={`w-6 h-6 ${selectedUser.status !== 'active' ? 'text-gray-300 dark:text-gray-600 opacity-50' : ''}`} />
              </button>
            </header>
            
            <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-gray-50/50 dark:bg-gray-800/30 custom-scrollbar">
              {conversation.map(msg => {
                const isSender = msg.senderEmail === currentUser.email;
                return (
                  <div key={msg.id} className={`flex items-end gap-2 ${isSender ? 'justify-end' : 'justify-start'}`}>
                    {!isSender && (
                        <img 
                            src={selectedUser.photoUrl || `https://i.pravatar.cc/150?u=${selectedUser.email}`} 
                            alt={selectedUser.name} 
                            className="w-7 h-7 rounded-full flex-shrink-0 border dark:border-gray-700"
                        />
                    )}
                    <div className={`max-w-[85%] md:max-w-[70%] lg:max-w-[60%] p-3 rounded-2xl shadow-sm ${
                        isSender
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none border dark:border-gray-600'
                      }`}
                    >
                      <p className="text-xs md:text-sm leading-relaxed">{msg.text}</p>
                       <p className={`text-[9px] mt-1 font-bold ${isSender ? 'text-blue-200/80 text-right' : 'text-gray-400 dark:text-gray-400'}`}>
                        {formatTimestamp(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
              {conversation.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full opacity-50">
                      <div className="p-4 bg-gray-200 dark:bg-gray-700 rounded-full mb-4">
                          <ChatIcon className="w-8 h-8 text-gray-500" />
                      </div>
                      <p className="text-xs font-bold uppercase tracking-widest">No messages yet</p>
                  </div>
              )}
              <div ref={chatEndRef} />
            </div>
            
            <form onSubmit={handleSendMessage} className="p-3 md:p-4 border-t dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={selectedUser.status === 'active' ? 'Type something...' : 'User is offline'}
                  className="flex-1 py-2.5 px-4 bg-gray-100 dark:bg-gray-800 border-none rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all placeholder:font-medium disabled:opacity-50"
                  disabled={selectedUser.status !== 'active'}
                />
                <button 
                    type="submit" 
                    className="flex-shrink-0 p-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 transition shadow-lg active:scale-90" 
                    disabled={selectedUser.status !== 'active' || !newMessage.trim()}
                    aria-label="Send Message"
                >
                  <SendIcon className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-50/30 dark:bg-gray-800/20">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <ChatIcon className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tight">Select a Chat</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-xs font-medium">Collaborate instantly with your organization's team members.</p>
          </div>
        )}
      </main>
    </div>
  );
};
