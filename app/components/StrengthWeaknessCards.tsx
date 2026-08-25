import React from 'react';

interface StrengthWeaknessCardsProps {
  strengths: string[];
  weaknesses: string[];
}

export default function StrengthWeaknessCards({ strengths = [], weaknesses = [] }: StrengthWeaknessCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {/* Strengths Column */}
      <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center mb-4">
          <svg className="w-6 h-6 text-emerald-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-bold text-emerald-400">Strengths</h3>
        </div>
        <ul className="flex flex-col">
          {strengths.length > 0 ? (
            strengths.map((strength, index) => (
              <li 
                key={index} 
                className="flex flex-row items-start py-2.5 border-b border-emerald-900/20 last:border-b-0 hover:bg-white/5 transition-colors rounded-lg px-2 -mx-2"
              >
                <svg className="w-5 h-5 text-emerald-500 mr-3 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-200">{strength}</span>
              </li>
            ))
          ) : (
            <li className="text-slate-400 italic">No significant strengths identified.</li>
          )}
        </ul>
      </div>

      {/* Weaknesses Column */}
      <div className="bg-amber-950/20 border border-amber-900/40 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center mb-4">
          <svg className="w-6 h-6 text-amber-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-bold text-amber-400">Weaknesses</h3>
        </div>
        <ul className="flex flex-col">
          {weaknesses.length > 0 ? (
            weaknesses.map((weakness, index) => (
              <li 
                key={index} 
                className="flex flex-row items-start py-2.5 border-b border-amber-900/20 last:border-b-0 hover:bg-white/5 transition-colors rounded-lg px-2 -mx-2"
              >
                <svg className="w-5 h-5 text-amber-500 mr-3 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
                </svg>
                <span className="text-slate-200">{weakness}</span>
              </li>
            ))
          ) : (
            <li className="text-slate-400 italic">No significant weaknesses identified.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
