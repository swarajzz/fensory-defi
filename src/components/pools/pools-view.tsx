"use client";

import { useMemo, useState } from "react";
import { usePools } from "@/hooks/use-pools";
import { CategoryFilter } from "@/components/pools/category-filter";
import { PoolCard } from "@/components/pools/pool-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardPool } from "@/lib/defillama";

type Category = "Lending" | "Liquid Staking" | "Yield Aggregator";

function LoadingGrid() {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3 rounded-lg border p-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-24" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PoolsView() {
  const [category, setCategory] = useState<Category>("Lending");
  const { pools, isLoading, isError, refresh } = usePools();
  
  const filtered: DashboardPool[] = useMemo(() => {
    return pools.filter((p) => p.category === category);
  }, [pools, category]);

  return (
    <section id="pools" className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl">Explore Pools</h1>
        <CategoryFilter value={category} onChange={setCategory} />
      </div>

      {isLoading && <LoadingGrid />}

      {isError && (
        <Alert variant="destructive" className="mt-6">
          <AlertTitle>Could not load pools</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-4">
            There was a problem fetching data from DeFiLlama.
            <Button onClick={() => refresh()} variant="secondary">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {!isLoading && !isError && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((pool) => (
            <PoolCard key={pool.id} pool={pool} />
          ))}
        </div>
      )}
    </section>
  );
}
