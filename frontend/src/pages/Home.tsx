import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Stack,
  useBreakpointValue,
} from '@chakra-ui/react';
import NavigationBar from '@components/Bars/NavigationBar';
import SignUp from '@components/Modals/SignUp';
import ResetPasswordModal from '@components/Modals/ResetPassword';
import backgroundImage from '../assets/ahjHe3h.jpg';
import useTypingEffect from '../hooks/useTypingEffect';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();

  const handleOpenSignUp = () => setIsSignUpOpen(true);
  const handleCloseSignUp = () => setIsSignUpOpen(false);

  useEffect(() => {
    setAnimationStarted(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (location.pathname === '/reset_password') {
        setShowModal(true);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const typedText = useTypingEffect(
    '  Collabor8 is your ultimate code collaboration tool. Code with your team in real-time, and never miss a beat.',
    50,
    animationStarted,
  );

  return (
    <>
      <NavigationBar />
      <Flex
        direction="column"
        align="center"
        justify="center"
        bg="brand.900"
        minH="100vh"
        p={5}
        textAlign="center"
        position="relative"
      >
        {/* Background Image Wrapper */}
        <Box
          backgroundImage={`url(${backgroundImage})`}
          backgroundSize="cover"
          backgroundPosition="center"
          w="100%"
          h="75vh"
          p={10}
          position="relative"
          borderRadius="lg"
          boxShadow="2xl"
          overflow="hidden"
        >
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="rgba(0, 0, 0, 0.8)"
            zIndex={1}
          />

          {/* Content on top of the background */}
          <Stack spacing={6} position="relative" zIndex={2} textAlign="center">
            <Heading as="h1" size="3xl" fontFamily="mono" color="whitesmoke">
              Welcome to{' '}
              <Text as="span" color="whitesmoke">
                collabor<span style={{ color: '#E86044' }}>8</span>
              </Text>
            </Heading>
            <Text
              fontSize={useBreakpointValue({ base: 'lg', md: '2xl' })}
              color="whitesmoke"
              fontFamily="mono"
            >
              {typedText}
            </Text>
            <Box w="full" display="flex" justifyContent="center" mt={20}>
              <Button
                bg="#E86044"
                color="whitesmoke"
                size="lg"
                fontFamily="mono"
                onClick={handleOpenSignUp}
                width={{ base: '70%', md: '50%', lg: '30%' }}
                _hover={{ bg: '#d95434' }}
              >
                Get Started
              </Button>
            </Box>
          </Stack>
        </Box>
      </Flex>

      {/* Features Section */}
      <Flex direction="column" align="center" bg="brand.800" p={10}>
        <Heading as="h2" size="xl" color="teal.300" mb={6}>
          Features
        </Heading>
        <Stack spacing={8} maxW="800px" mx="auto">
          <FeatureCard
            title="Real-Time Collaboration"
            description="Edit code together, see changes instantly."
          />
          <FeatureCard
            title="Syntax Highlighting"
            description="Support for various programming languages."
          />
          <FeatureCard
            title="User-Friendly Interface"
            description="An intuitive design for effortless coding."
          />
        </Stack>
      </Flex>

      {/* Testimonials Section */}
      <Flex
        direction="column"
        align="center"
        bg="brand.900"
        p={10}
        color="white"
      >
        <Heading as="h2" size="xl" color="teal.300" mb={6}>
          What Our Users Say
        </Heading>
        <Stack spacing={8} maxW="800px" mx="auto">
          <TestimonialCard
            name="Jane Doe"
            feedback="Collabor8 has revolutionized our coding process. It's amazing!"
          />
          <TestimonialCard
            name="John Smith"
            feedback="An essential tool for any development team."
          />
        </Stack>
      </Flex>

      {/* Footer Section */}
      <Box bg="brand.800" p={5} color="white" textAlign="center">
        <Text fontSize="sm">© 2024 Collabor8. All rights reserved.</Text>
      </Box>

      {/* SignUp Modal */}
      <SignUp
        isOpen={isSignUpOpen}
        onClose={handleCloseSignUp}
        onSuccess={() => {
          handleCloseSignUp();
        }}
      />

      {/* ResetPasswordModal */}
      {showModal && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={9999}
          bg="rgba(0, 0, 0, 0.5)"
        >
          <ResetPasswordModal />
        </Box>
      )}
    </>
  );
};

const FeatureCard = ({ title, description }) => (
  <Box bg="brand.700" color="white" p={5} borderRadius="md" boxShadow="md">
    <Heading as="h3" size="lg" mb={2}>
      {title}
    </Heading>
    <Text>{description}</Text>
  </Box>
);

const TestimonialCard = ({ name, feedback }) => (
  <Box bg="brand.700" color="white" p={5} borderRadius="md" boxShadow="md">
    <Text fontSize="lg" mb={2}>
      "{feedback}"
    </Text>
    <Text fontStyle="italic">- {name}</Text>
  </Box>
);

export default Home;
