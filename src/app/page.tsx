"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import PoolsView from "@/components/pools/pools-view";
import { UnlockDialog } from "@/components/auth/unlock-dialog";
import { useUnlock } from "@/components/auth/unlock-provider";

export default function HomePage() {
  const { openUnlock, unlocked } = useUnlock();

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

            {unlocked ? (
              <Button variant="secondary" disabled>
                Connected
              </Button>
            ) : (
              <Button variant="default" onClick={openUnlock}>
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </header>

      <PoolsView />
      <UnlockDialog />
    </main>
  );
}
