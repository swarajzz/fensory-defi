"use client";

import { Lock } from "lucide-react";

export function LockedOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/70 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Lock className="h-4 w-4" aria-hidden />
        <span className="text-sm">
          Unlock by connecting wallet or logging in
        </span>
      </div>
    </div>
  );
}
