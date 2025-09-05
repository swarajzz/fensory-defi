"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryBadge } from "./pools-legend";
import { formatPercent, formatUSD } from "@/lib/format";
import type { DashboardPool } from "@/lib/defillama";
import { useUnlock } from "@/components/auth/unlock-provider";
import Link from "next/link";
import { LockedOverlay } from "@/components/pools/locked-overlay";

export function PoolCard({ pool }: { pool: DashboardPool }) {
  const { unlocked } = useUnlock();
  const locked = pool.locked && !unlocked;

  const content = (
    <Card className="relative overflow-hidden">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-pretty">{pool.project}</CardTitle>
          <CategoryBadge category={pool.category} />
        </div>
        <p className="text-sm text-muted-foreground">
          {pool.chain} • {pool.symbol || "—"}
        </p>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-muted-foreground">TVL</dt>
            <dd className="font-medium">{formatUSD(pool.tvlUsd)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">APY</dt>
            <dd className="font-medium">{formatPercent(pool.apy)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">APY (30d mean)</dt>
            <dd className="font-medium">{formatPercent(pool.apyMean30d)}</dd>
          </div>

          <div>
            <dt className="text-muted-foreground">Prediction Class</dt>
            <dd className="font-medium">
              {pool.predictions?.predictedClass ?? "—"}
            </dd>
          </div>

          <div>
            <dt className="text-muted-foreground">Predicted Probability</dt>
            <dd className="font-medium">
              {typeof pool.predictions?.predictedProbability === "number"
                ? formatPercent(pool.predictions.predictedProbability)
                : "—"}
            </dd>
          </div>

          <div>
            <dt className="text-muted-foreground">Binned Confidence</dt>
            <dd className="font-medium">
              {typeof pool.predictions?.binnedConfidence === "number"
                ? pool.predictions.binnedConfidence
                : "—"}
            </dd>
          </div>

          <div>
            <dt className="text-muted-foreground">Sigma</dt>
            <dd className="font-medium">
              {typeof pool.sigma === "number" ? pool.sigma.toFixed(2) : "—"}
            </dd>
          </div>
        </dl>
      </CardContent>
      {locked && <LockedOverlay />}
    </Card>
  );

  return locked ? (
    <div aria-disabled className="pointer-events-none opacity-90">
      {content}
    </div>
  ) : (
    <Link href={`/pools/${encodeURIComponent(pool.id)}`} prefetch>
      {content}
    </Link>
  );
}
