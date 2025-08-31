
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { Document, DocumentStatus } from '../types';
import { DocumentCard } from './DocumentCard';

interface DashboardProps {
  documents: Document[];
  onViewDocument: (docId: string) => void;
}

const COLORS: { [key in DocumentStatus]: string } = {
  'Approved': '#22c55e', // green-500
  'In Review': '#f59e0b', // amber-500
  'Rejected': '#ef4444', // red-500
};

export const Dashboard: React.FC<DashboardProps> = ({ documents, onViewDocument }) => {
  const stats = useMemo(() => {
    return documents.reduce(
      (acc, doc) => {
        acc[doc.status]++;
        return acc;
      },
      { 'Approved': 0, 'In Review': 0, 'Rejected': 0 }
    );
  }, [documents]);

  const chartData = [
    { name: 'Approved', value: stats['Approved'] },
    { name: 'In Review', value: stats['In Review'] },
    { name: 'Rejected', value: stats['Rejected'] },
  ].filter(item => item.value > 0);

  const recentDocuments = useMemo(() => {
    return [...documents]
      .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
      .slice(0, 3);
  }, [documents]);

  const StatCard: React.FC<{ title: string; value: number; color: string }> = ({ title, value, color }) => (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md flex flex-col items-center justify-center">
      <span className={`text-4xl font-bold`} style={{ color }}>{value}</span>
      <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">{title}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Documents" value={documents.length} color="#3b82f6" />
        <StatCard title="Approved" value={stats['Approved']} color={COLORS['Approved']} />
        <StatCard title="In Review" value={stats['In Review']} color={COLORS['In Review']} />
        <StatCard title="Rejected" value={stats['Rejected']} color={COLORS['Rejected']} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Document Status Overview</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as DocumentStatus]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-3 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Recently Uploaded</h3>
            <div className="space-y-4">
                {recentDocuments.length > 0 ? (
                    recentDocuments.map(doc => (
                        <DocumentCard key={doc.id} document={doc} onSelect={() => onViewDocument(doc.id)} />
                    ))
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">No recent documents.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
