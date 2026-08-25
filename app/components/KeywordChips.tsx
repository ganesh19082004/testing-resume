import React from 'react';

interface KeywordChipsProps {
  keywords: string[];
}

export default function KeywordChips({ keywords }: KeywordChipsProps) {
  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl shadow-xl p-5 sm:p-6">
      <div className="flex items-center mb-4">
        <svg className="w-6 h-6 text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        <h3 className="text-xl font-bold text-white">Missing Keywords</h3>
      </div>
      
      {keywords && keywords.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword, index) => (
            <span 
              key={index} 
              className="px-3 py-1.5 rounded-full text-sm font-medium bg-amber-950/30 text-amber-300 border border-amber-800/40 hover:bg-amber-900/40 hover:scale-105 transition-all duration-300 cursor-default"
            >
              {keyword}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-emerald-400 font-medium">
          No missing keywords detected!
        </p>
      )}
    </div>
  );
}
