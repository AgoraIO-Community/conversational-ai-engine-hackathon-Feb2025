"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import VideoCall with no SSR
const VideoCall = dynamic(() => import("./VideoCall"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <span className="ml-3 text-white">Loading video call component...</span>
    </div>
  ),
});

export default function ClientVideoCall({
  channelName,
  isDoctor,
  aiAssistantEnabled,
  onAiToggle,
  selectedLanguage,
  selectedVoice,
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    console.log("ClientVideoCall: Mounting component...");
    setIsMounted(true);
    return () => {
      console.log("ClientVideoCall: Unmounting component...");
      setIsMounted(false);
    };
  }, []);

  if (!isMounted) {
    console.log("ClientVideoCall: Waiting for mount...");
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-white">
          Initializing client-side component...
        </span>
      </div>
    );
  }

  console.log("ClientVideoCall: Rendering VideoCall component...");
  return (
    <VideoCall
      channelName={channelName}
      isDoctor={isDoctor}
      aiAssistantEnabled={aiAssistantEnabled}
      onAiToggle={onAiToggle}
      selectedLanguage={selectedLanguage}
      selectedVoice={selectedVoice}
    />
  );
}
