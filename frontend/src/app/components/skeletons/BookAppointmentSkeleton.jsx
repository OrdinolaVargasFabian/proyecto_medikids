import { Skeleton } from "../ui/Skeleton";

export const BookAppointmentSkeleton = () => {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56 rounded-lg" />
        <Skeleton className="h-4 w-72 rounded-md" />
      </div>

      <div className="flex items-center gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 flex-1">
            <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
            <div className="hidden sm:block flex-1 space-y-1">
              <Skeleton className="h-3 w-12 rounded" />
              <Skeleton className="h-4 w-20 rounded-md" />
            </div>
            {i < 3 && <Skeleton className="flex-1 h-px" />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
        <Skeleton className="h-7 w-64 rounded-lg" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-gradient-to-r from-gray-200/70 via-gray-100/50 to-gray-200/70 p-6 space-y-3">
              <div className="w-14 h-14 rounded-xl bg-white/30 mx-auto" />
              <div className="h-5 w-24 rounded-md bg-white/40 mx-auto" />
              <div className="h-4 w-16 rounded bg-white/30 mx-auto" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-100">
        <Skeleton className="h-10 w-24 rounded-xl" />
        <Skeleton className="h-10 w-28 rounded-2xl" />
      </div>
    </div>
  );
};
