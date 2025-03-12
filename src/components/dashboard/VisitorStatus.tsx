"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VisitorStatusProps {
  siteId: string;
  refreshInterval?: number; // in milliseconds
}

export function VisitorStatus({
  siteId,
  refreshInterval = 10000,
}: VisitorStatusProps) {
  const [activeVisitors, setActiveVisitors] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  const fetchActiveVisitors = async () => {
    setIsLoading(true);
    try {
      // Trong môi trường thực tế, bạn sẽ gọi API để lấy số lượng người dùng đang hoạt động
      const { createSupabaseClient } = await import("@/lib/supabase/client");
      const supabase = createSupabaseClient();

      // Lấy các sự kiện trong 5 phút gần đây
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from("tracking_events")
        .select("ip_address, created_at")
        .eq("site_id", siteId)
        .gt("created_at", fiveMinutesAgo)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Đếm số lượng IP duy nhất
      const uniqueIPs = new Set();
      data?.forEach((event) => {
        if (event.ip_address) {
          uniqueIPs.add(event.ip_address);
        }
      });

      setActiveVisitors(uniqueIPs.size);
    } catch (error) {
      console.error("Error fetching active visitors:", error);
      // Don't change the value on error, just keep the last known value
      // If we don't have a value yet, set to 0
      if (activeVisitors === undefined) {
        setActiveVisitors(0);
      }
    } finally {
      setIsLoading(false);
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    fetchActiveVisitors();

    const intervalId = setInterval(() => {
      fetchActiveVisitors();
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [siteId, refreshInterval]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex justify-between items-center">
          <span>Người dùng đang truy cập</span>
          {activeVisitors > 0 ? (
            <Badge
              variant="default"
              className="bg-green-500 hover:bg-green-600"
            >
              Đang hoạt động
            </Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground">
              Không hoạt động
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-bold">
              {isLoading ? "..." : activeVisitors}
            </p>
            <p className="text-sm text-muted-foreground">người dùng</p>
          </div>
          <div className="text-xs text-muted-foreground">
            Cập nhật:{" "}
            {lastChecked.toLocaleTimeString("vi-VN", {
              timeZone: "Asia/Bangkok",
            })}
          </div>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          Dựa trên hoạt động trong 5 phút qua
        </div>
        <div className="mt-4 pt-2 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Trạng thái:</span>
            <span
              className={
                activeVisitors > 0
                  ? "text-green-500 font-medium"
                  : "text-muted-foreground"
              }
            >
              {activeVisitors > 0
                ? "Có người đang online"
                : "Không có người online"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
