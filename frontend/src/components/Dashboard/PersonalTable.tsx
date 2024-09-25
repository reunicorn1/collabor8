import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
  Box,
  Text,
  Spacer,
  Center,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import MenuSelection from './MenuSelection';
import { ArrowForwardIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { HiDotsHorizontal } from 'react-icons/hi';
import MenuProject from './MenuProject';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectUserProjects,
  selectUserProjectsPagination,
} from '@store/selectors';
import {
  setUserProjects,
  setUserProjectsPagination,
} from '@store/slices/projectSlice';
import { useGetAllProjectsPaginatedQuery } from '@store/services/project';
// import * as projectUtils from '@utils/dashboard.utils';

export default function PersonalTable() {
  // These two values can be used to customize the way data is retrived
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userProjects = useSelector(selectUserProjects);
  const userProjectsPagination = useSelector(selectUserProjectsPagination);

  const handleBack = () => {
    // This function handles requests of pagination to previous page
    if (userProjectsPagination.page > 1) {
      dispatch(
        setUserProjectsPagination({
          ...userProjectsPagination,
          page: userProjectsPagination.page - 1,
        }),
      );
    }
  };

  const handleForward = () => {
    // This function handles requests of pagination to next page
    if (userProjects.totalPages > userProjectsPagination.page) {
      dispatch(
        setUserProjectsPagination({
          ...userProjectsPagination,
          page: userProjectsPagination.page + 1,
        }),
      );
    }
  };

  const { data, refetch, isSuccess } = useGetAllProjectsPaginatedQuery(
    { ...userProjectsPagination },
    { refetchOnReconnect: true }, // Optional: refetch when reconnecting
  );

  useEffect(() => {
    if (isSuccess) {
      dispatch(setUserProjects(data as any));
    }
  }, [isSuccess, data, userProjects.total, dispatch, userProjectsPagination]);

  useEffect(() => {
    refetch();
  }, [userProjectsPagination]);

  if (userProjects.status === 'loading') {
    return <div>Loading...</div>;
  }

  if (userProjects.status === 'failed') {
    return <div>Error loading data</div>;
  }

  const handleGoToProject = (project: any) => {
    // This function handles the click of a project item in the table it recives the id of the project
    // And it navigates to the project page using the id
    navigate(`/editor/${project._id}`, { state: project });
  };

  return (
    <>
      <Flex alignItems="center" ml={[4, 8, 20]} mt={[4, 8, 10]}>
        <Box w="10px" h="10px" bg="blue.200" borderRadius="50%" />
        <Text fontFamily="mono" fontSize={['xs', 'sm', 'md']} ml={2}>
          Personal Projects
        </Text>
        <Spacer />
        <MenuSelection
          setPagination={setUserProjectsPagination}
          selectPagination={selectUserProjectsPagination}
        />
      </Flex>
      <TableContainer
        mt="25px"
        ml={[4, 8, 20]}
        mr={[4, 8, 20]}
        mb={5}
        overflowY="scroll"
        minH="300px"
        maxH="550px"
        bgGradient="linear(to-t, brand.800, brand.900)"
      >
        {!userProjects.userProjects?.length ? (
          <Center mt={20}>
            <Text fontFamily="mono" fontSize={['xs', 'sm', 'md']}>
              No Projects created yet...
            </Text>
          </Center>
        ) : (
          <Table size="sm">
            <Thead>
              <Tr>
                <Th color="#B4B4B4" opacity="0.7" fontFamily="mono">
                  Name
                </Th>
                <Th color="#B4B4B4" opacity="0.7" fontFamily="mono">
                  Members
                </Th>
                <Th color="#B4B4B4" opacity="0.7" fontFamily="mono">
                  Last Modified
                </Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody fontFamily="mono">
              {userProjects.userProjects?.map((project, index) => {
                const date = new Date(project.updated_at);
                return (
                  <Tr
                    cursor="pointer"
                    key={index}
                    onClick={() => handleGoToProject(project)}
                  >
                    <Td>{project.project_name}</Td>
                    <Td>{project.member_count} Member(s)</Td>
                    <Td>{date.toDateString()}</Td>
                    <Td>
                      <MenuProject project={project} type={'personal'}>
                        <HiDotsHorizontal />
                      </MenuProject>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        )}
      </TableContainer>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        mb={5}
        mr={[4, 8, 20]}
      >
        <ArrowBackIcon
          opacity={userProjectsPagination.page > 1 ? 1 : 0.2}
          onClick={handleBack}
          cursor={userProjectsPagination.page > 1 ? 'pointer' : 'default'}
        />
        <Box w="8px" h="8px" bg="white" borderRadius="50%" ml={1} mr={1} />
        <ArrowForwardIcon
          opacity={
            userProjects.totalPages > userProjectsPagination.page ? 1 : 0.2
          }
          onClick={handleForward}
          cursor={
            userProjects.totalPages > userProjectsPagination.page
              ? 'pointer'
              : 'default'
          }
        />
      </Box>
    </>
  );
}
