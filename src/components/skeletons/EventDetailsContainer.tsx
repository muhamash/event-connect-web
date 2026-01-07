"use client";

import { Card, CardContent } from "@/components/ui/card";

const SkeletonBlock = ({ className }: { className?: string }) => (
  <div
    className={`animate-pulse rounded-md bg-muted ${className}`}
  />
);

const EventDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-20">

        {/* Hero Skeleton */}
        <div className="relative h-[50vh] overflow-hidden">
          <SkeletonBlock className="w-full h-full" />
        </div>

        <div className="container mx-auto px-4 -mt-20 relative z-10">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">

              {/* Event Info */}
              <Card>
                <CardContent className="p-8 space-y-6">
                  <SkeletonBlock className="h-6 w-32" />
                  <SkeletonBlock className="h-10 w-3/4" />

                  <div className="grid md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <SkeletonBlock className="h-10 w-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <SkeletonBlock className="h-4 w-24" />
                          <SkeletonBlock className="h-4 w-32" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-6 space-y-3">
                    <SkeletonBlock className="h-6 w-48" />
                    <SkeletonBlock className="h-4 w-full" />
                    <SkeletonBlock className="h-4 w-full" />
                    <SkeletonBlock className="h-4 w-5/6" />
                  </div>
                </CardContent>
              </Card>

              {/* Host Skeleton */}
              <Card>
                <CardContent className="p-6">
                  <SkeletonBlock className="h-6 w-32 mb-4" />
                  <div className="flex items-center gap-4">
                    <SkeletonBlock className="h-16 w-16 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <SkeletonBlock className="h-4 w-40" />
                      <SkeletonBlock className="h-4 w-32" />
                    </div>
                    <SkeletonBlock className="h-10 w-28" />
                  </div>
                </CardContent>
              </Card>

              {/* Attendees Skeleton */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <SkeletonBlock className="h-6 w-48" />
                  <div className="flex gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <SkeletonBlock
                        key={i}
                        className="h-10 w-10 rounded-full"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card>
                  <CardContent className="p-6 space-y-6">
                    <div className="text-center space-y-2">
                      <SkeletonBlock className="h-10 w-32 mx-auto" />
                      <SkeletonBlock className="h-4 w-24 mx-auto" />
                    </div>

                    <SkeletonBlock className="h-12 w-full" />

                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex justify-between">
                        <SkeletonBlock className="h-4 w-24" />
                        <SkeletonBlock className="h-4 w-12" />
                      </div>
                      <div className="flex justify-between">
                        <SkeletonBlock className="h-4 w-20" />
                        <SkeletonBlock className="h-4 w-16" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

          </div>
        </div>

        <div className="py-12" />
      </div>
    </div>
  );
};

export default EventDetailsSkeleton;