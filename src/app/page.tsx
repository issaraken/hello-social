"use client";

import { useState } from "react";
import ChatWindow from "@components/ChatWindow";
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

const DeviceIcon = ({ type }: { type: DeviceSize }) => {
  if (type === "desktop") {
    return (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    );
  }
  if (type === "tablet") {
    return (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    );
  }
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
    </svg>
  );
};

const Home = () => {
  const [device, setDevice] = useState<DeviceSize>("desktop");

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-green-100 dark:from-zinc-900 dark:to-zinc-800 flex flex-col items-center p-4">
      <div className="flex items-center gap-1 mb-4 bg-white dark:bg-zinc-800 rounded-lg p-1 shadow-md">
        {(["desktop", "tablet", "mobile"] as DeviceSize[]).map((size) => (
          <button
            key={size}
            onClick={() => setDevice(size)}
            className={cn(
              "p-2 rounded-md transition-colors",
              device === size
                ? "bg-green-500 text-white"
                : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700"
            )}
            title={size.charAt(0).toUpperCase() + size.slice(1)}
          >
            <DeviceIcon type={size} />
          </button>
        ))}
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
