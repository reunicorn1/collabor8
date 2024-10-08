import {
  Box,
  Image,
  Flex,
  Button,
  useDisclosure,
  useMediaQuery,
  List,
  ListItem,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import SignUp from '@components/Modals/SignUp';
import SignIn from '@components/Modals/SignIn';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react';
import CallToAction from '@components/Buttons/CallToAction';

export default function NavigationBar() {
  const navigate = useNavigate();
  const [isLessThan900] = useMediaQuery('(max-width: 900px)');
  const menuBarRef = useRef<HTMLDivElement | null>(null); // Updated to allow null

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

  useEffect(() => {
    const handleScroll = () => {
      if (menuBarRef.current) {
        if (window.scrollY > 50) {
          menuBarRef.current.classList.add('bg-brand');
        } else {
          menuBarRef.current.classList.remove('bg-brand');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {isLessThan900 ? (
        <MenuDrawer
          renderFooter={(onClose) => (
            <>
              <Button
                color="white"
                colorScheme="gray"
                variant="ghost"
                _hover={{ bg: 'white', color: 'black' }}
                onClick={() => {
                  onClose();
                  openSignIn();
                }}
              >
                Log in
              </Button>
              <Button
                color="white"
                colorScheme="gray"
                variant="outline"
                _hover={{ bg: 'white', color: 'black' }}
                onClick={() => {
                  onClose();
                  openSignUp();
                }}
                rounded="full"
                rightIcon={<ArrowForwardIcon />}
              >
                Sign Up
              </Button>
            </>
          )}
        />
      ) : (
        <Flex
          ref={menuBarRef}
          zIndex={100}
          position="fixed"
          top={0}
          left={0}
          w="100%"
          alignItems="center"
          px={3}
          p={4}
        >
          <Image src="/logo-bb.png" h="25px" ml={3} />
          <List className="flex items-center gap-10 ms-auto text-white font-semibold font-mono">
            <ListItem>
              <a href="#home" onClick={() => window.scrollTo({ top: 0 })}>
                Home
              </a>
            </ListItem>
            <ListItem>
              <a href="#features">Features</a>
            </ListItem>
            <ListItem>
              <a href="#about-us">About us</a>
            </ListItem>
            <ListItem>
              <Link to="/mission">Mission</Link>
            </ListItem>
            <ListItem>
              <CallToAction />
            </ListItem>
          </List>
          <Button
            ms="auto"
            color="white"
            colorScheme="gray"
            variant="ghost"
            size="sm"
            fontFamily="mono"
            _hover={{ bg: 'white', color: 'black' }}
            onClick={openSignIn}
          >
            Log in
          </Button>
          <Button
            ml={3}
            mr={3}
            py={4}
            color="white"
            colorScheme="gray"
            variant="outline"
            size="sm"
            fontFamily="mono"
            _hover={{ bg: 'white', color: 'black' }}
            onClick={openSignUp}
            rounded="full"
            rightIcon={<ArrowForwardIcon />}
          >
            Sign Up
          </Button>
        </Flex>
      )}
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
    </>
  );
}

type Props = {
  renderFooter: (onClose: () => void) => React.ReactNode;
};

function MenuDrawer({ renderFooter }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement | null>(null); // updated to allow null
  const menuBarRef = useRef<HTMLDivElement | null>(null); // updated to allow null

  useEffect(() => {
    const handleScroll = () => {
      if (menuBarRef.current) {
        if (window.scrollY > 50) {
          menuBarRef.current.classList.add('bg-brand');
        } else {
          menuBarRef.current.classList.remove('bg-brand');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Box
      ref={menuBarRef}
      className="trasnition fixed left-0 top-0 w-full z-10 flex justify-between items-center p-4"
    >
      <Box w="120px">
        <Image src="/logo-bb.png" w="100%" />
      </Box>
      <Button
        ref={btnRef}
        onClick={onOpen}
        className={`
        flex !p-0 !bg-transparent !text-slate-200 !font-mono capitalize
        tracking-wider
        before:content-['<'] before:text-yellow-200 after:content-['/>'] after:text-[#F16145] after:ms-1
        `}
      >
        menu
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton className="!bg-slate-100" />
          <DrawerHeader className="!pt-12 bg-black">
            <Image src="/logo-bb.png" w="100%" />
          </DrawerHeader>

          <DrawerBody className="text-lg font-mono bg-slate-100">
            <List className="flex flex-col gap-4 mt-8">
              <ListItem>
                <a href="#home" onClick={() => window.scrollTo({ top: 0 })}>
                  Home
                </a>
              </ListItem>
              <ListItem>
                <a href="#features">features</a>
              </ListItem>
              <ListItem>
                <a href="#about-us">about us</a>
              </ListItem>
              <ListItem>
                <Link to="/mission">mission</Link>
              </ListItem>
            </List>
          </DrawerBody>

          <DrawerFooter className="text-lg font-mono bg-black gap-2">
            {renderFooter(onClose)}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
