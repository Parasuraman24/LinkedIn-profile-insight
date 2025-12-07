import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Mon', views: 20 },
    { name: 'Tue', views: 45 },
    { name: 'Wed', views: 30 },
    { name: 'Thu', views: 80 },
    { name: 'Fri', views: 65 },
    { name: 'Sat', views: 90 },
    { name: 'Sun', views: 50 },
];

export const ChartWidget: React.FC = () => {
    return (
        <div className="bg-white p-3 rounded shadow-sm border border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase">Profile Trends</h3>
            <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                        <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            itemStyle={{ fontSize: '12px', color: '#0077b5' }}
                        />
                        <Line type="monotone" dataKey="views" stroke="#0077b5" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
