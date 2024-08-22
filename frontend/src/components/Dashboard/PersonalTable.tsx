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
import { useState } from 'react';
import MenuSelection from './MenuSelection';
import { ArrowForwardIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

export default function PersonalTable() {
  // These two values can be used to customize the way data is retrived
  const [sort, setSort] = useState('Last Modified');
  const [order, setOrder] = useState('Newest first');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();


  const handleBack = () => {
    // This function handles requests of pagination to previous page
    console.log('Previous Page');
  };

  const handleForward = () => {
    // This function handles requests of pagination to previous page
    console.log('Next Page');
  };

  const handleGoToProject = (id: string) => {
    // This function handles the click of a project item in the table it recives the id of the project
    // And it navigates to the project page using the id
    navigate(`/editor/${id}`);
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
          sort={sort}
          setSort={setSort}
          order={order}
          setOrder={setOrder}
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
            <Tr cursor="pointer">
              <Td>Python Project Snake Game</Td>
              <Td>3 Members</Td>
              <Td>1 Sep, 2023</Td>
              <Td></Td>
            </Tr>
            <Tr cursor="pointer">
              <Td>Python Project Snake Game</Td>
              <Td>3 Members</Td>
              <Td>1 Sep, 2023</Td>
              <Td></Td>
            </Tr>
            <Tr cursor="pointer">
              <Td>Python Project Snake Game</Td>
              <Td>3 Members</Td>
              <Td>1 Sep, 2023</Td>
              <Td></Td>
            </Tr>
            <Tr cursor="pointer">
              <Td>Python Project Snake Game</Td>
              <Td>3 Members</Td>
              <Td>1 Sep, 2023</Td>
              <Td></Td>
            </Tr>
            <Tr cursor="pointer">
              <Td>Python Project Snake Game</Td>
              <Td>3 Members</Td>
              <Td>1 Sep, 2023</Td>
              <Td></Td>
            </Tr>
            <Tr cursor="pointer">
              <Td>Python Project Snake Game</Td>
              <Td>3 Members</Td>
              <Td>1 Sep, 2023</Td>
              <Td></Td>
            </Tr>
            <Tr cursor="pointer">
              <Td>Python Project Snake Game</Td>
              <Td>3 Members</Td>
              <Td>1 Sep, 2023</Td>
              <Td></Td>
            </Tr>
            <Tr cursor="pointer">
              <Td>Python Project Snake Game</Td>
              <Td>3 Members</Td>
              <Td>1 Sep, 2023</Td>
              <Td></Td>
            </Tr>
            <Tr cursor="pointer">
              <Td>Python Project Snake Game</Td>
              <Td>3 Members</Td>
              <Td>1 Sep, 2023</Td>
              <Td></Td>
            </Tr>
            <Tr cursor="pointer">
              <Td>Python Project Snake Game</Td>
              <Td>3 Members</Td>
              <Td>1 Sep, 2023</Td>
              <Td></Td>
            </Tr>
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
        <ArrowBackIcon opacity={0} onClick={handleBack} cursor="pointer" />
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
