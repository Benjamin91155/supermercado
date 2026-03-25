import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col gap-8 px-6 py-16">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-4 rounded-3xl border border-slate-100 p-6">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </main>
  );
}
