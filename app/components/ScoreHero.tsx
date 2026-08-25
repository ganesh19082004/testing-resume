import { useEffect, useState } from 'react';

interface Props {
  result: AnalysisResult;
}

export default function ScoreHero({ result }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const overallScore = result.overall_score || 0;
  const matchScore = result.job_match_score;

  const getBadge = (score: number) => {
    if (score >= 80) return { text: 'Excellent', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    if (score >= 60) return { text: 'Good', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
    return { text: 'Needs Work', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
  };

  const badge = getBadge(overallScore);

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
        
        {/* Main Gauge */}
        <div className="flex flex-col items-center">
          <div className="relative w-64 h-32 flex justify-center overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 200 100">
              <defs>
                <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
              </defs>
              {/* Background Arc */}
              <path
                d="M 30 90 A 70 70 0 0 1 170 90"
                fill="none"
                stroke="currentColor"
                strokeWidth="16"
                strokeLinecap="round"
                className="text-slate-800"
              />
              {/* Foreground Arc */}
              <path
                d="M 30 90 A 70 70 0 0 1 170 90"
                fill="none"
                stroke="url(#score-gradient)"
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray={220}
                strokeDashoffset={220 - ((mounted ? overallScore : 0) / 100) * 220}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute bottom-0 flex flex-col items-center">
              <span className="text-4xl font-bold text-white">{overallScore}</span>
              <span className="text-sm text-slate-400 mt-1">Overall Score</span>
            </div>
          </div>
          
          <div className={`mt-4 px-4 py-1.5 rounded-full border ${badge.color} text-sm font-medium`}>
            {badge.text}
          </div>
        </div>

        {/* Secondary Gauge */}
        {matchScore !== undefined && (
          <div className="flex flex-col items-center mt-6 sm:mt-0">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-800"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#score-gradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - ((mounted ? matchScore : 0) / 100) * 251.2}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-white">{matchScore}</span>
              </div>
            </div>
            <span className="text-sm text-slate-400 mt-3 font-medium">Job Match</span>
          </div>
        )}
      </div>
    </div>
  );
}
