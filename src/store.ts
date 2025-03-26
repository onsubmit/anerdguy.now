import { configureStore } from '@reduxjs/toolkit';

import { dialogReducer } from './slices/dialogSlice';

export const store = configureStore({
  reducer: {
    dialog: dialogReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
