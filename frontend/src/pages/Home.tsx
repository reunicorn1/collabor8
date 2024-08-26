import { useState, useEffect } from 'react';
import { Box, Flex, Heading, Text, Center, Image } from '@chakra-ui/react';
import NavigationBar from '@components/Bars/NavigationBar';
import SignUp from '@components/Modals/SignUp';
import ResetPasswordModal from '@components/Modals/ResetPassword';
import useTypingEffect from '../hooks/useTypingEffect';
import { useLocation } from 'react-router-dom';
import { HiUsers } from 'react-icons/hi2';
import { PiCursorClickFill } from 'react-icons/pi';
import { ImDatabase } from 'react-icons/im';
import { TbLayoutDashboardFilled } from 'react-icons/tb';

const Home = () => {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();

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

  const typedText = useTypingEffect(
    '  Collabor8 is your ultimate code collaboration tool. Code with your team in real-time, and never miss a beat.',
    50,
    animationStarted,
  );

  return (
    <>
      <NavigationBar />
      <Flex bg="black" justifyContent="center">
        <Box
          bgGradient="radial-gradient(circle at 20% 600%, #ff7e5f, #6699CC, #76449A, transparent)"
          w="100%"
          display="flex"
          justifyContent="center"
          p={5}
          className="fade"
          id="home"
        >
          <Box>
            <Flex justifyContent="flex-start" alignItems="center" mb="-30px">
              <Text color="#F16145" fontFamily="mono" fontSize="110px">
                {'==>'}
              </Text>
              <Text color="white" fontFamily="mono" fontSize="110px">
                code
              </Text>
            </Flex>
            <Flex justifyContent="flex-start" alignItems="center" mb="-30px">
              <Text color="white" fontFamily="mono" fontSize="110px">
                together
              </Text>
              <Text color="#76449A" fontFamily="mono" fontSize="110px">
                {'}'}
              </Text>
              <Text color="#F6D277" fontFamily="mono" fontSize="110px">
                ..
              </Text>
            </Flex>
            <Flex alignItems="center" mb="-30px">
              <Text
                color="white"
                w="200px"
                fontSize="16px"
                textAlign="left"
                fontFamily="mono"
              >
                Collaborative coding made simple. Join developers worldwide and
                create together.
              </Text>
              <Text color="white" fontFamily="mono" fontSize="110px">
                innovate
              </Text>
            </Flex>
            <Flex alignItems="center">
              <Box bg="#F16145" w="225px" h="60px" mr={30}></Box>
              <Text color="white" fontFamily="mono" fontSize="110px">
                faster
              </Text>
              <Text fontFamily="mono" fontSize="110px" color="#52A0D8">
                ^
              </Text>
              <Text fontFamily="mono" fontSize="100px" color="#B4B4B4">
                *
              </Text>
            </Flex>
          </Box>
        </Box>
      </Flex>
      <Box bg="white" h="200px" display="flex" justifyContent="center" pt={20}>
        <Text fontSize="2xl" color="black" fontFamily="mono" w="900px">
          {typedText}
        </Text>
      </Box>
      <Box justifyContent="center" bg="black" w="100%">
        <Center mb={10} bg="black" pt={20}>
          <Text
            fontFamily="mono"
            fontSize="35px"
            w="50%"
            textAlign="center"
            color="white"
          >
            Why Collabor8 is the <span className="ultimate">Ultimate</span>
            &nbsp; Tool for Team Collaboration
          </Text>
        </Center>
        <Box
          alignItems="center"
          backgroundImage={`url('/loop.png')`}
          backgroundSize="cover"
          backgroundPosition="center"
          w="100%"
          pb={20}
          id="features"
        >
          <Flex justifyContent="center" alignItems="center">
            <Box
              className="glass"
              p={10}
              textAlign="center"
              w="400px"
              background={'rgba(179, 74, 18, 0.25)'}
              border="5px solid #F16145"
              m={6}
            >
              <Center mb={4}>
                <HiUsers fontSize="90px" color="#F16145" />
              </Center>
              <Heading
                textAlign="center"
                fontFamily="mono"
                size="lg"
                color="white"
                mb={2}
              >
                Instant Updates
              </Heading>
              <Text textAlign="left" color="white" opacity="0.9">
                Experience the power of real-time editing where every team
                member can see changes as they happen. No need to refresh or
                wait for updates—your document evolves instantly as your team
                works together.
              </Text>
            </Box>
            <Box
              className="glass"
              p={10}
              textAlign="center"
              w="400px"
              border="5px solid #52A0D8"
              m={6}
              background={'rgba(96, 163, 250, 0.1)'}
            >
              <Center mb={4}>
                <PiCursorClickFill fontSize="90px" color="#52A0D8" />
              </Center>
              <Heading
                textAlign="center"
                fontFamily="mono"
                size="lg"
                color="white"
                mb={2}
              >
                Live Cursor Tracking
              </Heading>
              <Text textAlign="left" color="white" opacity="0.9">
                Keep track of who’s working on what with live cursors,
                highlighting, and color-coded indicators for each collaborator.
                You’ll always know where your teammates are making edits.
              </Text>
            </Box>
          </Flex>
          <Flex justifyContent="center" alignItems="center">
            <Box
              className="glass"
              p={10}
              textAlign="center"
              w="400px"
              background={'rgba(240, 215, 94, 0.1)'}
              border="5px solid #F6D277"
              m={6}
            >
              <Center mb={4}>
                <ImDatabase fontSize="90px" color="#F6D277" />
              </Center>
              <Heading
                textAlign="center"
                fontFamily="mono"
                size="lg"
                color="white"
                mb={2}
              >
                Secure Data Storage
              </Heading>
              <Text textAlign="left" color="white" opacity="0.9">
                All your documents are stored securely on our servers with
                robust security measures in place to protect against data
                breaches and unauthorized access. Your work is not only
                accessible when you need it but also protected from threats.
              </Text>
            </Box>
            <Box
              className="glass"
              p={10}
              textAlign="center"
              w="400px"
              background={'rgba(131, 12, 236, 0.1)'}
              border="5px solid #76449A"
              m={6}
            >
              <Center mb={4}>
                <TbLayoutDashboardFilled fontSize="90px" color="#76449A" />
              </Center>
              <Heading
                textAlign="center"
                fontFamily="mono"
                size="lg"
                color="white"
                mb={2}
              >
                Clean and Simple Design
              </Heading>
              <Text textAlign="left" color="white" opacity="0.7" pb={6}>
                Our user-friendly interface is designed to keep you focused on
                your work. Whether you’re tech-savvy or a novice, Collabor8’s
                intuitive design ensures that anyone can start collaborating
                immediately.
              </Text>
            </Box>
          </Flex>
        </Box>
      </Box>
      <Flex bg="#F6D277" justifyContent="center" alignItems="center" pt={20}>
        <Box
          alignItems="center"
          textAlign="center"
          position="relative"
          w="1000px"
          h="100%"
          p={20}
        >
          <Heading fontFamily="mono" fontSize="83px" zIndex="1">
            Meet a Text Editor that makes an impact
          </Heading>
          <Image
            src="giphy.gif"
            position="absolute"
            top="0"
            left="50%"
            transform="translateX(-50%)"
            zIndex="2"
          />
          <Center>
            <Text fontSize="30px" w="700px" mb={10} mt={10}>
              Accelerate your workflow and shorten your cycle with all-in one
              platform for efficent code reviews
            </Text>
          </Center>
        </Box>
      </Flex>
      <Flex
        justifyContent="center"
        alignItems="center"
        bg="white"
        id="about-us"
      >
        <Box p={10} pb={10}>
          <Center>
            <Heading mb={20} size="2xl" fontFamily="mono">
              Our Team
            </Heading>
          </Center>
          <Flex>
            <Box
              justifyContent="center"
              alignItems="center"
              textAlign="center"
              borderBottom="10px solid #52A0D8"
              p={2}
              m={4}
            >
              <Center>
                <Image src="/aa.png" h="250px" />
              </Center>
              <Heading fontSize="25px" fontFamily="mono">
                Abdallah Abdelrahman
              </Heading>
            </Box>
            <Box
              justifyContent="center"
              alignItems="center"
              textAlign="center"
              borderBottom="10px solid #F16145"
              p={2}
              m={4}
            >
              <Center>
                <Image src="/mea.png" h="250px" />
              </Center>
              <Heading fontSize="25px" fontFamily="mono">
                Mohamed Elfadil Abdalla
              </Heading>
            </Box>
            <Box
              justifyContent="center"
              alignItems="center"
              textAlign="center"
              borderBottom="10px solid #76449A"
              p={2}
              m={4}
            >
              <Image src="/mab.png" h="250px" />
              <Heading fontSize="25px" fontFamily="mono">
                Mohannad Babiker
              </Heading>
            </Box>
            <Box
              justifyContent="center"
              alignItems="center"
              textAlign="center"
              borderBottom="10px solid #F6D277"
              p={2}
              m={4}
            >
              <Image src="/ro.png" h="250px" />
              <Heading fontSize="25px" fontFamily="mono">
                Reem Osama
              </Heading>
            </Box>
          </Flex>
        </Box>
      </Flex>
      <Image src="banner3.png" />

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

export default Home;
