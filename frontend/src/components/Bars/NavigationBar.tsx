import {
  Box,
  Image,
  Flex,
  Spacer,
  Divider,
  Button,
  Heading,
  useDisclosure,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import SignUp from '@components/Modals/SignUp';
import SignIn from '@components/Modals/SignIn';
import { ArrowForwardIcon } from '@chakra-ui/icons';

export default function NavigationBar() {
  const navigate = useNavigate();
  const {
    isOpen: isSignUpOpen,
    onOpen: openSignUp,
    onClose: closeSignUp,
  } = useDisclosure();

  const {
    isOpen: isSignInOpen,
    onOpen: openSignIn,
    onClose: closeSignIn,
  } = useDisclosure();

  const handleSignUpSuccess = () => {
    closeSignUp();
    openSignIn();
  };

  return (
    <Flex
      alignItems="center"
      bg="black"
      p={3}
      borderBottom="0.5px solid rgba(128, 128, 128, 0.5)"
    >
      <Image src="/logo-bb.png" h="25px" ml={3} />
      <Divider
        ml={10}
        mr={10}
        orientation="vertical"
        borderColor="white"
        borderWidth="1px"
        h="23px"
      />
      <Box display="flex">
        <Heading color="white" fontFamily="mono" mr={5} size="xs">
          <a href="#home">Home</a>
        </Heading>
        <Heading color="white" fontFamily="mono" ml={5} mr={5} size="xs">
          <a href="#features">Features</a>
        </Heading>
        <Heading color="white" fontFamily="mono" ml={5} mr={5} size="xs">
          <a href="#about-us">About us</a>
        </Heading>
        <Link to="/mission">
          <Heading color="white" fontFamily="mono" ml={5} size="xs">
            Mission
          </Heading>
        </Link>
      </Box>
      <Spacer />
      <Button
        color="white"
        colorScheme="gray"
        variant="ghost"
        size="xs"
        fontFamily="mono"
        _hover={{ bg: 'white', color: 'black' }}
        onClick={openSignIn} // open login modal
      >
        Log in
      </Button>
      <Button
        ml={3}
        mr={3}
        color="white"
        colorScheme="gray"
        variant="outline"
        size="xs"
        fontFamily="mono"
        _hover={{ bg: 'white', color: 'black' }}
        onClick={openSignUp} // open sign up modal
        rounded="full"
        rightIcon={<ArrowForwardIcon />}
      >
        Sign Up
      </Button>
      <SignUp
        isOpen={isSignUpOpen}
        onClose={closeSignUp}
        onSuccess={async () => handleSignUpSuccess()}
      />
      <SignIn
        isOpen={isSignInOpen}
        onClose={closeSignIn}
        onSuccess={() => navigate('/dashboard')}
      />
    </Flex>
  );
}
