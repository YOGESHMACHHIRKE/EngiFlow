import React, { useState, useRef, useEffect } from 'react';
import type { NewProjectData } from '../types';
import { ProjectIcon } from './icons/ProjectIcon';

interface AddProjectModalProps {
  onClose: () => void;
  onAddProject: (projectData: NewProjectData) => void;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({ onClose, onAddProject }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [projectCode, setProjectCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !projectCode.trim()) {
        alert('Project name and code are required.');
        return;
    };

    setIsLoading(true);
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 300));

    onAddProject({ name, description, projectCode });
    
    // Note: isLoading might not be set to false if the component unmounts after onAddProject
    // but in this case, the modal closes, so it's acceptable.
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-95 hover:scale-100">
        
        <form onSubmit={handleSubmit}>
            <div className="p-8">
                <div className="flex items-center mb-6">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg mr-4">
                        <ProjectIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Project</h2>
                </div>
              
              <div className="space-y-6">
                <div>
                    <label htmlFor="project-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Project Name</label>
                    <input
                        id="project-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Project Phoenix"
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                 <div>
                    <label htmlFor="project-code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Project Code *</label>
                    <input
                        id="project-code"
                        type="text"
                        value={projectCode}
                        onChange={(e) => setProjectCode(e.target.value.toUpperCase())}
                        placeholder="e.g., PNX-001 (Must be unique)"
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                 <div>
                    <label htmlFor="project-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                    <textarea
                        id="project-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter a brief description of the project..."
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                    />
                </div>
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 px-8 py-4 flex justify-end space-x-3 rounded-b-2xl">
              <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">Cancel</button>
              <button type="submit" disabled={isLoading} className="px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300">
                {isLoading ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </form>
      </div>
    </div>
  );
};

export default AddProjectModal;