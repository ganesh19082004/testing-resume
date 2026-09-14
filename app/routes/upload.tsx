import { type FormEvent, useState } from "react";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import LoadingSteps from "~/components/LoadingSteps";
import ProtectedRoute from "~/components/ProtectedRoute";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import { extractText } from "~/lib/textExtractor";
import { generateUUID } from "~/lib/utils";
import { buildAnalysisPrompt } from "../../constants";

const LOADING_STEPS = [
    "Reading your resume...",
    "Extracting text content...",
    "Uploading to cloud...",
    "Analyzing with AI...",
    "Saving results...",
];

const FEATURES = [
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
        ),
        title: "Instant ATS Score",
        description: "Get your score across 7 categories — keywords, experience, format, skills, and more — with actionable suggestions.",
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
        ),
        title: "AI-Powered Insights",
        description: "Our AI identifies strengths, weaknesses, missing keywords, and provides tailored improvement suggestions.",
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
        ),
        title: "Download Report",
        description: "Export your analysis as a detailed report. Track improvements and share with mentors or career coaches.",
    },
];

const STATS = [
    { value: "95%", label: "ATS Pass Rate" },
    { value: "2x", label: "More Interviews" },
    { value: "AI", label: "Smart Analysis" },
    { value: "Free", label: "Always Free" },
];

