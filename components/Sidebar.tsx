
import React from 'react';
import type { View } from '../types';
import { DashboardIcon } from './icons/DashboardIcon';
import { DocumentIcon } from './icons/DocumentIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { APP_NAME } from '../constants';


interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  return (
    <li
      onClick={onClick}
      className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all duration-200 ${
        isActive
          ? 'bg-blue-600 text-white shadow-lg'
          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
      }`}
    >
      {icon}
      <span className="ml-4 font-medium">{label}</span>
    </li>
  );
};


export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-900 shadow-md flex-shrink-0 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-center h-20 border-b dark:border-gray-700">
           <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">{APP_NAME}</h1>
        </div>
        <nav className="p-4">
          <ul>
            <NavItem
              icon={<DashboardIcon className="w-6 h-6" />}
              label="Dashboard"
              isActive={currentView === 'dashboard'}
              onClick={() => setView('dashboard')}
            />
            <NavItem
              icon={<DocumentIcon className="w-6 h-6" />}
              label="Documents"
              isActive={currentView === 'documents'}
              onClick={() => setView('documents')}
            />
          </ul>
        </nav>
      </div>
       <div className="p-4 border-t dark:border-gray-700">
          <ul>
            <NavItem
              icon={<SettingsIcon className="w-6 h-6" />}
              label="Settings"
              isActive={false}
              onClick={() => {}}
            />
             <NavItem
              icon={<LogoutIcon className="w-6 h-6" />}
              label="Logout"
              isActive={false}
              onClick={() => {}}
            />
          </ul>
      </div>
    </aside>
  );
};
