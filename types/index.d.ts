interface AnalysisResult {
    overall_score: number;
    strengths: string[];
    weaknesses: string[];
    missing_keywords: string[];
    ats_notes: string[];
    suggestions: string[];
    job_match_score?: number;
}

interface Resume {
    id: string;
    companyName?: string;
    jobTitle?: string;
    jobDescription?: string;
    imagePath: string;
    resumePath: string;
    feedback: AnalysisResult;
}
