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
import { useTheme } from "next-themes";

export function APYChart({ poolId }: { poolId: string }) {
  const { points, isLoading, isError } = usePoolChart(poolId);
  const { theme } = useTheme();

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
    <Card className="mt-8 bg-card/50 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              APY Performance
            </CardTitle>
            <p className="text-sm text-muted-foreground">12-month historical data</p>
          </div>
          {trend && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Current APY</p>
                <p className="text-lg font-bold text-foreground">{trend.current}%</p>
              </div>
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  trend.direction === "up"
                    ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400"
                    : "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400"
                }`}
              >
                {trend.direction === "up" ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">
                  {trend.direction === "up" ? "+" : "-"}
                  {trend.changePercent}%
                </span>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="apyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="50%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="100%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.05}
                  />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid
                strokeDasharray="2 4"
                stroke={theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}
                strokeOpacity={0.3}
              />
              <XAxis
                dataKey="date"
                tick={{ 
                  fontSize: 12, 
                  fill: theme === "dark" ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
                  fontWeight: 500
                }}
                axisLine={{ 
                  stroke: theme === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)", 
                  strokeWidth: 1 
                }}
                tickLine={{ 
                  stroke: theme === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)" 
                }}
                tickMargin={12}
                interval="preserveStartEnd"
              />
              <YAxis
                tickFormatter={(v) => `${v}%`}
                tick={{ 
                  fontSize: 12, 
                  fill: theme === "dark" ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
                  fontWeight: 500
                }}
                axisLine={{ 
                  stroke: theme === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)", 
                  strokeWidth: 1 
                }}
                tickLine={{ 
                  stroke: theme === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)" 
                }}
                tickMargin={12}
                domain={["dataMin - 0.5", "dataMax + 0.5"]}
              />
              <Tooltip
                contentStyle={{
                  background: theme === "dark" ? "rgba(18, 18, 18, 0.95)" : "rgba(255, 255, 255, 0.95)",
                  borderColor: theme === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
                  color: theme === "dark" ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)",
                  borderRadius: 16,
                  boxShadow: theme === "dark" 
                    ? "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2)"
                    : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  border: `1px solid ${theme === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)"}`,
                  backdropFilter: "blur(8px)",
                }}
                formatter={(value: any) => [`${value}%`, "APY"]}
                labelFormatter={(label) => `Date: ${label}`}
                cursor={{
                  stroke: theme === "dark" ? "rgba(147, 51, 234, 0.8)" : "rgba(99, 102, 241, 0.8)",
                  strokeWidth: 2,
                  strokeDasharray: "8 4",
                  strokeOpacity: 0.8,
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
        
        {/* Chart Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/50">
          <div className="text-center space-y-1">
            <p className="text-xs text-muted-foreground">Peak APY</p>
            <p className="text-lg font-bold text-emerald-600">
              {Math.max(...data.map(d => d.apy || 0)).toFixed(2)}%
            </p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-xs text-muted-foreground">Average APY</p>
            <p className="text-lg font-bold text-foreground">
              {(data.reduce((sum, d) => sum + (d.apy || 0), 0) / data.length).toFixed(2)}%
            </p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-xs text-muted-foreground">Data Points</p>
            <p className="text-lg font-bold text-foreground">
              {data.length}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
