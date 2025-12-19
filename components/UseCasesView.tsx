
import React from 'react';
import { CivilIcon } from './icons/CivilIcon';
import { StructuralIcon } from './icons/StructuralIcon';
import { ElectricalIcon } from './icons/ElectricalIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

const useCases = [
  {
    id: 'structural-review',
    title: 'Multi-Stage Structural Review',
    icon: <StructuralIcon className="w-8 h-8 text-blue-500" />,
    description: 'Ensure load-bearing integrity by routing drawings through primary engineers then senior principals.',
    steps: ['Lead Designer Upload', 'Structural Peer Review', 'Principal Approval'],
    benefit: 'Reduces liability by 40% with dual-signature verification.'
  },
  {
    id: 'site-plan',
    title: 'Civil Permit Submission',
    icon: <CivilIcon className="w-8 h-8 text-green-500" />,
    description: 'Centralize site plans and grading charts for regulatory submission across multiple disciplines.',
    steps: ['Civil Team Draft', 'Surveyor Verification', 'Project Manager Final Check'],
    benefit: 'Ensures all regulatory deadlines are tracked via Calendar.'
  },
  {
    id: 'electrical-mep',
    title: 'Electrical & MEP Coordination',
    icon: <ElectricalIcon className="w-8 h-8 text-amber-500" />,
    description: 'Manage complex circuitry diagrams and ensure zero-interference with plumbing/HVAC layouts.',
    steps: ['MEP Coordination Upload', 'Interference Check', 'Conflict Resolution'],
    benefit: 'AI Summaries identify technical conflicts in drawing history.'
  }
];

export const UseCasesView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="max-w-3xl">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4">Engineering Use Cases</h2>
        <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
          Discover how leading engineering firms utilize EngiFlow to eliminate bottlenecking in their approval pipelines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {useCases.map((uc) => (
          <div key={uc.id} className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-3xl p-6 shadow-md flex flex-col hover:shadow-xl transition-shadow">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl w-fit mb-6">
              {uc.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{uc.title}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
              {uc.description}
            </p>
            
            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Typical Workflow</h4>
              {uc.steps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[10px] font-bold text-blue-600">
                    {i + 1}
                  </div>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{step}</span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-100 dark:border-green-900/20">
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5" />
                <p className="text-xs font-bold text-green-800 dark:text-green-400 leading-tight">
                   {uc.benefit}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-110"></div>
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div>
             <h3 className="text-2xl font-black mb-2 flex items-center">
               <SparklesIcon className="w-6 h-6 mr-2" />
               Custom Workflows?
             </h3>
             <p className="text-blue-100 font-medium opacity-90">
               Our team can help you build custom discipline structures for niche engineering requirements.
             </p>
           </div>
           <button className="whitespace-nowrap px-8 py-4 bg-white text-blue-700 font-black rounded-2xl shadow-lg hover:bg-blue-50 transition-colors transform active:scale-95 uppercase tracking-tighter text-sm">
             Schedule Consultation
           </button>
         </div>
      </div>
    </div>
  );
};
