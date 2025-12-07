import React from 'react';

interface LoginViewProps {
    onLogin: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-slate-50">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Profile Insights</h1>
                <p className="text-slate-500 text-sm mt-2">Unlock analytics for your LinkedIn Profile</p>
            </div>

            <button
                onClick={onLogin}
                className="w-full py-3 px-4 bg-[#0077b5] hover:bg-[#004182] text-white font-semibold rounded shadow-md transition-colors flex items-center justify-center gap-2"
            >
                <span>Sign in with LinkedIn</span>
            </button>

            <p className="mt-8 text-xs text-slate-400">
                Safe & Secure. We only access public profile data.
            </p>
        </div>
    );
};
