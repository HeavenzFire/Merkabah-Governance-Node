import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const mockData = [
  { time: '08:00', coherence: 85, tension: 10 },
  { time: '10:00', coherence: 88, tension: 12 },
  { time: '12:00', coherence: 82, tension: 25 },
  { time: '14:00', coherence: 90, tension: 8 },
  { time: '16:00', coherence: 94, tension: 5 },
  { time: '18:00', coherence: 91, tension: 8 },
];

export const CoherenceMetrics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
        <h3 className="text-slate-300 text-sm font-semibold mb-4">Collective Coherence Field</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockData}>
              <defs>
                <linearGradient id="colorCoherence" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
                itemStyle={{ color: '#818cf8' }}
              />
              <Area 
                type="monotone" 
                dataKey="coherence" 
                stroke="#6366f1" 
                fillOpacity={1} 
                fill="url(#colorCoherence)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-center">
          <span className="block text-slate-400 text-xs uppercase tracking-wider">Avg Agency Score</span>
          <span className="text-2xl font-bold text-emerald-400">92/100</span>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-center">
          <span className="block text-slate-400 text-xs uppercase tracking-wider">Active Tensions</span>
          <span className="text-2xl font-bold text-blue-400">2</span>
        </div>
      </div>
    </div>
  );
};