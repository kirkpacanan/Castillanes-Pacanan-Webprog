import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSupabaseAdmin } from "../../../../lib/supabase";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    const trimmedName = typeof name === "string" ? name.trim() : "";
    const trimmedEmail = typeof email === "string" ? email.trim() : null;
    const rawPassword = typeof password === "string" ? password : "";

    if (!trimmedName) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }
    if (!rawPassword || rawPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(rawPassword, 10);
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("users")
      .insert({
        name: trimmedName,
        email: trimmedEmail || null,
        password_hash: passwordHash,
      })
      .select("id, name, email, created_at")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 409 }
        );
      }
      console.error("Signup DB error:", error);
      return NextResponse.json(
        { error: "Could not create account. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: { id: data.id, name: data.name, email: data.email },
    });
  } catch (err) {
    if (err.message?.includes("SUPABASE")) {
      return NextResponse.json(
        { error: "Server is not configured for sign up yet." },
        { status: 503 }
      );
    }
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
