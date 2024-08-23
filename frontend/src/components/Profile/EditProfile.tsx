import {
  Box,
  Flex,
  Avatar,
  useBreakpointValue,
  Button,
  Heading,
  Spacer,
} from '@chakra-ui/react';
import { FiEdit3 } from 'react-icons/fi';

export default function EditProfile() {
  const leftPosition = useBreakpointValue({
    base: '120px',
    sm: '350px',
    md: '390px',
  });

  return (
    <>
      <Box
        bgGradient="linear(to-r, #F6D277, #F16145, #76449A)"
        h="100px"
        borderTopRadius="2xl"
      />
      <Avatar
        size="2xl"
        position="absolute"
        top="120px"
        left={leftPosition}
        borderColor="white"
      />
      <Box p={20} pt={10} display="flex" justifyContent="flex-end">
        <Button
          colorScheme="white"
          variant="outline"
          w="180px"
          size="sm"
          fontFamily="mono"
        >
          Upload new photo
        </Button>
      </Box>
      <Box p={5} m={20} mt={0} border="1px" borderRadius="2xl">
        <Flex alignItems="center">
          <Heading fontFamily="mono" fontSize="md">
            Personal Info
          </Heading>
          <Spacer />
          <Button
            leftIcon={<FiEdit3 />}
            variant="solid"
            size="xs"
            bg="white"
            fontFamily="mono"
          >
            Edit
          </Button>
        </Flex>
        <Flex pt={5} justifyContent="space-between">
          <Box>
            <Heading fontFamily="mono" fontSize="sm" opacity="0.7">
              First Name
            </Heading>
            <Heading fontFamily="mono" fontSize="md" mt={2}>
              Reem
            </Heading>
          </Box>
          <Box>
            <Heading fontFamily="mono" fontSize="sm" opacity="0.7">
              Last Name
            </Heading>
            <Heading fontFamily="mono" fontSize="md" mt={2}>
              Osama
            </Heading>
          </Box>
          <Box>
            <Heading fontFamily="mono" fontSize="sm" opacity="0.7">
              username
            </Heading>
            <Heading fontFamily="mono" fontSize="md" mt={2}>
              @reunicorn
            </Heading>
          </Box>
          <Box>
            <Heading fontFamily="mono" fontSize="sm" opacity="0.7">
              Email
            </Heading>
            <Heading fontFamily="mono" fontSize="md" mt={2}>
              ireosama1@gmail.com
            </Heading>
          </Box>
        </Flex>
      </Box>
      <Box p={5} m={20} mt={0} border="1px" borderRadius="2xl">
        <Flex alignItems="center">
          <Heading fontFamily="mono" fontSize="md">
            Bio
          </Heading>
          <Spacer />
          <Button
            leftIcon={<FiEdit3 />}
            variant="solid"
            size="xs"
            bg="white"
            fontFamily="mono"
          >
            Edit
          </Button>
        </Flex>
        <Box pt={5} fontFamily="mono" fontSize="sm">
          I’m a passionate full-stack developer with over 5 years of experience
          building scalable web applications and intuitive user interfaces. My
          expertise lies in JavaScript, particularly with frameworks like React,
          Node.js, and Express, but I'm always exploring new technologies to
          stay on the cutting edge. 💻 My journey in tech started with a deep
          fascination for problem-solving and creating digital solutions that
          make a difference. Whether I'm debugging a complex issue 🐛 or
          brainstorming the architecture of a new feature, I thrive on the
          challenges that coding presents. 🎯 I've worked on a variety of
          projects, from developing enterprise-level applications to launching
          startups’ MVPs. I’m particularly proud of my contributions to
          [YourProjectName], where I led the development of a real-time
          collaboration tool that improved team productivity by 30%. 📈 Beyond
          the code, I’m a strong advocate for clean, maintainable code and enjoy
          mentoring junior developers to help them grow in their careers. 🌱 I’m
          always looking to collaborate on exciting projects that challenge my
          skills and contribute to meaningful outcomes. 🤝
        </Box>
      </Box>
    </>
  );
}
