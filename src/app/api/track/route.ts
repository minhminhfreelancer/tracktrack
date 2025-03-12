import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    const data = await req.json();

    // Extract tracking data
    const { eventType, data: eventData } = data;
    const { siteId } = eventData;

    // Add IP address information
    const clientIP =
      req.headers.get("CF-Connecting-IP") ||
      req.headers.get("X-Forwarded-For") ||
      req.headers.get("X-Real-IP") ||
      "unknown";

    console.log("Client IP:", clientIP);
    console.log("Headers:", Object.fromEntries(req.headers.entries()));

    if (eventData.ip === "") {
      eventData.ip = clientIP;
    }

    // Get user agent
    const userAgent = req.headers.get("User-Agent") || "unknown";

    // Find the site by domain
    const { data: siteData, error: siteError } = await supabase
      .from("sites")
      .select("id")
      .eq("domain", siteId)
      .maybeSingle();

    // If site doesn't exist, create it with an anonymous user
    let siteId_db = siteData?.id;

    if (!siteData) {
      // Get the first admin user as the owner (in a real app, you'd have a better way to handle this)
      const { data: adminUser } = await supabase
        .from("users")
        .select("id")
        .limit(1)
        .single();

      if (adminUser) {
        const { data: newSite, error: createError } = await supabase
          .from("sites")
          .insert({
            user_id: adminUser.id,
            domain: siteId,
            name: siteId,
          })
          .select()
          .single();

        if (newSite) {
          siteId_db = newSite.id;
        }
      }
    }

    if (siteId_db) {
      // Store the tracking event
      await supabase.from("tracking_events").insert({
        site_id: siteId_db,
        event_type: eventType,
        event_data: eventData,
        ip_address: clientIP,
        user_agent: userAgent,
        url: eventData.url || null,
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing tracking request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
