import {
  Box,
  Image,
  Flex,
  Spacer,
  Divider,
  Button,
  Heading,
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
} from '@chakra-ui/react'
import { useRef } from 'react';

export default function NavigationBar() {
  const navigate = useNavigate();
  const [isLessThan768] = useMediaQuery('(max-width: 768px)');
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
    <>
      {
        isLessThan768
          ? (
            <MenuDrawer
              renderFooter={(onClose) => {
                return (
                  <>
                    <Button
                      color="white"
                      colorScheme="gray"
                      variant="ghost"
                      _hover={{ bg: 'white', color: 'black' }}
                      onClick={() => {
                        onClose()
                        openSignIn()
                      }} // open login modal
                    >
                      Log in
                    </Button>
                    <Button
                      color="white"
                      colorScheme="gray"
                      variant="outline"
                      _hover={{ bg: 'white', color: 'black' }}
                      onClick={() => {
                        onClose()
                        openSignUp()
                      }} // open sign up modal
                      rounded="full"
                      rightIcon={<ArrowForwardIcon />}
                    >
                      Sign Up
                    </Button>
                  </>

                )
              }}
            />
          )
          : (
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
                py={4}
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
            </Flex>
          )
      }
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
  renderFooter: (onClose: () => void) => JSX.Element
}

function MenuDrawer({ renderFooter }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()

  return (
    <Box className='sticky -top-1 z-10 flex justify-between items-center py-4 px-4 bg-black'>
      <Box w='120px'>
        <Image src="/logo-bb.png" w='100%' />
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
        placement='right'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton className='!bg-slate-100' />
          <DrawerHeader className='!pt-12 bg-black'>
            <Image src="/logo-bb.png" w='100%' />
          </DrawerHeader>

          <DrawerBody className='text-lg font-mono bg-slate-100'>
            <List className='flex flex-col gap-4 mt-8'>
              <ListItem>
                <a href='#home'>Home</a>
              </ListItem>
              <ListItem>
                <a href='#features'>features</a>
              </ListItem>
              <ListItem>
                <a href='#about-us'>about us</a>
              </ListItem>
              <ListItem>
                <Link to='/mission'>mission</Link>
              </ListItem>
            </List>
          </DrawerBody>

          <DrawerFooter className='text-lg font-mono bg-black gap-2'>
            {renderFooter(onClose)}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}
