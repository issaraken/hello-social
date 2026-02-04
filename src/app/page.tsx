"use client";

import { useState } from "react";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import ChatWindow from "@components/ChatWindow";
import BroadcastDialog from "@components/BroadcastDialog";
import { Button } from "@/components/ui/button";
import { cn } from "@lib/utils";

type DeviceSize = "desktop" | "tablet" | "mobile";

const deviceSizes: Record<DeviceSize, { width: string; height: string }> = {
  desktop: {
    width: "w-full max-w-4xl",
    height: "h-[700px] max-h-[calc(100vh-100px)]",
  },
  tablet: {
    width: "w-full max-w-[768px]",
    height: "h-[600px] max-h-[calc(100vh-100px)]",
  },
  mobile: {
    width: "w-full max-w-[375px]",
    height: "h-[667px] max-h-[calc(100vh-100px)]",
  },
};

const deviceIcons: Record<DeviceSize, React.ReactNode> = {
  desktop: <Monitor className="w-5 h-5" />,
  tablet: <Tablet className="w-5 h-5" />,
  mobile: <Smartphone className="w-5 h-5" />,
};

const Home = () => {
  const [device, setDevice] = useState<DeviceSize>("desktop");

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-green-100 dark:from-zinc-900 dark:to-zinc-800 flex flex-col items-center p-4">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1 bg-white dark:bg-zinc-800 rounded-lg p-1 shadow-md">
          {(["desktop", "tablet", "mobile"] as DeviceSize[]).map((size) => (
            <Button
              key={size}
              variant={device === size ? "default" : "ghost"}
              size="icon"
              onClick={() => setDevice(size)}
              className={cn(
                device === size && "bg-green-500 hover:bg-green-600"
              )}
              title={size.charAt(0).toUpperCase() + size.slice(1)}
            >
              {deviceIcons[size]}
            </Button>
          ))}
        </div>

        <BroadcastDialog />
      </div>

      <div
        className={cn(
          deviceSizes[device].width,
          deviceSizes[device].height,
          "transition-all duration-300"
        )}
      >
        <ChatWindow className="h-full" />
      </div>
    </div>
  );
};

export default Home;
