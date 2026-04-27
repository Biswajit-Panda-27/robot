const SkeletonCard = () => (
  <div className="border rounded-2xl p-4 flex flex-col gap-4">
    <div className="aspect-square bg-muted rounded-xl skeleton-shimmer" />
    <div className="h-6 w-3/4 bg-muted rounded skeleton-shimmer" />
    <div className="h-4 w-1/2 bg-muted rounded skeleton-shimmer" />
    <div className="flex justify-between items-center mt-2">
      <div className="h-8 w-20 bg-muted rounded skeleton-shimmer" />
      <div className="h-10 w-10 bg-muted rounded-full skeleton-shimmer" />
    </div>
  </div>
)

export default SkeletonCard
