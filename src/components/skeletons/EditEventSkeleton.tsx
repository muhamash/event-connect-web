"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const EditEventSkeleton = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="space-y-6 container">
      
      {/* Back Button */}
      <div className="mb-6">
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>

      {/* Header */}
      <div className="mb-8 space-y-2">
        <Skeleton className="h-10 w-64 rounded-md" />
        <Skeleton className="h-4 w-80 rounded-md" />
      </div>

      {/* IMAGE */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-5 w-40 rounded-md" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full rounded-lg mb-4" />
          <Skeleton className="h-10 w-48 rounded-md" />
        </CardContent>
      </Card>

      {/* BASIC INFO */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-5 w-48 rounded-md" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-24 w-full rounded-md" />
        </CardContent>
      </Card>

      {/* DATE & TIME */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-5 w-48 rounded-md" />
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </CardContent>
      </Card>

      {/* LOCATION & CAPACITY */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-5 w-40 rounded-md" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </CardContent>
      </Card>

      {/* PRICING */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-5 w-48 rounded-md" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-24 rounded-full" />
          <Skeleton className="h-10 w-48 rounded-md" />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Skeleton className="h-12 w-full rounded-md" />
    </motion.div>
  );
};

export default EditEventSkeleton;
