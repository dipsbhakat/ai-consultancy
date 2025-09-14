export function ProjectsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 bg-gray-100 rounded shadow animate-pulse h-32" />
      ))}
    </div>
  );
}
