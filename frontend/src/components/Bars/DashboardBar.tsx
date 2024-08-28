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
  Badge,
  useDisclosure,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { BsBell } from 'react-icons/bs';
import { ChevronDownIcon } from '@chakra-ui/icons';
import DBMenu from '../Dashboard/DBMenu';
import BellMenu from '@components/Dashboard/BellMenu';
import NewProject from '@components/Modals/NewProject';
import { useNavigate } from 'react-router-dom';
import { selectUserDetails } from '@store/selectors/userSelectors';
import { useSelector } from 'react-redux';
import { useState } from 'react';

export default function DashboardBar() {
  const [notificationCount, setNotificationCount] = useState(1);
  const userDetails = useSelector(selectUserDetails);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  return (
    <Flex
      bg="brand.900"
      alignItems="center"
      borderBottom="2px solid #524175"
      p={3}
      w="100%"
    >
      <Image
        src="/logo-bb.png"
        h="23px"
        ml={3}
        cursor="pointer"
        onClick={() => navigate('/dashboard')}
      ></Image>
      <Spacer />
      <ButtonGroup size="xs" isAttached variant="outline" onClick={onOpen}>
        <Button
          fontFamily="mono"
          color="white"
          _hover={{ color: 'black', bg: 'white' }}
        >
          New Project
        </Button>
        <IconButton
          _hover={{ color: 'black', bg: 'white' }}
          aria-label="Add a Project"
          color="white"
          icon={<AddIcon />}
        />
      </ButtonGroup>

      <BellMenu>
        <Box position="relative">
          <Icon color="white" ml={4} boxSize="16px" as={BsBell} />
          {notificationCount > 0 && (
            <Badge
              display="flex"
              justifyContent="center"
              alignItems="center"
              textAlign="center"
              position="absolute"
              top="-1px"
              right="-1px"
              borderRadius="full"
              bgColor="red.500"
              color="white"
              fontSize="7px"
              h="12px"
              w="12px"
            >
              {notificationCount}
            </Badge>
          )}
        </Box>
      </BellMenu>

      <Box display="flex" alignItems="center">
        <DBMenu>
          <Avatar
            src={userDetails?.profile_picture}
            boxSize="22px"
            bg="purple.400"
            ml={4}
            mr={2}
          />
          <Icon color="white" as={ChevronDownIcon} />
        </DBMenu>
      </Box>
      <NewProject isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
}
