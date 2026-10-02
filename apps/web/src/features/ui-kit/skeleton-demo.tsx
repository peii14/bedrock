"use client";

import { Button } from "@heroui/react";
import { useState } from "react";
import { FormSkeleton, Skeleton } from "@/components/ui/skeleton";
import { Typography } from "@/components/ui/typography";

const ProfileCard = () => (
  <div className="flex animate-enter items-center gap-4">
    <div className="grid size-12 place-items-center rounded-full bg-accent-soft font-semibold text-accent">
      GK
    </div>
    <div>
      <Typography variant="s2">Gayuh Kautaman</Typography>
      <Typography variant="b3" color="secondary">
        Shimmer swaps to content with a short fade.
      </Typography>
    </div>
  </div>
);

export const SkeletonDemo = () => {
  const [loading, setLoading] = useState(true);
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="flex items-center gap-4">
            <Skeleton className="size-12 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-56" />
            </div>
          </div>
        ) : (
          <ProfileCard />
        )}
        <Button size="sm" variant="secondary" onPress={() => setLoading((value) => !value)}>
          {loading ? "Show content" : "Show skeleton"}
        </Button>
      </div>
      <FormSkeleton fields={2} />
    </div>
  );
};
