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

import { useState, useEffect } from 'react';
import * as projectUtils from '@utils/dashboard.utils';
import { useSelector } from 'react-redux';
import { selectUserDetails } from '@store/selectors/userSelectors';
import { selectRecentProjects, selectUserProjects, selectSharedProjects } from '@store/selectors';

export default function Home() {
  const coolors = ['#F6D277', '#76449A', '#B4B4B4', '#52A0D8', '#F16145'];
  const recentProjects = useSelector(selectRecentProjects);
  console.log('recent', recentProjects);

  const userDetails = useSelector(selectUserDetails);


  function hashStringToIndex(str: string, arrayLength: number): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; // Convert to a 32-bit integer
    }
    return Math.abs(hash) % arrayLength;
  }

  function getRandomColor(projectName: string): string {
    const index = hashStringToIndex(projectName, coolors.length);
    return coolors[index];
  }



  return (
    <Flex justifyContent="center" h="100vh">
      <Box>
        <Image src="/banner3.png" />
        <Center>
          <Text color="white" fontFamily="mono" fontSize="2xl" m={5}>
            {`Good morning, ${userDetails?.first_name} ${userDetails?.last_name}`}
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
          mr={20}
          mt="15px"
          display="flex"
          overflowX="scroll"
          maxW="1020"
          whiteSpace="nowrap"
        >
          {/* top 3 recent projects will be shown here */}


            {recentProjects.recentProjects?.map((project, index) => {
            const color = getRandomColor(project.name);
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
                flexShrink={0}
                cursor="pointer"
              >
                <Icon as={FaFolder} fontSize="45px" color={color} />
                <Box ml={5}>
                  <Text
                    fontSize="sm"
                    fontFamily="mono"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    maxW="150px"
                  >
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
        {/* projects table */}
        <PersonalTable />
      </Box>
    </Flex>
  );
}
