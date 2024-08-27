import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/store';


export const selectRoom = createSelector(
  (state: RootState) => state.sharedProjects.room,
  (room) => room,
);


