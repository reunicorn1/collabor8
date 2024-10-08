import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  Flex,
  Center,
  Box,
  Heading,
  useToast,
  Divider,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { IoChevronForwardCircle } from 'react-icons/io5';
import { useLoginUserMutation } from '@store/services/auth';
import PasswordReset from './PasswordReset';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data: any) => void;
  is_invited?: boolean;
}

export default function SignIn({
  is_invited,
  isOpen,
  onClose,
  onSuccess,
}: ModalProps) {
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading }] = useLoginUserMutation();
  const [isResetPasswordOpen, setResetPasswordOpen] = useState(false);
  const toast = useToast();

  // Handles the login process
  const handleLogin = () => {
    if (!username.trim()) {
      toast({
        title: 'Whoops! 🤔',
        description:
          'Username can’t be empty or just spaces. Give it another shot!',
        status: 'error',
        variant: 'subtle',
        position: 'bottom-right',
        isClosable: true,
      });
      return;
    }

    if (/guest/.test(username.trim().toLowerCase())) {
      toast({
        title: 'Invalid Username',
        description: 'guest as username is reserved. 🔑',
        status: 'warning',
        isClosable: true,
        variant: 'subtle',
      });
      return;
    }

    login({ username, password, is_invited })
      .unwrap()
      .then((data) => {
        console.log('Login successful ===========>', data);
        toast({
          title: 'Welcome back! 🎉',
          description: 'You’re now logged in. Let’s code!',
          status: 'success',
          variant: 'subtle',
          position: 'bottom-left',
          isClosable: true,
        });
        // we use Inversion of Control here
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess(data);
        }
        handleClose(); // Close & navigate to dashboard modal on success
      })
      .catch((err) => {
        let errorMessage = 'Login failed.';

        // Custom error handling based on the response error message
        if (
          err.data?.message.includes('User with query') &&
          err.data?.message.includes('not found')
        ) {
          if (username.trim() === '') {
            errorMessage = 'Username can’t be empty or just spaces. Try again!';
          } else {
            errorMessage =
              'Invalid username or password. Double-check your creds!';
          }
        } else if (err.data?.message.includes('User is not verified')) {
          errorMessage =
            'Account not verified. Check your email for the magic link.';
        } else if (err.data?.message.includes('Invalid password')) {
          errorMessage =
            'Invalid username or password. Double-check your creds!';
        }

        toast({
          title: errorMessage,
          status: 'error',
          variant: 'subtle',
          position: 'bottom-left',
          isClosable: true,
        });
      })
      .finally(() => {});
  };

  // Opens the password reset modal
  const handleResetPassword = () => {
    setResetPasswordOpen(true);
  };

  // Resets the input fields
  const handleClose = () => {
    setUsername('');
    setPassword('');
    onClose();
  };

  // Closes the password reset modal
  const handleResetPasswordClose = () => {
    setResetPasswordOpen(false);
  };

  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={handleClose}
      >
        <ModalOverlay />
        <ModalContent
          background="linear-gradient(to bottom, #001845, #524175)"
          w={['95%', '80%', '60%', '50%', '40%']}
        >
          <ModalCloseButton color="white" />
          <ModalBody pb={6}>
            <Flex alignItems="center" justifyContent="center">
              <Box mt={5} alignItems="center" justifyContent="center">
                <Heading
                  color="white"
                  fontFamily="mono"
                  fontSize={['lg', 'xl']}
                  textAlign="center"
                >
                  Sign In
                </Heading>
                <Center>
                  <Heading
                    fontSize={['sm', 'md']}
                    mt={2}
                    fontFamily="sans-serif"
                    textAlign="center"
                    color="white"
                    opacity="0.7"
                  >
                    Let's get you in
                  </Heading>
                </Center>
              </Box>
            </Flex>
            <Center>
              <Divider mt={6} mb={5} w="90%" />
            </Center>
            <Box
              mt={3}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <FormControl w="95%">
                <FormLabel
                  color="white"
                  opacity="0.7"
                  fontFamily="mono"
                  fontSize={['xs', 'sm']}
                >
                  Username (a.k.a. your unique ID)
                </FormLabel>
                <Input
                  w="95%"
                  color="white"
                  fontFamily="mono"
                  fontSize={['sm', 'md']}
                  ref={initialRef}
                  placeholder="Enter your Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => {
                    if (
                      e.key === 'Enter' &&
                      username &&
                      password &&
                      !isLoading
                    ) {
                      handleLogin();
                    }
                  }}
                />
              </FormControl>

              <FormControl mt={6} w="95%">
                <FormLabel
                  color="white"
                  opacity="0.7"
                  fontFamily="mono"
                  fontSize={['xs', 'sm']}
                >
                  Password (the secret sauce)
                </FormLabel>
                <Input
                  w="95%"
                  type="password"
                  color="white"
                  fontFamily="mono"
                  fontSize={['sm', 'md']}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (
                      e.key === 'Enter' &&
                      username &&
                      password &&
                      !isLoading
                    ) {
                      handleLogin();
                    }
                  }}
                />
              </FormControl>
            </Box>
          </ModalBody>
          <Box display="flex" justifyContent="center" mt={6}>
            <Button
              ref={finalRef}
              isDisabled={!username || !password || isLoading}
              isLoading={isLoading}
              onClick={handleLogin}
              rounded="full"
              w="60%"
              size={['sm', 'md']}
              colorScheme="orange"
              fontFamily="mono"
              rightIcon={<IoChevronForwardCircle fontSize="22px" />}
            >
              Authenticate
            </Button>
          </Box>
          <Center>
            <Button
              color="white"
              mt={4}
              fontFamily="sans-serif"
              opacity="0.7"
              fontSize={['xs', 'sm']}
              variant="link"
              onClick={handleResetPassword}
            >
              Forgot Password?
            </Button>
          </Center>
          <ModalFooter mb={4}></ModalFooter>
        </ModalContent>
      </Modal>

      <PasswordReset
        isOpen={isResetPasswordOpen}
        onClose={handleResetPasswordClose}
        onSuccess={() => {
          handleResetPasswordClose();
          toast({
            title: 'Password Reset Sent',
            description: 'Please check your email to reset your password.',
            status: 'success',
            variant: 'subtle',
            position: 'bottom-left',
            isClosable: true,
          });
        }}
      />
    </>
  );
}
