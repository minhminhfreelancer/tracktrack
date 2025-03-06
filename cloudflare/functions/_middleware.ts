export const onRequest: PagesFunction = async ({ request, next, env }) => {
  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
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

  // Handle the request
  const response = await next();

  // Add CORS headers to all responses
  response.headers.set("Access-Control-Allow-Origin", "*");

  return response;
};
