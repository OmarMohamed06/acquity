import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { message: "Server is missing Supabase configuration." },
        { status: 500 },
      );
    }

    const body = await request.json();
    const email = String(body?.email || "")
      .trim()
      .toLowerCase();
    const source = String(body?.source || "footer").trim();

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address." },
        { status: 400 },
      );
    }

    const { error } = await supabase.from("newsletter_subscribers").insert({
      email,
      source,
    });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ message: "You're already subscribed." });
      }

      if (error.code === "42P01") {
        return NextResponse.json(
          { message: "Subscriber table not found. Run the SQL setup." },
          { status: 500 },
        );
      }

      return NextResponse.json(
        { message: "Unable to subscribe right now." },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: "Thanks for subscribing!" });
  } catch (error) {
    console.error("Subscribe API error:", error);
    return NextResponse.json(
      { message: "Unable to subscribe right now." },
      { status: 500 },
    );
  }
}
