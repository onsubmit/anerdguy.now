import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DialogType } from '../components/dialog';
import { RootState } from '../store';

export interface DialogState {
  type: DialogType | null;
}

const initialState: DialogState = {
  type: null,
};

export const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    open: (state, action: PayloadAction<DialogType>) => {
      state.type = action.payload;
    },
    close: (state, action: PayloadAction<DialogType | null>) => {
      state.type = action.payload ?? null;
    },
  },
});

export const { open, close } = dialogSlice.actions;

export const selectDialog = (state: RootState): DialogType | null => state.dialog.type;

export const dialogReducer = dialogSlice.reducer;
