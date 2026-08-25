import { useEffect, useState } from "react";
import { Link } from "react-router";
import Navbar from "~/components/Navbar";
import ProtectedRoute from "~/components/ProtectedRoute";
import { usePuterStore } from "~/lib/puter";

export const meta = () => ([
    { title: 'Resumind | Profile' },
    { name: 'description', content: 'Your profile' },
]);

const ProfileContent = () => {
    const { auth, kv } = usePuterStore();
    const [totalAnalyses, setTotalAnalyses] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const items = (await kv.list("resume:*", true)) as KVItem[];
                setTotalAnalyses(items?.length || 0);
            } catch {
                setTotalAnalyses(0);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [kv]);

    return (
        <main className="bg-gradient min-h-screen">
            <Navbar />
            <section className="main-section">
                <div className="w-full max-w-2xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
                    {/* Header */}
                    <div className="mb-8">
                        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm mb-4">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                            Back to Dashboard
                        </Link>
                        <h1 className="!text-3xl sm:!text-4xl">Your Profile</h1>
                    </div>

                    {/* Profile Card */}
                    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl mb-6">
                        <div className="flex items-center gap-4 mb-6">
                            {/* Avatar */}
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-black text-2xl font-bold flex-shrink-0">
                                {auth.user?.username?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">{auth.user?.username || "User"}</h3>
                                <p className="text-sm text-slate-400">Resumind Member</p>
                            </div>
                        </div>

                        {/* Info Rows */}
                        <div className="flex flex-col gap-0 border-t border-slate-800">
                            <div className="flex items-center justify-between py-4 border-b border-slate-800/60">
                                <span className="text-sm text-slate-400">Username</span>
                                <span className="text-sm text-white font-medium">{auth.user?.username || "—"}</span>
                            </div>
                            <div className="flex items-center justify-between py-4 border-b border-slate-800/60">
                                <span className="text-sm text-slate-400">User ID</span>
                                <span className="text-xs text-slate-500 font-mono">{auth.user?.uuid || "—"}</span>
                            </div>
                            <div className="flex items-center justify-between py-4 border-b border-slate-800/60">
                                <span className="text-sm text-slate-400">Resumes Analyzed</span>
                                <span className="text-sm text-white font-medium">
                                    {loading ? (
                                        <span className="text-slate-500">Loading...</span>
                                    ) : (
                                        totalAnalyses
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-4">
                                <span className="text-sm text-slate-400">Plan</span>
                                <span className="text-sm text-amber-400 font-medium">Free Forever</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                            to="/upload"
                            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold transition-all duration-300 shadow-lg shadow-amber-500/15 active:scale-[0.98]"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            New Analysis
                        </Link>
                        <button
                            onClick={auth.signOut}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all duration-300 border border-slate-700 active:scale-[0.98] cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                            </svg>
                            Sign Out
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
};

const Profile = () => (
    <ProtectedRoute>
        <ProfileContent />
    </ProtectedRoute>
);

export default Profile;
