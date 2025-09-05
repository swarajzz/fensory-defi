"use client";

import type React from "react";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type UnlockContextValue = {
  unlocked: boolean;
  setUnlocked: (v: boolean) => void;
  open: boolean;
  openUnlock: () => void;
  closeUnlock: () => void;
  // Tries to connect an EIP-1193 wallet (e.g., MetaMask). Resolves true on success.
  connectWallet: () => Promise<boolean>;
};

const UnlockContext = createContext<UnlockContextValue | undefined>(undefined);

export function UnlockProvider({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("defi_unlocked");
      if (stored === "true") setUnlocked(true);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("defi_unlocked", unlocked ? "true" : "false");
    } catch {}
  }, [unlocked]);

  const openUnlock = useCallback(() => setOpen(true), []);
  const closeUnlock = useCallback(() => setOpen(false), []);

  const connectWallet = useCallback(async () => {
    const eth = (globalThis as any)?.ethereum;
    if (!eth?.request) {
      return false;
    }
    try {
      await eth.request({ method: "eth_requestAccounts" });
      setUnlocked(true);
      setOpen(false);
      return true;
    } catch {
      return false;
    }
  }, []);

  const value = useMemo(
    () => ({
      unlocked,
      setUnlocked,
      open,
      openUnlock,
      closeUnlock,
      connectWallet,
    }),
    [unlocked, open, openUnlock, closeUnlock, connectWallet]
  );

  return (
    <UnlockContext.Provider value={value}>{children}</UnlockContext.Provider>
  );
}

export function useUnlock() {
  const ctx = useContext(UnlockContext);
  if (!ctx) throw new Error("useUnlock must be used within UnlockProvider");
  return ctx;
}
