import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useGetAllProjectsPaginatedQuery } from '@store/services/project';




export const DashboardContext = createContext<ProjectsContextProps | null>(null);

interface DashboardProps {
  children: ReactNode;
}

 const { data, err, isFetching, refetch } = useGetAllProjectsPaginatedQuery(
    { page, limit, sort },
    { refetchOnReconnect: true }, // Optional: refetch when reconnecting
  );

  useEffect(() => {
    if (isFetching) {
      if (err) {
        setError(err);
      }

      if (data?.projects) {
        // why is data only projects?
        console.log('data', data);
        const mutatedProjects = projectUtils.mutateProjects(data?.projects);
        console.log('mutatedProjects', mutatedProjects);
        setUserProjects(mutatedProjects);
        projectUtils.setRecentProjectsFromAllProjects(
          data?.projects,
          setRecentProjects,
        ); // Set recent projects here
      }
    }
  }, [data, err, isFetching]);


export const DashBoardFC: React.FC<DashboardProps> = ({ children }) => {
  const [recentProjects, setRecentProjects] = useState<recentProjects>({
    recentProjects: [],
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
  });

  const [userProjects, setUserProjects] = useState<userProjects>({
    userProjects: [],
    page: 1,
    limit: 10,
    total: 0,
    sort: '-created_at',
    totalPages: 0,
  });

  const [sharedProjects, setSharedProjects] = useState<sharedProjects>({
    sharedProjects: [],
    page: 1,
    limit: 10,
    total: 0,
    sort: '-created_at',
    totalPages: 0,
  });

  useEffect(() => {
    // fetchRecentProjects();
    // fetchUserProjects();
    // fetchSharedProjects();
  }, []);





}

