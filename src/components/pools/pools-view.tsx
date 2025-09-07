"use client";

import { useMemo, useState } from "react";
import { usePools } from "@/hooks/use-pools";
import { CategoryFilter } from "@/components/pools/category-filter";
import { PoolCard } from "@/components/pools/pool-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { DashboardPool } from "@/lib/defillama";

type Category = "Lending" | "Liquid Staking" | "Yield Aggregator";

function LoadingGrid() {
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="space-y-4 rounded-2xl border bg-card/50 p-6 animate-pulse"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <div className="flex justify-between items-center pt-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PoolsView() {
  const [category, setCategory] = useState<Category>("Lending");
  const [searchQuery, setSearchQuery] = useState("");
  const { pools, isLoading, isError, refresh } = usePools();

  const filtered: DashboardPool[] = useMemo(() => {
    let filteredPools = pools.filter((p) => p.category === category);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredPools = filteredPools.filter(
        (pool) =>
          pool.project.toLowerCase().includes(query) ||
          pool.chain.toLowerCase().includes(query) ||
          (pool.symbol && pool.symbol.toLowerCase().includes(query))
      );
    }

    return filteredPools;
  }, [pools, category, searchQuery]);

  return (
    <section id="pools" className="mx-auto max-w-7xl px-4 py-12">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              DeFi Pools
            </span>
          </h2>
          {/* <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover and analyze the best DeFi opportunities across different protocols
          </p> */}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">
              Filter by:
            </span>
            <CategoryFilter
              value={category}
              onChange={setCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>

          {/* Results count */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {filtered.length} pools
            </Badge>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && <LoadingGrid />}

        {/* Error State */}
        {isError && (
          <Alert variant="destructive" className="mt-8">
            <AlertTitle>Could not load pools</AlertTitle>
            <AlertDescription className="flex items-center justify-between gap-4">
              There was a problem fetching data from DeFiLlama.
              <Button onClick={() => refresh()} variant="secondary">
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* No Results */}
        {!isLoading && !isError && filtered.length === 0 && (
          <div className="text-center py-12">
            <div className="space-y-4">
              <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                <span className="text-2xl">🔍</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">No pools found</h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? `No pools match "${searchQuery}" in ${category} category`
                    : `No pools available in ${category} category`}
                </p>
              </div>
              {searchQuery && (
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                  className="mt-4"
                >
                  Clear search
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Pools Grid */}
        {!isLoading && !isError && filtered.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {filtered.map((pool, index) => (
              <div
                key={pool.id}
                className="animate-fade-in"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: "both",
                }}
              >
                <PoolCard pool={pool} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
