"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "./DateRangePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  addDays,
  startOfDay,
  endOfDay,
  subDays,
  subMonths,
  subWeeks,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";

export type TimeRange =
  | "realtime"
  | "today"
  | "yesterday"
  | "this_week"
  | "last_week"
  | "this_month"
  | "last_month"
  | "custom";

interface TimeRangeSelectorProps {
  onTimeRangeChange: (range: {
    type: TimeRange;
    dateRange?: DateRange;
  }) => void;
}

export function TimeRangeSelector({
  onTimeRangeChange,
}: TimeRangeSelectorProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("realtime");
  const [customDateRange, setCustomDateRange] = useState<
    DateRange | undefined
  >();

  const handleRangeChange = (range: TimeRange) => {
    setSelectedRange(range);

    let dateRange: DateRange | undefined;
    const now = new Date();

    switch (range) {
      case "realtime":
        dateRange = {
          from: subDays(now, 1),
          to: now,
        };
        break;
      case "today":
        dateRange = {
          from: startOfDay(now),
          to: endOfDay(now),
        };
        break;
      case "yesterday":
        const yesterday = subDays(now, 1);
        dateRange = {
          from: startOfDay(yesterday),
          to: endOfDay(yesterday),
        };
        break;
      case "this_week":
        dateRange = {
          from: startOfWeek(now, { weekStartsOn: 1 }),
          to: now,
        };
        break;
      case "last_week":
        const lastWeekStart = startOfWeek(subWeeks(now, 1), {
          weekStartsOn: 1,
        });
        const lastWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
        dateRange = {
          from: lastWeekStart,
          to: lastWeekEnd,
        };
        break;
      case "this_month":
        dateRange = {
          from: startOfMonth(now),
          to: now,
        };
        break;
      case "last_month":
        const lastMonth = subMonths(now, 1);
        dateRange = {
          from: startOfMonth(lastMonth),
          to: endOfMonth(lastMonth),
        };
        break;
      case "custom":
        dateRange = customDateRange;
        break;
    }

    onTimeRangeChange({ type: range, dateRange });
  };

  const handleCustomDateChange = (range: DateRange | undefined) => {
    setCustomDateRange(range);
    if (range?.from && range?.to) {
      setSelectedRange("custom");
      onTimeRangeChange({ type: "custom", dateRange: range });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
      <Select value={selectedRange} onValueChange={handleRangeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Chọn khoảng thời gian" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="realtime">Thời gian thực (30p)</SelectItem>
          <SelectItem value="today">Hôm nay</SelectItem>
          <SelectItem value="yesterday">Hôm qua</SelectItem>
          <SelectItem value="this_week">Tuần này</SelectItem>
          <SelectItem value="last_week">Tuần trước</SelectItem>
          <SelectItem value="this_month">Tháng này</SelectItem>
          <SelectItem value="last_month">Tháng trước</SelectItem>
          <SelectItem value="custom">Tùy chỉnh</SelectItem>
        </SelectContent>
      </Select>

      {selectedRange === "custom" && (
        <DateRangePicker
          dateRange={customDateRange}
          onDateRangeChange={handleCustomDateChange}
        />
      )}
    </div>
  );
}
