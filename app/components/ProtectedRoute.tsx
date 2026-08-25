import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { usePuterStore } from "~/lib/puter";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * Wraps protected pages. Redirects to /login if not authenticated.
 * Shows a loading spinner while Puter initializes.
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { auth, isInitializing, puterReady, isLoading } = usePuterStore();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Wait until Puter is ready and we've checked auth status
        if (isInitializing || !puterReady || isLoading) return;

        if (!auth.isAuthenticated) {
            const returnTo = encodeURIComponent(location.pathname + location.search);
            navigate(`/login?next=${returnTo}`, { replace: true });
        }
    }, [auth.isAuthenticated, isInitializing, puterReady, isLoading, navigate, location]);

    // Still initializing — show spinner
    if (isInitializing || !puterReady || isLoading) {
        return (
            <div className="min-h-screen bg-gradient flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-400 text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    // Not authenticated — will redirect via useEffect, show nothing
    if (!auth.isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
