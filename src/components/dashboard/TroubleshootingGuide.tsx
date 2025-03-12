"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, Copy, ExternalLink } from "lucide-react";

export function TroubleshootingGuide() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("cloudflare");

  const cloudflareScript = `<script>
  (function() {
    var trackingOptions = ["visitor_metrics","network_provider","connection_type","os_version","screen_dimensions","phone_clicks","zalo_clicks","messenger_clicks"];
    var scriptElement = document.createElement('script');
    scriptElement.async = true;
    scriptElement.src = 'https://tracktrack-dun.vercel.app/tracker-update.js?id=' + encodeURIComponent(window.location.hostname || 'test-site') + '&options=' + encodeURIComponent(JSON.stringify(trackingOptions));
    document.head.appendChild(scriptElement);
    console.log('TrackTrack script loaded for: ' + window.location.hostname);
  })();
</script>`;

  const vercelScript = `<script>
  (function() {
    var trackingOptions = ["visitor_metrics","network_provider","connection_type","os_version","screen_dimensions","phone_clicks","zalo_clicks","messenger_clicks"];
    var scriptElement = document.createElement('script');
    scriptElement.async = true;
    scriptElement.src = 'https://tracktrack-dun.vercel.app/tracker-update.js?id=' + encodeURIComponent(window.location.hostname || 'test-site') + '&options=' + encodeURIComponent(JSON.stringify(trackingOptions));
    document.head.appendChild(scriptElement);
    console.log('TrackTrack script loaded for: ' + window.location.hostname);
  })();
</script>`;

  const copyToClipboard = (script: string) => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          Hướng dẫn khắc phục lỗi mã theo dõi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 text-amber-800 rounded-md">
            <p className="font-medium">
              Mã theo dõi không hoạt động trên website của bạn
            </p>
            <p className="mt-2 text-sm">
              Mã theo dõi hiện tại đang sử dụng domain{" "}
              <code>tracktrack.pages.dev</code> nhưng hệ thống đã được cập nhật
              sang domain mới. Vui lòng sử dụng một trong các mã theo dõi dưới
              đây để thay thế.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="cloudflare">Cloudflare Pages</TabsTrigger>
              <TabsTrigger value="vercel">Vercel</TabsTrigger>
            </TabsList>

            <TabsContent value="cloudflare" className="space-y-4">
              <div className="relative">
                <pre className="p-4 rounded-md bg-secondary overflow-x-auto">
                  <code className="text-sm">{cloudflareScript}</code>
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(cloudflareScript)}
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>
                  Sử dụng mã này nếu website của bạn được triển khai trên
                  Cloudflare Pages.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="vercel" className="space-y-4">
              <div className="relative">
                <pre className="p-4 rounded-md bg-secondary overflow-x-auto">
                  <code className="text-sm">{vercelScript}</code>
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(vercelScript)}
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>
                  Sử dụng mã này nếu website của bạn được triển khai trên Vercel
                  hoặc các nền tảng khác.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <h3 className="font-medium">Hướng dẫn cài đặt:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Sao chép mã theo dõi mới từ trên.</li>
              <li>Truy cập trang quản trị website của bạn.</li>
              <li>Tìm và thay thế mã theo dõi cũ bằng mã mới.</li>
              <li>Lưu thay đổi và kiểm tra lại sau 5-10 phút.</li>
            </ol>
          </div>

          <div className="pt-2">
            <Button variant="outline" size="sm" className="gap-1" asChild>
              <a
                href="https://tracktrack-dun.vercel.app/dashboard"
                target="_blank"
                rel="noopener noreferrer"
              >
                Kiểm tra trạng thái <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
