import { configureStore } from "@reduxjs/toolkit";
import countriesSlice from "./countriesSlice"

export const store = configureStore({
    reducer: {
        countries: countriesSlice
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;