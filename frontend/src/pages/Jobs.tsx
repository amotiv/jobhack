import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../lib/api";
import JobCard from "../components/JobCard";
import Button from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { motion } from "framer-motion";
import { Info, Search, MapPin, Filter } from "lucide-react";
import { toast } from "sonner";
import PremiumModal from "../components/PremiumModal";
import JobDetailPanel from "../components/JobDetailPanel";
import { getSaved } from "../lib/saved";

type Job = { 
  id: number; 
  title: string; 
  company: string; 
  location: string; 
  match_score?: number | null; 
  description?: string; 
  matched_keywords?: string[]; 
  keywords?: string[];
  locked?: boolean;
  score_hint?: number | null;
};

export default function Jobs() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState<"date"|"match">("date");
  const [onlySaved, setOnlySaved] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);
  const [active, setActive] = useState<Job|null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const location_ = useLocation();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["jobs", keyword, location, sort],
    queryFn: async () => {
      const params: Record<string,string> = {};
      if (keyword) params.keyword = keyword;
      if (location) params.location = location;
      if (sort === "match") params.sort = "match";
      const { data } = await api.get("/jobs/", { params });
      if (!Array.isArray(data) && data?.warning) {
        setShowUpsell(true);
        return data.results ?? [];
      }
      return data as Job[];
    },
    staleTime: 5000, // 5 seconds - much shorter to ensure refetchOnMount works
    refetchOnWindowFocus: false,
    refetchOnMount: true, // This ensures fresh data when component mounts
  });

  // Reset component state when navigating back to this page
  useEffect(() => {
    if (location_.pathname === "/") {
      // Invalidate and refetch jobs when returning to the page
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    }
  }, [location_.pathname, queryClient]);

  useEffect(() => { if (error) toast.error("Failed to load jobs"); }, [error]);

  const filtered = useMemo(() => {
    if (!onlySaved) return data || [];
    const saved = new Set(getSaved());
    return (data || []).filter((j: Job) => saved.has(j.id));
  }, [data, onlySaved]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="heading-responsive font-bold tracking-tight">Find Your Next Job</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-responsive">
          Discover opportunities that match your skills and experience
        </p>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="sm:hidden">
        <Button 
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-center gap-2"
        >
          <Filter size={16} />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      {/* Controls */}
      <div className={`rounded-2xl border bg-white dark:bg-black dark:border-white/10 p-4 shadow-soft ${showFilters ? 'block' : 'hidden sm:block'}`}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Keyword Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              className="w-full border rounded-xl pl-10 pr-3 py-2 dark:bg-black dark:border-white/10 text-sm" 
              placeholder="Keyword (React, Django)"
              value={keyword} 
              onChange={e=>setKeyword(e.target.value)} 
            />
          </div>

          {/* Location Search */}
          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              className="w-full border rounded-xl pl-10 pr-3 py-2 dark:bg-black dark:border-white/10 text-sm" 
              placeholder="Location (Remote, NYC)"
              value={location} 
              onChange={e=>setLocation(e.target.value)} 
            />
          </div>

          {/* Sort Dropdown */}
          <select 
            className="border rounded-xl px-3 py-2 dark:bg-black dark:border-white/10 text-sm"
            value={sort} 
            onChange={e=>setSort(e.target.value as any)}
          >
            <option value="date">Sort: Date</option>
            <option value="match">Sort: Match % (Premium)</option>
          </select>

          {/* Saved Filter */}
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input 
              type="checkbox" 
              className="accent-black dark:accent-white" 
              checked={onlySaved} 
              onChange={e=>setOnlySaved(e.target.checked)} 
            />
            <span className="whitespace-nowrap">Only saved</span>
          </label>

          {/* Search Button */}
          <Button onClick={()=>refetch()} className="w-full sm:w-auto">
            Search
          </Button>
        </div>

        {/* Premium Notice */}
        {sort === "match" && (
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mt-3 p-2 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
            <Info size={14}/> 
            <span>Sorting by match % is a premium feature.</span>
          </div>
        )}
      </div>

      {/* Results Count */}
      {!isLoading && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {filtered.length} job{filtered.length !== 1 ? 's' : ''} found
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="grid gap-3">
          <Skeleton className="h-24 sm:h-28" />
          <Skeleton className="h-24 sm:h-28" />
          <Skeleton className="h-24 sm:h-28" />
        </div>
      ) : (
        <motion.div layout className="grid gap-3">
          {filtered.map((job: Job) => (
            <JobCard 
              key={job.id} 
              job={job} 
              onClick={() => setActive(job)} 
              onUnlock={() => setShowUpsell(true)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-12">
              <div className="text-lg font-medium mb-2">No jobs found</div>
              <div className="text-sm">Try adjusting your filters or search terms</div>
            </div>
          )}
        </motion.div>
      )}

      <PremiumModal open={showUpsell} onClose={() => setShowUpsell(false)} />
      <JobDetailPanel job={active} open={!!active} onClose={() => setActive(null)} />
    </div>
  );
}
