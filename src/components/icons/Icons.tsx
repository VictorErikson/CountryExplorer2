import EuropeIcon from "../../icons/europe.svg?react";
import AsiaIcon from "../../icons/asia.svg?react";
import OceaniaIcon from "../../icons/oceania.svg?react";
import AmericasIcon from "../../icons/americas.svg?react";
import AfricaIcon from "../../icons/africa.svg?react";
import AllIcon from "../../icons/all.svg?react";
import type { ComponentType, SVGProps } from "react";
import type { Region } from "../../types";

export const ICONS: Record<Region, ComponentType<SVGProps<SVGSVGElement>>> = {
  All: AllIcon,
  Europe: EuropeIcon,
  Asia: AsiaIcon,
  Oceania: OceaniaIcon,
  Americas: AmericasIcon,
  Africa: AfricaIcon,
} as const;
