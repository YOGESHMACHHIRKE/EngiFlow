import React from 'react';
import type { Project } from '../types';
import { ProjectIcon } from './icons/ProjectIcon';
import { CalendarIcon } from './icons/CalendarIcon';

interface ProjectCardProps {
  project: Project;
  viewMode: 'grid' | 'list';
  onSelect: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, viewMode, onSelect }) => {
  const commonClasses = "p-6 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer transition-all duration-300";
  
  if (viewMode === 'list') {
    return (
      <div onClick={onSelect} className={`${commonClasses} flex items-center justify-between`}>
        <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg mr-4">
                <ProjectIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{project.name}</h3>
                <p className="text-sm font-semibold text-blue-500 dark:text-blue-400">{project.projectCode}</p>
            </div>
        </div>
        <div className="flex-1 px-4">
             <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-md">{project.description}</p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center flex-shrink-0 ml-4">
            <CalendarIcon className="w-4 h-4 mr-1.5" />
            <span>Last updated: {new Date(project.lastUpdated).toLocaleDateString()}</span>
        </div>
      </div>
    );
  }

  return (
    <div onClick={onSelect} className={`${commonClasses} flex flex-col`}>
      <div className="flex items-start justify-between mb-2">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
          <ProjectIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      <h3 className="font-bold text-xl text-gray-900 dark:text-white">{project.name}</h3>
      <p className="text-sm font-semibold text-blue-500 dark:text-blue-400 mb-2">{project.projectCode}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 flex-grow mb-4">{project.description}</p>
      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center border-t dark:border-gray-700 pt-3 mt-auto">
        <CalendarIcon className="w-4 h-4 mr-1.5" />
        <span>Last updated: {new Date(project.lastUpdated).toLocaleDateString()}</span>
      </div>
    </div>
  );
};