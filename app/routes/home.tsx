import type { Route } from "./+types/home";
import { Link, useNavigate } from "react-router";
import { useEffect } from "react";
import Navbar from "~/components/Navbar";
import { usePuterStore } from "~/lib/puter";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Resumind — AI Resume Studio" },
        { name: "description", content: "Score your resume against ATS with AI-powered insights" },
    ];
}

const FEATURES = [
    { title: "ATS Scoring", desc: "Get scored against real Applicant Tracking Systems", icon: "📊" },
    { title: "AI Analysis", desc: "Strengths, weaknesses, and missing keywords identified", icon: "✨" },
    { title: "Actionable Tips", desc: "Concrete suggestions to improve your resume instantly", icon: "🎯" },
];

export default function Home() {
    const { auth, isInitializing, puterReady } = usePuterStore();
    const navigate = useNavigate();

    // Redirect authenticated users to dashboard
    useEffect(() => {
        if (!isInitializing && puterReady && auth.isAuthenticated) {
            navigate("/dashboard", { replace: true });
        }
    }, [auth.isAuthenticated, isInitializing, puterReady, navigate]);

    return (
        <main className="bg-gradient min-h-screen">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16 sm:py-24 w-full">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/5 mb-6">
                        <span className="text-xs sm:text-sm font-medium text-amber-300 tracking-wide">AI Powered · Free · ATS Optimized</span>
                    </div>

                    {/* Title */}
                    <h1 className="mb-3 !text-4xl sm:!text-5xl md:!text-6xl">
                        Your AI Resume{" "}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500">
                            Studio
                        </span>
                    </h1>

                    <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                        Score your resume against ATS, get AI-powered insights, and land more interviews — completely free.
                    </p>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-8">
                        <Link
                            to="/login"
                            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-base transition-all duration-300 shadow-lg shadow-amber-500/20 active:scale-[0.98]"
                        >
                            Get Started — It's Free
                        </Link>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 w-full max-w-3xl">
                        {FEATURES.map((f) => (
                            <div key={f.title} className="flex flex-col items-center gap-2 p-5 rounded-2xl border border-slate-800 bg-slate-900/30 text-center">
                                <span className="text-2xl">{f.icon}</span>
                                <h4 className="text-sm font-bold text-white">{f.title}</h4>
                                <p className="text-xs text-slate-400">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
