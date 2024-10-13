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
  Badge,
  useToast,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import MenuSelection from './MenuSelection';
import { ArrowForwardIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { HiDotsHorizontal } from 'react-icons/hi';
import MenuProject from './MenuProject';
import {
  selectSharedProjects,
  selectSharedProjectsPagination,
} from '@store/selectors';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSharedProjectsPagination,
  setSharedProjects,
} from '@store/slices/projectSlice';
import { useGetProjectSharesPaginatedQuery } from '@store/services/projectShare';

export default function SharedWithMe() {
  // TODO: All items of the table are clickable with cursor pointer
  // These two values can be used to customize the way data is retrived
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userProjects = useSelector(selectSharedProjects);
  const userProjectsPagination = useSelector(selectSharedProjectsPagination);
  const toast = useToast();

  const handleBack = () => {
    // This function handles requests of pagination to previous page
    if (userProjectsPagination.page > 1) {
      dispatch(
        setSharedProjectsPagination({
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
        setSharedProjectsPagination({
          ...userProjectsPagination,
          page: userProjectsPagination.page + 1,
        }),
      );
    }
  };

  const { data, refetch, isSuccess } = useGetProjectSharesPaginatedQuery(
    { ...userProjectsPagination },
    { refetchOnReconnect: true }, // Optional: refetch when reconnecting
  );
  useEffect(() => {
    if (isSuccess) {
      dispatch(setSharedProjects(data as any));
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
    if (project.status === 'pending') {
      toast({
        title: '🚀 Pending Invitation',
        description:
          'You have an outstanding invitation! Check the bell icon to review and accept.',
        status: 'info',
        duration: 7000,
        isClosable: true,
        position: 'bottom-left',
        variant: 'subtle',
      });
    } else if (project.status === 'accepted') {
      navigate(`/editor/${project._id}`, { state: project });
    }
  };

  return (
    <Box h="100vh">
      <Flex alignItems="center" ml={[4, 8, 20]} mt={[4, 8, 10]}>
        <Box w="10px" h="10px" bg="purple.300" borderRadius="50%" />
        <Text fontFamily="mono" fontSize={['xs', 'sm', 'md']} ml={2}>
          Shared with me
        </Text>
        <Spacer />
        <MenuSelection
          setPagination={setSharedProjectsPagination}
          selectPagination={selectSharedProjectsPagination}
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
        {!userProjects.sharedProjects?.length ? (
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
              {userProjects.sharedProjects?.map((project, index) => {
                const date = new Date(project.updated_at);
                return (
                  <Tr
                    cursor="pointer"
                    key={index}
                    onClick={() => handleGoToProject(project)}
                  >
                    <Td>
                      {project.project_name}
                      {project.status === 'pending' && (
                        <Badge ml={2} colorScheme="orange">
                          Pending
                        </Badge>
                      )}
                    </Td>
                    <Td>{project.member_count} Member(s)</Td>
                    <Td>{date.toDateString()}</Td>
                    <Td>
                      <MenuProject project={project} type={'shared'}>
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
    </Box>
  );
}
