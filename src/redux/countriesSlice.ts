import { createAsyncThunk, createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { apiFetch, adaptCountry, RESPONSE_FIELDS, type ApiResponse } from "../config/api";
import { sleep, backoffDelay } from "../utils/retry";
import type { RootState } from "./configureStore";
import type { Region } from "../types";

export type Country = {
  flags: {
    png: string;
    svg: string;
    alt: string;
  };
  name: {
    common: string;
    official: string;
    nativeName: {
      [key: string]: {
        official: string;
        common: string;
      };
    };
  };
  currencies: {
    [code: string]: {
      name: string;
      symbol: string;
    };
  };
  capital: string[];
  capitalInfo?: {
    latlng: [
      number,
      number
    ]
  },
  region: string;
  latlng: [
      number,
      number
    ]
  cca3: string,
  borders: string[]
  maps: {
    googleMaps: string;
    openStreetMaps: string;
  };
  population: number;
};

export type UserScore = {
  name: string,
  score: number
}

type Leaderboard = {
  Europe: UserScore[];
  Asia: UserScore[];
  Oceania: UserScore[];
  Americas: UserScore[];
  Africa: UserScore[];
};

const EMPTY_LEADERBOARD: Leaderboard = {
  Europe: [],
  Asia: [],
  Oceania: [],
  Americas: [],
  Africa: [],
};

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const COUNTRIES_CACHE_KEY = "countriesCache";

export interface CountriesState {
  countries: Country[];
  savedCountries: Country[];
  leaderboard: Leaderboard;
  region: Region;
  status: "Idle" | "Loading" | "Success!" | "Failed";
  error: string | null;
  loadedRegions: Partial<Record<Region, number>>;
}

function mergeCountries(existing: Country[], incoming: Country[]): Country[] {
  if (incoming.length === 0) return existing;
  const byId = new Map(existing.map((c) => [c.cca3, c]));
  for (const c of incoming) byId.set(c.cca3, c);
  return Array.from(byId.values());
}

function loadSavedCountries(): Country[] {
  const saved = localStorage.getItem("savedCountries");
  if (saved) {
    return JSON.parse(saved) as Country[];
  } else {
    localStorage.setItem("savedCountries", JSON.stringify([]));
    return [];
  }
}
function loadSavedLeaderboard(): Leaderboard {
  const saved = localStorage.getItem("savedLeaderboard");
  if (saved) {
    return JSON.parse(saved) as Leaderboard;
  } else {
    localStorage.setItem("savedLeaderboard", JSON.stringify(EMPTY_LEADERBOARD));
    return EMPTY_LEADERBOARD;
  }
}

function loadCountriesCache(): { countries: Country[]; loadedRegions: Partial<Record<Region, number>> } {
  const raw = localStorage.getItem(COUNTRIES_CACHE_KEY);
  if (!raw) return { countries: [], loadedRegions: {} };
  try {
    const parsed = JSON.parse(raw) as {
      countries?: Country[];
      loadedRegions?: Partial<Record<Region, number>>;
    };
    const now = Date.now();
    const loadedRegions: Partial<Record<Region, number>> = {};
    for (const [region, ts] of Object.entries(parsed.loadedRegions ?? {})) {
      if (typeof ts === "number" && now - ts < CACHE_TTL_MS) {
        loadedRegions[region as Region] = ts;
      }
    }
    if (Object.keys(loadedRegions).length === 0) return { countries: [], loadedRegions: {} };
    return {
      countries: Array.isArray(parsed.countries) ? parsed.countries : [],
      loadedRegions,
    };
  } catch {
    return { countries: [], loadedRegions: {} };
  }
}

const countriesCache = loadCountriesCache();

const initialState: CountriesState = {
  countries: countriesCache.countries,
  savedCountries: loadSavedCountries(),
  leaderboard: loadSavedLeaderboard(),
  region: "Europe",
  status: "Idle",
  error: null,
  loadedRegions: countriesCache.loadedRegions,
};


export const fetchCountries = createAsyncThunk<
  Country[], 
  Region, 
  { rejectValue: string; state: RootState } 
>(
    "posts/fetchCountries",
    async (region, { rejectWithValue, signal }) => {
        const fetchWithRetry = async (path: string) => {
          let attempt = 0;
          while (!signal.aborted) {
            try {
              const res = await apiFetch(path, { signal });
              if (res.ok || res.status === 404) return res;
            } catch {
              if (signal.aborted) throw new DOMException("Aborted", "AbortError");
            }
            attempt++;
            await sleep(backoffDelay(attempt), signal);
          }
          throw new DOMException("Aborted", "AbortError");
        };

        try {
            if(region === "All"){
              const objects = [];
              let offset = 0;
              while (true) {
                const res = await fetchWithRetry(`?response_fields=${RESPONSE_FIELDS}&limit=100&offset=${offset}`);
                if (!res.ok) return rejectWithValue("Failed to fetch");
                const json: ApiResponse = await res.json();
                objects.push(...json.data.objects);
                if (!json.data.meta.more) break;
                offset += 100;
              }
              return objects.map(adaptCountry);
            }else{
              const res = await fetchWithRetry(`region/${region}?response_fields=${RESPONSE_FIELDS}&limit=100`);
              if (!res.ok) return rejectWithValue("Failed to fetch");
              const json: ApiResponse = await res.json();
              return json.data.objects.map(adaptCountry);
            }
        } catch (err) {
            if ((err as Error)?.name === "AbortError") throw err;
            return rejectWithValue("Network error");
        }
    },
    {

      condition: (region, { getState }) => {
        const { loadedRegions } = getState().countries;
        const now = Date.now();
        const isFresh = (ts?: number) => ts !== undefined && now - ts < CACHE_TTL_MS;
        return !(isFresh(loadedRegions.All) || isFresh(loadedRegions[region]));
      },
    }
)

const countriesSlice = createSlice({
    name: "countriesSlice",
    initialState,
    reducers: {
        saveCountry: (state, action: PayloadAction<Country>) => {
          const newCountry = action.payload;
          const exists = state.savedCountries.some(country => country.name.common === newCountry.name.common);
          if (!exists) {state.savedCountries.push(newCountry)
          }else{
            const newList = state.savedCountries.filter(country => country.name.common !== newCountry.name.common);
            state.savedCountries = newList;
          };
        },
        selectRegion: (state, action: PayloadAction<Region>) => {state.region = action.payload},
        saveResult: (state, action: PayloadAction<{ region: Region; entry: UserScore }>) => {
          const { region, entry } = action.payload;
          if(region !== "All") state.leaderboard[region].push(entry);
        },

        upsertCountries: (state, action: PayloadAction<Country[]>) => {
          state.countries = mergeCountries(state.countries, action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchCountries.fulfilled, (state, action) =>{
            state.status = "Success!";
            state.countries = mergeCountries(state.countries, action.payload);
            state.loadedRegions[action.meta.arg] = Date.now();
        })
        .addCase(fetchCountries.pending, (state) =>{
            state.status = "Loading";
        })
        .addCase(fetchCountries.rejected, (state, action) =>{
            if (action.meta.aborted) return;
            state.status = "Failed";
            state.error = action.payload ?? action.error.message ?? "Unknown error";
        })
    }
})

export const selectCountriesForRegion = createSelector(
  (state: CountriesState) => state.countries,
  (state: CountriesState) => state.region,
  (countries, region) => (region === "All" ? countries : countries.filter((c) => c.region === region))
);

export const  { saveCountry, selectRegion, saveResult, upsertCountries } = countriesSlice.actions
export default countriesSlice.reducer
