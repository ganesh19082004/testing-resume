import { create } from "zustand";

declare global {
    interface Window {
        puter: {
            auth: {
                getUser: () => Promise<PuterUser>;
                isSignedIn: () => Promise<boolean>;
                signIn: () => Promise<void>;
                signOut: () => Promise<void>;
            };
            fs: {
                write: (
                    path: string,
                    data: string | File | Blob
                ) => Promise<File | undefined>;
                read: (path: string) => Promise<Blob>;
                upload: (file: File[] | Blob[]) => Promise<FSItem>;
                delete: (path: string) => Promise<void>;
                readdir: (path: string) => Promise<FSItem[] | undefined>;
            };
            ai: {
                chat: (
                    prompt: string | ChatMessage[],
                    imageURL?: string | PuterChatOptions,
                    testMode?: boolean,
                    options?: PuterChatOptions
                ) => Promise<Object>;
                img2txt: (
                    image: string | File | Blob,
                    testMode?: boolean
                ) => Promise<string>;
            };
            kv: {
                get: (key: string) => Promise<string | null>;
                set: (key: string, value: string) => Promise<boolean>;
                delete: (key: string) => Promise<boolean>;
                list: (pattern: string, returnValues?: boolean) => Promise<string[]>;
                flush: () => Promise<boolean>;
            };
        };
    }
}

const PUTER_SCRIPT_URL = "https://js.puter.com/v2/";

interface PuterStore {
    isLoading: boolean;
    isInitializing: boolean;
    error: string | null;
    puterReady: boolean;
    auth: {
        user: PuterUser | null;
        isAuthenticated: boolean;
        signIn: () => Promise<void>;
        signOut: () => Promise<void>;
        refreshUser: () => Promise<void>;
        checkAuthStatus: () => Promise<boolean>;
        getUser: () => PuterUser | null;
    };
    fs: {
        write: (
            path: string,
            data: string | File | Blob
        ) => Promise<File | undefined>;
        read: (path: string) => Promise<Blob | undefined>;
        upload: (file: File[] | Blob[]) => Promise<FSItem | undefined>;
        delete: (path: string) => Promise<void>;
        readDir: (path: string) => Promise<FSItem[] | undefined>;
    };
    ai: {
        chat: (
            prompt: string | ChatMessage[],
            imageURL?: string | PuterChatOptions,
            testMode?: boolean,
            options?: PuterChatOptions
        ) => Promise<AIResponse | undefined>;
        analyzeResume: (
            prompt: string
        ) => Promise<AIResponse | undefined>;
        img2txt: (
            image: string | File | Blob,
            testMode?: boolean
        ) => Promise<string | undefined>;
    };
    kv: {
        get: (key: string) => Promise<string | null | undefined>;
        set: (key: string, value: string) => Promise<boolean | undefined>;
        delete: (key: string) => Promise<boolean | undefined>;
        list: (
            pattern: string,
            returnValues?: boolean
        ) => Promise<string[] | KVItem[] | undefined>;
        flush: () => Promise<boolean | undefined>;
    };

    init: () => void;
    clearError: () => void;
}

const getPuter = (): typeof window.puter | null =>
    typeof window !== "undefined" && window.puter ? window.puter : null;

let initStarted = false;

const loadPuterScript = (): Promise<void> => {
    if (typeof window === "undefined") {
        return Promise.reject(new Error("Puter.js can only load in the browser"));
    }

    if (getPuter()) {
        return Promise.resolve();
    }

    const existing = document.querySelector<HTMLScriptElement>(
        `script[src="${PUTER_SCRIPT_URL}"]`
    );

    if (existing) {
        return new Promise((resolve, reject) => {
            if (getPuter()) {
                resolve();
                return;
            }

            existing.addEventListener("load", () => resolve(), { once: true });
            existing.addEventListener(
                "error",
                () => reject(new Error("Failed to load Puter.js")),
                { once: true }
            );
        });
    }

    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = PUTER_SCRIPT_URL;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Puter.js"));
        document.head.appendChild(script);
    });
};

