/*
 * This file contains selectors for accessing project-related data from the
 * Redux store. Selectors are used to derive and access specific pieces of
 * state related to the project list, loading states, and error states.
 *
 * Responsibilities:
 * - Retrieve the project list from the state.
 *   - Filter the list based on search criteria.
 *   - Sort the list based on a specified field.
 *   - Paginate the list based on the current page and page size.
 *   - Retrieve a specific project by ID.
 */

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/store';

// Selector to get the recent projects from the state.
export const selectRecentProjects = createSelector(
  (state: RootState) => state.project.recentProjects,
  (recentProjects) => recentProjects,
);

// Selector to get the user project list from the state.
export const selectUserProjects = createSelector(
  (state: RootState) => state.project.userProjects,
  (userProjects) => userProjects,
);

// Selector to get the share project list from the state.
export const selectSharedProjects = createSelector(
  (state: RootState) => state.project.sharedProjects,
  (sharedProjects) => sharedProjects,
);

export const selectAllProjects = createSelector(
  (state: RootState) => state.project.allProjects,
  (allProjects) => allProjects,
);

export const selectRecentProjectsPagination = createSelector(
  (state: RootState) => state.project.pagination.recentProjects,
  (recentProjectsPagination) => recentProjectsPagination,
);

export const selectUserProjectsPagination = createSelector(
  (state: RootState) => state.project.pagination.userProjects,

  (userProjectsPagination) => userProjectsPagination,
);

export const selectSharedProjectsPagination = createSelector(
  (state: RootState) => state.project.pagination.sharedProjects,
  (sharedProjectsPagination) => sharedProjectsPagination,
);

export const selectAllProjectsPagination = createSelector(
  (state: RootState) => state.project.pagination.allProjects,
  (allProjectsPagination) => allProjectsPagination,
);




