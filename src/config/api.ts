import type { Country } from "../redux/countriesSlice";

export const BASE_URL = "https://api.restcountries.com/countries/v5";

export const RESPONSE_FIELDS =
  "names.common,names.official,codes.alpha_3,flag.url_svg,flag.url_png,flag.description,region,borders,coordinates,capitals,currencies,links.google_maps,links.open_street_maps,population";

export function apiFetch(path: string, init: RequestInit = {}) {
  const url = path.startsWith("?") ? `${BASE_URL}${path}` : `${BASE_URL}/${path}`;
  return fetch(url, {
    ...init,
    headers: {
      ...init.headers,
      Authorization: `Bearer ${import.meta.env.VITE_COUNTRIES_API_KEY}`,
    },
  });
}

export type RawCountry = {
  names: { common: string; official: string };
  codes: { alpha_3: string };
  flag: { url_svg: string; url_png: string; description: string };
  region: string;
  borders: string[];
  coordinates: { lat: number; lng: number };
  capitals: { name: string; coordinates?: { lat: number; lng: number } }[];
  currencies: { code: string; name: string; symbol: string }[];
  links: { google_maps: string; open_street_maps: string };
  population: number;
};

export type ApiResponse = {
  data: {
    objects: RawCountry[];
    meta: { total: number; count: number; limit: number; offset: number; more: boolean };
  };
};

export function adaptCountry(raw: RawCountry): Country {
  const primaryCapital = raw.capitals?.[0];
  return {
    name: { common: raw.names.common, official: raw.names.official, nativeName: {} },
    flags: { svg: raw.flag.url_svg, png: raw.flag.url_png, alt: raw.flag.description },
    capital: raw.capitals?.map((c) => c.name) ?? [],
    capitalInfo: primaryCapital?.coordinates
      ? { latlng: [primaryCapital.coordinates.lat, primaryCapital.coordinates.lng] }
      : undefined,
    region: raw.region,
    latlng: [raw.coordinates.lat, raw.coordinates.lng],
    cca3: raw.codes.alpha_3,
    borders: raw.borders ?? [],
    maps: { googleMaps: raw.links.google_maps, openStreetMaps: raw.links.open_street_maps },
    currencies: Object.fromEntries(raw.currencies.map((c) => [c.code, { name: c.name, symbol: c.symbol }])),
    population: raw.population,
  };
}
