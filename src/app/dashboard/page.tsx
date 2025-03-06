"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ArrowLeft, BarChart3, Settings, User } from "lucide-react";
import Link from "next/link";

interface VisitorData {
  ip: string;
  browser: string;
  provider: string;
  connectionType: string;
  os: string;
  screenSize: string;
  phoneClicks: number;
  zaloClicks: number;
  messengerClicks: number;
}

export default function Dashboard() {
  const [userData, setUserData] = useState<VisitorData>({
    ip: "192.168.1.1",
    browser: "Chrome 98.0.4758.102",
    provider: "Viettel",
    connectionType: "WiFi",
    os: "Windows 11",
    screenSize: "1920 x 1080",
    phoneClicks: 23,
    zaloClicks: 15,
    messengerClicks: 8,
  });

  useEffect(() => {
    // Simulate fetching user data
    const fetchUserData = async () => {
      // In a real app, this would be an API call
      // For demo purposes, we'll use the default data

      // Detect some real browser info
      const browserInfo = navigator.userAgent;
      const screenInfo = `${window.screen.width} x ${window.screen.height}`;

      setUserData((prev) => ({
        ...prev,
        browser: browserInfo,
        screenSize: screenInfo,
      }));
    };

    fetchUserData();
  }, []);

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
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                <TabsTrigger value="interactions">Tương tác</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Địa chỉ IP
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{userData.ip}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Trình duyệt
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-md font-medium truncate">
                        {userData.browser}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Nhà mạng
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{userData.provider}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Kết nối
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">
                        {userData.connectionType}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Hệ điều hành
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{userData.os}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Kích thước màn hình
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">
                        {userData.screenSize}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="interactions" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Click số điện thoại
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline space-x-2">
                        <p className="text-3xl font-bold">
                          {userData.phoneClicks}
                        </p>
                        <p className="text-sm text-muted-foreground">lượt</p>
                      </div>
                      <div className="mt-2">
                        <div className="h-2 bg-secondary rounded-full">
                          <div
                            className="h-2 bg-primary rounded-full"
                            style={{
                              width: `${Math.min(userData.phoneClicks * 2, 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Click Zalo
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline space-x-2">
                        <p className="text-3xl font-bold">
                          {userData.zaloClicks}
                        </p>
                        <p className="text-sm text-muted-foreground">lượt</p>
                      </div>
                      <div className="mt-2">
                        <div className="h-2 bg-secondary rounded-full">
                          <div
                            className="h-2 bg-primary rounded-full"
                            style={{
                              width: `${Math.min(userData.zaloClicks * 3, 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Click Messenger
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline space-x-2">
                        <p className="text-3xl font-bold">
                          {userData.messengerClicks}
                        </p>
                        <p className="text-sm text-muted-foreground">lượt</p>
                      </div>
                      <div className="mt-2">
                        <div className="h-2 bg-secondary rounded-full">
                          <div
                            className="h-2 bg-primary rounded-full"
                            style={{
                              width: `${Math.min(userData.messengerClicks * 5, 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Tổng hợp tương tác</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-end justify-around gap-2">
                      <div className="relative h-full flex flex-col justify-end items-center">
                        <div
                          className="w-16 bg-primary rounded-t-md"
                          style={{ height: `${userData.phoneClicks * 2}%` }}
                        ></div>
                        <span className="mt-2">Điện thoại</span>
                        <span className="absolute bottom-[calc(2%*23+8px)]">
                          {userData.phoneClicks}
                        </span>
                      </div>
                      <div className="relative h-full flex flex-col justify-end items-center">
                        <div
                          className="w-16 bg-primary rounded-t-md"
                          style={{ height: `${userData.zaloClicks * 2}%` }}
                        ></div>
                        <span className="mt-2">Zalo</span>
                        <span className="absolute bottom-[calc(2%*15+8px)]">
                          {userData.zaloClicks}
                        </span>
                      </div>
                      <div className="relative h-full flex flex-col justify-end items-center">
                        <div
                          className="w-16 bg-primary rounded-t-md"
                          style={{ height: `${userData.messengerClicks * 2}%` }}
                        ></div>
                        <span className="mt-2">Messenger</span>
                        <span className="absolute bottom-[calc(2%*8+8px)]">
                          {userData.messengerClicks}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
