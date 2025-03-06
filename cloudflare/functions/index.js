export default {
  async fetch(request, env, ctx) {
    return new Response(
      "<html><body><h1>TrackTrack API Service</h1><p>This is the API service for the TrackTrack analytics platform.</p></body></html>",
      {
        headers: {
          "content-type": "text/html;charset=UTF-8",
        },
      },
    );
  },
};
