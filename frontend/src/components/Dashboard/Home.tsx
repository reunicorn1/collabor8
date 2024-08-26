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

  const { data, err, isFetching, refetch, isSuccess, isLoading } =
    useGetAllProjectsPaginatedQuery(
      { ...recentProjectsPagination },
      { refetchOnReconnect: true }, // Optional: refetch when reconnecting
    );
  useEffect(() => {
    if (isSuccess) {
      dispatch(setRecentProjects(data));
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

  const handlePaginationChange = (
    type: string,
    page: number,
    limit: number,
  ) => {
    // Update pagination state based on type and new page/limit values
    switch (type) {
      case 'recentProjects':
        dispatch(
          setRecentProjectsPagination({
            page,
            limit,
            sort: recentProjectsPagination.sort,
          }),
        );
        break;
      default:
        break;
    }
  };
  console.log(recentProjects);

  if (recentProjects.status === 'loading') {
    return <div>Loading...</div>;
  }

  if (recentProjects.status === 'failed') {
    return <div>Error loading data</div>;
  }

  const handleGoToProject = (project: any) => {
    // This function handles the click of a project item in the table it recives the id of the project
    // And it navigates to the project page using the id
    navigate(`/editor/${project._id}`, { state: { project } });
  };

  // BUG: Since the shared projects, all projects tab are underprogress, clicking them currently crashed the app
  // But it also changes the state of isAuthenticated to false and therefore it logs the user out, though
  // The access token remain stable in the local storage.
  // When this happens userDetails disappear, but accessToken is still there

  return (
    <Flex justifyContent="center" h="100vh">
      <Box>
        <Image src="/banner3.png" />
        <Center>
          <Text color="white" fontFamily="mono" fontSize="2xl" m={5}>
            {`Good ${getTimeOfDay()}, ${userDetails?.first_name} ${userDetails?.last_name}`}
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
          mr={20}
          mt="15px"
          display="flex"
          overflowX="scroll"
          maxW="1020"
          whiteSpace="nowrap"
        >
          {/* top 3 recent projects will be shown here */}
          {recentProjects.recentProjects?.map((project, index) => {
            const color = getRandomColor(project.project_name);
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
                onClick={() => handleGoToProject(project)}
              >
                <Icon as={FaFolder} fontSize="45px" color={color} />
                <Box ml={5}>
                  <Text
                    fontSize="sm"
                    fontFamily="mono"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    maxW="150px"
                  >
                    {project.project_name}
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
