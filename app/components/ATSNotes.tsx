import React from 'react';

interface ATSNotesProps {
  notes: string[];
}

export default function ATSNotes({ notes }: ATSNotesProps) {
  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl shadow-xl p-5 sm:p-6">
      <div className="flex items-center mb-4">
        <svg className="w-6 h-6 text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-xl font-bold text-white">ATS Compatibility</h3>
      </div>

      <div className="flex flex-col gap-3">
        {notes && notes.length > 0 ? (
          notes.map((note, index) => (
            <div 
              key={index} 
              className="bg-slate-800/30 rounded-lg p-3 sm:p-4 flex items-start gap-3 border-l-[3px] border-indigo-500/60"
            >
              <svg className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-slate-300 text-sm sm:text-base">
                {note}
              </p>
            </div>
          ))
        ) : (
          <p className="text-slate-400 italic">No ATS notes available.</p>
        )}
      </div>
    </div>
  );
}
