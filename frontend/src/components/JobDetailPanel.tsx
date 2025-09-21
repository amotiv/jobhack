import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Building, ExternalLink } from "lucide-react";
import { highlightText } from "../lib/highlight";

type Job = { 
  id: number; 
  title: string; 
  company: string; 
  location: string; 
  description?: string; 
  matched_keywords?: string[]; 
  match_score?: number | null;
  locked?: boolean;
  score_hint?: number | null;
};

export default function JobDetailPanel({ job, open, onClose }: { job: Job | null; open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && job && (
        <>
          {/* Backdrop */}
          <motion.div 
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
          />
          
          {/* Panel */}
          <motion.aside
            className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white dark:bg-black border-l border-gray-200 dark:border-white/10 overflow-y-auto"
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }} 
            transition={{ type: "tween", duration: 0.25 }}
            role="dialog" 
            aria-modal="true"
          >
            <div className="p-4 sm:p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                    {job.title}
                  </h2>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Building size={14} className="opacity-70" />
                      <span className="font-medium truncate">{job.company}</span>
                    </div>
                    <div className="hidden sm:block h-1 w-1 rounded-full bg-gray-300 dark:bg-white/20" />
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="opacity-70" />
                      <span className="truncate">{job.location}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={onClose} 
                  aria-label="Close" 
                  className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex-shrink-0"
                >
                  <X size={18}/>
                </button>
              </div>

              {/* Matched Keywords */}
              {job.matched_keywords?.length && !job.locked ? (
                <div className="space-y-2">
                  <div className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 tracking-wide">
                    Matching Keywords
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job.matched_keywords.map(k => (
                      <span 
                        key={k} 
                        className="inline-block bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Description */}
              {job.description && (
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Job Description
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {highlightText(job.description, job.matched_keywords || [])}
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 bg-black dark:bg-white text-white dark:text-black py-3 px-4 rounded-xl font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                    <ExternalLink size={16} />
                    Apply Now
                  </button>
                  <button className="flex-1 border border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl font-medium text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    Save Job
                  </button>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
