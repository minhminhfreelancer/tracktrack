import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface TrackingOption {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface TrackingOptionsProps {
  options?: TrackingOption[];
  onOptionsChange?: (options: TrackingOption[]) => void;
}

const defaultOptions: TrackingOption[] = [
  {
    id: "visitor_metrics",
    name: "Visitor Metrics",
    description:
      "Track basic visitor information including IP address and browser details",
    enabled: true,
  },
  {
    id: "network_provider",
    name: "Network Provider",
    description: "Collect information about visitor's network provider",
    enabled: true,
  },
  {
    id: "connection_type",
    name: "Connection Type",
    description: "Track whether visitors are using WiFi, 3G, 4G, etc.",
    enabled: true,
  },
  {
    id: "os_version",
    name: "Operating System",
    description: "Collect OS type and version information",
    enabled: true,
  },
  {
    id: "screen_dimensions",
    name: "Screen Dimensions",
    description: "Track visitor's device screen size and resolution",
    enabled: true,
  },
  {
    id: "phone_clicks",
    name: "Phone Call Clicks",
    description: "Track when visitors click on phone number links",
    enabled: true,
  },
  {
    id: "zalo_clicks",
    name: "Zalo Link Clicks",
    description: "Track when visitors click on Zalo messaging links",
    enabled: true,
  },
  {
    id: "messenger_clicks",
    name: "Messenger Link Clicks",
    description: "Track when visitors click on Facebook Messenger links",
    enabled: true,
  },
];

const TrackingOptions = ({
  options = defaultOptions,
  onOptionsChange,
}: TrackingOptionsProps) => {
  const [trackingOptions, setTrackingOptions] =
    React.useState<TrackingOption[]>(options);
  const [enableAll, setEnableAll] = React.useState(
    options.every((option) => option.enabled),
  );

  const handleToggleOption = (id: string) => {
    const updatedOptions = trackingOptions.map((option) => {
      if (option.id === id) {
        return { ...option, enabled: !option.enabled };
      }
      return option;
    });

    setTrackingOptions(updatedOptions);
    setEnableAll(updatedOptions.every((option) => option.enabled));

    if (onOptionsChange) {
      onOptionsChange(updatedOptions);
    }
  };

  const handleToggleAll = () => {
    const newEnableAll = !enableAll;
    setEnableAll(newEnableAll);

    const updatedOptions = trackingOptions.map((option) => ({
      ...option,
      enabled: newEnableAll,
    }));

    setTrackingOptions(updatedOptions);

    if (onOptionsChange) {
      onOptionsChange(updatedOptions);
    }
  };

  return (
    <Card className="w-full max-w-md bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Tracking Options</CardTitle>
        <CardDescription>
          Select which metrics and interactions you want to track on your
          website
        </CardDescription>
        <div className="flex items-center space-x-2 pt-2">
          <Switch
            id="enable-all"
            checked={enableAll}
            onCheckedChange={handleToggleAll}
          />
          <Label htmlFor="enable-all" className="font-medium cursor-pointer">
            {enableAll ? "Disable All" : "Enable All"}
          </Label>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4">
            {trackingOptions.map((option) => (
              <div
                key={option.id}
                className={cn(
                  "flex items-start space-x-3 rounded-md border p-4",
                  option.enabled
                    ? "border-primary/50 bg-primary/5"
                    : "border-muted",
                )}
              >
                <Checkbox
                  id={option.id}
                  checked={option.enabled}
                  onCheckedChange={() => handleToggleOption(option.id)}
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
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Reset to Default</Button>
        <Button>Apply Changes</Button>
      </CardFooter>
    </Card>
  );
};

export default TrackingOptions;
