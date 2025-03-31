import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { useCallback } from 'react';

import { useAppDispatch } from '../hooks';

export function useDispatch<T>(action: ActionCreatorWithPayload<T>): (value: T) => void {
  const dispatch = useAppDispatch();

  return useCallback(
    (value: T) => {
      dispatch(action(value));
    },
    [action, dispatch],
  );
}
