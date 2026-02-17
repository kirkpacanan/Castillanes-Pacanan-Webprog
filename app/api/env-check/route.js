import { NextResponse } from "next/server";

/**
 * One-time check: hit /api/env-check to see if Supabase public env vars are set.
 * Only reports presence, not values. Delete this file when done debugging.
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return NextResponse.json({
    hasUrl: !!url,
    hasKey: !!key,
    readyForGoogle: !!(url && key),
  });
}
