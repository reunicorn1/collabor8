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
  Box,
  Divider,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useResetPasswordMutation } from '@store/services/auth';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PasswordReset = ({ isOpen, onClose, onSuccess }: ModalProps) => {
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const [email, setEmail] = useState('');
  const [resetPassword] = useResetPasswordMutation();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = () => {
    if (!email.trim()) {
      toast({
        title: 'Email is required',
        description: 'Please enter a valid email address.',
        status: 'error',
        variant: 'subtle',
        position: 'bottom-left',
        isClosable: true,
      });
      return;
    }

    if (!isValidEmail(email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        status: 'error',
        variant: 'subtle',
        position: 'bottom-left',
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      resetPassword({ email }).unwrap();
      toast({
        title: 'Password reset email sent',
        description: 'Please check your email to reset your password.',
        status: 'success',
        variant: 'subtle',
        position: 'bottom-left',
        isClosable: true,
      });
      handleClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description:
          'An error occurred while sending the password reset email.',
        status: 'error',
        variant: 'subtle',
        position: 'bottom-left',
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
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
        background="linear-gradient(to bottom, #001845, #524175)"
        w={['95%', '80%', '60%', '50%', '40%']}
      >
        <ModalHeader
          color="white"
          fontFamily="mono"
          fontSize={{ base: 'md', md: 'lg' }}
        >
          Reset Password
        </ModalHeader>
        <ModalCloseButton color="white" onClick={handleClose} />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel
              color="white"
              opacity="0.7"
              fontFamily="mono"
              fontSize={{ base: 'xs', md: 'sm' }}
            >
              Email
            </FormLabel>
            <Input
              type="email"
              color="white"
              fontFamily="mono"
              fontSize={{ base: 'xs', md: 'sm' }}
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && email && !isLoading) {
                  handleResetPassword();
                }
              }}
            />
          </FormControl>
        </ModalBody>
        <Box display="flex" justifyContent="center" mt={6}>
          <Button
            colorScheme="orange"
            mr={3}
            size="sm"
            fontFamily="mono"
            isDisabled={!email || isLoading}
            onClick={handleResetPassword}
            ref={finalRef}
            isLoading={isLoading}
            rounded="full"
            w={{ base: '80%', md: '60%' }}
          >
            Send Reset Link
          </Button>
        </Box>
        <Divider mt={6} mb={5} w="90%" mx="auto" />
        <ModalFooter>
          <Button
            size="sm"
            fontFamily="mono"
            color="white"
            opacity="0.7"
            variant="link"
            onClick={handleClose}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PasswordReset;
