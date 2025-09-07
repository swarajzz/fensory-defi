"use client";

import useSWR from "swr";
import type { DashboardPool } from "@/lib/defillama";

const fetcher = async (url: string) => {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Request failed: ${r.status}`);
  return r.json();
};

export function usePools() {
  const { data, error, isLoading, mutate } = useSWR<{ data: DashboardPool[] }>(
    "/api/pools",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
    }
  );
  return {
    pools: data?.data ?? [],
    isLoading,
    isError: error as Error | undefined,
    refresh: mutate,
  };
}

export function usePoolChart(id?: string) {
  const key = id ? `/api/pools/${id}/chart` : null;
  const { data, error, isLoading, mutate } = useSWR<{
    data: Array<{ date: string; apy: number | null }>;
  }>(key, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  });
  return {
    points: data?.data ?? [],
    isLoading,
    isError: error as Error | undefined,
    refresh: mutate,
  };
}
