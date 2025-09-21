import { motion } from "framer-motion";
import ScoreBadge from "./ScoreBadge";
import { MapPin, Heart, Building } from "lucide-react";
import { isSaved, toggleSaved } from "../lib/saved";
import { useState } from "react";

type Job = { 
  id: number; 
  title: string; 
  company: string; 
  location: string; 
  match_score?: number | null; 
  description?: string; 
  matched_keywords?: string[]; 
  locked?: boolean;
  score_hint?: number | null;
};

export default function JobCard({ job, onClick, onUnlock }: { job: Job; onClick?: () => void; onUnlock?: () => void }) {
  const [saved, setSaved] = useState(isSaved(job.id));
  const doToggle = (e: React.MouseEvent) => { e.stopPropagation(); setSaved(prev => !prev); toggleSaved(job.id); };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.995 }}
      className="text-left w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black shadow-soft hover:shadow transition p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4"
    >
      {/* Main Content */}
      <div className="flex-1 min-w-0 space-y-3 sm:space-y-2">
        {/* Title */}
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 sm:line-clamp-1">
            {job.title}
          </h3>
        </div>

        {/* Company and Location */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-sm text-gray-600 dark:text-gray-400">
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

        {/* Matched Keywords */}
        {job.matched_keywords?.length && !job.locked ? (
          <div className="text-xs">
            <span className="text-gray-500 dark:text-gray-400">Matches:</span>{" "}
            <div className="flex flex-wrap gap-1 mt-1">
              {job.matched_keywords.map(k => (
                <span 
                  key={k} 
                  className="inline-block bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2 py-0.5 rounded-full text-xs"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
        <ScoreBadge
          score={job.match_score}
          hint={job.score_hint}
          locked={job.locked}
          onUnlock={onUnlock}
        />
        <button 
          onClick={doToggle} 
          aria-label="Save job" 
          className="p-2 sm:p-2.5 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
        >
          <Heart size={18} className={saved ? "fill-current text-red-500" : "text-gray-600 dark:text-gray-400"} />
        </button>
      </div>
    </motion.button>
  );
}
