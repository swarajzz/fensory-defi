"use client";

import { Button } from "@/components/ui/button";

type Category = "Lending" | "Liquid Staking" | "Yield Aggregator";
const CATEGORIES: Category[] = [
  "Lending",
  "Liquid Staking",
  "Yield Aggregator",
];

export function CategoryFilter({
  value,
  onChange,
}: {
  value: Category;
  onChange: (c: Category) => void;
}) {
  return (
    <div className="inline-flex gap-2 rounded-md border bg-background p-1">
      {CATEGORIES.map((c) => {
        const active = value === c;
        return (
          <Button
            key={c}
            variant={active ? "default" : "ghost"}
            className={
              active ? "bg-primary text-primary-foreground" : "text-foreground"
            }
            onClick={() => onChange(c)}
          >
            {c}
          </Button>
        );
      })}
    </div>
  );
}
