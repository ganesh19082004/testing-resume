import React from 'react';

interface LoadingStepsProps {
  currentStep: number;
  steps: string[];
}

export default function LoadingSteps({ currentStep, steps }: LoadingStepsProps) {
  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 w-full">
      <div className="flex flex-col gap-0 w-full max-w-sm mx-auto relative">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div key={index} className="relative flex items-start gap-4 py-3">
              {!isLast && (
                <div 
                  className={`absolute left-4 top-10 bottom-[-10px] w-[2px] -ml-[1px] ${
                    isCompleted ? 'bg-emerald-500/50' : 'bg-slate-700'
                  }`}
                />
              )}

              <div className="flex-shrink-0 z-10">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' :
                    isActive ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)] animate-pulse' :
                    'bg-slate-800 border border-slate-700 text-slate-500'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isActive ? (
                    <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center min-h-[2rem]">
                <span 
                  className={`text-sm sm:text-base transition-colors duration-300 ${
                    isCompleted ? 'text-emerald-400' :
                    isActive ? 'text-white font-semibold' :
                    'text-slate-500'
                  }`}
                >
                  {step}
                  {isActive && (
                    <span className="inline-flex ml-1 tracking-widest animate-pulse">...</span>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
