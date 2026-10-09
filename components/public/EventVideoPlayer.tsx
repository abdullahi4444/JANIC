"use client";

import React from "react";
import { Play, Video } from "lucide-react";

interface EventVideoPlayerProps {
  videoUrl?: string | null;
  coverImage?: string | null;
  title: string;
}

export function EventVideoPlayer({ videoUrl, coverImage, title }: EventVideoPlayerProps) {
  if (!videoUrl) return null;

  // Determine whether this is a YouTube, Vimeo, or direct video
  const isYouTube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
  const isVimeo = videoUrl.includes("vimeo.com");

  let embedUrl = videoUrl;
  if (isYouTube) {
    if (videoUrl.includes("watch?v=")) {
      const videoId = videoUrl.split("watch?v=")[1]?.split("&")[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (videoUrl.includes("youtu.be/")) {
      const videoId = videoUrl.split("youtu.be/")[1]?.split("?")[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
  } else if (isVimeo) {
    const vimeoId = videoUrl.split("/").filter(Boolean).pop();
    embedUrl = `https://player.vimeo.com/video/${vimeoId}`;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <Video className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-[#08245C] dark:text-white tracking-tight">
            Event Recap Video
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Watch the official highlights and live proceedings recorded during the event.
          </p>
        </div>
      </div>

      <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-xl group">
        {isYouTube || isVimeo ? (
          <iframe
            src={embedUrl}
            title={`${title} Recap Video`}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            controls
            playsInline
            preload="metadata"
            poster={coverImage || undefined}
            className="w-full h-full object-contain bg-black"
          >
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  );
}
