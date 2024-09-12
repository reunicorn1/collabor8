/**
 * @description: This file contains the selectors for the sharedProjects slice of the store
 * Responsibilities:
 *   - Retrieve the room from the state.
 *   - Retrieve the invitation count from the state.
 */

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/store';

// Selector to get the room from the state.
export const selectRoom = createSelector(
  (state: RootState) => state.sharedProjects.room,
  (room) => room,
);

// Selector to get the invitation count from the state.
export const selectInvitationCount = createSelector(
  (state: RootState) => state.sharedProjects.invitationCount,
  (invitationCount) => invitationCount,
);
