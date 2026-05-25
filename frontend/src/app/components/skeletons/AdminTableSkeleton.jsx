import { Skeleton } from "../ui/Skeleton";

export const AdminTableSkeleton = ({
  headerWidth = "w-56",
  subtitleWidth = "w-72",
  showActions = false,
  cards = 0,
  cardsCols = "grid-cols-3",
  cardHeight = "h-24",
  tableHeight = "h-96",
  variant = "default",
}) => {
  if (variant === "doctors") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64 rounded-xl" />
            <Skeleton className="h-5 w-80 rounded-lg" />
          </div>
          <Skeleton className="h-12 w-40 rounded-2xl" />
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-5 border-b border-gray-50 flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48 rounded-lg" />
                <Skeleton className="h-3 w-32 rounded-lg" />
              </div>
              <Skeleton className="h-8 w-20 rounded-xl shrink-0" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Skeleton className={`h-8 ${headerWidth} rounded-xl`} />
      <Skeleton className={`h-5 ${subtitleWidth} rounded-lg`} />
      {showActions && (
        <div className="flex justify-end">
          <Skeleton className="h-12 w-40 rounded-2xl" />
        </div>
      )}
      {cards > 0 && (
        <div className={`grid ${cardsCols} gap-4`}>
          {Array.from({ length: cards }).map((_, i) => (
            <Skeleton key={i} className={`bg-white rounded-2xl border border-gray-100 ${cardHeight}`} />
          ))}
        </div>
      )}
      <Skeleton className={`bg-white rounded-3xl border border-gray-100 shadow-sm ${tableHeight}`} />
    </div>
  );
};
