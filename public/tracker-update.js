(function () {
  // Configuration
  const API_ENDPOINT = "/api/track";
  const DEFAULT_OPTIONS = [
    "visitor_metrics",
    "network_provider",
    "connection_type",
    "os_version",
    "screen_dimensions",
    "phone_clicks",
    "zalo_clicks",
    "messenger_clicks",
  ];

  // Parse tracking options from URL
  const scriptTag = document.currentScript;
  const urlParams = new URLSearchParams(scriptTag.src.split("?")[1] || "");
  const siteId = urlParams.get("id") || "unknown";
  const optionsParam = urlParams.get("options");
  const trackingOptions = optionsParam
    ? JSON.parse(decodeURIComponent(optionsParam))
    : DEFAULT_OPTIONS;

  // Collect basic visitor data
  function collectVisitorData() {
    const data = {
      siteId: siteId,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      referrer: document.referrer || "direct",
    };

    if (trackingOptions.includes("visitor_metrics")) {
      data.userAgent = navigator.userAgent;
      data.language = navigator.language;
      data.ip = ""; // Will be filled on server side
    }

    if (trackingOptions.includes("network_provider")) {
      // Network provider info will be determined server-side based on IP
      data.collectNetworkProvider = true;
    }

    if (trackingOptions.includes("connection_type")) {
      if (navigator.connection) {
        data.connectionType = navigator.connection.effectiveType || "unknown";
      } else {
        data.connectionType = "unknown";
      }
    }

    if (trackingOptions.includes("os_version")) {
      const userAgent = navigator.userAgent;
      let os = "unknown";
      let version = "";

      if (/Windows/.test(userAgent)) {
        os = "Windows";
        if (/Windows NT 10.0/.test(userAgent)) version = "10";
        else if (/Windows NT 6.3/.test(userAgent)) version = "8.1";
        else if (/Windows NT 6.2/.test(userAgent)) version = "8";
        else if (/Windows NT 6.1/.test(userAgent)) version = "7";
      } else if (/Macintosh|Mac OS X/.test(userAgent)) {
        os = "macOS";
        const match = userAgent.match(/Mac OS X ([0-9_]+)/);
        if (match) version = match[1].replace(/_/g, ".");
      } else if (/Android/.test(userAgent)) {
        os = "Android";
        const match = userAgent.match(/Android ([0-9\.]+)/);
        if (match) version = match[1];
      } else if (/iOS|iPhone|iPad|iPod/.test(userAgent)) {
        os = "iOS";
        const match = userAgent.match(/OS ([0-9_]+)/);
        if (match) version = match[1].replace(/_/g, ".");
      } else if (/Linux/.test(userAgent)) {
        os = "Linux";
      }

      data.os = os;
      data.osVersion = version;
    }

    if (trackingOptions.includes("screen_dimensions")) {
      data.screenWidth = window.screen.width;
      data.screenHeight = window.screen.height;
      data.screenColorDepth = window.screen.colorDepth;
      data.devicePixelRatio = window.devicePixelRatio || 1;
    }

    return data;
  }

  // Track click events
  function setupClickTracking() {
    if (
      !trackingOptions.includes("phone_clicks") &&
      !trackingOptions.includes("zalo_clicks") &&
      !trackingOptions.includes("messenger_clicks")
    ) {
      return;
    }

    document.addEventListener("click", function (event) {
      let target = event.target;

      // Find closest anchor if the click was on a child element
      while (target && target.tagName !== "A") {
        target = target.parentElement;
        if (!target) return;
      }

      if (!target || !target.href) return;

      const href = target.href.toLowerCase();
      let trackType = null;

      if (trackingOptions.includes("phone_clicks") && href.startsWith("tel:")) {
        trackType = "phone";
      } else if (
        trackingOptions.includes("zalo_clicks") &&
        href.includes("zalo.me")
      ) {
        trackType = "zalo";
      } else if (
        trackingOptions.includes("messenger_clicks") &&
        href.includes("m.me")
      ) {
        trackType = "messenger";
      }

      if (trackType) {
        const clickData = {
          siteId: siteId,
          timestamp: new Date().toISOString(),
          type: trackType,
          url: window.location.href,
          targetUrl: href,
        };

        sendData({
          eventType: "click",
          data: clickData,
        });
      }
    });
  }

  // Send data to server
  function sendData(payload) {
    // Log tracking data to console for debugging
    console.log("Tracking data:", payload);

    // Use the correct API endpoint with full URL
    const apiUrl = "https://tracktrack-dun.vercel.app/api/track";

    // Create a debug element to show tracking status
    const debugElement = document.createElement("div");
    debugElement.style.position = "fixed";
    debugElement.style.bottom = "10px";
    debugElement.style.right = "10px";
    debugElement.style.padding = "5px";
    debugElement.style.background = "rgba(0,0,0,0.7)";
    debugElement.style.color = "white";
    debugElement.style.fontSize = "10px";
    debugElement.style.zIndex = "9999";
    debugElement.style.borderRadius = "3px";
    debugElement.textContent = "Đang gửi dữ liệu theo dõi...";
    document.body.appendChild(debugElement);

    // Always use fetch API for more reliable tracking
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(payload),
      keepalive: true, // Important for data to be sent even if page is unloading
      mode: "cors",
      credentials: "omit",
    })
      .then((response) => {
        debugElement.textContent = "Phản hồi: " + response.status;
        if (!response.ok) {
          throw new Error("Network response was not ok: " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Tracking data sent successfully:", data);
        debugElement.textContent = "Đã gửi thành công!";
        debugElement.style.background = "rgba(0,128,0,0.7)";
        setTimeout(() => {
          document.body.removeChild(debugElement);
        }, 3000);
      })
      .catch((error) => {
        console.error("Error sending tracking data:", error);
        debugElement.textContent = "Lỗi: " + error.message;
        debugElement.style.background = "rgba(255,0,0,0.7)";
        setTimeout(() => {
          document.body.removeChild(debugElement);
        }, 5000);
      });
  }

  // Initialize tracking
  function init() {
    console.log("TrackTrack initialized for:", siteId);
    const visitorData = collectVisitorData();
    sendData({
      eventType: "pageview",
      data: visitorData,
    });

    setupClickTracking();

    // Track when user leaves the page
    window.addEventListener("beforeunload", function () {
      sendData({
        eventType: "exit",
        data: {
          siteId: siteId,
          timestamp: new Date().toISOString(),
          timeOnPage: Math.round((new Date() - pageLoadTime) / 1000),
          url: window.location.href,
        },
      });
    });
  }

  // Record page load time
  const pageLoadTime = new Date();

  // Initialize after DOM is fully loaded
  if (document.readyState === "complete") {
    init();
  } else {
    window.addEventListener("load", init);
  }
})();
