import { configureStore } from "@reduxjs/toolkit";
import countriesSlice from "./countriesSlice"
import type { Country, CountriesState } from "./countriesSlice"

export const store = configureStore({
    reducer: {
        countries: countriesSlice
    }
})

let lastCountries: Country[] | null = null;
let lastLoadedRegions: CountriesState["loadedRegions"] | null = null;

store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem(
    "savedCountries",
    JSON.stringify(state.countries.savedCountries)
  );
  if (
    state.countries.countries !== lastCountries ||
    state.countries.loadedRegions !== lastLoadedRegions
  ) {
    lastCountries = state.countries.countries;
    lastLoadedRegions = state.countries.loadedRegions;
    localStorage.setItem(
      "countriesCache",
      JSON.stringify({
        countries: state.countries.countries,
        loadedRegions: state.countries.loadedRegions,
        savedAt: Date.now(),
      })
    );
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;