const installDevMock = (): void => {
    let signedIn = false;

    (window as Window & { puter: Window["puter"] }).puter = {
        auth: {
            isSignedIn: async () => signedIn,
            getUser: async () =>
                signedIn
                    ? ({ uuid: "dev-uuid", username: "developer" } as PuterUser)
                    : (null as unknown as PuterUser),
            signIn: async () => {
                signedIn = true;
            },
            signOut: async () => {
                signedIn = false;
            },
        },
        fs: {
            write: async (path: string, data: string | File | Blob) => {
                const blob =
                    data instanceof Blob ? data : new Blob([String(data)]);
                return new File([blob], path.split("/").pop() || "file");
            },
            read: async () => new Blob(["mock file contents"]),
            upload: async (files: File[] | Blob[]) => {
                const file = (files as File[])[0];
                const path = `/mock/${Date.now()}-${file?.name || "upload"}`;
                return {
                    id: `${Date.now()}`,
                    uid: `${Date.now()}`,
                    name: file?.name || "upload",
                    path,
                    is_dir: false,
                    parent_id: "",
                    parent_uid: "",
                    created: Date.now(),
                    modified: Date.now(),
                    accessed: Date.now(),
                    size: (file as File)?.size || 0,
                    writable: true,
                } as FSItem;
            },
            delete: async () => {},
            readdir: async () => [],
        },
        ai: {
            chat: async () => ({
                message: {
                    content: JSON.stringify({
                        overall_score: 78,
                        strengths: [
                            "Clear and professional formatting with consistent structure",
                            "Strong action verbs used throughout experience section",
                            "Quantified achievements with specific metrics and numbers",
                            "Relevant technical skills are prominently listed"
                        ],
                        weaknesses: [
                            "Summary section is too generic and lacks personalization",
                            "Missing industry-specific keywords for target role",
                            "Education section lacks relevant coursework or certifications",
                            "No links to portfolio, GitHub, or LinkedIn profile"
                        ],
                        missing_keywords: [
                            "agile", "scrum", "CI/CD", "microservices",
                            "cloud computing", "REST API", "system design"
                        ],
                        ats_notes: [
                            "Resume uses standard section headers which parse well in ATS",
                            "Avoid using tables or columns — some ATS cannot parse them",
                            "File format is compatible with most ATS platforms",
                            "Consider adding a skills section with exact keywords from job posting"
                        ],
                        suggestions: [
                            "Tailor your summary to specifically mention the target role and company",
                            "Add metrics to at least 3 more bullet points (e.g., 'reduced load time by 40%')",
                            "Include a dedicated 'Technical Skills' section with keywords from the job description",
                            "Add links to your GitHub profile and any relevant project portfolios",
                            "Remove outdated skills and replace with current industry-standard tools",
                            "Consider adding volunteer work or open-source contributions"
                        ],
                        job_match_score: 72
                    }),
                },
            }),
            img2txt: async () => "Mock OCR text",
        },
        kv: {
            get: async () => null,
            set: async () => true,
            delete: async () => true,
            list: async () => [],
            flush: async () => true,
        },
    };
};

