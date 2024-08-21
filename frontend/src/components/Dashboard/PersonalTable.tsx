import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';

export default function PersonalTable() {
  return (
    <TableContainer m={10} ml={20} mr={20}>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Members</Th>
            <Th isNumeric>Last Modified</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Person1</Td>
            <Td>3 Members</Td>
            <Td isNumeric>1 Sep, 2023</Td>
            <Td></Td>
          </Tr>
          <Tr>
            <Td>Person1</Td>
            <Td>3 Members</Td>
            <Td isNumeric>1 Sep, 2023</Td>
            <Td></Td>
          </Tr>
          <Tr>
            <Td>Person1</Td>
            <Td>3 Members</Td>
            <Td isNumeric>1 Sep, 2023</Td>
            <Td></Td>
          </Tr>
          <Tr>
            <Td>Person1</Td>
            <Td>3 Members</Td>
            <Td isNumeric>1 Sep, 2023</Td>
            <Td></Td>
          </Tr>
          <Tr>
            <Td>Person1</Td>
            <Td>3 Members</Td>
            <Td isNumeric>1 Sep, 2023</Td>
            <Td></Td>
          </Tr>
          <Tr>
            <Td>Person1</Td>
            <Td>3 Members</Td>
            <Td isNumeric>1 Sep, 2023</Td>
            <Td></Td>
          </Tr>
          <Tr>
            <Td>Person1</Td>
            <Td>3 Members</Td>
            <Td isNumeric>1 Sep, 2023</Td>
            <Td></Td>
          </Tr>
          <Tr>
            <Td>Person1</Td>
            <Td>3 Members</Td>
            <Td isNumeric>1 Sep, 2023</Td>
            <Td></Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
}
