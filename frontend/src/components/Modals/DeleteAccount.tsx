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
        <ModalContent>
          <ModalHeader>Delete account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}></ModalBody>
          Once you delete your account, there is no going back. Please be
          certain.
          <ModalFooter>
            <Button colorScheme="red" mr={3}>
              Delete your account
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