export const usePuterStore = create<PuterStore>((set, get) => {
    const setError = (msg: string) => {
        // also log to console to aid local debugging
        // eslint-disable-next-line no-console
        console.error('Puter error:', msg);
        set({
            error: msg,
            isLoading: false,
            auth: {
                user: null,
                isAuthenticated: false,
                signIn: get().auth.signIn,
                signOut: get().auth.signOut,
                refreshUser: get().auth.refreshUser,
                checkAuthStatus: get().auth.checkAuthStatus,
                getUser: get().auth.getUser,
            },
        });
    };

    const checkAuthStatus = async (): Promise<boolean> => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return false;
        }

        set({ isInitializing: true, error: null });

        try {
            const isSignedIn = await puter.auth.isSignedIn();
            if (isSignedIn) {
                const user = await puter.auth.getUser();
                set({
                    auth: {
                        user,
                        isAuthenticated: true,
                        signIn: get().auth.signIn,
                        signOut: get().auth.signOut,
                        refreshUser: get().auth.refreshUser,
                        checkAuthStatus: get().auth.checkAuthStatus,
                        getUser: () => user,
                    },
                    isInitializing: false,
                });
                return true;
            } else {
                set({
                    auth: {
                        user: null,
                        isAuthenticated: false,
                        signIn: get().auth.signIn,
                        signOut: get().auth.signOut,
                        refreshUser: get().auth.refreshUser,
                        checkAuthStatus: get().auth.checkAuthStatus,
                        getUser: () => null,
                    },
                    isInitializing: false,
                });
                return false;
            }
        } catch (err) {
            const msg =
                err instanceof Error ? err.message : "Failed to check auth status";
            set({ isInitializing: false });
            setError(msg);
            return false;
        }
    };

    const signIn = async (): Promise<void> => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }

        set({ isLoading: true, error: null });

        try {
            await puter.auth.signIn();
            await checkAuthStatus();
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Sign in failed";
            setError(msg);
        }
    };

    const signOut = async (): Promise<void> => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }

        set({ isLoading: true, error: null });

        try {
            await puter.auth.signOut();
            set({
                auth: {
                    user: null,
                    isAuthenticated: false,
                    signIn: get().auth.signIn,
                    signOut: get().auth.signOut,
                    refreshUser: get().auth.refreshUser,
                    checkAuthStatus: get().auth.checkAuthStatus,
                    getUser: () => null,
                },
                isLoading: false,
            });
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Sign out failed";
            setError(msg);
        }
    };

    const refreshUser = async (): Promise<void> => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }

        set({ isLoading: true, error: null });

        try {
            const user = await puter.auth.getUser();
            set({
                auth: {
                    user,
                    isAuthenticated: true,
                    signIn: get().auth.signIn,
                    signOut: get().auth.signOut,
                    refreshUser: get().auth.refreshUser,
                    checkAuthStatus: get().auth.checkAuthStatus,
                    getUser: () => user,
                },
                isLoading: false,
            });
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Failed to refresh user";
            setError(msg);
        }
    };

    const init = (): void => {
        if (initStarted || typeof window === "undefined") return;
        initStarted = true;

        set({ isInitializing: true, error: null });

        const waitForPuter = async (): Promise<void> => {
            if (getPuter()) return;

            for (let attempt = 0; attempt < 100; attempt++) {
                await new Promise((resolve) => setTimeout(resolve, 100));
                if (getPuter()) return;
            }

            throw new Error("Puter.js failed to initialize");
        };

        loadPuterScript()
            .then(() => waitForPuter())
            .then(() => {
                set({ puterReady: true });
                return checkAuthStatus();
            })
            .catch((err) => {
                if (import.meta.env.DEV) {
                    // eslint-disable-next-line no-console
                    console.warn(
                        "Puter.js unavailable — using local dev mock. Real auth popup requires Puter CDN."
                    );
                    installDevMock();
                    set({ puterReady: true });
                    return checkAuthStatus();
                }

                const msg =
                    err instanceof Error ? err.message : "Failed to load Puter.js";
                set({ isInitializing: false });
                setError(msg);
            });
    };

    const write = async (path: string, data: string | File | Blob) => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }
        return puter.fs.write(path, data);
    };

    const readDir = async (path: string) => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }
        return puter.fs.readdir(path);
    };

    const readFile = async (path: string) => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }
        return puter.fs.read(path);
    };

    const upload = async (files: File[] | Blob[]) => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }
        return puter.fs.upload(files);
    };

    const deleteFile = async (path: string) => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }
        return puter.fs.delete(path);
    };

    const chat = async (
        prompt: string | ChatMessage[],
        imageURL?: string | PuterChatOptions,
        testMode?: boolean,
        options?: PuterChatOptions
    ) => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }
        // return puter.ai.chat(prompt, imageURL, testMode, options);
        return puter.ai.chat(prompt, imageURL, testMode, options) as Promise<
            AIResponse | undefined
        >;
    };

    const analyzeResume = async (prompt: string) => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }

        // Use chat message format for better compatibility
        const messages: ChatMessage[] = [
            {
                role: "system",
                content: "You are an expert ATS resume analyst. You MUST respond with ONLY valid JSON. No markdown, no code fences, no explanation — just the JSON object."
            },
            {
                role: "user",
                content: prompt
            }
        ];

        // Try multiple models in order of preference
        const modelsToTry = ["gpt-4o-mini", "claude-3-5-sonnet", "gpt-4o"];
        
        for (const model of modelsToTry) {
            try {
                console.log(`Trying model: ${model}`);
                const response = await puter.ai.chat(messages, { model }) as AIResponse | undefined;
                
                if (response) {
                    // Check for error in response content
                    const content = typeof response === "string"
                        ? response
                        : response?.message?.content;
                    const contentStr = typeof content === "string" ? content : "";
                    
                    if (contentStr.toLowerCase().includes("model output error")) {
                        console.warn(`Model ${model} returned error, trying next...`);
                        continue;
                    }
                    
                    return response;
                }
            } catch (err) {
                console.warn(`Model ${model} failed:`, err);
                continue;
            }
        }

        // Final fallback: no model specified (Puter default)
        try {
            console.log("Trying Puter default model...");
            return await puter.ai.chat(messages) as AIResponse | undefined;
        } catch (err) {
            console.error("All models failed:", err);
            throw new Error("AI analysis failed. Please try again.");
        }
    };

    const img2txt = async (image: string | File | Blob, testMode?: boolean) => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }
        return puter.ai.img2txt(image, testMode);
    };

    const getKV = async (key: string) => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }
        return puter.kv.get(key);
    };

    const setKV = async (key: string, value: string) => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }
        return puter.kv.set(key, value);
    };

    const deleteKV = async (key: string) => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }
        return puter.kv.delete(key);
    };

    const listKV = async (pattern: string, returnValues?: boolean) => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }
        if (returnValues === undefined) {
            returnValues = false;
        }
        return puter.kv.list(pattern, returnValues);
    };

    const flushKV = async () => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }
        return puter.kv.flush();
    };

    return {
        isLoading: false,
        isInitializing: true,
        error: null,
        puterReady: false,
        auth: {
            user: null,
            isAuthenticated: false,
            signIn,
            signOut,
            refreshUser,
            checkAuthStatus,
            getUser: () => get().auth.user,
        },
        fs: {
            write: (path: string, data: string | File | Blob) => write(path, data),
            read: (path: string) => readFile(path),
            readDir: (path: string) => readDir(path),
            upload: (files: File[] | Blob[]) => upload(files),
            delete: (path: string) => deleteFile(path),
        },
        ai: {
            chat: (
                prompt: string | ChatMessage[],
                imageURL?: string | PuterChatOptions,
                testMode?: boolean,
                options?: PuterChatOptions
            ) => chat(prompt, imageURL, testMode, options),
            analyzeResume: (prompt: string) => analyzeResume(prompt),
            img2txt: (image: string | File | Blob, testMode?: boolean) =>
                img2txt(image, testMode),
        },
        kv: {
            get: (key: string) => getKV(key),
            set: (key: string, value: string) => setKV(key, value),
            delete: (key: string) => deleteKV(key),
            list: (pattern: string, returnValues?: boolean) =>
                listKV(pattern, returnValues),
            flush: () => flushKV(),
        },
        init,
        clearError: () => set({ error: null }),
    };
});
