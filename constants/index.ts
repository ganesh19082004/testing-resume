/**
 * Build the AI analysis prompt.
 *
 * The prompt embeds the extracted resume text and (optionally) a job
 * description, then instructs the model to return ONLY valid JSON that
 * conforms to the AnalysisResult shape.
 */
export function buildAnalysisPrompt(params: {
    resumeText: string;
    jobTitle?: string;
    jobDescription?: string;
}): string {
    const { resumeText, jobTitle, jobDescription } = params;
    const hasJob = !!(jobDescription && jobDescription.trim());

    const jobBlock = hasJob
        ? `
## Target Position
Job Title: ${jobTitle || "Not specified"}
Job Description:
"""
${jobDescription}
"""

Because a job description was provided you MUST also include a "job_match_score"
field (0-100) that rates how well this resume matches the specific job posting.
`
        : jobTitle
          ? `
## Target Position
Job Title: ${jobTitle}
No specific job description was provided, so do NOT include a "job_match_score" field.
`
          : `
No target position was specified. Do NOT include a "job_match_score" field.
`;

    return `You are an expert ATS (Applicant Tracking System) analyst and professional resume reviewer.

Analyze the resume text below and return your evaluation as a JSON object.

## Rules
1. Return ONLY a single valid JSON object — no markdown, no code fences, no preamble, no trailing text.
2. Be honest and critical. Low scores are acceptable when warranted.
3. Provide actionable, specific feedback — avoid vague or generic advice.
4. Evaluate the resume on formatting, content quality, keyword usage, ATS compatibility, and overall impact.
${hasJob ? "5. Evaluate how well the resume matches the provided job description." : ""}

${jobBlock}

## Resume Text
"""
${resumeText}
"""

## Required JSON Output Shape
{
  "overall_score": <number 0-100, holistic quality rating>,
  "strengths": [<3-5 specific things the resume does well>],
  "weaknesses": [<3-5 specific areas that need improvement>],
  "missing_keywords": [<important keywords/skills missing from the resume${hasJob ? " based on the job description" : ""}>],
  "ats_notes": [<3-5 notes about ATS compatibility — formatting issues, parsability, keyword density>],
  "suggestions": [<5-8 concrete, actionable improvement suggestions ranked by impact>]${hasJob ? ',\n  "job_match_score": <number 0-100, how well the resume matches this specific job>' : ""}
}

Return ONLY the JSON object. No other text.`;
}
