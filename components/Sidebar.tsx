
import React from 'react';
import type { View } from '../types';
import { DashboardIcon } from './icons/DashboardIcon';
import { DocumentIcon } from './icons/DocumentIcon';
import { ProfileIcon } from './icons/ProfileIcon';
import { APP_NAME } from '../constants';
import { ProjectIcon } from './icons/ProjectIcon';
import { SearchIcon } from './icons/SearchIcon';
import { LogoIcon } from './icons/LogoIcon';
import { ThemeToggle } from './ThemeToggle';


interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
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


export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, theme, onToggleTheme }) => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-900 shadow-md flex-shrink-0 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-center h-20 border-b dark:border-gray-700 px-4">
           <LogoIcon className="w-8 h-8" />
           <span className="ml-3 text-2xl font-bold text-gray-800 dark:text-white">{APP_NAME}</span>
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
              icon={<ProjectIcon className="w-6 h-6" />}
              label="Projects"
              isActive={currentView === 'projects'}
              onClick={() => setView('projects')}
            />
            <NavItem
              icon={<DocumentIcon className="w-6 h-6" />}
              label="All Documents"
              isActive={currentView === 'documents'}
              onClick={() => setView('documents')}
            />
             <NavItem
              icon={<SearchIcon className="w-6 h-6" />}
              label="Global Search"
              isActive={currentView === 'search'}
              onClick={() => setView('search')}
            />
          </ul>
        </nav>
      </div>
       <div>
          <div className="p-4 border-t dark:border-gray-700">
            <ul>
              <NavItem
                icon={<ProfileIcon className="w-6 h-6" />}
                label="Profile"
                isActive={currentView === 'profile'}
                onClick={() => setView('profile')}
              />
            </ul>
             <div className="mt-4 flex items-center justify-between">
              <span className="font-medium text-gray-500 dark:text-gray-400">Theme</span>
              <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            </div>
        </div>
        <div className="p-4 border-t dark:border-gray-700 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>Version 1.0.0</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} EngiFlow</p>
        </div>
      </div>
    </aside>
  );
};
