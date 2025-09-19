import { useEffect } from "react";
import type { Region } from "../types";

export function usePreloadMedia(map: Record<Region, { video: string; poster: string; type?: string }>, {
  aggressiveVideos = false,     // true => preload videos (heavier)
  crossOrigin,
}: { aggressiveVideos?: boolean; crossOrigin?: "" | "anonymous" } = {}) {
  useEffect(() => {
    const tags: HTMLLinkElement[] = [];

    // posters: high-priority (cheap)
    Object.values(map).forEach(({ poster }) => {
      const l = document.createElement("link");
      l.rel = "preload";
      l.as = "image";
      l.href = poster;
      if (crossOrigin) l.crossOrigin = crossOrigin;
      tags.push(l);
    });

    // videos: low or high priority depending on your choice
    Object.values(map).forEach(({ video, type }) => {
      const l = document.createElement("link");
      l.rel = aggressiveVideos ? "preload" : "prefetch";
      l.as = "video";
      l.href = video;
      if (type) l.type = type;
      if (crossOrigin) l.crossOrigin = crossOrigin;
      tags.push(l);
    });

    tags.forEach(t => document.head.appendChild(t));
    return () => tags.forEach(t => t.remove());
  }, [map, aggressiveVideos, crossOrigin]);
}