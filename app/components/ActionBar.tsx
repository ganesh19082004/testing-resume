import React, { useState } from 'react';
import { Link } from 'react-router';

export default function ActionBar({ 
  result, 
  companyName, 
  jobTitle 
}: { 
  result: AnalysisResult; 
  companyName?: string; 
  jobTitle?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    let report = `# Resume Analysis Report\n\n`;
    if (jobTitle || companyName) {
      report += `Target Role: ${jobTitle || 'N/A'} at ${companyName || 'N/A'}\n\n`;
    }
    report += `## Overall Score: ${result.overall_score}/100\n`;
    if (result.job_match_score !== undefined) {
      report += `Job Match Score: ${result.job_match_score}/100\n`;
    }
    
    report += `\n## Strengths\n${result.strengths.map(s => `- ${s}`).join('\n')}\n`;
    report += `\n## Weaknesses\n${result.weaknesses.map(s => `- ${s}`).join('\n')}\n`;
    report += `\n## Missing Keywords\n${result.missing_keywords.map(s => `- ${s}`).join('\n')}\n`;
    report += `\n## ATS Notes\n${result.ats_notes.map(s => `- ${s}`).join('\n')}\n`;
    report += `\n## Improvement Suggestions\n${result.suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume-analysis-report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopySuggestions = () => {
    const textToCopy = result.suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n');
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl shadow-xl p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <button 
          onClick={handleDownload}
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-5 py-3 font-medium transition-colors flex items-center justify-center gap-2 flex-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Report
        </button>
        
        <button 
          onClick={handleCopySuggestions}
          className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-5 py-3 font-medium transition-colors border border-slate-700 flex items-center justify-center gap-2 flex-1"
        >
          {copied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy Suggestions
            </>
          )}
        </button>

        <Link 
          to="/upload"
          className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-5 py-3 font-medium transition-colors border border-slate-700 flex items-center justify-center gap-2 flex-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Analyze Another
        </Link>
      </div>
    </div>
  );
}
