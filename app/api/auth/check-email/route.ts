import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const client =
  supabaseUrl && anonKey
    ? createClient(supabaseUrl, anonKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : null;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    if (!client) {
      return NextResponse.json(
        { message: "Server is missing Supabase configuration." },
        { status: 500 },
      );
    }

    const body = await request.json();
    const email = String(body?.email || "")
      .trim()
      .toLowerCase();

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const { data, error } = await client.rpc("check_email_exists", {
      input_email: email,
    });

    if (error) {
      return NextResponse.json(
        { message: error.message || "Failed to check email." },
        { status: 500 },
      );
    }

    return NextResponse.json({ exists: Boolean(data) });
  } catch (error) {
    console.error("Check email error:", error);
    return NextResponse.json(
      { message: "Failed to check email." },
      { status: 500 },
    );
  }
}
