import {
  Flex,
  Image,
  Spacer,
  Icon,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  IconButton,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

import { BsBell } from 'react-icons/bs';
import { ChevronDownIcon } from '@chakra-ui/icons';
import DBMenu from '../Dashboard/DBMenu';

export default function DashboardBar() {
  return (
    <Flex
      bg="brand.900"
      alignItems="center"
      borderBottom="2px solid #524175"
      p={3}
    >
      <Image src="/logo-bb.png" h="23px" ml={3}></Image>
      <Spacer />
      <ButtonGroup size="xs" isAttached variant="outline">
        <Button
          fontFamily="mono"
          color="white"
          _hover={{ color: 'black', bg: 'white' }}
        >
          New Project
        </Button>
        <IconButton
          _hover={{ color: 'black', bg: 'white' }}
          aria-label="Add to friends"
          color="white"
          icon={<AddIcon />}
        />
      </ButtonGroup>
      <Icon color="white" ml={4} boxSize="16px" as={BsBell} />
      <Box display="flex" alignItems="center">
        <DBMenu>
          <Avatar boxSize="22px" bg="purple.400" ml={4} mr={2} />
          <Icon color="white" as={ChevronDownIcon} />
        </DBMenu>
      </Box>
    </Flex>
  );
}
