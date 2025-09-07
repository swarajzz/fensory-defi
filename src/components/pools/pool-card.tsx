"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CategoryBadge } from "./pools-legend";
import { formatPercent, formatUSD } from "@/lib/format";
import type { DashboardPool } from "@/lib/defillama";
import { useUnlock } from "@/components/auth/unlock-provider";
import Link from "next/link";
import { LockedOverlay } from "@/components/pools/locked-overlay";
import { TrendingUp, TrendingDown, Shield, Zap, BarChart3, ArrowUpRight } from "lucide-react";

export function PoolCard({ pool }: { pool: DashboardPool }) {
  const { unlocked } = useUnlock();
  const locked = pool.locked && !unlocked;

  // Calculate APY trend
  const apyTrend = pool.apy && pool.apyMean30d 
    ? pool.apy > pool.apyMean30d ? "up" : "down"
    : null;

  const content = (
    <Card className="group relative overflow-hidden bg-card/50 backdrop-blur-sm border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in hover-lift">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative space-y-3 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
              {pool.project}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>{pool.chain}</span>
              {pool.symbol && (
                <>
                  <span>•</span>
                  <span className="font-medium">{pool.symbol}</span>
                </>
              )}
            </div>
          </div>
          <CategoryBadge category={pool.category} />
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Shield className="h-3 w-3" />
              <span>TVL</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {formatUSD(pool.tvlUsd)}
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {!apyTrend && <TrendingUp className="h-3 w-3" />}
              <span>APY</span>
              {apyTrend && (
                <div className={`flex items-center gap-0.5 ${
                  apyTrend === "up" ? "text-emerald-600" : "text-red-600"
                }`}>
                  {apyTrend === "up" ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                </div>
              )}
            </div>
            <p className="text-lg font-bold text-emerald-600">
              {formatPercent(pool.apy)}
            </p>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <BarChart3 className="h-3 w-3" />
                <span>30d Avg</span>
              </div>
              <p className="font-medium">{formatPercent(pool.apyMean30d)}</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Zap className="h-3 w-3" />
                <span>Risk</span>
              </div>
              <p className="font-medium">
                {typeof pool.sigma === "number" ? pool.sigma.toFixed(2) : "—"}
              </p>
            </div>
          </div>

          {/* Prediction Badge */}
          {pool.predictions?.predictedClass && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Prediction</span>
              <Badge 
                variant={pool.predictions.predictedClass === "stable" ? "default" : "secondary"}
                className="text-xs"
              >
                {pool.predictions.predictedClass}
              </Badge>
            </div>
          )}
        </div>

        {/* Hover indicator */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ArrowUpRight className="h-4 w-4 text-primary" />
        </div>
      </CardContent>

      {locked && <LockedOverlay />}
    </Card>
  );

  return locked ? (
    <div aria-disabled className="pointer-events-none opacity-90">
      {content}
    </div>
  ) : (
    <Link href={`/pools/${encodeURIComponent(pool.id)}`} prefetch className="block">
      {content}
    </Link>
  );
}
