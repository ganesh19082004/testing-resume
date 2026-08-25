import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import ProtectedRoute from "~/components/ProtectedRoute";
import Navbar from "~/components/Navbar";

const WipeContent = () => {
    const { auth, error, fs, kv } = usePuterStore();
    const [files, setFiles] = useState<FSItem[]>([]);
    const [wiping, setWiping] = useState(false);
    const [wiped, setWiped] = useState(false);

    const loadFiles = async () => {
        const files = (await fs.readDir("./")) as FSItem[];
        setFiles(files || []);
    };

    useEffect(() => {
        loadFiles();
    }, []);

    const handleDelete = async () => {
        setWiping(true);
        for (const file of files) {
            await fs.delete(file.path);
        }
        await kv.flush();
        setFiles([]);
        setWiping(false);
        setWiped(true);
    };

    return (
        <main className="bg-gradient min-h-screen">
            <Navbar />
            <section className="main-section">
                <div className="w-full max-w-lg mx-auto py-12 px-4">
                    <h1 className="!text-2xl mb-2">Wipe App Data</h1>
                    <p className="text-slate-400 text-sm mb-6">Authenticated as: <span className="text-amber-400">{auth.user?.username}</span></p>

                    {error && <p className="text-rose-400 text-sm mb-4">Error: {error}</p>}

                    {wiped ? (
                        <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-4 text-emerald-300 text-sm">
                            ✓ All data wiped successfully.
                        </div>
                    ) : (
                        <>
                            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 mb-4">
                                <p className="text-sm text-slate-300 mb-3">Files ({files.length}):</p>
                                {files.length === 0 ? (
                                    <p className="text-xs text-slate-500">No files found.</p>
                                ) : (
                                    <ul className="flex flex-col gap-1">
                                        {files.map((file) => (
                                            <li key={file.id} className="text-xs text-slate-400">{file.name}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <button
                                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-all cursor-pointer disabled:opacity-50"
                                onClick={handleDelete}
                                disabled={wiping || files.length === 0}
                            >
                                {wiping ? "Wiping..." : "Wipe All Data"}
                            </button>
                        </>
                    )}
                </div>
            </section>
        </main>
    );
};

const WipeApp = () => (
    <ProtectedRoute>
        <WipeContent />
    </ProtectedRoute>
);

export default WipeApp;
