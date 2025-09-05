import type { NextRequest } from "next/server";
import { ALL_POOL_IDS, CATEGORY_BY_ID } from "@/data/pools";
import type { DashboardPool, LlamaPool } from "@/lib/defillama";
import { matchPoolById, toDashboardPool } from "@/lib/defillama";

export async function GET(_req: NextRequest) {
  try {
    const res = await fetch("https://yields.llama.fi/pools", {
      // cache revalidation to reduce rate and improve perf
      // next: { revalidate: 300 },
      headers: { accept: "application/json" },
    });
    if (!res.ok) {
      return Response.json(
        { error: "Failed to fetch pools" },
        { status: res.status }
      );
    }
    const json = (await res.json()) as { data?: LlamaPool[] } | LlamaPool[];
    const list: LlamaPool[] = Array.isArray(json)
      ? json
      : Array.isArray(json?.data)
      ? json.data!
      : [];

    // select pools from exisiting pools 
    const selected: DashboardPool[] = [];
    for (const id of ALL_POOL_IDS) {
      const found = list.find((p) => matchPoolById(p, id));
      if (found) {
        const category = CATEGORY_BY_ID[id];
        selected.push(toDashboardPool(found, id, category));
      } else {
        // placeholder if pool not found
        selected.push({
          id,
          project: "Unknown",
          chain: "Unknown",
          symbol: "",
          tvlUsd: 0,
          apy: null,
          apyMean30d: null,
          predictions: null,
          sigma: null,
          category: CATEGORY_BY_ID[id],
          locked: CATEGORY_BY_ID[id] === "Yield Aggregator",
        });
      }
    }

    // ordering by category then project
    selected.sort((a, b) => {
      const catOrder = [
        "Lending",
        "Liquid Staking",
        "Yield Aggregator",
      ] as const;
      const ca = catOrder.indexOf(a.category as (typeof catOrder)[number]);
      const cb = catOrder.indexOf(b.category as (typeof catOrder)[number]);
      if (ca !== cb) return ca - cb;
      return a.project.localeCompare(b.project);
    });

    return Response.json({ data: selected }, { status: 200 });
  } catch (err) {
    return Response.json(
      { error: "Unexpected error", detail: (err as Error).message },
      { status: 500 }
    );
  }
}
