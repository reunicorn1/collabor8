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
      window.location.href = '/';
    } catch (error) {
      let errorMessage =
        'An unexpected error occurred. Please try again later.';

      if (error?.data?.statusCode === 404) {
        if (error?.data?.message === 'Invalid token') {
          errorMessage =
            'The reset token is invalid or has expired. Please request a new password reset link.';
        } else {
          errorMessage = 'The requested resource was not found.';
        }
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      }

      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        variant: 'subtle',
        position: 'bottom-left',
        isClosable: true,
      });
    }
  };

  const handleClose = () => {
    window.location.href = '/';
  };

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={true}
      onClose={handleClose}
    >
      <ModalOverlay />
      <ModalContent
        background="linear-gradient(to bottom, #001845, #524175)"
        maxW={{ base: '90%', sm: '400px', md: '500px' }}
      >
        <ModalHeader
          color="white"
          fontFamily="mono"
          fontSize={{ base: 'md', md: 'lg' }}
        >
          Reset Your Password
        </ModalHeader>
        <ModalCloseButton color="white" onClick={handleClose} />
        <ModalBody pb={6}>
          <Box>
            <FormControl>
              <FormLabel
                color="white"
                opacity="0.7"
                fontFamily="mono"
                fontSize={{ base: 'xs', md: 'sm' }}
              >
                New Password
              </FormLabel>
              <Input
                type="password"
                color="white"
                fontFamily="mono"
                fontSize={{ base: 'xs', md: 'sm' }}
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel
                color="white"
                opacity="0.7"
                fontFamily="mono"
                fontSize={{ base: 'xs', md: 'sm' }}
              >
                Confirm New Password
              </FormLabel>
              <Input
                type="password"
                color="white"
                fontFamily="mono"
                fontSize={{ base: 'xs', md: 'sm' }}
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormControl>
          </Box>
        </ModalBody>
        <Box display="flex" justifyContent="center" mt={6}>
          <Button
            colorScheme="orange"
            mr={3}
            size="sm"
            fontFamily="mono"
            isDisabled={!newPassword || !confirmPassword || isLoading}
            onClick={handleResetPassword}
            ref={finalRef}
            isLoading={isLoading}
            rounded="full"
            w={{ base: '80%', md: '60%' }}
          >
            Reset Password
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

export default ResetPasswordModal;
