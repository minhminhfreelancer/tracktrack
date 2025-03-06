export async function onRequestPost(context) {
  try {
    const request = context.request;
    const env = context.env;

    const data = await request.json();

    // Add IP address information
    const clientIP =
      request.headers.get("CF-Connecting-IP") ||
      request.headers.get("X-Forwarded-For") ||
      "unknown";
    if (data.data && data.data.ip === "") {
      data.data.ip = clientIP;
    }

    // In a production environment, you would store this data in a database
    // For example, using Cloudflare D1 or KV
    console.log("Tracking data received:", data);

    // Example of storing in KV (if KV_ANALYTICS binding exists)
    if (env.KV_ANALYTICS) {
      const key = `track_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      await env.KV_ANALYTICS.put(key, JSON.stringify(data));
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error processing tracking request:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}

export function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}
