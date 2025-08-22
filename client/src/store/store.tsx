import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "../slices/dataSlice";
import { addVisibility, logger } from "../middlewares/middleware";

export const store = configureStore({
  reducer: {
    data: dataReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(addVisibility, logger),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
