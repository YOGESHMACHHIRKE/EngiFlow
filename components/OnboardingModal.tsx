
import React, { useState } from 'react';
import { ProjectIcon } from './icons/ProjectIcon';
import { UsersIcon } from './icons/UsersIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { XIcon } from './icons/XIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { FolderIcon } from './icons/FolderIcon';

interface OnboardingModalProps {
  onClose: () => void;
  userName: string;
}

const steps = [
  {
    title: "1. Create Project Folders",
    description: "Organization is key in engineering. Start by creating a project folder to house your technical drawings, specs, and reports.",
    icon: <FolderIcon className="w-12 h-12 text-blue-500" />,
    action: "Go to 'Projects' and click 'New Project'."
  },
  {
    title: "2. Invite Your Team",
    description: "Add your fellow engineers, principals, and project managers. Assign roles like 'Approver' or 'Commenter' to automate your sign-off chain.",
    icon: <UsersIcon className="w-12 h-12 text-teal-500" />,
    action: "Head to Settings > User Management."
  },
  {
    title: "3. Explore Use Cases",
    description: "Not sure where to start? Our 'Use Cases' section provides blueprints for Structural Reviews, Civil Permits, and MEP Coordination.",
    icon: <SparklesIcon className="w-12 h-12 text-amber-500" />,
    action: "Click 'Use Cases' in the sidebar."
  }
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose, userName }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden transform transition-all animate-fade-in-up border border-white/10">
        <div className="p-8 md:p-10">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-4 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">Guided Tour {currentStep + 1}/{steps.length}</span>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400">
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="p-8 bg-gray-50 dark:bg-gray-800 rounded-[2.5rem] mb-8 shadow-inner ring-1 ring-black/5 dark:ring-white/5">
              {steps[currentStep].icon}
            </div>
            
            {currentStep === 0 && (
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Welcome, {userName}!</h2>
            )}
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{steps[currentStep].title}</h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8 text-lg">
              {steps[currentStep].description}
            </p>

            <div className="w-full p-5 bg-blue-600/5 dark:bg-blue-400/5 rounded-2xl border border-blue-200 dark:border-blue-800/50 text-sm font-bold text-blue-700 dark:text-blue-300 mb-10 flex items-center justify-center gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">!</span>
              Step: {steps[currentStep].action}
            </div>
          </div>

          <div className="flex items-center justify-between gap-6">
            <div className="flex space-x-2.5">
              {steps.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-2 rounded-full transition-all duration-500 ${idx === currentStep ? 'w-10 bg-blue-600' : 'w-2 bg-gray-200 dark:bg-gray-800'}`}
                />
              ))}
            </div>
            <button 
              onClick={nextStep}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black transition-all transform active:scale-95 shadow-[0_10px_20px_-10px_rgba(37,99,235,0.5)] uppercase tracking-wider text-xs"
            >
              {currentStep === steps.length - 1 ? "Let's Build" : "Continue"}
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
