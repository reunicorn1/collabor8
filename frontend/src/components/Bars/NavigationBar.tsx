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
import { Link } from 'react-router-dom';
import SignUp from '@components/Modals/SignUp';
import SignIn from '@components/Modals/SignIn';

export default function NavigationBar() {
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
    <Flex alignItems="center" bg="black" p={3}>
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
          Home
        </Heading>
        <Heading color="white" fontFamily="mono" ml={5} mr={5} size="xs">
          Features
        </Heading>
        <Link to="/about">
          <Heading color="white" fontFamily="mono" ml={5} size="xs">
            About
          </Heading>
        </Link>
      </Box>
      <Spacer />
      <Button
        ml={7}
        color="white"
        colorScheme="gray"
        variant="outline"
        size="xs"
        fontFamily="mono"
        _hover={{ bg: 'white', color: 'black' }}
        onClick={openSignUp} // open sign up modal
      >
        Sign Up
      </Button>
      <Button
        ml={7}
        color="white"
        colorScheme="gray"
        variant="outline"
        size="xs"
        fontFamily="mono"
        _hover={{ bg: 'white', color: 'black' }}
        onClick={openSignIn} // open login modal
      >
        Sign in
      </Button>
      <SignUp
        isOpen={isSignUpOpen}
        onClose={closeSignUp}
        onSuccess={handleSignUpSuccess}
      />
      <SignIn isOpen={isSignInOpen} onClose={closeSignIn} />
    </Flex>
  );
}
