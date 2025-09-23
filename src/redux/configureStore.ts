import { configureStore } from "@reduxjs/toolkit";
import countriesSlice from "./countriesSlice"

export const store = configureStore({
    reducer: {
        countries: countriesSlice
    }
})

store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem(
    "savedCountries",
    JSON.stringify(state.countries.savedCountries)
  );
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;