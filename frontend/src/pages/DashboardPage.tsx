import {
  Flex,
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { GoHome, GoHomeFill } from 'react-icons/go';
import {
  HiOutlineSquares2X2,
  HiSquares2X2,
  HiOutlineUserGroup,
  HiUserGroup,
} from 'react-icons/hi2';
import DashboardBar from '../components/Bars/DashboardBar';
import { useState, useEffect } from 'react';
import Home from '../components/Dashboard/Home';
import SharedWithMe from '../components/Dashboard/SharedWithMe';
import AllProjects from '../components/Dashboard/AllProjects';
import {
  useGetAllProjectsPaginatedQuery,
} from '@store/services/project';
import {
  setRecentProjects,
  setRecentProjectsPagination,
  setUserProjects,
  setUserProjectsPagination,
  // setSharedProjects,
} from '@store/slices/projectSlice';
import {
  selectRecentProjects,
  selectRecentProjectsPagination,
  selectUserProjects,
  selectUserProjectsPagination,
  // selectSharedProjects,
} from '@store/selectors';
import {
fetchRecentProjects,
fetchUserProjects,
// fetchSharedProjects,
// fetchAllProjects,
} from '@store/thunks/projectThunks';
import { useDispatch, useSelector } from 'react-redux';




export default function DashboardPage() {
  const [clicked, setClicked] = useState('Home');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('-updated_at');
  const [limit, setLimit] = useState(10);
  // const dispatch = useDispatch();
  // const recentProjects = useSelector(selectRecentProjects);
  // const userProjects = useSelector(selectUserProjects);

  // const recentProjectsPagination = useSelector(selectRecentProjectsPagination);
  // const userProjectsPagination = useSelector(selectUserProjectsPagination);


  // useEffect(() => {
  //   dispatch(fetchRecentProjects(recentProjectsPagination));
  //   dispatch(fetchUserProjects(userProjectsPagination));
  // }, [dispatch, recentProjectsPagination, userProjectsPagination]);

  // const { data, err, isFetching, refetch, isSuccess, isLoading } = useGetAllProjectsPaginatedQuery(
  //   { page, limit, sort },
  //   { refetchOnReconnect: true }, // Optional: refetch when reconnecting
  // );

  // useEffect(() => {
  //   if (isSuccess) {
  //     dispatch(setRecentProjects(data));
  //   }
  // }, [isSuccess, data, recentProjects.total, dispatch, recentProjectsPagination]);

  // useEffect(() => {
  //   if (isSuccess) {
  //     dispatch(setUserProjects(data));
  //   }
  // }, [isSuccess, data, userProjects.total, dispatch, userProjectsPagination]);


//  const handlePaginationChange = (type: string, page: number, limit: number) => {
//     // Update pagination state based on type and new page/limit values
//     switch (type) {
//       case 'recentProjects':
//         dispatch(setRecentProjectsPagination({ page, limit, sort: recentProjectsPagination.sort }));
//         break;
//       case 'userProjects':
//         dispatch(setUserProjectsPagination({ page, limit, sort: userProjectsPagination.sort }));
//         break;
//       default:
//         break;
//     }
//   };
//   console.log(recentProjects, userProjects);

//   if (recentProjects.status === 'loading' || userProjects.status === 'loading' ) {
//     return <div>Loading...</div>;
//   }

//   if (recentProjects.status === 'failed' || userProjects.status === 'failed') {
//     return <div>Error loading data</div>;
//   }



  return (
    <>
      {/* This is the nvaigation bar of the dashboard */}
      <DashboardBar />
      <Flex h="100%">
        <Box
          bg="brand.900"
          w="270px"
          color="white"
          borderRight="2px solid #524175"
        >
          <InputGroup>
            {/* navbar to the left */}
            <InputLeftElement mt={2} ml={2}>
              <SearchIcon color="gray.500" />
            </InputLeftElement>
            {/* search bar */}
            <Input
              fontFamily="mono"
              variant="filled"
              bg="brand.900"
              placeholder="Search"
              _hover={{ bg: 'brand.900' }}
              _focusVisible={{
                bg: 'brand.900',
              }}
              size="sm"
              w="90%"
              m={3}
              pr={3}
              border="1px solid #524175"
            />
          </InputGroup>
          <>
            <Box
              p={2}
              pl={4}
              display="flex"
              alignItems="center"
              _hover={{ bg: '#524175' }}
              bg={clicked === 'Home' ? '#524175' : 'transparent'}
              onClick={() => setClicked('Home')}
              cursor="pointer"
            >
              {clicked === 'Home' ? <GoHomeFill /> : <GoHome />}
              <Text pl={2} fontFamily="mono" fontSize="xs">
                Home
              </Text>
            </Box>
            <Box
              p={2}
              pl={4}
              display="flex"
              alignItems="center"
              _hover={{ bg: '#524175' }}
              bg={clicked === 'Project' ? '#524175' : 'transparent'}
              onClick={() => setClicked('Project')}
              cursor="pointer"
            >
              {clicked === 'Project' ? (
                <HiSquares2X2 />
              ) : (
                <HiOutlineSquares2X2 />
              )}
              <Text pl={2} fontFamily="mono" fontSize="xs">
                All Projects
              </Text>
            </Box>
            <Box
              p={2}
              pl={4}
              display="flex"
              alignItems="center"
              _hover={{ bg: '#524175' }}
              bg={clicked === 'Shared' ? '#524175' : 'transparent'}
              onClick={() => setClicked('Shared')}
              cursor="pointer"
            >
              {clicked === 'Shared' ? <HiUserGroup /> : <HiOutlineUserGroup />}
              <Text pl={2} fontFamily="mono" fontSize="xs">
                Shared with me
              </Text>
            </Box>
          </>
        </Box>
        <Box flex="1" bg="brand.900" h="100%" color="white">
          {clicked === 'Home' ? (
            <Home />
          ) : clicked === 'Project' ? (
            <AllProjects />
          ) : (
            <SharedWithMe />
          )}
        </Box>
      </Flex>
    </>
  );
}
