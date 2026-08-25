import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { useTheme } from "~/lib/useTheme";

export const meta = () => ([
    { title: 'Resumind | Login' },
    { name: 'description', content: 'Sign in to your Resumind account' },
]);

const FEATURES = [
    {
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
        ),
        title: "ATS Score",
        desc: "Score your resume against real ATS criteria",
    },
    {
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
        ),
        title: "AI Insights",
        desc: "Get strengths, weaknesses, and suggestions",
    },
    {
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
        ),
        title: "Secure & Private",
        desc: "Your data belongs to you, always",
    },
];

const Login = () => {
    const { isLoading, auth, isInitializing, puterReady } = usePuterStore();
    const location = useLocation();
    const navigate = useNavigate();

    // Extract the return URL from query params
    const searchParams = new URLSearchParams(location.search);
    const next = searchParams.get("next") || "/dashboard";

    // Redirect if already authenticated
    useEffect(() => {
        if (!isInitializing && puterReady && auth.isAuthenticated) {
            navigate(decodeURIComponent(next), { replace: true });
        }
    }, [auth.isAuthenticated, isInitializing, puterReady, next, navigate]);

    const handleSignIn = async () => {
        await auth.signIn();
    };

    const { isDark, toggle } = useTheme();

    return (
        <main className="bg-gradient min-h-screen flex items-center justify-center p-4 relative">
            {/* Theme toggle — top right */}
            <button
                onClick={toggle}
                className="absolute top-5 right-5 p-2.5 rounded-xl hover:bg-slate-800/40 transition-colors cursor-pointer"
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                aria-label="Toggle theme"
            >
                {isDark ? (
                    <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                    </svg>
                )}
            </button>

            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/">
                        <h1 className="!text-3xl sm:!text-4xl bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-500 inline-block">
                            RESUMIND
                        </h1>
                    </Link>
                    <p className="text-slate-400 text-sm mt-2">Your AI Resume Studio</p>
                </div>

                {/* Login Card */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
                    <div className="text-center mb-6">
                        <h2 className="!text-xl sm:!text-2xl text-white font-bold mb-2">Welcome Back</h2>
                        <p className="text-slate-400 text-sm">Sign in to access your resume analyses and history</p>
                    </div>

                    {/* Sign In Button */}
                    <button
                        onClick={handleSignIn}
                        disabled={isLoading || isInitializing}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-base transition-all duration-300 shadow-lg shadow-amber-500/15 hover:shadow-amber-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                    >
                        {isLoading || isInitializing ? (
                            <>
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                <span>Connecting...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                </svg>
                                <span>Sign In with Puter</span>
                            </>
                        )}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-slate-800" />
                        <span className="text-xs text-slate-500">New here? Signing in creates your account</span>
                        <div className="flex-1 h-px bg-slate-800" />
                    </div>

                    {/* Features */}
                    <div className="flex flex-col gap-3">
                        {FEATURES.map((f) => (
                            <div key={f.title} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-800/20">
                                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                                    {f.icon}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-200">{f.title}</p>
                                    <p className="text-xs text-slate-500">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-slate-600 mt-6">
                    Free forever · No credit card required · Powered by{" "}
                    <a href="https://puter.com" target="_blank" rel="noopener noreferrer" className="text-amber-500/70 hover:text-amber-400 transition-colors">
                        Puter
                    </a>
                </p>
            </div>
        </main>
    );
};

export default Login;
