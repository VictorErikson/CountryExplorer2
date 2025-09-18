import type { Region } from "../../types";

import AllPng from "../../icons/all.png";
import EuropePng from "../../icons/europe.png";
import AsiaPng from "../../icons/asia.png";
import OceaniaPng from "../../icons/oceania.png";
import AmericasPng from "../../icons/americas.png";
import AfricaPng from "../../icons/africa.png";

export const ICONS: Record<Region, string> = {
  All: AllPng,
  Europe: EuropePng,
  Asia: AsiaPng,
  Oceania: OceaniaPng,
  Americas: AmericasPng,
  Africa: AfricaPng,
} as const;
