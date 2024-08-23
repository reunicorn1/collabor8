import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteAccount({ isOpen, onClose }: ModalProps) {
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
            <Button size="sm" colorScheme="red" mr={3}>
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
