import {Link} from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath } }: { resume: Resume }) => {
    const { fs } = usePuterStore();
    const [resumeUrl, setResumeUrl] = useState('');

    useEffect(() => {
        const loadResume = async () => {
            const blob = await fs.read(imagePath);
            if(!blob) return;
            let url = URL.createObjectURL(blob);
            setResumeUrl(url);
        }

        loadResume();
    }, [imagePath]);

    return (
        <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000">
            <div className="resume-card-header">
                <div className="flex flex-col gap-2 min-w-0">
                    {companyName && <h2 className="text-white text-xl sm:text-2xl font-bold break-words">{companyName}</h2>}
                    {jobTitle && <h3 className="text-sm sm:text-base break-words text-slate-400">{jobTitle}</h3>}
                    {!companyName && !jobTitle && <h2 className="text-white text-xl sm:text-2xl font-bold">Resume</h2>}
                </div>
                <div className="flex-shrink-0">
                    <ScoreCircle score={feedback.overall_score} />
                </div>
            </div>
            {resumeUrl && (
                <div className="gradient-border overflow-hidden animate-in fade-in duration-1000 mt-auto">
                    <div className="w-full h-full rounded-xl overflow-hidden">
                        <img
                            src={resumeUrl}
                            alt="resume"
                            className="w-full h-[320px] max-sm:h-[200px] object-cover object-top transition-transform duration-500 hover:scale-[1.03]"
                        />
                    </div>
                </div>
                )}
        </Link>
    )
}
export default ResumeCard
