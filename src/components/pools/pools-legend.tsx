"use client";

import { Badge } from "@/components/ui/badge";

export function CategoryBadge({
  category,
}: {
  category: "Lending" | "Liquid Staking" | "Yield Aggregator";
}) {
  const color =
    category === "Lending"
      ? "bg-rose-600 text-white"
      : category === "Liquid Staking"
      ? "bg-teal-600 text-white"
      : "bg-cyan-500 text-white";
    
  return <Badge className={`${color} uppercase text-xs font-medium whitespace-nowrap px-2 py-1`}>{category}</Badge>;
}
