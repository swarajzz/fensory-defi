"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, Shield, Zap } from "lucide-react";
import { useState } from "react";

type Category = "Lending" | "Liquid Staking" | "Yield Aggregator";
const CATEGORIES: Category[] = [
  "Lending",
  "Liquid Staking",
  "Yield Aggregator",
];

const CATEGORY_ICONS = {
  Lending: Shield,
  "Liquid Staking": TrendingUp,
  "Yield Aggregator": Zap,
};

export function CategoryFilter({
  value,
  onChange,
  searchQuery,
  onSearchChange,
}: {
  value: Category;
  onChange: (c: Category) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full">
      {/* Search Input */}
      {onSearchChange && (
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search pools..."
            value={searchQuery || ""}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 border-0 shadow-sm focus:shadow-md transition-all duration-200"
          />
        </div>
      )}

      {/* Category Filter */}
      <div className="inline-flex gap-1 rounded-xl border bg-card/50 backdrop-blur-sm p-1 shadow-sm">
        {CATEGORIES.map((c) => {
          const active = value === c;
          const Icon = CATEGORY_ICONS[c];
          return (
            <Button
              key={c}
              variant={active ? "default" : "ghost"}
              size="sm"
              className={`gap-2 transition-all duration-200 ${
                active
                  ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              onClick={() => onChange(c)}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{c}</span>
              <span className="sm:hidden">{c.split(" ")[0]}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
