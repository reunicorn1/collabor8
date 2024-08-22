import { formatDistanceToNow, parseISO } from 'date-fns';
import {
  useGetAllProjectsPaginatedQuery,
  useLazyGetAllProjectsPaginatedQuery,
} from '@store/services/project';
// import { useState } from 'react';


// This function should compute the last edited time based on the updated_at field
export function computeTimeDiff(time: string) {
  const lastEdited = formatDistanceToNow(parseISO(time), {
    addSuffix: true,
  });
  return lastEdited;
}

// This function should mutate the projects state
export function mutateProjects(projs) {
  if (!projs) {
    console.log('no projects');
    return [];
  }
  return projs?.map((proj) => ({
    name: proj.project_name,
    lastEdited: computeTimeDiff(proj.updated_at),
  }));
}

// takes callback to setState
export function handlePageChange(newPage: number, setPage: (page: number) => void, refetch: () => void) {
  setPage(newPage);
  refetch(); // Refetch data with the new page number
}

//export function SharedProjects() {
//   // This function should fetch the projects shared with the user from the backend
// }

export function setRecentProjectsFromAllProjects(projects, setRecentProjects) {
  const recentProjects = [...projects]
    ?.sort((a, b) => parseISO(b.updated_at) - parseISO(a.updated_at))
    .slice(0, 3);

    setRecentProjects(mutateProjects(recentProjects)); // Directly set the recent projects
}

//export function PersonalProjects() {
//   // This function should fetch the user's personal projects from the backend
// }
