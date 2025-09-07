import { type NextRequest, NextResponse } from "next/server";
import { reduceToMonthlyFirsts } from "@/lib/defillama";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    const res = await fetch(
      `https://yields.llama.fi/chart/${encodeURIComponent(id)}`,
      {
        next: { revalidate: 3600 },
        headers: { accept: "application/json" },
      }
    );
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch chart" },
        { status: res.status }
      );
    }
    const json = await res.json();

    const points = Array.isArray(json)
      ? json
      : Array.isArray(json?.data)
      ? json.data
      : [];
    const reduced = reduceToMonthlyFirsts(points);
    return NextResponse.json({ data: reduced });
  } catch (e) {
    return NextResponse.json(
      { error: "Unexpected error", detail: (e as Error).message },
      { status: 500 }
    );
  }
}
