import React, { useRef, useState } from 'react';
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
  Checkbox,
  useToast,
  Flex,
  Heading,
  Center,
  Box,
  Divider,
  FormErrorMessage,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { IoChevronForwardCircle } from 'react-icons/io5';
import { useCreateUserMutation } from '@store/services/auth';

// Regular expression for validating email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  // (data: any) => Promise<void> for the next developer,
  // trying to fix type annotation for this function:
  // I've tried: 0x0f (in hex)
  // pass the number of tries to the next developer
  onSuccess?: (data: any) => Promise<void>;
  is_invited?: boolean;
}

// SignUp Modal to handle user registration.
export default function SignUp({
  is_invited,
  isOpen,
  onClose,
  onSuccess,
}: ModalProps) {
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [favoriteLanguages, setFavoriteLanguages] = useState<string[]>([]);
  const [emailError, setEmailError] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [createUser, { isLoading }] = useCreateUserMutation();
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
    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email format.');
      return;
    }

    createUser({
      username,
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      favorite_languages: favoriteLanguages,
      is_invited,
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
        return data;
      })
      .then(async (data) => {
        if (onSuccess) {
          await onSuccess(data);
          handleClose();
        }
      })
      .catch((err) => {
        let errorMessage = 'Oops! Something went wrong.';
        console.log(err);
        // Custom error handling based on the response error message
        if (err.status === 409) {
          if (err.data?.message.includes('User with email')) {
            errorMessage = 'Email already in use. Try a different one!';
          } else if (err.data.message.includes('User with username')) {
            errorMessage = 'Username taken. Pick another one!';
          }
        } else if (err.data?.message.includes('username is required')) {
          errorMessage = 'Username shouldn’t have spaces. Choose a valid one!';
        }

        toast({
          title: errorMessage,
          status: 'error',
          variant: 'subtle',
          position: 'bottom-left',
          isClosable: true,
        });
      })
      .finally(() => () => {});
  };

  // Resets the input fields
  const handleClose = () => {
    setUsername('');
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFavoriteLanguages([]);
    setEmailError('');
    setPasswordMismatch(false);
    onClose();
  };

  // Validate email and password fields on change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (!emailRegex.test(value)) {
      setEmailError('Invalid email format.');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (value !== confirmPassword) {
      setPasswordMismatch(true);
    } else {
      setPasswordMismatch(false);
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (password !== value) {
      setPasswordMismatch(true);
    } else {
      setPasswordMismatch(false);
    }
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
                textAlign="center"
                fontSize={['lg', 'xl', '2xl']}
              >
                Sign Up
              </Heading>
              <Center>
                <Heading
                  textAlign="center"
                  fontSize={['xs', 'sm', 'md']}
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
            <FormControl w="95%" isInvalid={!!emailError}>
              <FormLabel
                color="white"
                opacity="0.7"
                fontFamily="mono"
                fontSize={['xs', 'sm']}
              >
                Email
              </FormLabel>
              <Input
                type="email"
                color="white"
                fontFamily="mono"
                fontSize={['sm', 'md']}
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
              />
              {emailError && <FormErrorMessage>{emailError}</FormErrorMessage>}
            </FormControl>

            <FormControl mt={4} w="95%">
              <FormLabel
                color="white"
                opacity="0.7"
                fontFamily="mono"
                fontSize={['xs', 'sm']}
              >
                Password
              </FormLabel>
              <Input
                type="password"
                color="white"
                fontFamily="mono"
                fontSize={['sm', 'md']}
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
              />
            </FormControl>

            <FormControl mt={4} w="95%">
              <FormLabel
                color="white"
                opacity="0.7"
                fontFamily="mono"
                fontSize={['xs', 'sm']}
              >
                Confirm Password
              </FormLabel>
              <Input
                type="password"
                color="white"
                fontFamily="mono"
                fontSize={['sm', 'md']}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              {passwordMismatch && (
                <FormErrorMessage>Passwords do not match.</FormErrorMessage>
              )}
            </FormControl>

            <FormControl mt={4} w="95%">
              <FormLabel
                color="white"
                opacity="0.7"
                fontFamily="mono"
                fontSize={['xs', 'sm']}
              >
                Username
              </FormLabel>
              <Input
                type="text"
                color="white"
                fontFamily="mono"
                fontSize={['sm', 'md']}
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
                fontSize={['xs', 'sm']}
              >
                First Name
              </FormLabel>
              <Input
                type="text"
                color="white"
                fontFamily="mono"
                fontSize={['sm', 'md']}
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
                fontSize={['xs', 'sm']}
              >
                Last Name
              </FormLabel>
              <Input
                type="text"
                color="white"
                fontFamily="mono"
                fontSize={['sm', 'md']}
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </FormControl>

            <FormControl mt={5} w="95%">
              <FormLabel
                color="white"
                opacity="0.7"
                fontFamily="mono"
                fontSize={['xs', 'sm']}
              >
                Select your toolkit
              </FormLabel>
              <Wrap spacing={4} justify="center">
                {['JavaScript', 'Python', 'TypeScript', 'Swift'].map((lang) => (
                  <WrapItem key={lang}>
                    <Checkbox
                      colorScheme="orange"
                      color="white"
                      opacity="0.7"
                      fontFamily="mono"
                      size={['sm', 'md']}
                      onChange={() => handleCheckboxChange(lang)}
                      isChecked={favoriteLanguages.includes(lang)}
                    >
                      {lang}
                    </Checkbox>
                  </WrapItem>
                ))}
              </Wrap>
            </FormControl>
          </Box>
        </ModalBody>

        <Box display="flex" justifyContent="center" mt={3}>
          <Button
            ref={finalRef}
            rounded="full"
            w={['80%', '70%']}
            size={['sm', 'md']}
            colorScheme="orange"
            fontFamily="mono"
            isDisabled={
              !username ||
              !firstName ||
              !lastName ||
              !email ||
              !password ||
              !confirmPassword ||
              !!emailError ||
              passwordMismatch ||
              isLoading
            }
            isLoading={isLoading}
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
