import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const adminClient =
  supabaseUrl && serviceKey
    ? createClient(supabaseUrl, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : null;

const normalizeDoc = (row: any) => ({
  id: row.id,
  listing_id: row.listing_id,
  document_type: row.document_type ?? row.type ?? null,
  file_name: row.file_name ?? row.name ?? "",
  file_path: row.file_path ?? row.file_url ?? row.url ?? "",
  file_size: row.file_size ?? row.file_size_bytes ?? row.size ?? null,
  mime_type: row.mime_type ?? row.content_type ?? null,
  created_at: row.created_at ?? row.uploaded_at ?? null,
});

export async function GET(request: Request) {
  try {
    if (!adminClient) {
      return NextResponse.json(
        { message: "Server is missing Supabase admin configuration." },
        { status: 500 },
      );
    }

    const url = new URL(request.url);
    const listingId = url.searchParams.get("listingId");
    if (!listingId) {
      return NextResponse.json(
        { message: "listingId is required" },
        { status: 400 },
      );
    }

    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace(/Bearer\s+/i, "").trim();
    if (!token) {
      return NextResponse.json(
        { message: "Missing authorization token" },
        { status: 401 },
      );
    }

    const { data: userData, error: userError } =
      await adminClient.auth.getUser(token);
    if (userError || !userData?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error: profileError } = await adminClient
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .maybeSingle();

    if (profileError || profile?.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { data: docs, error: docsError } = await adminClient
      .from("listing_documents")
      .select("*")
      .eq("listing_id", listingId)
      .order("created_at", { ascending: false });

    if (docsError) {
      return NextResponse.json(
        { message: docsError.message || "Failed to load documents" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      documents: (docs || []).map(normalizeDoc),
    });
  } catch (error) {
    console.error("Admin listing-documents error:", error);
    return NextResponse.json(
      { message: "Failed to load documents" },
      { status: 500 },
    );
  }
}
