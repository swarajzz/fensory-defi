"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import PoolsView from "@/components/pools/pools-view";
import { UnlockDialog } from "@/components/auth/unlock-dialog";
import { useUnlock } from "@/components/auth/unlock-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { TrendingUp, Wallet, Shield, Zap, ArrowRight } from "lucide-react";
import { usePools } from "@/hooks/use-pools";

export default function HomePage() {
  const { openUnlock, unlocked } = useUnlock();
  const { pools } = usePools();

  // Calculate total TVL and average APY
  const totalTVL = pools.reduce((sum, pool) => sum + (pool.tvlUsd || 0), 0);
  const avgAPY =
    pools.length > 0
      ? pools.reduce((sum, pool) => sum + (pool.apy || 0), 0) / pools.length
      : 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg group-hover:shadow-xl transition-all duration-300" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-transparent" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  DeFiSense
                </span>
                <p className="text-xs text-muted-foreground -mt-1">
                  Pool Analytics
                </p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <Button variant="ghost" asChild className="text-sm font-medium">
                <Link href="#pools" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Pools
                </Link>
              </Button>
              <Button variant="ghost" className="text-sm font-medium">
                Analytics
              </Button>
              <Button variant="ghost" className="text-sm font-medium">
                Docs
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>

            <div className="flex items-center gap-3">
              {unlocked ? (
                <Button variant="secondary" className="gap-2" disabled>
                  <Wallet className="h-4 w-4" />
                  Connected
                </Button>
              ) : (
                <Button
                  variant="default"
                  onClick={openUnlock}
                  className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Wallet className="h-4 w-4" />
                  Connect Wallet
                </Button>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
        <div className="relative mx-auto max-w-7xl px-4 py-16">
          <div className="text-center space-y-6">
            <div className="space-y-4 animate-slide-up">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent animate-gradient">
                  DeFi Pool
                </span>
                <br />
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent animate-gradient">
                  Analytics
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in px-4">
                Discover, analyze, and track the best DeFi pools across lending,
                liquid staking, and yield aggregation protocols.
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
              <div
                className="bg-card/50 backdrop-blur-sm border rounded-2xl p-6 space-y-2 hover-lift animate-scale-in"
                style={{ animationDelay: "0.1s", animationFillMode: "both" }}
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="h-4 w-4 animate-pulse-slow" />
                  <span className="text-sm font-medium">
                    Total Value Locked
                  </span>
                </div>
                <p className="text-2xl font-bold">
                  ${(totalTVL / 1e9).toFixed(1)}B
                </p>
                <p className="text-xs text-muted-foreground">
                  Across all pools
                </p>
              </div>

              <div
                className="bg-card/50 backdrop-blur-sm border rounded-2xl p-6 space-y-2 hover-lift animate-scale-in"
                style={{ animationDelay: "0.2s", animationFillMode: "both" }}
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="h-4 w-4 animate-pulse-slow" />
                  <span className="text-sm font-medium">Average APY</span>
                </div>
                <p className="text-2xl font-bold text-emerald-600">
                  {avgAPY.toFixed(2)}%
                </p>
                <p className="text-xs text-muted-foreground">Current yield</p>
              </div>

              <div
                className="bg-card/50 backdrop-blur-sm border rounded-2xl p-6 space-y-2 hover-lift animate-scale-in"
                style={{ animationDelay: "0.3s", animationFillMode: "both" }}
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Zap className="h-4 w-4 animate-pulse-slow" />
                  <span className="text-sm font-medium">Active Pools</span>
                </div>
                <p className="text-2xl font-bold">{pools.length}</p>
                <p className="text-xs text-muted-foreground">Available now</p>
              </div>
            </div>

            <div
              className="pt-8 animate-fade-in"
              style={{ animationDelay: "0.4s", animationFillMode: "both" }}
            >
              <Button
                asChild
                size="lg"
                className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 hover-glow"
              >
                <Link href="#pools" className="group">
                  Explore Pools
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <PoolsView />
      <UnlockDialog />
    </main>
  );
}
