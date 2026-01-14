
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { VisualData } from '../types';

export const VisualDisplay: React.FC<{ data: VisualData }> = ({ data }) => {
  if (data.type === 'none') return null;

  if (data.type === 'pie') {
    const chartData = [
      { name: data.label, value: data.value },
      { name: 'Resto', value: Math.max(0, data.total - data.value) }
    ];
    return (
      <div className="h-48 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value" stroke="none">
              <Cell fill="#a3e635" />
              <Cell fill="#1e293b" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute text-center">
           <p className="text-2xl font-black text-white">{Math.round((data.value / data.total) * 100)}%</p>
           <p className="text-[10px] text-lime-400 font-bold uppercase">{data.label}</p>
        </div>
      </div>
    );
  }

  if (data.type === 'scale' || data.type === 'bar') {
    const chartData = [{ name: data.label, value: data.value, total: data.total }];
    return (
      <div className="h-32 w-full mt-4">
        <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
          <span>0</span>
          <span>{data.total} {data.label}</span>
        </div>
        <div className="relative h-6 bg-slate-800 rounded-full overflow-hidden border border-white/5">
          <div 
            className="absolute left-0 top-0 h-full mamba-gradient transition-all duration-1000 ease-out"
            style={{ width: `${(data.value / data.total) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-center text-sm font-bold text-lime-400">{data.value} / {data.total}</p>
      </div>
    );
  }

  return null;
};
