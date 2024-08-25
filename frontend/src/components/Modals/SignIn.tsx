import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useLoginUserMutation } from '@store/services/auth';
import { useNavigate } from 'react-router-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// SignIn Modal handles user login.
export default function SignIn({ isOpen, onClose }: ModalProps) {
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login] = useLoginUserMutation();
  const toast = useToast();
  const navigate = useNavigate();

  // Handles the login process.
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

    login({ username, password })
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
        navigate('/dashboard');
        handleClose(); // close & navigate to dashboard modal on success
      })
      .catch((err) => {
        let errorMessage = 'Login failed.';

        // Custom error handling based on the response error message
        if (
          err.data.message.includes('User with query') &&
          err.data.message.includes('not found')
        ) {
          if (username.trim() === '') {
            errorMessage = 'Username can’t be empty or just spaces. Try again!';
          } else {
            errorMessage =
              'Invalid username or password. Double-check your creds!';
          }
        } else if (err.data.message.includes('User is not verified')) {
          errorMessage =
            'Account not verified. Check your email for the magic link.';
        }

        toast({
          title: errorMessage,
          status: 'error',
          variant: 'subtle',
          position: 'bottom-left',
          isClosable: true,
        });
      });
  };

  // Resets the input fields
  const handleClose = () => {
    setUsername('');
    setPassword('');
    onClose();
  };

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={handleClose}
    >
      <ModalOverlay />
      <ModalContent
        bg="brand.900"
        top="20px"
        right="40px"
        position="absolute"
        transform="none"
      >
        <ModalHeader color="white" fontFamily="mono" fontSize="xx">
          Secure Login: Enter Your Credentials
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel color="grey" fontFamily="mono" fontSize="md">
              Username (a.k.a. your unique ID)
            </FormLabel>
            <Input
              color="white"
              fontFamily="mono"
              fontSize="sm"
              ref={initialRef}
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel color="grey" fontFamily="mono" fontSize="md">
              Password (the secret sauce)
            </FormLabel>
            <Input
              type="password"
              color="white"
              fontFamily="mono"
              fontSize="sm"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter mb={4}>
          <Button
            colorScheme="orange"
            mr={3}
            size="sm"
            fontFamily="mono"
            isDisabled={!username || !password}
            onClick={handleLogin}
            ref={finalRef}
          >
            Authenticate
          </Button>
          <Button size="sm" fontFamily="mono" onClick={handleClose}>
            Abort Mission
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
