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
import { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useValidateResetTokenMutation } from '@store/services/auth';

const ResetPasswordModal = () => {
  const { search } = useLocation();
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const toast = useToast();

  const [validateResetToken, { isLoading, isError, isSuccess, error }] =
    useValidateResetTokenMutation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const tokenFromUrl = params.get('token');
    setToken(tokenFromUrl || '');
  }, [search]);

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please ensure both password fields match.',
        status: 'error',
        variant: 'subtle',
        position: 'bottom-left',
        isClosable: true,
      });
      return;
    }
    console.log('Token', token);
    try {
      await validateResetToken({ token, password: newPassword }).unwrap();
      toast({
        title: 'Password Reset Successful',
        description: 'Your password has been reset successfully.',
        status: 'success',
        variant: 'subtle',
        position: 'bottom-left',
        isClosable: true,
      });
      // Redirect to login or home page
      window.location.href = '/';
    } catch (error) {
      toast({
        title: 'Error',
        description: `An error occurred while resetting your password: ${error?.data.message}`,
        status: 'error',
        variant: 'subtle',
        position: 'bottom-left',
        isClosable: true,
      });
    }
  };

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={true}
      onClose={() => {}}
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
          Reset Your Password
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel color="grey" fontFamily="mono" fontSize="sm">
              New Password
            </FormLabel>
            <Input
              type="password"
              color="white"
              fontFamily="mono"
              fontSize="sm"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel color="grey" fontFamily="mono" fontSize="sm">
              Confirm New Password
            </FormLabel>
            <Input
              type="password"
              color="white"
              fontFamily="mono"
              fontSize="sm"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter mb={4}>
          <Button
            colorScheme="orange"
            mr={3}
            size="sm"
            fontFamily="mono"
            isDisabled={!newPassword || !confirmPassword}
            onClick={handleResetPassword}
            ref={finalRef}
            isLoading={isLoading}
          >
            Reset Password
          </Button>
          <Button
            size="sm"
            fontFamily="mono"
            onClick={() => {
              window.location.href = '/';
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ResetPasswordModal;
