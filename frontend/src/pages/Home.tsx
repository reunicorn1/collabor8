import { useState, useEffect } from 'react';
import { FaGithub } from 'react-icons/fa6';
import { FaLinkedin } from 'react-icons/fa';
import { FaSquareXTwitter } from 'react-icons/fa6';

import {
  Box,
  Heading,
  Text,
  Center,
  Image,
  SimpleGrid,
  Stack,
  Flex,
  Link,
} from '@chakra-ui/react';
import SignUp from '@components/Modals/SignUp';
import ResetPasswordModal from '@components/Modals/ResetPassword';
import useTypingEffect from '../hooks/useTypingEffect';
import { useLocation } from 'react-router-dom';
import Slogan from '@components/Slogan';
import { TEXT, AVATARS, FEATURES } from '../constants.ts';
import NavigationBar from '@components/Bars/NavigationBar.tsx';

const Home = () => {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const typedText = useTypingEffect(TEXT, 50, animationStarted);

  const handleCloseSignUp = () => setIsSignUpOpen(false);

  useEffect(() => {
    setAnimationStarted(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (location.pathname === '/reset-password') {
        setShowModal(true);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <Stack className="h-screen bg-brand h-max">
        <NavigationBar />
        {/* SLOGAN */}
        <Slogan />
      </Stack>
      <Image src="gradient.png" h="200px" w="100%" />
      <Center>
        <Image
          src="/converted.gif"
          maxW={{ base: '90%', md: '700px', lg: '1000px' }}
          mt={10}
        />
      </Center>

      {/* TYPING */}
      <Box bg="white" p={{ base: 10, md: 20 }}>
        <p className="max-w-[90%] lg:max-w-[65%] mx-auto font-mono !leading-loose text-sm md:text-2xl">
          {typedText}
        </p>
      </Box>

      {/* FEATURES */}
      <Box
        bg="black"
        backgroundImage={`url('/loop.png')`}
        backgroundSize="cover"
        backgroundPosition="center"
        pt={20}
        pb={20}
        p={7}
      >
        <Text
          fontFamily="mono"
          fontSize={{ base: '25px', md: '35px' }}
          mt={'40px'}
          mb={'20px'}
          color="white"
          className="w-[min(90%,700px)] mx-auto text-center"
        >
          Why Collabor8 is the <span className="bg-orange-600">Ultimate</span>{' '}
          Tool for Team Collaboration
        </Text>
        <Box
          className={`container mx-auto py-10 px-4 grid  justify-center gap-8`}
          id="features"
        >
          {FEATURES.map((f, idx) => (
            <Box
              key={idx}
              className={`flex flex-col gap-3 justify-center items-center glass p-7 bg-[rgba(179, 255, 255, 0.313)] border-4 
      ${idx % 2 === 0 ? 'md:col-start-1 md:col-end-5' : 'md:col-start-6 md:col-end-10'} 
      max-w-[400px] mx-auto`}
              borderColor={f.borderColor}
              maxW="400px"
            >
              <f.Icon fontSize="90px" color={f.borderColor} />
              <Heading
                fontFamily="mono"
                textAlign="center"
                size="lg"
                color="white"
                mb={2}
              >
                {f.title}
              </Heading>
              <Text className="text-white text-lg text-center" textAlign="left">
                {f.description}
              </Text>
            </Box>
          ))}
        </Box>
      </Box>

      {/* LOOOPING MOUSE */}
      <Box className="relative py-20 px-20 bg-[#F6D277] lg:py-24">
        <Box className="mx-auto max-w-[700px] items-center flex flex-col gap-4 px-5 overflow-hidden">
          <Heading className="text-center !font-mono font-bold !text-4xl md:!text-5xl lg:!text-7xl p-1">
            Meet a Text Editor that makes an impact
          </Heading>
          <Image
            src="giphy.gif"
            className="h-full absolute top-0 left-1/2 -translate-x-1/2 lg:w-[30%]"
          />
          <Text
            className="text-xl leading-8 lg:mt-4 !text-xl lg:!text-2xl"
            textAlign="center"
          >
            Accelerate your workflow and shorten your cycle with all-in one
            platform for efficent code reviews
          </Text>
        </Box>
      </Box>

      {/* ABOUT US */}
      <Box id="about-us" className="container mx-auto my-8">
        <h1 className="py-4 text-center font-mono text-5xl font-bold">
          Our Team
        </h1>
        <SimpleGrid
          px={{ base: '20px', md: '0' }}
          spacing="40px"
          columns={{ base: 1, md: 2, xl: 4 }} // 2 columns for small screens, 4 columns for large screens
        >
          {AVATARS.map((avatar) => (
            <Box>
              <Box
                key={avatar.name}
                justifyContent="center"
                alignItems="center"
                textAlign="center"
                p={2}
                m={4}
                borderBottom={`10px solid ${avatar.borderColor}`}
              >
                <Center>
                  <Image src={avatar.img} h="250px" />
                </Center>
                <Heading fontSize="25px" fontFamily="mono">
                  {avatar.name}
                </Heading>
              </Box>
              {/* Social Icons */}
              <Flex justifyContent="center" mt={4} gap="4">
                {avatar.socials.map((social, index) => (
                  <Link key={index} href={social.link} isExternal>
                    <Box as="span" _hover={{ color: 'blue.500' }}>
                      {' '}
                      {/* Hover color can be customized */}
                      <social.Icon fontSize={24} />
                    </Box>
                  </Link>
                ))}
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
      <Center>
        <Image w="1500px" src="banner3.png" />
      </Center>

      {/* Footer Section */}
      <Box bg="brand.800" p={5} color="white" textAlign="center" pt={10}>
        <Center>
          <Image h="90px" src="pattern-b.gif"></Image>
        </Center>
        <Text fontSize="sm" fontFamily="mono">
          © 2024 Collabor8. All rights reserved.
        </Text>
      </Box>

      {/* SignUp Modal */}
      <SignUp
        isOpen={isSignUpOpen}
        onClose={handleCloseSignUp}
        onSuccess={async () => {
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

export default Home;
