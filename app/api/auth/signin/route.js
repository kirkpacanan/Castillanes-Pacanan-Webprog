import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSupabaseAdmin } from "../../../../lib/supabase";

export async function POST(request) {
  try {
    const body = await request.json();
    const { emailOrUsername, password } = body;

    const trimmed = typeof emailOrUsername === "string" ? emailOrUsername.trim() : "";
    const rawPassword = typeof password === "string" ? password : "";

    if (!trimmed) {
      return NextResponse.json(
        { error: "Email or username is required" },
        { status: 400 }
      );
    }
    if (!rawPassword) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const isEmail = trimmed.includes("@");

    let resolved;
    if (isEmail) {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, email, password_hash")
        .eq("email", trimmed)
        .maybeSingle();
      resolved = { data, error };
    } else {
      const { data: rows, error } = await supabase
        .from("users")
        .select("id, name, email, password_hash")
        .eq("name", trimmed)
        .limit(1);
      resolved = { data: rows?.[0] ?? null, error };
    }

    if (resolved.error) {
      console.error("Signin fetch error:", resolved.error);
      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }

    if (!resolved.data) {
      return NextResponse.json(
        { error: "No account found. Please sign up first." },
        { status: 401 }
      );
    }

    const match = await bcrypt.compare(rawPassword, resolved.data.password_hash);
    if (!match) {
      return NextResponse.json(
        { error: "Invalid password." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: { name: resolved.data.name, email: resolved.data.email },
    });
  } catch (err) {
    if (err.message?.includes("SUPABASE")) {
      return NextResponse.json(
        { error: "Sign-in is not available yet." },
        { status: 503 }
      );
    }
    console.error("Signin error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
