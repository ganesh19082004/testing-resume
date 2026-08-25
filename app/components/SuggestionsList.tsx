import React from 'react';

interface SuggestionsListProps {
  suggestions: string[];
}

export default function SuggestionsList({ suggestions }: SuggestionsListProps) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl shadow-xl p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <h2 className="text-xl font-bold text-white">Improvement Suggestions</h2>
      </div>
      <div className="flex flex-col">
        {suggestions.map((suggestion, index) => (
          <div 
            key={index} 
            className="flex items-start gap-3 p-3 sm:p-4 rounded-xl hover:bg-slate-800/40 transition-colors border-b border-slate-800/40 last:border-b-0"
          >
            <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 text-sm font-bold flex items-center justify-center flex-shrink-0">
              {index + 1}
            </div>
            <p className="text-slate-200 sm:text-base text-sm pt-0.5">
              {suggestion}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
