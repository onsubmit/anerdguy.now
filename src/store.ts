import { configureStore } from '@reduxjs/toolkit';

import { dialogReducer } from './slices/dialogSlice';
import { fontReducer } from './slices/fontSlice';

export const store = configureStore({
  reducer: {
    dialog: dialogReducer,
    font: fontReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
