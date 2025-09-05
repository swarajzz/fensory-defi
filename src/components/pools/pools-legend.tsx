"use client";

import { Badge } from "@/components/ui/badge";

export function CategoryBadge({
  category,
}: {
  category: "Lending" | "Liquid Staking" | "Yield Aggregator";
}) {
  const color =
    category === "Lending"
      ? "bg-pink-600 text-white"
      : category === "Liquid Staking"
      ? "bg-emerald-500 text-white"
      : "bg-muted-foreground text-white";
  return <Badge className={color}>{category}</Badge>;
}
