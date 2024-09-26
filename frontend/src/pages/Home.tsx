import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Center,
  Image,
  SimpleGrid,
  Stack,
  List,
  ListItem,
} from '@chakra-ui/react';
import SignUp from '@components/Modals/SignUp';
import ResetPasswordModal from '@components/Modals/ResetPassword';
import useTypingEffect from '../hooks/useTypingEffect';
import { useLocation } from 'react-router-dom';
import Slogan from '@components/Slogan';
import { TEXT, AVATARS, FEATURES } from '../constants.ts';
import NavigationBar from '@components/Bars/NavigationBar.tsx';
import { LinkedIn, Twitter, Github } from '../common/icons';

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
      <Stack className='h-screen bg-brand overflow-hidden'>
        <NavigationBar />
        {/* SLOGAN */}
        <Slogan className='my-auto' />
      </Stack>

      {/* TYPING */}
      <Box bg='white' px={4} className='py-10 lg:py-20'>
        <p className='lg:max-w-[50%] mx-auto font-mono !leading-loose lg:text-4xl'>
          {typedText}
        </p>
      </Box>

      {/* FEATURES */}
      <Box
        bg='black'
        backgroundImage={`url('/loop.png')`}
        backgroundSize="cover"
        backgroundPosition="center"
        py={10}
      >
        <Text
          fontFamily="mono"
          fontSize="35px"

          color="white"
          className="w-[min(90%,700px)] mx-auto text-center"
        >
          Why Collabor8 is the Ultimate Tool for Team Collaboration
        </Text>
        <Box
          className={`container mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-9 justify-center gap-8 lg:px-24`}
          id="features"
        >
          {FEATURES.map((f, idx) => (
            <Box
              key={idx}
              className={`flex flex-col gap-3 justify-start glass p-4 bg-[rgba(179,74,18,0.25)] border-4 
              ${(idx) % 2 === 0 ? 'md:col-start-1 md:col-end-5' : 'md:col-start-6 md:col-end-10'}`}
              borderColor={f.borderColor}
            >
              <f.Icon fontSize='90px' color={f.borderColor} />
              <Heading
                fontFamily="mono"
                size="lg"
                color="white"
                mb={2}
              >
                {f.title}
              </Heading>
              <Text className='text-white text-lg'>
                {f.description}
              </Text>
            </Box>
          ))
          }
        </Box>
      </Box>

      {/* LOOOPING MOUSE */}
      <Box className='relative py-10 bg-[#F6D277] lg:py-24'>
        <Box className='mx-auto max-w-[700px] items-center flex flex-col gap-4 px-4 overflow-hidden'>
          <Heading className='text-center !font-mono font-bold lg:!text-7xl'>
            Meet a Text Editor that makes an impact
          </Heading>
          <Image
            src="giphy.gif"
            className='h-full absolute top-0 left-1/2 -translate-x-1/2 lg:w-[30%]'
          />
          <Text className='text-xl leading-8 font-mono lg:mt-4 lg:text-3xl'>
            Accelerate your workflow and shorten your cycle with all-in one
            platform for efficent code reviews
          </Text>
        </Box>
      </Box>

      {/* ABOUT US */}
      <Box
        id="about-us"
        className="container mx-auto my-8"
      >
        <h1 className='py-4 text-center font-mono text-5xl font-bold'>
          Our Team
        </h1>
        <SimpleGrid
          px={{ base: '20px', md: '0' }}
          minChildWidth='250px'
          spacing='40px'
        >
          {AVATARS.map(avatar => (
            <Box
              key={avatar.name}
              justifyContent="center"
              alignItems="center"
              textAlign="center"
              borderBottom={`10px solid ${avatar.borderColor}`}
              className='relative flex flex-col h-[300px] group origin-top overflow-hidden'
            >
              <Box className='absolute top-0 left-0 w-full h-full transition group-hover:scale-[0.6] group-hover:-translate-y-[20%]'>
                <Image className='mx-auto' src={avatar.img} h="250px" />
                <Heading fontSize="25px" fontFamily="mono">
                  {avatar.name}
                </Heading>
              </Box>
              <Box
                className='w-full gap-4 bg-slate-100 py-2 rounded-t-2xl h-[100px] transition translate-y-full mt-auto group-hover:flex group-hover:flex-col group-hover:translate-y-0'
              >
                <h3
                style={{ color: avatar.borderColor }}
                  className='text-slate-50 font-bold capitalize'>
                  reach out
                </h3>
                <List className='flex justify-center gap-3'>
                  {avatar.socials.map((social) => (
                    <ListItem key={social.link}>
                      <a href={social.link}><social.Icon boxSize='8' /></a>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      <Image className='h-8 w-full' src="banner3.png" />

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
