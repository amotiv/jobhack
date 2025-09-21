import { useState } from "react";
import api from "../lib/api";
import Button from "../components/ui/Button";
import { motion } from "framer-motion";
import { UploadCloud, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function ResumeUpload() {
  const [file, setFile] = useState<File|null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [result, setResult] = useState<any>(null);
  const [active, setActive] = useState(false);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  };

  const upload = async () => {
    if (!file) return;
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF or DOCX file");
      return;
    }
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }
    
    const fd = new FormData(); 
    fd.append("file", file);
    
    try {
      setProgress(0);
      const { data } = await api.post("/resumes/upload/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (p) => setProgress(Math.round((p.loaded / (p.total || 1)) * 100))
      });
      setResult(data); 
      toast.success("Resume uploaded and analyzed successfully!");
    } catch (e: any) {
      console.error("Upload error:", e);
      const errorMessage = e?.response?.data?.detail || e?.message || "Upload failed. Please try again.";
      toast.error(errorMessage);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-2xl space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <h1 className="heading-responsive font-bold tracking-tight">Upload Your Resume</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto text-responsive">
            Get instant feedback on your resume's ATS compatibility and improve your job search success.
          </p>
        </div>

        {/* Upload Area */}
        <div
          onDragOver={(e)=>{ e.preventDefault(); setActive(true); }}
          onDragLeave={()=>setActive(false)}
          onDrop={onDrop}
          className={`rounded-2xl border-2 border-dashed p-6 sm:p-8 lg:p-12 bg-white dark:bg-black shadow-soft grid place-items-center transition-all duration-200
          ${active ? "border-black bg-black/[.02] dark:border-white dark:bg-white/5 scale-[1.02]" : "border-gray-200 dark:border-white/10"}`}
        >
          <div className="text-center space-y-6 w-full max-w-sm">
            {/* Upload Icon */}
            <motion.div 
              initial={{ scale: 0.95 }} 
              animate={{ scale: 1 }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center mx-auto"
            >
              <UploadCloud size={24} className="sm:w-8 sm:h-8 opacity-70" />
            </motion.div>
            
            {/* Instructions */}
            <div className="space-y-2">
              <div className="text-lg sm:text-xl font-medium">
                {file ? file.name : "Drag & drop your resume here"}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Supports <span className="font-medium">PDF</span> and <span className="font-medium">DOCX</span> files
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Maximum file size: 5MB</div>
            </div>

            {/* File Input */}
            <div className="space-y-4">
              <input 
                type="file" 
                accept=".pdf,.doc,.docx"
                onChange={(e)=>setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 dark:text-gray-400
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-black dark:file:bg-white file:text-white dark:file:text-black
                          hover:file:bg-gray-800 dark:hover:file:bg-gray-200
                          transition-colors"
              />
              
              <Button 
                onClick={upload} 
                disabled={!file}
                className="w-full max-w-xs"
              >
                {progress > 0 && progress < 100 ? `Uploading... ${progress}%` : "Upload Resume"}
              </Button>
            </div>

            {/* Progress Bar */}
            {progress > 0 && progress < 100 && (
              <div className="w-full max-w-xs h-2 bg-gray-200 dark:bg-white/10 rounded-full mx-auto overflow-hidden">
                <motion.div 
                  className="h-2 bg-black dark:bg-white" 
                  initial={{ width: 0 }} 
                  animate={{ width: `${progress}%` }} 
                />
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 8 }} 
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border bg-white dark:bg-black dark:border-white/10 shadow-soft p-6 sm:p-8 space-y-4"
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="text-xl sm:text-2xl font-semibold">
                ATS Analysis Complete
              </div>
              <div className={`text-lg sm:text-xl font-medium flex items-center justify-center gap-2 ${result.ats_friendly ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}>
                {result.ats_friendly ? (
                  <>
                    <CheckCircle size={20} />
                    ATS-Friendly
                  </>
                ) : (
                  <>
                    <AlertCircle size={20} />
                    Potential Issues Detected
                  </>
                )}
              </div>
            </div>
            
            {/* Issues */}
            {!!result.issues?.length && (
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Issues Found:
                </div>
                <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  {result.issues.map((i:string, idx:number)=>(<li key={idx}>{i}</li>))}
                </ul>
              </div>
            )}
            
            {/* Footer */}
            <div className="text-center pt-4 border-t border-gray-200 dark:border-white/10">
              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
                <FileText size={14} />
                Parsed {result.chars.toLocaleString()} characters from your resume
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
