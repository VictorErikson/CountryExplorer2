import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { BASE_URL } from "../config/api";
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
  region: string;
  fifa: string,
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

interface CountriesState {
  countries: Country[];
  savedCountries: Country[];
  leaderboard: Leaderboard;
  region: Region;
  status: "Idle" | "Loading" | "Success!" | "Failed";
  error: string | null;
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

const initialState: CountriesState = {
  countries: [],
  savedCountries: loadSavedCountries(),
  leaderboard: loadSavedLeaderboard(),
  region: "All",
  status: "Idle",
  error: null,
};


export const fetchCountries = createAsyncThunk<
  Country[], // Return type when fulfilled
  Region, // Argument type 
  { rejectValue: string } // Thunk API config
>(
    "posts/fetchCountries", 
    async (region, { rejectWithValue }) => { 
        try {
            let res
            if(region === "All"){
              res = await fetch(BASE_URL + "all/" + "?fields=name,capital,currencies,maps,population,flags,region,fifa,borders");
            }else{
              res = await fetch(BASE_URL + "region/" + region + "?fields=name,capital,currencies,maps,population,flags,region,fifa,borders");
            }
            if (!res.ok) return rejectWithValue("Failed to fetch");
            const data: Country[] = await res.json()
            return data
        } catch {
            return rejectWithValue("Network error");
        }
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
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchCountries.fulfilled, (state, action) =>{
            state.status = "Success!";
            state.countries = action.payload;
        })
        .addCase(fetchCountries.pending, (state) =>{
            state.status = "Loading";
        })
        .addCase(fetchCountries.rejected, (state, action) =>{
            state.status = "Failed";
            state.error = action.payload ?? action.error.message ?? "Unknown error";
        })
    }
})

export const  { saveCountry, selectRegion, saveResult } = countriesSlice.actions
export default countriesSlice.reducer