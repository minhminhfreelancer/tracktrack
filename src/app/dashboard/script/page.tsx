"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  ArrowLeft,
  BarChart3,
  Check,
  Copy,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface TrackingOption {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export default function ScriptPage() {
  const [copied, setCopied] = useState(false);
  const [trackingOptions, setTrackingOptions] = useState<TrackingOption[]>([
    {
      id: "visitor_metrics",
      name: "Thông tin người dùng",
      description:
        "Theo dõi thông tin cơ bản của người dùng bao gồm địa chỉ IP và chi tiết trình duyệt",
      enabled: true,
    },
    {
      id: "network_provider",
      name: "Nhà mạng",
      description: "Thu thập thông tin về nhà cung cấp mạng của người dùng",
      enabled: true,
    },
    {
      id: "connection_type",
      name: "Loại kết nối",
      description: "Theo dõi người dùng đang sử dụng WiFi, 3G, 4G, v.v.",
      enabled: true,
    },
    {
      id: "os_version",
      name: "Hệ điều hành",
      description: "Thu thập thông tin về loại và phiên bản hệ điều hành",
      enabled: true,
    },
    {
      id: "screen_dimensions",
      name: "Kích thước màn hình",
      description:
        "Theo dõi kích thước và độ phân giải màn hình của thiết bị người dùng",
      enabled: true,
    },
    {
      id: "phone_clicks",
      name: "Click số điện thoại",
      description: "Theo dõi khi người dùng nhấp vào liên kết số điện thoại",
      enabled: true,
    },
    {
      id: "zalo_clicks",
      name: "Click Zalo",
      description: "Theo dõi khi người dùng nhấp vào liên kết nhắn tin Zalo",
      enabled: true,
    },
    {
      id: "messenger_clicks",
      name: "Click Messenger",
      description:
        "Theo dõi khi người dùng nhấp vào liên kết Facebook Messenger",
      enabled: true,
    },
  ]);

  const handleToggleOption = (id: string) => {
    setTrackingOptions(
      trackingOptions.map((option) =>
        option.id === id ? { ...option, enabled: !option.enabled } : option,
      ),
    );
  };

  const generateScript = () => {
    const enabledOptions = trackingOptions
      .filter((option) => option.enabled)
      .map((option) => option.id);

    return `<!-- Mã theo dõi người dùng -->
<script>
  (function() {
    var trackingOptions = ${JSON.stringify(enabledOptions)};
    var scriptElement = document.createElement('script');
    scriptElement.async = true;
    scriptElement.src = 'https://analytics-api.example.com/tracker.js?id=YOUR_SITE_ID&options=' + encodeURIComponent(JSON.stringify(trackingOptions));
    document.head.appendChild(scriptElement);
  })();
</script>`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateScript());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">Phân tích người dùng</h1>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4 mr-2" />
              Tài khoản
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Đăng xuất
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4">
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Điều hướng</CardTitle>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href="/dashboard">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Tổng quan
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href="/dashboard/script">
                        <Settings className="h-4 w-4 mr-2" />
                        Mã nhúng
                      </Link>
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="w-full md:w-3/4">
            <Card>
              <CardHeader>
                <CardTitle>Tạo mã nhúng theo dõi</CardTitle>
                <CardDescription>
                  Tùy chỉnh các tùy chọn theo dõi và tạo mã JavaScript để nhúng
                  vào trang web của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="options">
                  <TabsList className="mb-4">
                    <TabsTrigger value="options">Tùy chọn theo dõi</TabsTrigger>
                    <TabsTrigger value="code">Mã nhúng</TabsTrigger>
                  </TabsList>

                  <TabsContent value="options" className="space-y-4">
                    <div className="grid gap-4">
                      {trackingOptions.map((option) => (
                        <div
                          key={option.id}
                          className={`flex items-start space-x-3 rounded-md border p-4 ${option.enabled ? "border-primary/50 bg-primary/5" : "border-muted"}`}
                        >
                          <Checkbox
                            id={option.id}
                            checked={option.enabled}
                            onCheckedChange={() =>
                              handleToggleOption(option.id)
                            }
                            className="mt-1"
                          />
                          <div className="space-y-1">
                            <Label
                              htmlFor={option.id}
                              className="font-medium cursor-pointer"
                            >
                              {option.name}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {option.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="code">
                    <div className="space-y-4">
                      <div className="relative">
                        <pre className="p-4 rounded-md bg-secondary overflow-x-auto">
                          <code className="text-sm">{generateScript()}</code>
                        </pre>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2"
                          onClick={copyToClipboard}
                        >
                          {copied ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <div className="bg-yellow-50 text-yellow-800 p-4 rounded-md text-sm">
                        <p>
                          <strong>Hướng dẫn:</strong> Sao chép mã trên và dán
                          vào phần <code>&lt;head&gt;</code> của trang web của
                          bạn. Mã này sẽ tự động thu thập dữ liệu theo các tùy
                          chọn bạn đã chọn.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Đặt lại mặc định</Button>
                <Button onClick={() => copyToClipboard()}>
                  {copied ? "Đã sao chép" : "Sao chép mã"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
