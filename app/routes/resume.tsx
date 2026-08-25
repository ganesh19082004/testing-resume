import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import Navbar from "~/components/Navbar";
import ProtectedRoute from "~/components/ProtectedRoute";
import { usePuterStore } from "~/lib/puter";
import ResultsHeader from "~/components/ResultsHeader";
import ScoreHero from "~/components/ScoreHero";
import StrengthWeaknessCards from "~/components/StrengthWeaknessCards";
import KeywordChips from "~/components/KeywordChips";
import ATSNotes from "~/components/ATSNotes";
import SuggestionsList from "~/components/SuggestionsList";
import ActionBar from "~/components/ActionBar";

const ResumePage = () => {
    const { id } = useParams();
    const { kv, fs } = usePuterStore();
    const [resume, setResume] = useState<Resume | null>(null);
    const [resumeImageUrl, setResumeImageUrl] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadResume = async () => {
            if (!id) {
                setError("No resume ID provided.");
                setIsLoading(false);
                return;
            }

            try {
                const raw = await kv.get(`resume:${id}`);
                if (!raw) {
                    setError("Resume not found. It may have been deleted.");
                    setIsLoading(false);
                    return;
                }

                const data: Resume = JSON.parse(raw);
                setResume(data);

                // Load resume preview image if available
                if (data.imagePath) {
                    try {
                        const blob = await fs.read(data.imagePath);
                        if (blob) {
                            setResumeImageUrl(URL.createObjectURL(blob));
                        }
                    } catch {
                        // Image loading is non-critical
                    }
                }
            } catch (err) {
                setError("Failed to load resume data.");
            } finally {
                setIsLoading(false);
            }
        };

        loadResume();
    }, [id, kv, fs]);

    if (isLoading) {
        return (
            <main className="bg-gradient min-h-screen">
                <Navbar />
                <section className="main-section">
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-10 h-10 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                        <p className="text-slate-400">Loading analysis...</p>
                    </div>
                </section>
            </main>
        );
    }

    if (error || !resume) {
        return (
            <main className="bg-gradient min-h-screen">
                <Navbar />
                <section className="main-section">
                    <div className="flex flex-col items-center justify-center py-20 gap-6">
                        <div className="bg-rose-950/30 border border-rose-800/40 rounded-2xl p-6 max-w-md text-center">
                            <svg
                                className="w-12 h-12 text-rose-400 mx-auto mb-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                                />
                            </svg>
                            <p className="text-rose-300 text-lg font-medium mb-2">
                                {error || "Resume not found"}
                            </p>
                            <p className="text-slate-400 text-sm mb-4">
                                The resume you&apos;re looking for doesn&apos;t
                                exist or may have been removed.
                            </p>
                        </div>
                        <Link to="/upload" className="primary-button">
                            Analyze a New Resume
                        </Link>
                    </div>
                </section>
            </main>
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawFeedback: any = resume.feedback || {};

    // Normalize feedback — handle both old format (overallScore) and new format (overall_score)
    const feedback: AnalysisResult = {
        overall_score: rawFeedback.overall_score ?? rawFeedback.overallScore ?? 0,
        strengths: rawFeedback.strengths ?? [],
        weaknesses: rawFeedback.weaknesses ?? [],
        missing_keywords: rawFeedback.missing_keywords ?? [],
        ats_notes: rawFeedback.ats_notes ?? [],
        suggestions: rawFeedback.suggestions ?? [],
        job_match_score: rawFeedback.job_match_score,
    };

    return (
        <main className="bg-gradient min-h-screen">
            <Navbar />

            <section className="main-section">
                <div className="w-full max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6 flex flex-col gap-6">
                    {/* Header */}
                    <ResultsHeader
                        companyName={resume.companyName}
                        jobTitle={resume.jobTitle}
                    />

                    {/* Resume preview + Score hero */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        {/* Resume image preview */}
                        {resumeImageUrl && (
                            <div className="lg:col-span-2">
                                <div className="bg-slate-900/40 border border-slate-800 rounded-2xl shadow-xl p-3 overflow-hidden">
                                    <img
                                        src={resumeImageUrl}
                                        alt="Resume preview"
                                        className="w-full rounded-xl object-cover object-top max-h-[400px]"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Score Hero */}
                        <div
                            className={
                                resumeImageUrl
                                    ? "lg:col-span-3"
                                    : "lg:col-span-5"
                            }
                        >
                            <ScoreHero result={feedback} />
                        </div>
                    </div>

                    {/* Strengths & Weaknesses */}
                    {(feedback.strengths.length > 0 || feedback.weaknesses.length > 0) && (
                        <StrengthWeaknessCards
                            strengths={feedback.strengths}
                            weaknesses={feedback.weaknesses}
                        />
                    )}

                    {/* Missing Keywords */}
                    {feedback.missing_keywords &&
                        feedback.missing_keywords.length > 0 && (
                            <KeywordChips
                                keywords={feedback.missing_keywords}
                            />
                        )}

                    {/* ATS Notes */}
                    {feedback.ats_notes && feedback.ats_notes.length > 0 && (
                        <ATSNotes notes={feedback.ats_notes} />
                    )}

                    {/* Suggestions */}
                    {feedback.suggestions &&
                        feedback.suggestions.length > 0 && (
                            <SuggestionsList
                                suggestions={feedback.suggestions}
                            />
                        )}

                    {/* Action Bar */}
                    <ActionBar
                        result={feedback}
                        companyName={resume.companyName}
                        jobTitle={resume.jobTitle}
                    />
                </div>
            </section>
        </main>
    );
};

const ResumePageProtected = () => (
    <ProtectedRoute>
        <ResumePage />
    </ProtectedRoute>
);

export default ResumePageProtected;
