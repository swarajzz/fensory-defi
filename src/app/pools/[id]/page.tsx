import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CategoryBadge } from "@/components/pools/pools-legend";
import { APYChart } from "@/components/pools/apy-chart";
import { formatPercent, formatUSD } from "@/lib/format";

type DashboardPool = {
  id: string;
  project: string;
  chain: string;
  symbol: string;
  tvlUsd: number;
  apy: number | null;
  apyMean30d: number | null;
  prediction: number | null;
  sigma: number | null;
  category: "Lending" | "Liquid Staking" | "Yield Aggregator";
  locked: boolean;
};

async function getPool(id: string): Promise<DashboardPool | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_URL ? "https://" + process.env.NEXT_PUBLIC_VERCEL_URL : "http://localhost:3000"}/api/pools`,
    {
      next: { revalidate: 300 },
    }
  );
  const json = await res.json();

  console.log(`This is jons:`, json)
  const list: DashboardPool[] = json?.data ?? [];
  const found = list.find((p) => p.id === id);
  return found ?? null;
}

export default async function PoolPage({ params }: { params: { id: string } }) {
  const pool = await getPool(params.id);
  if (!pool) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <Button asChild variant="ghost">
          <Link href="/">← Back to pools</Link>
        </Button>
        <CategoryBadge category={pool.category} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-pretty">{pool.project}</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            {pool.chain} • {pool.symbol || "—"}
          </p>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 md:grid-cols-3 text-sm">
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
              <dt className="text-muted-foreground">Prediction</dt>
              <dd className="font-medium">{formatPercent(pool.prediction)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Sigma</dt>
              <dd className="font-medium">
                {typeof pool.sigma === "number" ? pool.sigma.toFixed(2) : "—"}
              </dd>
            </div>
          </dl>

          <APYChart poolId={pool.id} />
        </CardContent>
      </Card>
    </main>
  );
}
