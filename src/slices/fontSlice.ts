import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { FontName } from '../fonts';
import { getCachedItem } from '../localStorage';
import { RootState } from '../store';

export type FontState = {
  name: FontName;
};

const initialState: FontState = {
  name: getCachedItem('font') ?? 'JetBrains Mono',
};

export const fontSlice = createSlice({
  name: 'font',
  initialState,
  reducers: {
    setFont: (state, action: PayloadAction<FontName>) => {
      state.name = action.payload;
    },
  },
});

export const { setFont } = fontSlice.actions;
export const fontReducer = fontSlice.reducer;
export const selectFont = (state: RootState): FontName => state.font.name;
