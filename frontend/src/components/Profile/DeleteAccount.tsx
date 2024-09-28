import {
  Button,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';
import { useDeleteCurrentUserProfileMutation } from '@store/services/user';
import { useAppDispatch } from '@hooks/useApp';
import { performLogout } from '@store/slices/authSlice';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteAccount: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const navigate = useNavigate();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [deleteUser, { isLoading }] = useDeleteCurrentUserProfileMutation();
  const [isConfirming, setIsConfirming] = useState(false);

  const showToast = (
    title: string,
    description: string,
    status: 'success' | 'error',
  ) => {
    toast({
      title,
      description,
      variant: 'subtle',
      position: 'bottom-left',
      status,
      isClosable: true,
      duration: 5000,
    });
  };

  const handleDelete = async () => {
    try {
      await deleteUser().unwrap();
      showToast(
        'Account deleted successfully.',
        'Your account has been permanently deleted.',
        'success',
      );
      dispatch(performLogout(() => navigate('/')));
    } catch (err) {
      showToast(
        'Error deleting account.',
        'An error occurred while deleting your account. Please try again.',
        'error',
      );
      console.error('Error during account deletion:', err);
    } finally {
      onClose();
    }
  };

  const confirmDelete = () => {
    setIsConfirming(true);
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
      motionPreset="scale"
    >
      <AlertDialogOverlay>
        <AlertDialogContent bg="brand.900" fontFamily="mono" borderRadius="md">
          <AlertDialogHeader fontSize="lg" color="white">
            Delete Account
          </AlertDialogHeader>
          <AlertDialogBody color="white" fontSize="md" opacity="0.85">
            {isConfirming
              ? 'Are you sure? This action is irreversible.'
              : 'Once you delete your account, there is no going back. Please be certain.'}
          </AlertDialogBody>
          <AlertDialogFooter>
            {isConfirming ? (
              <>
                <Button
                  colorScheme="red"
                  size="sm"
                  isLoading={isLoading}
                  onClick={handleDelete}
                  isDisabled={isLoading}
                  aria-label="Confirm account deletion"
                >
                  Yes, delete my account
                </Button>
                <Button
                  ref={cancelRef}
                  size="sm"
                  ml={3}
                  onClick={onClose}
                  aria-label="Cancel account deletion"
                  isDisabled={isLoading}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={confirmDelete}
                  isDisabled={isLoading}
                  aria-label="Proceed to account deletion confirmation"
                >
                  Delete your account
                </Button>
                <Button
                  ref={cancelRef}
                  size="sm"
                  ml={3}
                  onClick={onClose}
                  aria-label="Cancel account deletion"
                  isDisabled={isLoading}
                >
                  Cancel
                </Button>
              </>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default DeleteAccount;
