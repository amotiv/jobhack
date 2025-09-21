export function Skeleton({ className="" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-gray-200/70 dark:bg-white/10 ${className}`} />;
}

