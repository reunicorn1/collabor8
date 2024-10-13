import { VStack, Box, Flex, CloseButton } from '@chakra-ui/react';
import Draggable from 'react-draggable';
import RoomComponent from '@components/Audio/RoomComponent';

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
        minH="110px"
        height="max-content"
        maxHeight="90vh"
        bg="gray.800"
        borderRadius="20px 20px 0 0"
        boxShadow="0 -2px 10px rgba(0, 0, 0, 0.3)"
        p={4}
        zIndex="1000"
        transition="bottom 0.3s ease"
        overflowY="auto"
      >
        <Flex justifyContent="flex-end">
          <CloseButton color="white" onClick={onClose} />
        </Flex>
        <VStack>
          <RoomComponent onClose={onClose} />
        </VStack>
      </Box>
    </Draggable>
  );
}
