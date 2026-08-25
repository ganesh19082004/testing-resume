import {useState, useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { formatSize } from '../lib/utils'

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
        setError(null);

        if (rejectedFiles.length > 0) {
            const rejection = rejectedFiles[0];
            const code = rejection.errors?.[0]?.code;
            if (code === 'file-too-large') {
                setError(`File is too large. Maximum size is ${formatSize(maxFileSize)}.`);
            } else if (code === 'file-invalid-type') {
                setError('Invalid file type. Please upload a PDF or DOCX file.');
            } else {
                setError('File could not be accepted. Please try again.');
            }
            return;
        }

        const file = acceptedFiles[0] || null;
        onFileSelect?.(file);
    }, [onFileSelect]);

    const maxFileSize = 10 * 1024 * 1024; // 10MB

    const {getRootProps, getInputProps, isDragActive, isDragReject, acceptedFiles} = useDropzone({
        onDrop,
        multiple: false,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        },
        maxSize: maxFileSize,
    });

    const file = acceptedFiles[0] || null;
    const isPdf = file?.name?.toLowerCase().endsWith('.pdf');

    const dropZoneClass = isDragReject || error
        ? 'border-rose-500/60 bg-rose-950/10'
        : isDragActive
            ? 'border-amber-400/60 bg-amber-950/10 scale-[1.01]'
            : 'border-slate-700/60 hover:border-amber-500/30 hover:bg-amber-950/5';

    return (
        <div
            {...getRootProps()}
            className={`w-full rounded-xl border-2 border-dashed p-5 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:ring-offset-2 focus-within:ring-offset-slate-950 bg-slate-900/30 ${dropZoneClass}`}
            role="button"
            aria-label="Upload resume file, PDF or DOCX format"
            tabIndex={0}
        >
            <input {...getInputProps()} aria-label="Choose resume file" />

            {file ? (
                <div className="flex items-center gap-3 w-full bg-slate-800/30 rounded-xl p-3 border border-slate-700/40" onClick={(e) => e.stopPropagation()}>
                    <div className="w-10 h-10 rounded-lg bg-slate-800/60 flex items-center justify-center flex-shrink-0">
                        {isPdf ? (
                            <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">{file.name}</p>
                        <p className="text-xs text-slate-500">{formatSize(file.size)} · {isPdf ? 'PDF' : 'DOCX'}</p>
                    </div>
                    <button
                        className="p-1.5 cursor-pointer rounded-lg hover:bg-slate-700 transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            onFileSelect?.(null);
                        }}
                        aria-label="Remove selected file"
                        type="button"
                    >
                        <svg className="w-4 h-4 text-slate-500 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ) : (
                <div className="py-3">
                    <div className="mx-auto w-11 h-11 flex items-center justify-center mb-3 rounded-xl bg-amber-500/5 border border-amber-500/15">
                        <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                    </div>
                    {isDragActive ? (
                        <p className="text-sm text-amber-300 font-medium">Drop your file here...</p>
                    ) : (
                        <>
                            <p className="text-sm text-amber-400 font-medium">
                                Click to upload your resume
                            </p>
                            <p className="text-xs text-slate-500 mt-1">PDF or DOCX · No credit card required</p>
                        </>
                    )}
                </div>
            )}

            {error && (
                <div className="mt-3 flex items-center gap-2 text-rose-400 text-xs" role="alert">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    <span>{error}</span>
                </div>
            )}
        </div>
    )
}
export default FileUploader