const Upload = () => {
    const { auth, isLoading, fs, ai, kv, puterReady, isInitializing } =
        usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [statusText, setStatusText] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    };

    const showError = (msg: string) => {
        console.error("Resume analysis error:", msg);
        setStatusText(msg);
        setIsProcessing(false);
        setHasError(true);
    };

    const handleRetry = () => {
        setIsProcessing(false);
        setHasError(false);
        setStatusText("");
        setCurrentStep(0);
    };

    const handleAnalyze = async ({
        companyName,
        jobTitle,
        jobDescription,
        file,
    }: {
        companyName: string;
        jobTitle: string;
        jobDescription: string;
        file: File;
    }) => {
        setIsProcessing(true);
        setHasError(false);
        setCurrentStep(0);

        try {
            setCurrentStep(0);
            const { text: resumeText, error: extractError } =
                await extractText(file);
            if (extractError || !resumeText) {
                return showError(
                    extractError || "Failed to extract text from resume."
                );
            }

            setCurrentStep(1);
            let imageFile: File | null = null;
            if (file.name.toLowerCase().endsWith(".pdf")) {
                const imageResult = await convertPdfToImage(file);
                imageFile = imageResult.file;
            }

            setCurrentStep(2);
            const uploadedFile = await fs.upload([file]);
            if (!uploadedFile)
                return showError("Failed to upload resume to cloud storage.");

            let imagePath = "";
            if (imageFile) {
                const uploadedImage = await fs.upload([imageFile]);
                if (uploadedImage) {
                    imagePath = uploadedImage.path;
                }
            }

            setCurrentStep(3);
            const prompt = buildAnalysisPrompt({
                resumeText,
                jobTitle: jobTitle || undefined,
                jobDescription: jobDescription || undefined,
            });

            const aiResponse = await ai.analyzeResume(prompt);
            if (!aiResponse) {
                return showError(
                    "AI analysis failed. The service may be unavailable. Please try again."
                );
            }

            console.log("AI Response:", aiResponse);
            let responseText = "";
            try {
                if (typeof aiResponse === "string") {
                    responseText = aiResponse;
                } else if (aiResponse.message?.content) {
                    responseText =
                        typeof aiResponse.message.content === "string"
                            ? aiResponse.message.content
                            : Array.isArray(aiResponse.message.content)
                              ? aiResponse.message.content[0]?.text || JSON.stringify(aiResponse.message.content)
                              : String(aiResponse.message.content);
                } else if ((aiResponse as any).text) {
                    responseText = (aiResponse as any).text;
                } else if ((aiResponse as any).content) {
                    responseText = typeof (aiResponse as any).content === "string"
                        ? (aiResponse as any).content
                        : JSON.stringify((aiResponse as any).content);
                } else {
                    responseText = JSON.stringify(aiResponse);
                }
            } catch {
                console.error("Failed to extract text from AI response:", aiResponse);
                return showError("Failed to read AI response. Please try again.");
            }

            if (!responseText.trim()) {
                return showError("AI returned an empty response. Please try again.");
            }

            let cleanedText = responseText.trim();
            if (cleanedText.startsWith("```")) {
                cleanedText = cleanedText
                    .replace(/^```(?:json)?\s*\n?/, "")
                    .replace(/\n?```\s*$/, "");
            }

            let analysisResult: AnalysisResult;
            try {
                analysisResult = JSON.parse(cleanedText);
            } catch {
                console.error("Failed to parse AI response:", cleanedText);
                return showError(
                    "AI returned an invalid response format. Please try again."
                );
            }

            if (
                typeof analysisResult.overall_score !== "number" ||
                !Array.isArray(analysisResult.strengths)
            ) {
                return showError(
                    "AI response is missing required fields. Please try again."
                );
            }

            setCurrentStep(4);
            const uuid = generateUUID();
            const data: Resume = {
                id: uuid,
                resumePath: uploadedFile.path,
                imagePath: imagePath,
                companyName: companyName || undefined,
                jobTitle: jobTitle || undefined,
                jobDescription: jobDescription || undefined,
                feedback: analysisResult,
            };

            await kv.set(`resume:${uuid}`, JSON.stringify(data));
            navigate(`/resume/${uuid}`);
        } catch (err) {
            const msg =
                err instanceof Error
                    ? err.message
                    : "An unexpected error occurred";
            showError(`Error: ${msg}`);
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest("form");
        if (!form) return;
        const formData = new FormData(form);

        const companyName = formData.get("company-name") as string;
        const jobTitle = formData.get("job-title") as string;
        const jobDescription = formData.get("job-description") as string;

        if (!file) return;

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    };

    if (isInitializing && !puterReady) {
        return (
            <main className="bg-gradient min-h-screen">
                <Navbar />
                <section className="main-section">
                    <div className="page-heading py-16 w-full">
                        <div className="flex flex-col items-center gap-4 mt-8">
                            <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                            <p className="text-slate-400 text-lg">Connecting to Puter...</p>
                            <p className="text-slate-500 text-sm">You may see a login prompt if this is your first visit.</p>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    /* ──────────────── Processing / Error State ──────────────── */
    if (isProcessing || hasError) {
        return (
            <main className="bg-gradient min-h-screen">
                <Navbar />
                <section className="main-section">
                    <div className="page-heading py-16 w-full">
                        <h1 className="!text-2xl sm:!text-4xl mb-4">Analyzing Your Resume</h1>
                        <div className="flex flex-col items-center gap-6 mt-8 w-full max-w-md mx-auto">
                            {hasError ? (
                                <>
                                    <div className="flex items-center gap-3 bg-rose-950/30 border border-rose-800/40 rounded-2xl p-4 sm:p-5 w-full">
                                        <svg className="w-6 h-6 text-rose-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                        </svg>
                                        <p className="text-rose-300 text-sm sm:text-base">{statusText}</p>
                                    </div>
                                    <button onClick={handleRetry} className="primary-button mt-2">Try Again</button>
                                </>
                            ) : (
                                <LoadingSteps currentStep={currentStep} steps={LOADING_STEPS} />
                            )}
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    /* ──────────────── Main Upload Page ──────────────── */
    return (
        <main className="bg-gradient min-h-screen">
            <Navbar />

            <section className="main-section">
                {/* ─── Hero Section ─── */}
                <div className="page-heading py-12 sm:py-20 w-full">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/5 mb-6">
                        <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs sm:text-sm font-medium text-amber-300 tracking-wide">AI Powered · Free · ATS Optimized</span>
                    </div>

                    {/* Title */}
                    <h1 className="mb-2 !text-4xl sm:!text-5xl md:!text-6xl">
                        Your AI Resume{" "}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500">
                            Studio
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto mt-3 leading-relaxed">
                        Score your resume against ATS, get AI-powered insights, then download a detailed report — one flow, no tools to switch between.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-8">
                        <a href="#analyze-section" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-[0.98]">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Check My Resume
                        </a>
                        <Link to="/" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-slate-700 bg-slate-900/50 text-slate-300 hover:text-white hover:border-slate-600 font-semibold transition-all duration-300 active:scale-[0.98]">
                            View Past Results
                        </Link>
                    </div>

                    {/* Stats Row */}
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-10">
                        {STATS.map((stat) => (
                            <div key={stat.label} className="flex flex-col items-center px-5 py-3 rounded-xl border border-slate-800 bg-slate-900/30 min-w-[100px]">
                                <span className="text-lg sm:text-xl font-bold text-amber-400">{stat.value}</span>
                                <span className="text-[11px] sm:text-xs text-slate-500 mt-0.5">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ─── Features Section ─── */}
                <div className="w-full max-w-4xl mx-auto mb-12">
                    <h3 className="text-xl sm:text-2xl font-bold text-white text-center mb-8">
                        Everything in One Flow
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {FEATURES.map((feature) => (
                            <div
                                key={feature.title}
                                className="group flex flex-col gap-3 p-5 sm:p-6 rounded-2xl border border-slate-800 bg-slate-900/30 hover:border-amber-500/30 hover:bg-slate-900/50 transition-all duration-300"
                            >
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/15 transition-colors">
                                    {feature.icon}
                                </div>
                                <h4 className="text-base font-bold text-amber-300">{feature.title}</h4>
                                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ─── Analyze Section ─── */}
                <div id="analyze-section" className="w-full max-w-2xl mx-auto mb-16 scroll-mt-24">
                    <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-6 sm:p-8 shadow-2xl">
                        {/* Section Header */}
                        <div className="mb-6">
                            <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                                <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                </svg>
                                Analyse Your Resume
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">Upload your PDF and optionally paste a job description for a more accurate score.</p>
                        </div>


                        {/* Form */}
                        <form id="upload-form" onSubmit={handleSubmit} className="!gap-5">
                            {/* Job Description */}
                            <div className="form-div">
                                <label htmlFor="job-description" className="mb-1">
                                    Paste Job Description{" "}
                                    <span className="text-slate-500 text-xs">(optional — improves accuracy)</span>
                                </label>
                                <textarea
                                    rows={4}
                                    name="job-description"
                                    placeholder="Paste the job description here to compare with your resume..."
                                    id="job-description"
                                    className="!rounded-xl !bg-slate-900/40 !border-slate-800/60 resize-y"
                                />
                            </div>

                            {/* Hidden fields for company/job title — streamlined UI */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                <div className="form-div">
                                    <label htmlFor="company-name" className="mb-1">
                                        Company <span className="text-slate-500 text-xs">(optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="company-name"
                                        placeholder="Google, Meta..."
                                        id="company-name"
                                        className="!rounded-xl !bg-slate-900/40 !border-slate-800/60 !py-3"
                                    />
                                </div>
                                <div className="form-div">
                                    <label htmlFor="job-title" className="mb-1">
                                        Job Title <span className="text-slate-500 text-xs">(optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="job-title"
                                        placeholder="Software Engineer..."
                                        id="job-title"
                                        className="!rounded-xl !bg-slate-900/40 !border-slate-800/60 !py-3"
                                    />
                                </div>
                            </div>

                            {/* File Upload Zone */}
                            <div className="form-div">
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            {/* Submit Button */}
                            <button
                                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-base transition-all duration-300 shadow-lg shadow-amber-500/15 hover:shadow-amber-500/25 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-amber-500 disabled:hover:to-amber-600 disabled:hover:shadow-amber-500/15 disabled:active:scale-100 cursor-pointer"
                                type="submit"
                                disabled={!file}
                            >
                                {file ? "Analyse & Score My Resume" : "Upload a resume to get started"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* ─── Trust Footer ─── */}
                <div className="text-center pb-8">
                    <p className="text-xs text-slate-600">
                        Most resume tools charge <span className="text-slate-400 font-medium">$30+/month</span>. Resumind is{" "}
                        <span className="text-amber-400 font-semibold">completely free</span>. No subscriptions, no credit card.
                    </p>
                </div>
            </section>
        </main>
    );
};
const UploadPage = () => (
    <ProtectedRoute>
        <Upload />
    </ProtectedRoute>
);
export default UploadPage;
