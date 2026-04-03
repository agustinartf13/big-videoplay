"use client";

import { useEffect, useRef, useState } from "react";

type Video = {
  id: number;
  title: string;
  url: string;
};

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // ✅ LOCAL VIDEO
  const videos: Video[] = [
    {
      id: 1,
      title: "Bunny",
      url: "/videos/1.mp4",
    },
  ];

  const [current] = useState<Video>(videos[0]);
  const [hasInteracted, setHasInteracted] = useState(false);

  // ✅ ENTER FULLSCREEN
  const enterFullscreen = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (!document.fullscreenElement) {
        await video.requestFullscreen();
      }
    } catch (err) {
      console.log("Fullscreen error:", err);
    }
  };

  // ✅ USER INTERACTION (WAJIB untuk autoplay + fullscreen)
  const handleUserInteraction = async () => {
    setHasInteracted(true);

    const video = videoRef.current;
    if (!video) return;

    try {
      await video.play();
      await enterFullscreen();
    } catch (e) {
      console.log("Play error:", e);
    }
  };

  // ✅ LOAD VIDEO
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.src = current.url;
    video.load();

    video
      .play()
      .then(() => {
        if (hasInteracted) enterFullscreen();
      })
      .catch(() => {});
  }, [current, hasInteracted]);

  // ✅ FORCE FULLSCREEN (kalau user keluar, masuk lagi)
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && hasInteracted) {
        enterFullscreen();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [hasInteracted]);

  // ✅ REPEAT VIDEO MANUAL (loop terus + tetap fullscreen)
  const handleEnded = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;

    video.play().then(() => {
      if (hasInteracted) {
        enterFullscreen();
      }
    });
  };

  return (
    <div
      className="relative w-full h-screen bg-black"
      onClick={handleUserInteraction}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted
        playsInline
        preload="auto"
        autoPlay
        onEnded={handleEnded}
      />

      {!hasInteracted && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-xl font-semibold">
          Tap to Start
        </div>
      )}
    </div>
  );
}
