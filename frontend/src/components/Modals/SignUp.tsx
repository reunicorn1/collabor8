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
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useCreateUserMutation } from '@store/services/auth';

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
      <ModalContent
        bg="brand.900"
        top="20px"
        right="40px"
        position="absolute"
        transform="none"
      >
        <ModalHeader color="white" fontFamily="mono" fontSize="xxx">
          Sign Up
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel color="grey" fontFamily="mono" fontSize="xx">
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

          <FormControl mt={4}>
            <FormLabel color="grey" fontFamily="mono" fontSize="xx">
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

          <FormControl mt={4}>
            <FormLabel color="grey" fontFamily="mono" fontSize="xx">
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

          <FormControl mt={4}>
            <FormLabel color="grey" fontFamily="mono" fontSize="xx">
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

          <FormControl mt={4}>
            <FormLabel color="grey" fontFamily="mono" fontSize="xx">
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

          <FormControl mt={4}>
            <FormLabel color="grey" fontFamily="mono" fontSize="xx">
              Select your toolkit{' '}
            </FormLabel>
            <HStack spacing={3}>
              <Checkbox
                colorScheme="orange"
                color="white"
                fontFamily="mono"
                size="sm"
                fontSize="sm"
                onChange={() => handleCheckboxChange('JavaScript')}
                isChecked={favoriteLanguages.includes('JavaScript')}
              >
                JavaScript
              </Checkbox>
              <Checkbox
                colorScheme="orange"
                color="white"
                fontFamily="mono"
                size="sm"
                fontSize="sm"
                onChange={() => handleCheckboxChange('Python')}
                isChecked={favoriteLanguages.includes('Python')}
              >
                Python
              </Checkbox>
              <Checkbox
                colorScheme="orange"
                color="white"
                fontFamily="mono"
                size="sm"
                fontSize="sm"
                onChange={() => handleCheckboxChange('TypeScript')}
                isChecked={favoriteLanguages.includes('TypeScript')}
              >
                TypeScript
              </Checkbox>
              <Checkbox
                colorScheme="orange"
                color="white"
                fontFamily="mono"
                size="sm"
                fontSize="sm"
                onChange={() => handleCheckboxChange('Swift')}
                isChecked={favoriteLanguages.includes('Swift')}
              >
                Swift
              </Checkbox>
            </HStack>
          </FormControl>
        </ModalBody>

        <ModalFooter mb={4}>
          <Button
            colorScheme="orange"
            mr={3}
            size="sm"
            fontFamily="mono"
            isDisabled={
              !username || !firstName || !lastName || !email || !password
            }
            onClick={handleCreate}
            ref={finalRef}
          >
            Join the Code Quest
          </Button>
          <Button size="sm" fontFamily="mono" onClick={handleClose}>
            Abort Registration
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
