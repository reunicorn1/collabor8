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
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import MenuSelection from './MenuSelection';
import { ArrowForwardIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { HiDotsHorizontal } from 'react-icons/hi';
import MenuProject from './MenuProject';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserProjects, selectUserProjectsPagination } from '@store/selectors';
import { setUserProjects, setUserProjectsPagination } from '@store/slices/projectSlice';
import { useGetAllProjectsPaginatedQuery } from '@store/services/project';
// import * as projectUtils from '@utils/dashboard.utils';


export default function PersonalTable() {
  // These two values can be used to customize the way data is retrived
  const [sort, setSort] = useState('Last Modified');
  const [order, setOrder] = useState('Newest first');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userProjects = useSelector(selectUserProjects);
  const userProjectsPagination = useSelector(selectUserProjectsPagination);

  const handleBack = () => {
    // This function handles requests of pagination to previous page
    if (userProjectsPagination.page > 1) {
      dispatch(
      setUserProjectsPagination(
      { ...userProjectsPagination, page: userProjectsPagination.page - 1 }
      ));
    }
  };

  const handleForward = () => {
    // This function handles requests of pagination to next page
    if (userProjects.totalPages > userProjectsPagination.page) {
            dispatch(
      setUserProjectsPagination(
      { ...userProjectsPagination, page: userProjectsPagination.page + 1 }
      ));
    }
  };

  const { data, err, isFetching, refetch, isSuccess, isLoading } = useGetAllProjectsPaginatedQuery(
    { ...userProjectsPagination },
    { refetchOnReconnect: true }, // Optional: refetch when reconnecting
  );
  useEffect(() => {
    if (isSuccess) {
      dispatch(setUserProjects(data));
    }
  }, [isSuccess, data, userProjects.total, dispatch, userProjectsPagination]);

  useEffect(() => {
    refetch();
  }
  , [userProjectsPagination]);


 const handlePaginationChange = (type: string, page: number, limit: number) => {
    // Update pagination state based on type and new page/limit values
    switch (type) {
      case 'userProjects':
        dispatch(setUserProjectsPagination({ page, limit, sort: userProjectsPagination.sort }));
        break;
      default:
        break;
    }
  };
  console.log(userProjects);

  if (userProjects.status === 'loading'  ) {
    return <div>Loading...</div>;
  }

  if (userProjects.status === 'failed' ) {
    return <div>Error loading data</div>;
  }




  const handleGoToProject = (id: string, project_name: string) => {
    // This function handles the click of a project item in the table it recives the id of the project
    // And it navigates to the project page using the id
    navigate(`/editor/${id}`, { state: { project_name } });
  };

  return (
    <>
      <Flex alignItems="center" ml={20} mt={10}>
        <Box w="10px" h="10px" bg="blue.200" borderRadius="50%" />
        <Text fontFamily="mono" fontSize="xs" ml={2}>
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
        ml={20}
        mr={20}
        mb={5}
        overflowY="scroll"
        maxH="250px"
      >
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
            <Tr cursor="pointer" 
            key={index}
            onClick={() => handleGoToProject(project.project_id, project.project_name)}
            >
              <Td>{project.project_name}</Td>
              <Td>3 Members TBD</Td>
              <Td>{date.toDateString()}</Td>
              <Td>
                <MenuProject>
                  <HiDotsHorizontal />
                </MenuProject>
              </Td>
            </Tr>
          );
          })}
          </Tbody>
        </Table>
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
    </>
  );
}
