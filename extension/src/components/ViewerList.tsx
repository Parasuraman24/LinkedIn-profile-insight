import React from 'react';
import { User, Eye } from 'lucide-react';

export interface Viewer {
    name: string;
    headline: string;
    time: string;
    imageUrl?: string;
    profileUrl?: string;
}

interface ViewerListProps {
    viewers: Viewer[];
}

export const ViewerList: React.FC<ViewerListProps> = ({ viewers = [] }) => {
    return (
        <div className="bg-white rounded shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-500 uppercase">Recent Viewers</h3>
                <Eye size={14} className="text-slate-400" />
            </div>
            {viewers.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                    No viewers found yet. Run a scan!
                </div>
            ) : (
                <>
                    <ul className="divide-y divide-slate-50">
                        {viewers.map((v, i) => (
                            <li key={i} className="p-3 hover:bg-slate-50 transition-colors flex gap-3 items-center">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 overflow-hidden">
                                    {v.imageUrl ? (
                                        <img src={v.imageUrl} alt={v.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={16} />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-800 truncate">{v.name}</p>
                                    <p className="text-[10px] text-slate-500 truncate">{v.headline}</p>
                                </div>
                                <span className="ml-auto text-[10px] text-slate-400 whitespace-nowrap">{v.time}</span>
                            </li>
                        ))}
                    </ul>
                    <div
                        className="p-2 text-center text-xs text-blue-600 font-medium cursor-pointer hover:bg-slate-50"
                        onClick={() => chrome.tabs.create({ url: 'https://www.linkedin.com/analytics/profile-views/' })}
                    >
                        View full list on LinkedIn
                    </div>
                </>
            )}
        </div>
    );
};
