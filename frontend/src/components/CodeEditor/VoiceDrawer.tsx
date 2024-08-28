import React from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  Button,
  VStack,
  Box,
} from '@chakra-ui/react';
import Draggable from 'react-draggable';
import  RoomComponent  from '@components/Audio/RoomComponent';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VoiceDrawer({ isOpen, onClose }: ModalProps) {
  return (
  <Draggable>
    <Box
      position="fixed"
      bottom={isOpen ? '0' : `-${150}`}
      width="290px"
      height="150px"
      maxHeight="90vh"
      bg="gray.800"
      borderRadius="20px 20px 0 0"
      boxShadow="0 -2px 10px rgba(0, 0, 0, 0.3)"
      p={4}
      zIndex="1000"
      transition="bottom 0.3s ease"
      overflowY="auto"
    >
      <VStack spacing={4}>
        <RoomComponent onClose={onClose} />
        <Button variant="outline" color="white" onClick={onClose}>
          Close
        </Button>
      </VStack>
    </Box>
  </Draggable>
  );
}
