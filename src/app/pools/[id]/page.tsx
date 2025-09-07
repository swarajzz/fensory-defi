import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CategoryBadge } from "@/components/pools/pools-legend";
import { APYChart } from "@/components/pools/apy-chart";
import { formatPercent, formatUSD } from "@/lib/format";
import {
  TrendingUp,
  TrendingDown,
  Shield,
  Zap,
  BarChart3,
  ArrowLeft,
  ExternalLink,
  Clock,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { DashboardPool } from "@/lib/defillama";


async function getPool(id: string): Promise<DashboardPool | null> {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_VERCEL_URL
        ? "https://" + process.env.NEXT_PUBLIC_VERCEL_URL
        : "http://localhost:3000"
    }/api/pools`,
    {
      next: { revalidate: 300 },
    }
  );
  const json = await res.json();

  const list: DashboardPool[] = json?.data ?? [];
  const found = list.find((p) => p.id === id);
  return found ?? null;
}

export default async function PoolPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pool = await getPool(id);
  if (!pool) {
    notFound();
  }

  // Calculate APY trend
  const apyTrend =
    pool.apy && pool.apyMean30d
      ? pool.apy > pool.apyMean30d
        ? "up"
        : "down"
      : null;

  // Risk assessment based on sigma
  const getRiskLevel = (sigma: number | null) => {
    if (!sigma)
      return { level: "Unknown", color: "secondary", icon: AlertTriangle };
    if (sigma < 0.1)
      return { level: "Low", color: "default", icon: CheckCircle };
    if (sigma < 0.3)
      return { level: "Medium", color: "secondary", icon: Activity };
    return { level: "High", color: "destructive", icon: AlertTriangle };
  };

  const risk = getRiskLevel(pool.sigma);

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Button asChild variant="ghost" className="gap-2">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back to pools
              </Link>
            </Button>
            <CategoryBadge category={pool.category} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Pool Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Pool Info Card */}
            <Card className="flex-1 bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg hover:border-border transition-colors duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg flex items-center justify-center">
                        <span className="text-xl font-bold text-primary-foreground">
                          {pool.project.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold">
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
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    View Protocol
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Key Metrics */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span>Total Value Locked</span>
                      </div>
                      <p className="text-2xl font-bold">
                        {formatUSD(pool.tvlUsd)}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        <span>Current APY</span>
                        {apyTrend && (
                          <div
                            className={`flex items-center gap-1 ${
                              apyTrend === "up"
                                ? "text-emerald-600"
                                : "text-red-600"
                            }`}
                          >
                            {apyTrend === "up" ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-2xl font-bold text-emerald-600">
                        {formatPercent(pool.apy)}
                      </p>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BarChart3 className="h-4 w-4" />
                        <span>30-Day Average</span>
                      </div>
                      <p className="text-xl font-semibold">
                        {formatPercent(pool.apyMean30d)}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Binned Confidence</span>
                      </div>
                      <p className="text-xl font-semibold">
                        {pool.predictions?.binnedConfidence}
                      </p>
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Shield className="h-4 w-4" />
                        <span>Risk Level</span>
                      </div>
                      <Badge variant={risk.color as any} className="gap-1">
                        <risk.icon className="h-3 w-3" />
                        {risk.level}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Zap className="h-4 w-4" />
                        <span>Volatility (σ)</span>
                      </div>
                      <p className="text-xl font-semibold">
                        {typeof pool.sigma === "number"
                          ? pool.sigma.toFixed(3)
                          : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* APY Chart */}
        <APYChart poolId={pool.id} />
      </div>
    </main>
  );
}
