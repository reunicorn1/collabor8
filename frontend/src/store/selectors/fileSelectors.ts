import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/store';

export const selectFile = createSelector(
  (state: RootState) => state.file.file,
  (file) => file,
);

