import { Skeleton } from "../ui/Skeleton";

export const MyProfileSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="flex-1 min-w-0 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 lg:p-12">
            <div className="space-y-6">
              <div className="flex items-center gap-5">
                <Skeleton className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 rounded-lg w-48" />
                  <Skeleton className="h-3 rounded-lg w-24" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 rounded-2xl" />
                ))}
              </div>
              <Skeleton className="h-12 rounded-2xl w-40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
