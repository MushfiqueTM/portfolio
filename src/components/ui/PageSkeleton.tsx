import { Skeleton } from '@/components/ui/Skeleton';

/**
 * Suspense fallback while a lazily-loaded route chunk downloads.
 *
 * The inline `#initial-loader` splash in index.html cannot serve here — createRoot wipes
 * it on first render and it is not tied to Suspense, so a `null` fallback would flash an
 * empty page on every navigation to a not-yet-loaded route.
 */
export function PageSkeleton() {
  return (
    <section className="section-container py-12 sm:py-16" aria-busy="true">
      <div className="mb-10 max-w-2xl space-y-3">
        <Skeleton className="h-3 w-32" rounded="rounded-full" />
        <Skeleton className="h-9 w-80 max-w-full" />
        <Skeleton className="h-4 w-full max-w-xl" rounded="rounded-sm" />
      </div>

      <div className="rounded-sm bg-paper-raised shadow-plate p-6 sm:p-10">
        <div className="flex items-center gap-3 mb-8">
          <Skeleton className="w-12 h-12" />
          <Skeleton className="h-7 w-48" />
        </div>
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    </section>
  );
}
