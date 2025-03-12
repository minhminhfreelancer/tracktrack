"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  BarChart3,
  Settings,
  User,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import {
  TimeRangeSelector,
  TimeRange,
} from "@/components/dashboard/TimeRangeSelector";
import { DateRange } from "react-day-picker";
import { VisitorStatus } from "@/components/dashboard/VisitorStatus";

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
  lastUpdated?: Date;
}

interface TimeRangeState {
  type: TimeRange;
  dateRange?: DateRange;
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
    lastUpdated: new Date(),
  });

  const [timeRange, setTimeRange] = useState<TimeRangeState>({
    type: "realtime",
    dateRange: {
      from: new Date(new Date().getTime() - 30 * 60000), // 30 minutes ago
      to: new Date(),
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(timeRange.type === "realtime");

  // State for site ID
  const [siteId, setSiteId] = useState<string>("");

  // Get site ID on component mount
  useEffect(() => {
    const getSiteId = async () => {
      try {
        const { createSupabaseClient } = await import("@/lib/supabase/client");
        const supabase = createSupabaseClient();

        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data: sites } = await supabase
          .from("sites")
          .select("id")
          .eq("user_id", user.id)
          .limit(1);

        if (sites && sites.length > 0) {
          setSiteId(sites[0].id);
        }
      } catch (error) {
        console.error("Error getting site ID:", error);
      }
    };

    getSiteId();
  }, []);

  useEffect(() => {
    // Fetch real user data from Supabase
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // Get Supabase client
        const { createSupabaseClient } = await import("@/lib/supabase/client");
        const supabase = createSupabaseClient();

        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        // Get user's site
        const { data: sites, error: sitesError } = await supabase
          .from("sites")
          .select("*")
          .eq("user_id", user.id)
          .limit(1);

        if (sitesError) throw sitesError;
        if (!sites || sites.length === 0) throw new Error("No sites found");

        const siteId = sites[0].id;

        // Prepare date range for query
        let fromDate: string;
        const toDate = new Date().toISOString();

        switch (timeRange.type) {
          case "realtime":
            fromDate = new Date(Date.now() - 30 * 60000).toISOString(); // 30 minutes ago
            break;
          case "today":
            fromDate = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
            break;
          case "yesterday":
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            yesterday.setHours(0, 0, 0, 0);
            fromDate = yesterday.toISOString();
            break;
          case "this_week":
            const thisWeek = new Date();
            thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay() + 1); // Monday
            thisWeek.setHours(0, 0, 0, 0);
            fromDate = thisWeek.toISOString();
            break;
          case "last_week":
            const lastWeek = new Date();
            lastWeek.setDate(lastWeek.getDate() - lastWeek.getDay() - 6); // Last Monday
            lastWeek.setHours(0, 0, 0, 0);
            fromDate = lastWeek.toISOString();
            break;
          case "this_month":
            const thisMonth = new Date();
            thisMonth.setDate(1);
            thisMonth.setHours(0, 0, 0, 0);
            fromDate = thisMonth.toISOString();
            break;
          case "last_month":
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            lastMonth.setDate(1);
            lastMonth.setHours(0, 0, 0, 0);
            fromDate = lastMonth.toISOString();
            break;
          case "custom":
            if (timeRange.dateRange?.from) {
              const customFrom = new Date(timeRange.dateRange.from);
              customFrom.setHours(0, 0, 0, 0);
              fromDate = customFrom.toISOString();
            } else {
              fromDate = new Date(
                Date.now() - 7 * 24 * 60 * 60 * 1000,
              ).toISOString(); // Default to 7 days ago
            }
            break;
          default:
            fromDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // Default to 24 hours ago
        }

        // Get tracking events for the site within date range
        const { data: events, error: eventsError } = await supabase
          .from("tracking_events")
          .select("*")
          .eq("site_id", siteId)
          .gte("created_at", fromDate)
          .lte("created_at", toDate);

        if (eventsError) throw eventsError;

        // Process events to extract metrics
        let phoneClicks = 0;
        let zaloClicks = 0;
        let messengerClicks = 0;
        let latestUserAgent = "";
        let latestIP = "";
        let providers = new Map();
        let connectionTypes = new Map();
        let operatingSystems = new Map();
        let screenSizes = new Map();

        events.forEach((event) => {
          // Count click events
          if (event.event_type === "click") {
            const clickType = event.event_data?.type;
            if (clickType === "phone") phoneClicks++;
            else if (clickType === "zalo") zaloClicks++;
            else if (clickType === "messenger") messengerClicks++;
          }

          // Track latest user info
          if (event.user_agent && !latestUserAgent) {
            latestUserAgent = event.user_agent;
          }

          if (event.ip_address && !latestIP) {
            latestIP = event.ip_address;
          }

          // Count providers, connection types, OS, screen sizes
          const eventData = event.event_data;
          if (eventData) {
            // Provider (simplified for demo)
            const provider = eventData.provider || "Unknown";
            providers.set(provider, (providers.get(provider) || 0) + 1);

            // Connection type
            const connectionType = eventData.connectionType || "Unknown";
            connectionTypes.set(
              connectionType,
              (connectionTypes.get(connectionType) || 0) + 1,
            );

            // OS
            const os = eventData.os || "Unknown";
            operatingSystems.set(os, (operatingSystems.get(os) || 0) + 1);

            // Screen size
            if (eventData.screenWidth && eventData.screenHeight) {
              const screenSize = `${eventData.screenWidth} x ${eventData.screenHeight}`;
              screenSizes.set(
                screenSize,
                (screenSizes.get(screenSize) || 0) + 1,
              );
            }
          }
        });

        // Get most common values
        const getMostCommon = (map: Map<string, number>) => {
          let maxCount = 0;
          let mostCommon = "Unknown";

          map.forEach((count, value) => {
            if (count > maxCount) {
              maxCount = count;
              mostCommon = value;
            }
          });

          return mostCommon;
        };

        // Detect real browser info as fallback
        const browserInfo = latestUserAgent || navigator.userAgent;
        const screenInfo =
          getMostCommon(screenSizes) ||
          `${window.screen.width} x ${window.screen.height}`;

        setUserData({
          ip: latestIP || "Unknown",
          browser: browserInfo,
          provider: getMostCommon(providers),
          connectionType: getMostCommon(connectionTypes),
          os: getMostCommon(operatingSystems),
          screenSize: screenInfo,
          phoneClicks: phoneClicks,
          zaloClicks: zaloClicks,
          messengerClicks: messengerClicks,
          lastUpdated: new Date(),
        });
      } catch (error) {
        console.error("Error fetching data:", error);

        // Fallback to last known data or zeros if error occurs
        console.error(
          "Không thể lấy dữ liệu từ server. Hiển thị dữ liệu cũ hoặc trống.",
        );

        // Keep the last known data instead of generating random values
        if (!userData.lastUpdated) {
          // Only set default values if we don't have any data yet
          const browserInfo = navigator.userAgent;
          const screenInfo = `${window.screen.width} x ${window.screen.height}`;

          setUserData({
            ip: "Không có dữ liệu",
            browser: browserInfo,
            provider: "Không có dữ liệu",
            connectionType: "Không có dữ liệu",
            os: "Không có dữ liệu",
            screenSize: screenInfo,
            phoneClicks: 0,
            zaloClicks: 0,
            messengerClicks: 0,
            lastUpdated: new Date(),
          });
        } else {
          // Just update the timestamp if we already have data
          setUserData({
            ...userData,
            lastUpdated: new Date(),
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();

    // Set up auto-refresh for realtime view
    let intervalId: NodeJS.Timeout | null = null;

    if (autoRefresh && timeRange.type === "realtime") {
      intervalId = setInterval(() => {
        fetchUserData();
      }, 30000); // Refresh every 30 seconds for realtime view
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [timeRange, autoRefresh]);

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
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Dữ liệu hiển thị là dữ liệu thực từ cơ sở dữ liệu. Nếu không có dữ
            liệu hoặc có lỗi, hệ thống sẽ hiển thị "Không có dữ liệu" thay vì
            tạo dữ liệu ngẫu nhiên.
          </AlertDescription>
        </Alert>

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">Thống kê người dùng</h2>
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTimeRange({ ...timeRange })}
                title="Làm mới dữ liệu"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <TimeRangeSelector
              onTimeRangeChange={(newRange) => {
                setTimeRange(newRange);
                setAutoRefresh(newRange.type === "realtime");
              }}
            />

            {timeRange.type === "realtime" && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="mr-2"
                  />
                  Tự động làm mới
                </label>
              </div>
            )}
          </div>
        </div>

        {userData.lastUpdated && (
          <div className="mb-6 text-sm text-muted-foreground">
            Cập nhật lần cuối:{" "}
            {userData.lastUpdated.toLocaleString("vi-VN", {
              timeZone: "Asia/Bangkok",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
        )}

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
                  {siteId && (
                    <VisitorStatus siteId={siteId} refreshInterval={10000} />
                  )}

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
