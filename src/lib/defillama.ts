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
};

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
  };
}
