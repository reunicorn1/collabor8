import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useDeleteCurrentUserProfileMutation } from '@store/services/user';
import { useDispatch } from 'react-redux';
import { unsetCredentials } from '@store/slices/authSlice';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteAccount({ isOpen, onClose }: ModalProps) {
  const dispatch = useDispatch();
  const toast = useToast();
  const [deleteUser] = useDeleteCurrentUserProfileMutation();

  const handleDelete = async () => {
    try {
      await deleteUser().unwrap();
      toast({
        title: `Data has been updated successfully!`,
        variant: 'subtle',
        position: 'bottom-right',
        status: 'success',
        isClosable: true,
      });
      dispatch(unsetCredentials());
    } catch (err) {
      console.log('An Error occured during deletion of this account', err);
    }
  };

  return (
    <>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="brand.900">
          <ModalHeader color="white" fontFamily="mono" fontSize="sm">
            Delete account
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody
            pb={6}
            color="white"
            fontFamily="mono"
            fontSize="sm"
            opacity="0.8"
          >
            Once you delete your account, there is no going back. Please be
            certain.
          </ModalBody>
          <ModalFooter mb={4}>
            <Button size="sm" colorScheme="red" mr={3} onClick={handleDelete}>
              Delete your account
            </Button>
            <Button size="sm" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
