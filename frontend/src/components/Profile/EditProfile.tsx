import {
  Box,
  Flex,
  Avatar,
  useBreakpointValue,
  Button,
  Heading,
  Spacer,
} from '@chakra-ui/react';
import { useRef, ChangeEvent } from 'react';
import { FiEdit3 } from 'react-icons/fi';
// import { uploadFile } from '@uploadcare/upload-client';

export default function EditProfile() {
  // Data shown in the fields are from the data retrieved from the user's account
  // This can be found either in the global sate, or by making an additional request
  // No need for a request
  // the states are used to create a duplicate local state which change based on user's
  // interactions with fields
  // When the user clicks save the part involved in that section is sent in an update api request
  // After the request is sent, data related to userdata is refetched so the state is updated globally as well

  const inputRef = useRef<HTMLInputElement | null>(null);
  const leftPosition = useBreakpointValue({
    base: '120px',
    sm: '350px',
    md: '390px',
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];
    if (file) {
      // Handle the file upload (e.g., display the file name, upload to a server, etc.)
      console.log('Selected file:', file.name);
    }
  };

  const handleButtonClick = () => {
    if (inputRef.current) inputRef.current.click();
  };

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
        <input
          type="file"
          ref={inputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        <Button
          colorScheme="white"
          variant="outline"
          w="180px"
          size="sm"
          fontFamily="mono"
          onClick={handleButtonClick}
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
