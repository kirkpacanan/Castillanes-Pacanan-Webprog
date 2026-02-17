import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        const origin = request.nextUrl.origin;
        return NextResponse.redirect(`${origin}${next.startsWith("/") ? next : "/"}`);
      }
    }
  }

  const origin = request.nextUrl.origin;
  return NextResponse.redirect(`${origin}/signin?error=auth`);
}
