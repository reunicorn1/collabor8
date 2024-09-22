import React from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import RoomComponent from './RoomComponent';

export function Mapped() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [size, setSize] = React.useState('md');

  const handleSizeClick = (newSize) => {
    setSize(newSize);
    onOpen();
  };

  const sizes = ['full'];

  return (
    <>
      {sizes.map((size) => (
        <Button
          onClick={() => handleSizeClick(size)}
          key={size}
          m={4}
        >{`Open ${size} Modal`}</Button>
      ))}

      <Modal onClose={onClose} size={size} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody style={{ height: '800px', padding: 0 }}>
            <div style={{ height: '100%', width: '100%' }}>
              <RoomComponent style={{ height: '100%', width: '100%' }} />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
