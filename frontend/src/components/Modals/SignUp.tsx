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
  Checkbox,
  useToast,
  HStack,
  Flex,
  Heading,
  Center,
  Box,
  Divider,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useCreateUserMutation } from '@store/services/auth';
import { IoChevronForwardCircle } from 'react-icons/io5';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// SignUp Modal to handle user registration.
export default function SignUp({ isOpen, onClose, onSuccess }: ModalProps) {
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [favoriteLanguages, setFavoriteLanguages] = useState<string[]>([]);
  const [createUser] = useCreateUserMutation();
  const toast = useToast();

  // Handles checkbox state changes
  const handleCheckboxChange = (language: string) => {
    setFavoriteLanguages((prevLanguages) =>
      prevLanguages.includes(language)
        ? prevLanguages.filter((lang) => lang !== language)
        : [...prevLanguages, language],
    );
  };

  // Handles the user creation process.
  const handleCreate = () => {
    createUser({
      username,
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      favorite_languages: favoriteLanguages,
    })
      .unwrap()
      .then((data) => {
        console.log('User created ============>', data);
        toast({
          title: 'Account created 🚀',
          description: 'You’re all set. Welcome to the code club!',
          status: 'success',
          variant: 'subtle',
          position: 'bottom-left',
          isClosable: true,
        });
        handleClose();
        if (onSuccess) {
          onSuccess();
        }
      })
      .catch((err) => {
        let errorMessage = 'Oops! Something went wrong.';

        // custom error handling based on the response error message
        if (err.data.message.includes('Duplicate entry')) {
          if (err.data.message.includes('IDX_')) {
            errorMessage = 'Email already in use. Try a different one!';
          } else if (err.data.message.includes('idx_username')) {
            errorMessage = 'Username taken. Pick another one!';
          }
        } else if (err.data.message.includes('username is required')) {
          errorMessage = 'Username shouldn’t have spaces. Choose a valid one!';
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
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setFavoriteLanguages([]);
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
      <ModalContent background="linear-gradient(to bottom, #001845, #524175)">
        <ModalCloseButton color="white" />
        <ModalBody pb={6}>
          <Flex alignItems="center" justifyContent="center">
            <Box mt={5} alignItems="center" justifyContent="center">
              <Heading color="white" fontFamily="mono" textAlign="center">
                Sign Up
              </Heading>
              <Center>
                <Heading
                  textAlign="center"
                  fontSize="sm"
                  mt={2}
                  fontFamily="sans-serif"
                  color="white"
                  opacity="0.7"
                >
                  Let's create you an account
                </Heading>
              </Center>
            </Box>
          </Flex>
          <Center>
            <Divider mt={6} mb={5} w="90%" />
          </Center>
          <Box
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
                fontSize="sm"
              >
                Username
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

            <FormControl mt={4} w="95%">
              <FormLabel
                color="white"
                opacity="0.7"
                fontFamily="mono"
                fontSize="sm"
              >
                First Name
              </FormLabel>
              <Input
                color="white"
                fontFamily="mono"
                fontSize="sm"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4} w="95%">
              <FormLabel
                color="white"
                opacity="0.7"
                fontFamily="mono"
                fontSize="sm"
              >
                Last Name
              </FormLabel>
              <Input
                color="white"
                fontFamily="mono"
                fontSize="sm"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4} w="95%">
              <FormLabel
                color="white"
                opacity="0.7"
                fontFamily="mono"
                fontSize="sm"
              >
                Email
              </FormLabel>
              <Input
                type="email"
                color="white"
                fontFamily="mono"
                fontSize="sm"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4} w="95%">
              <FormLabel
                color="white"
                opacity="0.7"
                fontFamily="mono"
                fontSize="sm"
              >
                Password
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

            <FormControl mt={5} w="95%">
              <FormLabel
                color="white"
                opacity="0.7"
                fontFamily="mono"
                fontSize="sm"
              >
                Select your toolkit
              </FormLabel>
              <HStack spacing={3}>
                <Checkbox
                  colorScheme="orange"
                  color="white"
                  opacity="0.7"
                  fontFamily="mono"
                  size="sm"
                  onChange={() => handleCheckboxChange('JavaScript')}
                  isChecked={favoriteLanguages.includes('JavaScript')}
                >
                  JavaScript
                </Checkbox>
                <Checkbox
                  colorScheme="orange"
                  color="white"
                  opacity="0.7"
                  fontFamily="mono"
                  size="sm"
                  onChange={() => handleCheckboxChange('Python')}
                  isChecked={favoriteLanguages.includes('Python')}
                >
                  Python
                </Checkbox>
                <Checkbox
                  colorScheme="orange"
                  color="white"
                  opacity="0.7"
                  fontFamily="mono"
                  size="sm"
                  onChange={() => handleCheckboxChange('TypeScript')}
                  isChecked={favoriteLanguages.includes('TypeScript')}
                >
                  TypeScript
                </Checkbox>
                <Checkbox
                  colorScheme="orange"
                  color="white"
                  opacity="0.7"
                  fontFamily="mono"
                  size="sm"
                  onChange={() => handleCheckboxChange('Swift')}
                  isChecked={favoriteLanguages.includes('Swift')}
                >
                  Swift
                </Checkbox>
              </HStack>
            </FormControl>
          </Box>
        </ModalBody>
        <Box display="flex" justifyContent="center" mt={3}>
          <Button
            ref={finalRef}
            rounded="full"
            w="70%"
            size="md"
            colorScheme="orange"
            fontFamily="mono"
            isDisabled={
              !username || !firstName || !lastName || !email || !password
            }
            onClick={handleCreate}
            rightIcon={<IoChevronForwardCircle fontSize="22px" />}
          >
            Join the Code Quest
          </Button>
        </Box>
        <ModalFooter mb={4}></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
