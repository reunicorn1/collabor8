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
import { useState } from 'react';
import Home from '../components/Dashboard/Home';
import SharedWithMe from '../components/Dashboard/SharedWithMe';
import AllProjects from '../components/Dashboard/AllProjects';

export default function DashboardPage() {
  const [clicked, setClicked] = useState('Home');

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
        <Box flex="1" bg="brand.900" h="100%" color="white" width="90%">
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
