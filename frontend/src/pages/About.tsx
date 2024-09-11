import {
  Box,
  Heading,
  Text,
  List,
  ListItem,
  ListIcon,
  Divider,
  Flex,
  Button,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();
  const handleGoHome = () => {
    navigate('/');
  };
  return (
    <Flex
      direction="column"
      align="center"
      bg="black"
      p={[4, 6, 10]}
      minH="100vh"
    >
      <Box
        maxW="800px"
        w={['100%', '90%', '80%']}
        bg="brand.900"
        color="white"
        borderRadius="md"
        boxShadow="md"
        p={[4, 6]}
      >
        {/* Heading */}
        <Heading
          as="h1"
          size="xl"
          fontFamily="mono"
          mb={4}
          color="#E86044"
          fontSize={['2xl', '3xl', '4xl']}
          textAlign={['center', 'left']}
        >
          Collabor8
        </Heading>

        {/* Introduction Text */}
        <Text
          fontSize={['md', 'lg']}
          fontFamily="mono"
          mb={4}
          textAlign={['justify', 'left']}
        >
          Collabor8 is your ultimate web-based coding playground where real-time
          code editing meets seamless collaboration. With a focus on providing
          developers and teams an ideal space to code together, this platform
          integrates syntax highlighting and other advanced features to make
          coding and collaboration a breeze.
        </Text>

        <Divider mb={4} borderColor="brand.800" />

        {/* Project Overview */}
        <Heading
          as="h2"
          size="lg"
          fontFamily="mono"
          mb={2}
          color="#E86044"
          fontSize={['xl', '2xl']}
        >
          Project Overview
        </Heading>

        <Text fontSize={['sm', 'md']} fontFamily="mono" mb={4}>
          Collabor8 is all about creating a sophisticated environment where
          users can code together in real-time. Leveraging WebSocket
          communication, Collabor8 ensures that all participants see changes
          instantly. We are working towards adding more features such as version
          control and efficient team chat in the future.
        </Text>

        <Divider mb={4} borderColor="brand.800" />

        {/* Objectives */}
        <Heading
          as="h2"
          size="lg"
          fontFamily="mono"
          mb={2}
          color="#E86044"
          fontSize={['xl', '2xl']}
        >
          Objectives
        </Heading>

        <List spacing={3} fontFamily="mono" fontSize={['sm', 'md']}>
          <ListItem>
            <ListIcon as={CheckCircleIcon} color="#E86044" />
            Build a real-time collaborative code editor.
          </ListItem>
          <ListItem>
            <ListIcon as={CheckCircleIcon} color="#E86044" />
            Implement syntax highlighting for multiple programming languages.
          </ListItem>
          <ListItem>
            <ListIcon as={CheckCircleIcon} color="#E86044" />
            Ensure smooth code synchronization across users.
          </ListItem>
          <ListItem>
            <ListIcon as={CheckCircleIcon} color="#E86044" />
            Develop a user-friendly and responsive interface.
          </ListItem>
          <ListItem>
            <ListIcon as={CheckCircleIcon} color="#E86044" />
            Future: Add version control and efficient team chat features.
          </ListItem>
        </List>

        {/* Go home */}
        <Flex justify="center" mt={6}>
          <Button
            onClick={handleGoHome}
            fontFamily="mono"
            colorScheme="orange"
            variant="solid"
            size={['sm', 'md']}
          >
            Back to Home
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default About;
