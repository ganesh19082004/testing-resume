import { useState } from "react";
import { Link } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { useTheme } from "~/lib/useTheme";

const ThemeToggle = () => {
    const { isDark, toggle } = useTheme();
    return (
        <button
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-slate-800/40 transition-colors cursor-pointer"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle theme"
        >
            {isDark ? (
                <svg className="w-[18px] h-[18px] text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
            ) : (
                <svg className="w-[18px] h-[18px] text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
            )}
        </button>
    );
};

const Navbar = () => {
    const { auth, isInitializing, puterReady } = usePuterStore();
    const [menuOpen, setMenuOpen] = useState(false);
    const { isDark, toggle } = useTheme();

    const isReady = !isInitializing && puterReady;
    const isLoggedIn = isReady && auth.isAuthenticated;

    return (
        <nav className="navbar">
            <Link to={isLoggedIn ? "/dashboard" : "/"}>
                <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-500">RESUMIND</p>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden sm:flex items-center gap-2">
                {isLoggedIn ? (
                    <>
                        <Link to="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5">
                            Dashboard
                        </Link>
                        <Link to="/upload" className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5">
                            Analyse
                        </Link>
                        <Link to="/profile" className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5">
                            Profile
                        </Link>
                        <ThemeToggle />
                        <div className="w-px h-5 bg-slate-700 mx-1" />
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-black text-sm font-bold">
                                {auth.user?.username?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                            <span className="text-sm text-slate-300 font-medium max-w-[100px] truncate">
                                {auth.user?.username || "User"}
                            </span>
                        </div>
                        <button
                            onClick={auth.signOut}
                            className="text-sm text-slate-500 hover:text-rose-400 transition-colors px-2 py-1.5 cursor-pointer"
                            title="Sign out"
                        >
                            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                            </svg>
                        </button>
                    </>
                ) : (
                    <>
                        <ThemeToggle />
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-sm hover:from-amber-400 hover:to-amber-500 transition-all duration-300 shadow-sm active:scale-[0.98]"
                        >
                            Sign In
                        </Link>
                    </>
                )}
            </div>

            {/* Mobile: Theme toggle + Menu Button */}
            <div className="flex sm:hidden items-center gap-1">
                <ThemeToggle />
                <button
                    className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    {menuOpen ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {menuOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 mx-4 sm:hidden bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-2xl z-50">
                    {isLoggedIn ? (
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-3 p-3 mb-2 bg-slate-800/40 rounded-xl">
                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-black text-sm font-bold">
                                    {auth.user?.username?.charAt(0)?.toUpperCase() || "U"}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">{auth.user?.username || "User"}</p>
                                    <p className="text-xs text-slate-500">Free Plan</p>
                                </div>
                            </div>
                            <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-sm text-slate-300 hover:text-white px-3 py-2.5 rounded-lg hover:bg-slate-800/40 transition-colors">
                                Dashboard
                            </Link>
                            <Link to="/upload" onClick={() => setMenuOpen(false)} className="text-sm text-slate-300 hover:text-white px-3 py-2.5 rounded-lg hover:bg-slate-800/40 transition-colors">
                                Analyse Resume
                            </Link>
                            <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-sm text-slate-300 hover:text-white px-3 py-2.5 rounded-lg hover:bg-slate-800/40 transition-colors">
                                Profile
                            </Link>
                            <div className="h-px bg-slate-800 my-1" />
                            <button
                                onClick={() => { auth.signOut(); setMenuOpen(false); }}
                                className="text-sm text-rose-400 hover:text-rose-300 px-3 py-2.5 rounded-lg hover:bg-slate-800/40 transition-colors text-left cursor-pointer"
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            onClick={() => setMenuOpen(false)}
                            className="block text-center py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-sm"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
