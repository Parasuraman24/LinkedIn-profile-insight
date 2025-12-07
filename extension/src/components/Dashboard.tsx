import React, { useState } from 'react';
import { ChartWidget } from './ChartWidget';
import { ViewerList, type Viewer } from './ViewerList';

interface DashboardProps {
    user: { name: string; headline: string };
    onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
    const [viewers, setViewers] = useState<Viewer[]>([
        // Initialize with null or empty if you want, keeping sample data for now or empty
        // { name: 'Alice Strategy', headline: 'Product Manager at TechCo', time: '2h ago' },
    ]);
    const [isScanning, setIsScanning] = useState(false);

    return (
        <div className="h-full flex flex-col bg-slate-50">
            {/* Header */}
            <header className="bg-white p-4 border-b border-slate-200 flex justify-between items-center">
                <div>
                    <h2 className="font-semibold text-slate-800">{user.name}</h2>
                    <p className="text-xs text-slate-500 truncate max-w-[200px]">{user.headline}</p>
                </div>
                <button onClick={onLogout} className="text-xs text-red-500 hover:underline">Logout</button>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded shadow-sm border border-slate-100">
                        <p className="text-xs text-slate-400 uppercase font-bold">Profile Views</p>
                        <p className="text-2xl font-bold text-slate-800">1,240</p>
                        <span className="text-xs text-green-600">▲ 12% this week</span>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm border border-slate-100">
                        <p className="text-xs text-slate-400 uppercase font-bold">Search Appears</p>
                        <p className="text-2xl font-bold text-slate-800">450</p>
                        <span className="text-xs text-green-600">▲ 5% this week</span>
                    </div>
                </div>

                {/* Charts & Lists */}
                <div className="space-y-4">
                    <ChartWidget />
                    <ViewerList viewers={viewers} />
                </div>

                {/* Feature Teaser */}
                <div className="bg-blue-50 border border-blue-100 p-4 rounded text-center">
                    <h3 className="font-semibold text-blue-800 text-sm">Profile Scanner</h3>
                    <p className="text-xs text-blue-600 mt-1 mb-3">Scan current page for profiles (Viewers or 'People Also Viewed').</p>
                    <button
                        onClick={() => {
                            setIsScanning(true);
                            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                                const currentTab = tabs[0];
                                if (currentTab?.id) {
                                    if (!currentTab.url?.includes("linkedin.com")) {
                                        alert("Please navigate to LinkedIn to use this feature.");
                                        setIsScanning(false);
                                        return;
                                    }

                                    chrome.tabs.sendMessage(currentTab.id, { action: "SCRAPE_VIEWERS" }, (response) => {
                                        setIsScanning(false);
                                        if (chrome.runtime.lastError) {
                                            const errorMsg = chrome.runtime.lastError.message;
                                            console.error("Error communicating with content script:", errorMsg);

                                            if (errorMsg?.includes("Could not establish connection")) {
                                                alert("Connection failed. Please REFRESH the LinkedIn page and try again.");
                                            } else {
                                                alert("Error: " + errorMsg);
                                            }
                                        } else if (response && response.status === "SUCCESS") {
                                            if (response.data && response.data.length > 0) {
                                                setViewers(response.data);
                                                console.log(`Found ${response.data.length} profiles.`);
                                            } else {
                                                alert("No profiles found. Try the 'Profile Views' page or a user profile.");
                                            }
                                        } else {
                                            alert("Scan failed. Try refreshing the page.");
                                        }
                                    });
                                }
                            });
                        }}
                        disabled={isScanning}
                        className={`px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 transition ${isScanning ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isScanning ? 'Scanning...' : 'Scan Page'}
                    </button>
                    {viewers.length > 0 && (
                        <p className="text-xs text-green-600 mt-2 font-medium">Found {viewers.length} profiles!</p>
                    )}
                </div>
            </div>
        </div>
    );
};
