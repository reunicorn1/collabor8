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
  const toast = useToast();

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

    resetPassword({ email })
      .unwrap()
      .then(() => {
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
      })
      .catch(() => {
        toast({
          title: 'Error',
          description:
            'An error occurred while sending the password reset email.',
          status: 'error',
          variant: 'subtle',
          position: 'bottom-left',
          isClosable: true,
        });
      });
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
        bg="brand.900"
        top="20px"
        right="40px"
        position="absolute"
        transform="none"
      >
        <ModalHeader color="white" fontFamily="mono" fontSize="lg">
          Reset Password
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel color="grey" fontFamily="mono" fontSize="sm">
              Email
            </FormLabel>
            <Input
              type="email"
              color="white"
              fontFamily="mono"
              fontSize="sm"
              ref={initialRef}
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter mb={4}>
          <Button
            colorScheme="orange"
            mr={3}
            size="sm"
            fontFamily="mono"
            isDisabled={!email}
            onClick={handleResetPassword}
            ref={finalRef}
          >
            Send Reset Link
          </Button>
          <Button size="sm" fontFamily="mono" onClick={handleClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PasswordReset;
