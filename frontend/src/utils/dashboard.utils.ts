import { formatDistanceToNow, parseISO } from 'date-fns';
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
    ...proj,
    lastEdited: computeTimeDiff(proj.updated_at),
  }));
}

//export function SharedProjects() {
//   // This function should fetch the projects shared with the user from the backend
// }

export function setRecentProjectsFromAllProjects(projects) {
  console.log('Setting recent projects', projects);
  const recentProjects = [...projects]
    ?.sort(
      (a, b) =>
        (parseISO(b.updated_at) as any) - (parseISO(a.updated_at) as any),
    )
    .slice(0, 5);

  return mutateProjects(recentProjects); // Directly set the recent projects
}
