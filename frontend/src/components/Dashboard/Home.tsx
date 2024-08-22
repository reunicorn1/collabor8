import {
  Image,
  Text,
  Flex,
  Box,
  Icon,
  Spacer,
  Avatar,
  Center,
} from '@chakra-ui/react';
import { FaFolder } from 'react-icons/fa';
import PersonalTable from './PersonalTable';

export default function Home() {
  const coolors = ['#F6D277', '#76449A', '#B4B4B4', '#52A0D8', '#F16145'];

  function getRandomColor(): string {
    const randomIndex = Math.floor(Math.random() * coolors.length);
    return coolors[randomIndex];
  }

  function getUserProjects() {
    // This function should fetch the user's projects from the backend
  }

  function getSharedProjects() {
    // This function should fetch the projects shared with the user from the backend
  }
  
  function getRecentProjects() {
    // This function should fetch the user's recent projects from the backend
  }


  
  

  // This is a list for demonstration purposes in a static version
  const projects = [
    { name: 'Project 1', lastEdited: '2 days ago' },
    { name: 'Project 2', lastEdited: '5 days ago' },
    { name: 'Project 3', lastEdited: '1 week ago' },
  ];

  return (
    <Flex h="100vh" justifyContent="center">
      <Box>
        <Image src="/banner3.png" />
        <Center>
          <Text color="white" fontFamily="mono" fontSize="2xl" m={5}>
            Good morning, John Doe
          </Text>
        </Center>

        <Flex alignItems="center" ml={20} mt={10}>
          <Box w="10px" h="10px" bg="yellow.200" borderRadius="50%" />
          <Text fontFamily="mono" fontSize="xs" ml={2}>
            Recent Projects
          </Text>
        </Flex>
        <Box
          ml={20}
          mt={10}
          display="flex"
          overflowX="auto"
          maxW="1100"
          whiteSpace="nowrap"
        >
          {/* top 3 recent projects will be shown here */}
          {projects.map((project, index) => {
            const color = getRandomColor();
            return (
              <Box
                key={index}
                display="flex"
                border="0.5px solid white"
                borderBottom={`6px solid ${color}`}
                w="320px"
                h="90px"
                p={6}
                pt={5}
                mr={5}
                alignItems="center"
              >
                <Icon as={FaFolder} fontSize="45px" color={color} />
                <Box ml={5}>
                  <Text fontSize="md" fontFamily="mono">
                    {project.name}
                  </Text>
                  <Text fontSize="xs" fontFamily="mono">
                    {project.lastEdited}
                  </Text>
                </Box>
                <Spacer />
                {/* The avatar of the owner */}
                <Avatar boxSize="23px" bg="gray.500" />
              </Box>
            );
          })}
        </Box>
        <Flex alignItems="center" ml={20} mt={10}>
          <Box w="10px" h="10px" bg="blue.200" borderRadius="50%" />
          <Text fontFamily="mono" fontSize="xs" ml={2}>
            Personal Projects
          </Text>
        </Flex>
        {/* projects table */}
        <PersonalTable />
      </Box>
    </Flex>
  );
}
