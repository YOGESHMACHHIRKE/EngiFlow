
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { Document, DocumentStatus, User } from '../types';
import { DocumentCard } from './DocumentCard';
import { BellIcon } from './icons/BellIcon';
import { CalendarIcon } from './icons/CalendarIcon';

interface DashboardProps {
  documents: Document[];
  onViewDocument: (docId: string) => void;
  theme: 'light' | 'dark';
  currentUser: User;
}

const COLORS: { [key in DocumentStatus]: string } = {
  'Approved': '#22c55e', // green-500
  'In Review': '#f59e0b', // amber-500
  'In Progress': '#14b8a6', // teal-500
  'Commented': '#8b5cf6', // violet-500
  'Rejected': '#ef4444', // red-500
};

export const Dashboard: React.FC<DashboardProps> = ({ documents, onViewDocument, theme, currentUser }) => {
  const stats = useMemo(() => {
    return documents.reduce(
      (acc, doc) => {
        if (!acc[doc.status]) acc[doc.status] = 0;
        acc[doc.status]++;
        return acc;
      },
      { 'Approved': 0, 'In Review': 0, 'Rejected': 0, 'Commented': 0, 'In Progress': 0 }
    );
  }, [documents]);

  const chartData = useMemo(() => {
    return (Object.entries(stats) as [DocumentStatus, number][])
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0);
  }, [stats]);

  const recentDocuments = useMemo(() => {
    return [...documents]
      .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
      .slice(0, 5);
  }, [documents]);

  const upcomingReminders = useMemo(() => {
    return documents
      .filter(doc => doc.status === 'In Review' && doc.reminderDate)
      .sort((a, b) => new Date(a.reminderDate!).getTime() - new Date(b.reminderDate!).getTime());
  }, [documents]);


  const StatCard: React.FC<{ title: string; value: number; color: string }> = ({ title, value, color }) => (
    <div className="bg-white dark:bg-gray-900 p-4 md:p-6 rounded-xl shadow-md border dark:border-gray-800 flex flex-col items-center justify-center transition-transform hover:scale-105">
      <span className={`text-2xl md:text-4xl font-black`} style={{ color }}>{value}</span>
      <p className="text-xs md:text-sm font-bold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-tight text-center">{title}</p>
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
        <StatCard title="Total Docs" value={documents.length} color="#3b82f6" />
        <StatCard title="Approved" value={stats['Approved']} color={COLORS['Approved']} />
        <StatCard title="In Review" value={stats['In Review']} color={COLORS['In Review']} />
        <StatCard title="In Progress" value={stats['In Progress']} color={COLORS['In Progress']} />
        <StatCard title="Commented" value={stats['Commented']} color={COLORS['Commented']} />
        <StatCard title="Rejected" value={stats['Rejected']} color={COLORS['Rejected']} />
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-5 gap-6 md:gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6 md:gap-8">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border dark:border-gray-800">
            <h3 className="text-lg md:text-xl font-bold mb-4 text-gray-900 dark:text-white border-b dark:border-gray-800 pb-2">Status Distribution</h3>
            <div style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                      borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                      color: theme === 'dark' ? '#f3f4f6' : '#1f2937',
                      borderRadius: '0.75rem',
                      fontWeight: 'bold',
                      fontSize: '12px'
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={(value) => (
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
           <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border dark:border-gray-800">
            <h3 className="text-lg md:text-xl font-bold mb-4 text-gray-900 dark:text-white border-b dark:border-gray-800 pb-2">Review Deadlines</h3>
             <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                {upcomingReminders.length > 0 ? (
                    upcomingReminders.map(doc => (
                        <div key={doc.id} onClick={() => onViewDocument(doc.id)} className="p-3 rounded-lg border border-transparent hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-all">
                           <p className="font-bold text-gray-800 dark:text-gray-200 truncate text-sm">{doc.name}</p>
                           <p className="flex items-center text-xs text-amber-600 dark:text-amber-400 mt-1 font-semibold uppercase">
                             <CalendarIcon className="w-3.5 h-3.5 mr-1.5"/>
                             Due: {new Date(doc.reminderDate!).toLocaleDateString()}
                           </p>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 py-8">
                      <BellIcon className="w-10 h-10 mb-2 opacity-30"/>
                      <p className="text-sm font-medium">No active reminders.</p>
                    </div>
                )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border dark:border-gray-800">
            <h3 className="text-lg md:text-xl font-bold mb-4 text-gray-900 dark:text-white border-b dark:border-gray-800 pb-2">Recent Activity</h3>
            <div className="space-y-3 md:space-y-4">
                {recentDocuments.length > 0 ? (
                    recentDocuments.map(doc => (
                        <DocumentCard key={doc.id} document={doc} onSelect={() => onViewDocument(doc.id)} currentUser={currentUser} />
                    ))
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 py-4 text-center font-medium">No recent document uploads found.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
