import { Skeleton } from "../ui/Skeleton";

export const ChildrenProfilesSkeleton = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40 rounded-lg" />
          <Skeleton className="h-4 w-56 rounded-md" />
        </div>
        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-gray-200/70 via-gray-100/50 to-gray-200/70 p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/30 shrink-0" />
                <div className="space-y-2">
                  <div className="h-5 w-28 rounded-md bg-white/40" />
                  <div className="h-4 w-20 rounded-md bg-white/30" />
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 2 }).map((_, j) => (
                  <div key={j} className="space-y-1">
                    <Skeleton className="h-3 w-12 rounded" />
                    <Skeleton className="h-4 w-20 rounded-md" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-11 w-full rounded-2xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
