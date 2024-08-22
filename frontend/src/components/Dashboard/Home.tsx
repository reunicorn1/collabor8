import {
  Image,
  Text,
  Flex,
  Box,
  Icon,
  Spacer,
  Avatar,
  Center,
} from '@chakra-ui/react';
import { FaFolder } from 'react-icons/fa';
import PersonalTable from './PersonalTable';
import {
  useGetAllProjectsPaginatedQuery,
  useLazyGetAllProjectsPaginatedQuery,
} from '@store/services/project';
import { useState, useEffect } from 'react';
import * as projectUtils from '@utils/dashboard.utils';
export default function Home() {
  const coolors = ['#F6D277', '#76449A', '#B4B4B4', '#52A0D8', '#F16145'];
  const [userProjects, setUserProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('-updated_at');
  const [limit, setLimit] = useState(10);
  const [recentProjects, setRecentProjects] = useState([]);
  // const [personalProjects, setPersonalProjects] = useState([]);
  // const [sharedProjects, setSharedProjects] = useState([]);
  const [fetch, setFetch] = useState(true);
  const [error, setError] = useState(null);

  function hashStringToIndex(str: string, arrayLength: number): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; // Convert to a 32-bit integer
    }
    return Math.abs(hash) % arrayLength;
  }

  function getRandomColor(projectName: string): string {
    const index = hashStringToIndex(projectName, coolors.length);
    return coolors[index];
  }

  const { data, err, isFetching, refetch } = useGetAllProjectsPaginatedQuery(
    { page, limit, sort },
    // { refetchOnReconnect: true }, // Optional: refetch when reconnecting
  );
  useEffect(() => {
    if (fetch) {
      if (err) {
        setError(err);
      }

      if (data) {
        console.log('data', data);
        const mutatedProjects = projectUtils.mutateProjects(data);
        console.log('mutatedProjects', mutatedProjects);
        setUserProjects(mutatedProjects);
        projectUtils.setRecentProjectsFromAllProjects(data, setRecentProjects); // Set recent projects here
        setFetch(false);
      }
    }
  }, [data, err, fetch]);

  //   function getRandomColor(): string {
  //     const randomIndex = Math.floor(Math.random() * coolors.length);
  //     return coolors[randomIndex];
  //   }

  //   function useData(data) {
  //     const mutatedProjects = projectUtils.mutateProjects(data);
  //     setUserProjects(mutatedProjects);
  //     projectUtils.setRecentProjectsFromAllProjects(data, setRecentProjects); // Set recent projects here
  //   }

  //   function useTrigger(page, limit, sort) {
  //     getProjectsPaginated({ page, limit, sort })
  //       .unwrap()
  //       .then((res) => {
  //         // const { total, projects, page, limit, totalPages } = res;
  //         const mutatedProjects = projectUtils.mutateProjects(res);
  //         setUserProjects(mutatedProjects);
  //         projectUtils.setRecentProjectsFromAllProjects(res, setRecentProjects); // Set recent projects here
  //       })
  //       .catch((error) => {
  //         console.error('Error fetching projects:', error);
  //       });
  //   }
  //   useData(data);
  // useEffect(() => {
  //   console.log('page:', page);
  //   if (data && page < 2) {
  //     useData(data);

  //     setPage(page + 1);
  //   } else {
  //     useTrigger(page, limit, sort);
  //   }
  // }, [page, limit, sort, data]);

  // This is a list for demonstration purposes in a static version
  const projects = [
    { name: 'Project 1', lastEdited: '2 days ago' },
    { name: 'Project 2', lastEdited: '5 days ago' },
    { name: 'Project 3', lastEdited: '1 week ago' },
    { name: 'Project 3', lastEdited: '1 week ago' },
    { name: 'Project 3', lastEdited: '1 week ago' },
    { name: 'Project 3', lastEdited: '1 week ago' },
    { name: 'Project 3', lastEdited: '1 week ago' },
    { name: 'Project 3', lastEdited: '1 week ago' },

  ];

  return (
    <Flex justifyContent="center" h="100vh">
      <Box>
        <Image src="/banner3.png" />
        <Center>
          <Text color="white" fontFamily="mono" fontSize="2xl" m={5}>
            Good morning, John Doe
          </Text>
        </Center>

        <Flex alignItems="center" ml={20} mt={10}>
          <Box w="10px" h="10px" bg="yellow.200" borderRadius="50%" />
          <Text fontFamily="mono" fontSize="xs" ml={2}>
            Recent Projects
          </Text>
        </Flex>
        <Box
          ml={20}
          mt="15px"
          display="flex"
          overflowX="scroll"
          maxW="1020"
          whiteSpace="nowrap"
        >
          {/* top 3 recent projects will be shown here */}
          {projects?.map((project, index) => {
            const color = getRandomColor(project.name);
            return (
              <Box
                key={index}
                display="flex"
                border="0.5px solid white"
                borderBottom={`6px solid ${color}`}
                w="320px"
                h="90px"
                p={6}
                pt={5}
                mr={5}
                alignItems="center"
                flexShrink={0}
                cursor="pointer"
              >
                <Icon as={FaFolder} fontSize="45px" color={color} />
                <Box ml={5}>
                  <Text fontSize="md" fontFamily="mono">
                    {project.name}
                  </Text>
                  <Text fontSize="xs" fontFamily="mono">
                    {project.lastEdited}
                  </Text>
                </Box>
                <Spacer />
                {/* The avatar of the owner */}
                <Avatar boxSize="23px" bg="gray.500" />
              </Box>
            );
          })}
        </Box>
        {/* projects table */}
        <PersonalTable />
      </Box>
    </Flex>
  );
}
