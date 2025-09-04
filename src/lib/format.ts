export const formatUSD = (n: number | null | undefined) =>
  typeof n === "number"
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(n)
    : "—";

export const formatPercent = (n: number | null | undefined) =>
  typeof n === "number" ? `${n.toFixed(2)}%` : "—";
