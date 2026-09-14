import { useEffect, useState } from "react";
import { Link } from "react-router";
import Navbar from "~/components/Navbar";
import ProtectedRoute from "~/components/ProtectedRoute";
import { usePuterStore } from "~/lib/puter";

export const meta = () => ([
    { title: 'Resumind | Dashboard' },
    { name: 'description', content: 'Your resume analysis dashboard' },
]);

const DashboardContent = () => {
    const { auth, kv } = usePuterStore();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const items = (await kv.list("resume:*", true)) as KVItem[];
                const parsed = items?.map((r) => JSON.parse(r.value) as Resume) || [];
                // Sort by most recent first (if we had timestamps; fallback to reverse order)
                setResumes(parsed.reverse());
            } catch {
                setResumes([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [kv]);

    const totalResumes = resumes.length;
    const avgScore = totalResumes > 0
        ? Math.round(resumes.reduce((sum, r) => sum + (r.feedback?.overall_score ?? (r.feedback as any)?.overallScore ?? 0), 0) / totalResumes)
        : 0;

    return (
        <main className="bg-gradient min-h-screen">
            <Navbar />
            <section className="main-section">
                <div className="w-full max-w-5xl mx-auto py-6 sm:py-12">
                    {/* Welcome Header */}
                    <div className="mb-6 sm:mb-8">
                        <h1 className="!text-2xl sm:!text-4xl mb-2">
                            Welcome back,{" "}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-500">
                                {auth.user?.username || "User"}
                            </span>
                        </h1>
                        <p className="text-slate-400 text-base">Here's an overview of your resume analyses.</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 flex flex-col gap-1">
                            <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Total Analyses</span>
                            <span className="text-3xl font-bold text-white">{totalResumes}</span>
                        </div>
                        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 flex flex-col gap-1">
                            <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Average Score</span>
                            <span className="text-3xl font-bold text-amber-400">{avgScore > 0 ? `${avgScore}/100` : "—"}</span>
                        </div>
                        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 flex flex-col gap-1">
                            <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Quick Actions</span>
                            <Link
                                to="/upload"
                                className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors text-sm font-medium mt-1"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                New Analysis
                            </Link>
                        </div>
                    </div>

                    {/* Resume History */}
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white">Recent Analyses</h3>
                        {totalResumes > 0 && (
                            <span className="text-xs text-slate-500">{totalResumes} total</span>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                            <p className="text-slate-500 text-sm">Loading your analyses...</p>
                        </div>
                    ) : resumes.length === 0 ? (
                        <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-5 sm:p-12 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 flex items-center justify-center">
                                <svg className="w-8 h-8 text-amber-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                            </div>
                            <h4 className="text-white font-semibold text-lg mb-1">No analyses yet</h4>
                            <p className="text-slate-400 text-sm mb-6">Upload your first resume to get an AI-powered ATS score and improvement suggestions.</p>
                            <Link
                                to="/upload"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold transition-all duration-300 shadow-lg shadow-amber-500/15 active:scale-[0.98]"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                </svg>
                                Analyse Your First Resume
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {resumes.map((resume) => {
                                const score = resume.feedback?.overall_score ?? (resume.feedback as any)?.overallScore ?? 0;
                                const scoreColor = score >= 80 ? "text-emerald-400" : score >= 60 ? "text-amber-400" : "text-rose-400";

                                return (
                                    <Link
                                        key={resume.id}
                                        to={`/resume/${resume.id}`}
                                        className="group flex items-center gap-4 p-4 rounded-xl bg-slate-900/30 border border-slate-800 hover:border-amber-500/30 hover:bg-slate-900/50 transition-all duration-300"
                                    >
                                        {/* Score */}
                                        <div className="flex-shrink-0">
                                            <div className={`w-12 h-12 rounded-xl bg-slate-800/60 flex items-center justify-center ${scoreColor} font-bold text-lg`}>
                                                {score}
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium truncate">
                                                {resume.companyName || resume.jobTitle || "Resume Analysis"}
                                            </p>
                                            <p className="text-xs text-slate-500 truncate">
                                                {resume.jobTitle && resume.companyName
                                                    ? `${resume.jobTitle} at ${resume.companyName}`
                                                    : resume.jobTitle || resume.companyName || "General analysis"}
                                            </p>
                                        </div>

                                        {/* Arrow */}
                                        <svg className="w-5 h-5 text-slate-600 group-hover:text-amber-400 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

const Dashboard = () => (
    <ProtectedRoute>
        <DashboardContent />
    </ProtectedRoute>
);

export default Dashboard;
