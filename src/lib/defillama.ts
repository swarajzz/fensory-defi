export type LlamaPool = {
  chain?: string;
  project?: string;
  symbol?: string;
  tvlUsd?: number;
  apy?: number | null;
  apyMean30d?: number | null;
  predictions?: Predictions | null;
  sigma?: number | null;
  pool?: string;
  poolId?: string;
  [key: string]: unknown;
};

type Predictions = {
  predictedClass: string;
  predictedProbability: number;
  binnedConfidence: number;
  [key: string]: unknown;
};

export type DashboardPool = {
  id: string;
  project: string;
  chain: string;
  symbol: string;
  tvlUsd: number;
  apy: number | null;
  apyMean30d: number | null;
  predictions: Predictions | null;
  sigma: number | null;
  category: "Lending" | "Liquid Staking" | "Yield Aggregator";
  locked: boolean;
};

export type ChartPoint = { date: string; apy: number | null }; // date in YYYY-MM

export function matchPoolById(item: LlamaPool, wanted: string): boolean {
  return (
    item.poolId === wanted ||
    item.pool === wanted ||
    (typeof item.pool === "string" && item.pool?.includes?.(wanted))
  );
}

export function toDashboardPool(
  item: LlamaPool,
  id: string,
  category: DashboardPool["category"]
): DashboardPool {
  return {
    id,
    project: item.project ?? "Unknown",
    chain: item.chain ?? "Unknown",
    symbol: item.symbol ?? "",
    tvlUsd: typeof item.tvlUsd === "number" ? item.tvlUsd : 0,
    apy: item.apy ?? null,
    apyMean30d: item.apyMean30d ?? null,
    predictions: item.predictions ?? null,
    sigma: item.sigma ?? null,
    category,
    locked: category === "Yield Aggregator",
  };
}

// Unix datatype
// export function reduceToMonthlyFirsts(
//   data: Array<{ timestamp: number; apy?: number | null }>
// ): ChartPoint[] {
//   if (!Array.isArray(data)) return [];
//   // Build a map of "YYYY-MM" -> point for that month's first day (lowest day for that month)
//   const byMonth = new Map<string, { ts: number; apy: number | null }>();
//   for (const d of data) {
//     const date = new Date(d.timestamp * 1000);
//     const ym = `${date.getUTCFullYear()}-${String(
//       date.getUTCMonth() + 1
//     ).padStart(2, "0")}`;
//     const existing = byMonth.get(ym);
//     if (!existing || d.timestamp < existing.ts) {
//       byMonth.set(ym, { ts: d.timestamp, apy: d.apy ?? null });
//     }
//   }
//   // Sort months descending, take last 12 months
//   const months = Array.from(byMonth.entries())
//     .sort((a, b) => (a[1].ts > b[1].ts ? 1 : -1))
//     .slice(-12);
//   return months.map(([ym, v]) => ({ date: ym, apy: v.apy ?? null }));
// }

// Reduce daily chart points to first day of each month for last 12 months
export function reduceToMonthlyFirsts(
  data: Array<{ timestamp: string; apy?: number | null }>
): ChartPoint[] {
  if (!Array.isArray(data)) return [];

  // Build a map of "YYYY-MM" -> point for that month's first day (lowest day for that month)
  const byMonth = new Map<string, { ts: string; apy: number | null }>();

  for (const d of data) {
    const date = new Date(d.timestamp); // ISO string can be passed directly to Date constructor

    // Skip invalid dates
    if (isNaN(date.getTime())) {
      console.warn(`Invalid timestamp format: ${d.timestamp}`);
      continue;
    }
    const ym = `${date.getUTCFullYear()}-${String(
      date.getUTCMonth() + 1
    ).padStart(2, "0")}`;

    const existing = byMonth.get(ym);

    if (!existing || d.timestamp < existing.ts) {
      byMonth.set(ym, { ts: d.timestamp, apy: d.apy ?? null });
    }
  }

  // Sort months by timestamp, take last 12 months
  const months = Array.from(byMonth.entries())
    .sort((a, b) => (a[1].ts > b[1].ts ? 1 : -1))
    .slice(-12);

  return months.map(([ym, v]) => ({ date: ym, apy: v.apy ?? null }));
}
