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
  selectAllProjects,
  selectAllProjectsPagination,
} from '@store/selectors';
import {
  setAllProjects,
  setAllProjectsPagination,
} from '@store/slices/projectSlice';
import { useGetAllProjectsPaginatedQuery } from '@store/services/project';

export default function AllProjects() {
  // TODO: All items of the table are clickable with cursor pointer
  // These two values can be used to customize the way data is retrived
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allProjects = useSelector(selectAllProjects);
  const allProjectsPagination = useSelector(selectAllProjectsPagination);

  const handleBack = () => {
    // This function handles requests of pagination to previous page
    if (allProjectsPagination.page > 1) {
      dispatch(
        setAllProjectsPagination({
          ...allProjectsPagination,
          page: allProjectsPagination.page - 1,
        }),
      );
    }
  };

  const handleForward = () => {
    // This function handles requests of pagination to next page
    if (allProjects.totalPages > allProjectsPagination.page) {
      dispatch(
        setAllProjectsPagination({
          ...allProjectsPagination,
          page: allProjectsPagination.page + 1,
        }),
      );
    }
  };

  const { data, refetch, isSuccess } = useGetAllProjectsPaginatedQuery(
    { ...allProjectsPagination },
    { refetchOnReconnect: true }, // Optional: refetch when reconnecting
  );
  useEffect(() => {
    if (isSuccess) {
      dispatch(setAllProjects(data as any));
    }
  }, [isSuccess, data, allProjects.total, dispatch, allProjectsPagination]);

  useEffect(() => {
    refetch();
  }, [allProjectsPagination]);

  if (allProjects.status === 'loading') {
    return <div>Loading...</div>;
  }

  if (allProjects.status === 'failed') {
    return <div>Error loading data</div>;
  }

  const handleGoToProject = (project: any) => {
    // This function handles the click of a project item in the table it recives the id of the project
    // And it navigates to the project page using the id
    navigate(`/editor/${project._id}`, { state: project });
  };

  return (
    <Box h="100vh">
      <Flex alignItems="center" ml={20} mt={10}>
        <Box w="10px" h="10px" bg="purple.300" borderRadius="50%" />
        <Text fontFamily="mono" fontSize="xs" ml={2}>
          All Projects
        </Text>
        <Spacer />
        <MenuSelection
          setPagination={setAllProjectsPagination}
          selectPagination={selectAllProjectsPagination}
        />
      </Flex>
      <TableContainer
        mt="25px"
        ml={20}
        mr={20}
        mb={5}
        overflowY="scroll"
        minH="300px"
        maxH="550px"
        bgGradient="linear(to-t, brand.800, brand.900)"
      >
        {!allProjects.allProjects?.length ? (
          <Center mt={20}>
            <Text fontFamily="mono" fontSize="sm">
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
              {allProjects.allProjects?.map((project, index) => {
                const date = new Date(project.updated_at);
                return (
                  <Tr
                    cursor="pointer"
                    key={index}
                    onClick={() => handleGoToProject(project)}
                  >
                    <Td>{project.project_name}</Td>
                    <Td>3 Members TBD</Td>
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
        mr={20}
      >
        {/* Control the opacity of the arrows based on the number of pages, if first page, 
        opacity of back is 0, if last page opacity of forward is 0 */}
        <ArrowBackIcon opacity={0.2} onClick={handleBack} cursor="pointer" />
        <Box w="8px" h="8px" bg="white" borderRadius="50%" ml={1} mr={1} />
        <ArrowForwardIcon
          opacity={1}
          onClick={handleForward}
          cursor="pointer"
        />
      </Box>
    </Box>
  );
}
