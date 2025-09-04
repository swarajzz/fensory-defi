"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import PoolsView from "@/components/pools/pools-view";

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-0px)]">
      <header className="border-b bg-card/50 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary" aria-hidden />
            <span className="text-balance text-xl font-semibold">
              DeFi Pools Dashboard
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="#pools">Pools</Link>
            </Button>

            <Button variant="default">Connect Wallet</Button>
          </div>
        </div>
      </header>

      <PoolsView />
    </main>
  );
}
