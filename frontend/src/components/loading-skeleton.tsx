import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function PredictionSkeleton() {
  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden">
      <CardHeader>
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-2">
          <Skeleton className="h-4 w-28 mx-auto" />
          <Skeleton className="h-10 w-40 mx-auto" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
        <Skeleton className="h-48 w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

export function AudioPredictionSkeleton() {
  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden">
      <CardHeader>
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-2">
          <Skeleton className="h-4 w-28 mx-auto" />
          <Skeleton className="h-10 w-40 mx-auto" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
        <div className="space-y-4 pt-4 border-t">
          <Skeleton className="h-16 w-full" />
          <div className="flex justify-center">
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function BatchResultsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <Card className="mt-8">
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: count }).map((_, i) => (
            <PredictionSkeleton key={i} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function FilePreviewSkeleton({
  mode = "large",
}: {
  mode?: "list" | "large" | "grid";
}) {
  if (mode === "large") {
    return (
      <Card className="relative overflow-hidden">
        <div className="w-full p-4">
          <Skeleton className="w-full h-64" />
        </div>
        <div className="p-4 flex items-center justify-between border-t">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </Card>
    );
  }

  if (mode === "grid") {
    return (
      <Card className="flex flex-col shrink-0">
        <div className="p-2 min-h-[150px] flex items-center justify-center">
          <Skeleton className="h-40 w-32" />
        </div>
        <div className="p-2 border-t">
          <Skeleton className="h-4 w-24" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex items-center gap-4 p-4 mt-4">
      <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-8 w-8 rounded-md shrink-0" />
    </Card>
  );
}
