"use client";

import { useMemo } from "react";
import { usePoolChart } from "@/hooks/use-pools";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

export function APYChart({ poolId }: { poolId: string }) {
  const { points, isLoading, isError } = usePoolChart(poolId);

  const data = useMemo(
    () =>
      points.map((p) => ({
        date: p.date,
        apy: typeof p.apy === "number" ? Number(p.apy.toFixed(2)) : null,
      })),
    [points]
  );

  const trend = useMemo(() => {
    if (data.length < 2) return null;
    const validPoints = data.filter((d) => d.apy !== null);
    if (validPoints.length < 2) return null;

    const first = validPoints[0].apy!;
    const last = validPoints[validPoints.length - 1].apy!;
    const change = last - first;
    const changePercent = ((change / first) * 100).toFixed(1);

    return {
      direction: change >= 0 ? "up" : "down",
      change: Math.abs(change).toFixed(2),
      changePercent: Math.abs(Number(changePercent)).toFixed(1),
      current: last.toFixed(2),
    };
  }, [data]);

  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="mt-6">
        <AlertTitle>Could not load APY history</AlertTitle>
        <AlertDescription>
          There was a problem fetching the APY chart data.
        </AlertDescription>
      </Alert>
    );
  }

  if (!data.length) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>APY History (12 months)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-80 w-full items-center justify-center">
            <p className="text-sm text-muted-foreground">
              No historical data available
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            APY History (12 months)
          </CardTitle>
          {trend && (
            <div className="flex items-center gap-2 text-sm">
              <div
                className={`flex items-center gap-1 ${
                  trend.direction === "up"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {trend.direction === "up" ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="font-medium">{trend.current}%</span>
                <span className="text-xs">
                  ({trend.direction === "up" ? "+" : "-"}
                  {trend.changePercent}%)
                </span>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="apyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                strokeOpacity={0.3}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
                tickMargin={8}
              />
              <YAxis
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
                tickMargin={8}
                domain={["dataMin - 0.5", "dataMax + 0.5"]}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--popover))",
                  borderColor: "hsl(var(--border))",
                  color: "hsl(var(--popover-foreground))",
                  borderRadius: 12,
                  boxShadow:
                    "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                  border: "1px solid hsl(var(--border))",
                }}
                formatter={(value: any) => [`${value}%`, "APY"]}
                labelFormatter={(label) => `Date: ${label}`}
                cursor={{
                  stroke: "hsl(var(--primary))",
                  strokeWidth: 1,
                  strokeDasharray: "5 5",
                }}
              />
              <Area
                type="monotone"
                dataKey="apy"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                fill="url(#apyGradient)"
                dot={{
                  r: 4,
                  stroke: "hsl(var(--primary))",
                  fill: "hsl(var(--background))",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  stroke: "hsl(var(--primary))",
                  fill: "hsl(var(--primary))",
                  strokeWidth: 2,
                }}
                connectNulls
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
