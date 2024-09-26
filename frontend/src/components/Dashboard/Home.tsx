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
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserDetails } from '@store/selectors/userSelectors';
import {
  selectRecentProjects,
  selectRecentProjectsPagination,
} from '@store/selectors';
import {
  setRecentProjects,
  setRecentProjectsPagination,
} from '@store/slices/projectSlice';
import { useGetAllProjectsPaginatedQuery } from '@store/services/project';
// import * as projectUtils from '@utils/dashboard.utils';

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const coolors = ['#F6D277', '#76449A', '#B4B4B4', '#52A0D8', '#F16145'];
  const recentProjects = useSelector(selectRecentProjects);
  const userDetails = useSelector(selectUserDetails);
  const recentProjectsPagination = useSelector(selectRecentProjectsPagination);
  console.log('recent', recentProjects);

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

  function getTimeOfDay() {
    const now = new Date();
    const hours = now.getHours();
    if (hours >= 5 && hours < 12) {
      return 'Morning';
    } else if (hours >= 12 && hours < 18) {
      return 'Afternoon';
    } else if (hours >= 18 && hours < 22) {
      return 'Evening';
    } else {
      return 'Night';
    }
  }

  const { data, refetch, isSuccess } = useGetAllProjectsPaginatedQuery(
    { ...recentProjectsPagination },
    { refetchOnReconnect: true }, // Optional: refetch when reconnecting
  );
  useEffect(() => {
    if (isSuccess) {
      dispatch(setRecentProjects(data as any));
    }
  }, [
    isSuccess,
    data,
    recentProjects.total,
    dispatch,
    recentProjectsPagination,
  ]);

  useEffect(() => {
    refetch();
  }, [recentProjectsPagination]);

  if (recentProjects.status === 'loading') {
    return <div>Loading...</div>;
  }

  if (recentProjects.status === 'failed') {
    return <div>Error loading data</div>;
  }

  const handleGoToProject = (project: any) => {
    // This function handles the click of a project item in the table it recives the id of the project
    // And it navigates to the project page using the id
    navigate(`/editor/${project._id}`, { state: project });
  };

  // BUG: Since the shared projects, all projects tab are underprogress, clicking them currently crashed the app
  // But it also changes the state of isAuthenticated to false and therefore it logs the user out, though
  // The access token remain stable in the local storage.
  // When this happens userDetails disappear, but accessToken is still there

  return (
    <Flex justifyContent="center" minH="100vh" flex={1} p={[4, 8, 12]}>
      <Box maxW="container.lg" w="100%">
        <Image src="/banner3.png" maxW="100%" />
        <Center>
          <Text
            color="white"
            fontFamily="mono"
            fontSize={['lg', 'xl', '2xl']}
            m={5}
            textAlign="center"
          >
            {`Good ${getTimeOfDay()}, ${userDetails?.first_name} ${userDetails?.last_name}`}
          </Text>
        </Center>
        {recentProjects.recentProjects?.length !== 0 && (
          <>
            <Flex alignItems="center" ml={[4, 8, 20]} mt={[4, 8, 10]}>
              <Box w="10px" h="10px" bg="yellow.200" borderRadius="50%" />
              <Text fontFamily="mono" fontSize={['xs', 'sm', 'md']} ml={2}>
                Recent Projects
              </Text>
            </Flex>

            <Box
              ml={[4, 8, 20]}
              mr={[4, 8, 20]}
              mt="15px"
              display="flex"
              overflowX="auto"
              maxW="100%"
              whiteSpace="nowrap"
              p={2}
            >
              {recentProjects.recentProjects?.map((project, index) => {
                const color = getRandomColor(project.project_name);
                return (
                  <Box
                    key={index}
                    display="flex"
                    border="0.5px solid white"
                    borderBottom={`6px solid ${color}`}
                    w={['280px', '300px', '320px']}
                    h="90px"
                    p={6}
                    pt={5}
                    mr={5}
                    alignItems="center"
                    flexShrink={0}
                    cursor="pointer"
                    onClick={() => handleGoToProject(project)}
                  >
                    <Icon as={FaFolder} fontSize="45px" color={color} />
                    <Box ml={5}>
                      <Text
                        fontSize={['xs', 'sm', 'md']}
                        fontFamily="mono"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        overflow="hidden"
                        maxW={['120px', '140px', '150px']}
                      >
                        {project.project_name}
                      </Text>
                      <Text fontSize={['xx-small', 'xs']} fontFamily="mono">
                        {project.lastEdited}
                      </Text>
                    </Box>
                    <Spacer />
                    <Avatar boxSize={['20px', '23px']} bg="gray.500" />
                  </Box>
                );
              })}
            </Box>
          </>
        )}
        <PersonalTable />
      </Box>
    </Flex>
  );
}
