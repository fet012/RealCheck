export function SkeletonBlock({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-pale-sage/40 rounded ${className}`} />
  );
}

export function ResultSkeleton() {
  return (
    <main className="min-h-screen bg-warm-white text-deep-forest max-w-md mx-auto flex flex-col p-5">
      <SkeletonBlock className="h-32 w-full mb-4" />
      <SkeletonBlock className="h-16 w-full mb-6" />
      <SkeletonBlock className="h-8 w-32 mb-2" />
      <SkeletonBlock className="h-24 w-full mb-6" />
      <SkeletonBlock className="h-8 w-32 mb-2" />
      <SkeletonBlock className="h-24 w-full" />
    </main>
  );
}