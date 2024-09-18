import {
  Box,
  Flex,
  Text,
  Divider,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import DashboardBar from '../components/Bars/DashboardBar';
import { useState } from 'react';
import {
  RiProfileFill,
  RiProfileLine,
  RiLockPasswordLine,
  RiLockPasswordFill,
  RiDeleteBin5Line,
} from 'react-icons/ri';
import DeleteAccount from '@components/Profile/DeleteAccount';
import EditProfile from '@components/Profile/EditProfile';
import Password from '@components/Profile/Password';

export default function Profile() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [clicked, setClicked] = useState('Edit');

  const isBanner = useBreakpointValue({ base: false, md: true });

  // Profile Component
  return (
    <>
      {/* Dashboard Bar */}
      <DashboardBar />

      {/* Flex container for the layout */}
      <Box
        display={{ base: 'block', md: 'flex' }}
        minHeight="100vh"
        width="100%"
      >
        {/* Sidebar */}
        <Box
          bg="brand.900"
          w={{ base: '100%', md: '230px' }}
          color="white"
          borderRight="2px solid #524175"
          pt={10}
          pb={2}
        >
          {/* Sidebar content */}
          <Box
            p={2}
            pl={4}
            display="flex"
            alignItems="center"
            _hover={{ bg: '#524175' }}
            bg={clicked === 'Edit' ? '#524175' : 'transparent'}
            onClick={() => setClicked('Edit')}
            cursor="pointer"
          >
            {clicked === 'Edit' ? <RiProfileFill /> : <RiProfileLine />}
            <Text pl={2} fontFamily="mono" fontSize="xs">
              Edit Profile
            </Text>
          </Box>

          <Box
            p={2}
            pl={4}
            display="flex"
            alignItems="center"
            _hover={{ bg: '#524175' }}
            bg={clicked === 'Password' ? '#524175' : 'transparent'}
            onClick={() => setClicked('Password')}
            cursor="pointer"
          >
            {clicked === 'Password' ? (
              <RiLockPasswordFill />
            ) : (
              <RiLockPasswordLine />
            )}
            <Text pl={2} fontFamily="mono" fontSize="xs">
              Password
            </Text>
          </Box>

          <Divider pb={5} />

          <Box
            p={2}
            pl={4}
            mt={5}
            display="flex"
            alignItems="center"
            _hover={{ bg: 'red.600', color: 'white' }}
            onClick={onOpen}
            cursor="pointer"
            color="red.300"
          >
            <RiDeleteBin5Line />
            <Text pl={2} fontFamily="mono" fontSize="xs">
              Delete Account
            </Text>
          </Box>
        </Box>

        {/* Main Content */}
        <Box flex="1" bg="brand.100" p={10} pb={0} w="100%" minHeight="100vh">
          <Box
            bg="brand.900"
            color="white"
            minHeight="100vh"
            borderTopRadius="2xl"
          >
            {clicked === 'Edit' ? <EditProfile /> : <Password />}
          </Box>
        </Box>

        {/* Delete Account Modal */}
        <DeleteAccount isOpen={isOpen} onClose={onClose} />
      </Box>
    </>
  );
}
