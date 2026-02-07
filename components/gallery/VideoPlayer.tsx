"use client";

import { useRef, useState, useEffect } from "react";
import type { GalleryMedia } from "@/lib/gallery";

function PlaybackIcon({ state }: { state: "play" | "pause" }) {
  if (state === "pause") {
    return (
      <svg className="w-16 h-16 text-white opacity-90" fill="white" viewBox="0 0 24 24">
        <rect x="6" y="4" width="4" height="16" />
        <rect x="14" y="4" width="4" height="16" />
      </svg>
    );
  }

  return (
    <svg className="w-16 h-16 text-white opacity-90" fill="white" viewBox="0 0 24 24">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  );
}

interface VideoPlayerProps {
  item: GalleryMedia;
  onActivate?: () => void;
  observeVisibility?: boolean;
  wrapperClassName?: string;
  className?: string;
  fit?: "cover" | "contain";
}

export default function VideoPlayer({
  item,
  onActivate,
  observeVisibility = true,
  wrapperClassName,
  className,
  fit = "cover",
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [iconState, setIconState] = useState<"play" | "pause" | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const iconTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMuted = true;

  const syncMute = (video: HTMLVideoElement) => {
    video.defaultMuted = isMuted;
    video.muted = isMuted;
    if (isMuted) {
      video.volume = 0;
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    syncMute(video);
  }, [isMuted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    syncMute(video);

    video
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!observeVisibility) return;

    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            syncMute(video);
            video
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => {});
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [observeVisibility]);

  const showIcon = (state: "play" | "pause") => {
    if (iconTimeoutRef.current) {
      clearTimeout(iconTimeoutRef.current);
    }
    setIconState(state);
    iconTimeoutRef.current = setTimeout(() => setIconState(null), 700);
  };

  useEffect(() => {
    return () => {
      if (iconTimeoutRef.current) {
        clearTimeout(iconTimeoutRef.current);
      }
    };
  }, []);

  const handleVideoClick = () => {
    if (onActivate) {
      onActivate();
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      syncMute(video);
      video
        .play()
        .then(() => {
          setIsPlaying(true);
          showIcon("pause");
        })
        .catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
      showIcon("play");
    }
  };

  return (
    <div
      ref={containerRef}
      className={wrapperClassName ?? "relative w-full cursor-pointer"}
      onClick={handleVideoClick}
    >
      <video
        ref={videoRef}
        src={item.src}
        loop
        muted={isMuted}
        autoPlay
        playsInline
        preload="metadata"
        controls={false}
        className={className ?? `w-full h-auto object-${fit}`}
        style={{ display: "block" }}
      />

      {!isPlaying && !iconState && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20">
          <PlaybackIcon state="play" />
        </div>
      )}

      {iconState && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <PlaybackIcon state={iconState} />
        </div>
      )}
    </div>
  );
}
