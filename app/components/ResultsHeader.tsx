import { Link } from 'react-router';

interface Props {
  companyName?: string;
  jobTitle?: string;
}

export default function ResultsHeader({ companyName, jobTitle }: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
      <Link 
        to="/upload" 
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M19 12H5"/>
          <path d="M12 19l-7-7 7-7"/>
        </svg>
        <span>New Analysis</span>
      </Link>

      {(companyName || jobTitle) && (
        <div className="flex flex-col sm:text-right">
          {companyName && <h1 className="text-white font-bold text-xl">{companyName}</h1>}
          {jobTitle && <p className="text-slate-400">{jobTitle}</p>}
        </div>
      )}
    </div>
  );
}
