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

import africaHighVideo from "../assets/videos/1080/africa.mp4";
import americasHighVideo from "../assets/videos/1080/americas.mp4";
import asiaHighVideo from "../assets/videos/1080/asia.mp4";
import europeHighVideo from "../assets/videos/1080/europe.mp4";
import oceaniaHighVideo from "../assets/videos/1080/oceania.mp4";
import allHighVideo from "../assets/videos/1080/all.mp4";

import type { Region } from "../types";

export const MEDIA: Record<Region, { video: string; poster: string; type?: string }> = {
  Africa:   { video: africaVideo,   poster: africaPoster,   type: "video/mp4" },
  Americas: { video: americasVideo, poster: americasPoster, type: "video/mp4" },
  Asia:     { video: asiaVideo,     poster: asiaPoster,     type: "video/mp4" },
  Europe:   { video: europeVideo,   poster: europePoster,   type: "video/mp4" },
  Oceania:  { video: oceaniaVideo,  poster: oceaniaPoster,  type: "video/mp4" },
  All:      { video: allVideo,      poster: allPoster,      type: "video/mp4" },
};
export const HIGHRES_MEDIA: Record<Region, { video: string; poster: string; type?: string }> = {
  Africa:   { video: africaHighVideo,   poster: africaPoster,   type: "video/mp4" },
  Americas: { video: americasHighVideo, poster: americasPoster, type: "video/mp4" },
  Asia:     { video: asiaHighVideo,     poster: asiaPoster,     type: "video/mp4" },
  Europe:   { video: europeHighVideo,   poster: europePoster,   type: "video/mp4" },
  Oceania:  { video: oceaniaHighVideo,  poster: oceaniaPoster,  type: "video/mp4" },
  All:      { video: allHighVideo,      poster: allPoster,      type: "video/mp4" },
};