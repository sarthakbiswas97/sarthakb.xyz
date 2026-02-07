"use client";

import { useRef, useState } from "react";
import { Media } from "./page";

export default function Video({ item }: { item: Media }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [iconState, setIconState] = useState<"play" | "pause" | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleVideoClick = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (video.paused) {
      video.play();
      setIsPlaying(true);
      setIconState("pause");
    } else {
      video.pause();
      setIsPlaying(false);
      setIconState("play");
    }
    setTimeout(() => setIconState(null), 700);
  };

  return (
    <div className="relative w-full cursor-pointer" onClick={handleVideoClick}>
      <video
        ref={videoRef}
        src={item.src}
        loop
        muted
        playsInline
        preload="metadata"
        className="w-full h-auto object-cover"
        style={{ display: "block" }}
      />

      {!isPlaying && !iconState && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20">
          <svg
            className="w-16 h-16 text-white opacity-90"
            fill="white"
            viewBox="0 0 24 24"
          >
            <polygon points="5,3 19,12 5,21" />
          </svg>
        </div>
      )}

      {iconState && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {iconState === "play" ? (
            <svg
              className="w-16 h-16 text-white opacity-90"
              fill="white"
              viewBox="0 0 24 24"
            >
              <polygon points="5,3 19,12 5,21" />
            </svg>
          ) : (
            <svg
              className="w-16 h-16 text-white opacity-90"
              fill="white"
              viewBox="0 0 24 24"
            >
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          )}
        </div>
      )}
    </div>
  );
}
