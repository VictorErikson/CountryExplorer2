import africaVideo from "../assets/videos/africaLow.mp4";
import africaPoster from "../assets/videos/africaPoster.jpg";
import americasVideo from "../assets/videos/americas.mp4";
import americasPoster from "../assets/videos/americasPoster.jpg";
import asiaVideo from "../assets/videos/asia.mp4";
import asiaPoster from "../assets/videos/asiaPoster.jpg";
import europeVideo from "../assets/videos/europe.mp4";
import europePoster from "../assets/videos/europePoster.jpg";
import oceaniaVideo from "../assets/videos/oceania.mp4";
import oceaniaPoster from "../assets/videos/oceaniaPoster.jpg";
import allVideo from "../assets/videos/all.mp4";
import allPoster from "../assets/videos/allPoster.jpg";

import type { Region } from "../types";

export const MEDIA: Record<Region, { video: string; poster: string; type?: string }> = {
  Africa:   { video: africaVideo,   poster: africaPoster,   type: "video/mp4" },
  Americas: { video: americasVideo, poster: americasPoster, type: "video/mp4" },
  Asia:     { video: asiaVideo,     poster: asiaPoster,     type: "video/mp4" },
  Europe:   { video: europeVideo,   poster: europePoster,   type: "video/mp4" },
  Oceania:  { video: oceaniaVideo,  poster: oceaniaPoster,  type: "video/mp4" },
  All:      { video: allVideo,      poster: allPoster,      type: "video/mp4" },
};
