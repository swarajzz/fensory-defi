"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useUnlock } from "./unlock-provider";

export function UnlockDialog() {
  const { open, closeUnlock, setUnlocked, connectWallet } = useUnlock();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onConnectMetaMask() {
    setBusy(true);
    setError(null);
    const ok = await connectWallet();
    if (!ok) {
      setError(
        "No wallet detected or connection was rejected. Please ensure MetaMask is installed and try again."
      );
    }
    setBusy(false);
  }

  function onMockLogin() {
    setUnlocked(true);
    closeUnlock();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? null : closeUnlock())}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Unlock Yield Aggregator</DialogTitle>
          <DialogDescription>
            Connect your wallet or use a mock login to unlock Yield Aggregator
            pools.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mt-2 grid gap-2">
          <Button onClick={onConnectMetaMask} disabled={busy}>
            {busy ? "Connecting..." : "Connect MetaMask"}
          </Button>
          <Button variant="secondary" onClick={onMockLogin} disabled={busy}>
            Mock Login
          </Button>
          <Button variant="ghost" onClick={closeUnlock} disabled={busy}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
