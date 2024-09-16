import { Box, Flex, Text, IconButton } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import React from 'react';

interface ConsoleProps {
  output: string;
  onClose: () => void;
}

const Console: React.FC<ConsoleProps> = ({ output, onClose }) => {
  return (
    <Box
      borderRadius="md"
      border="1px solid #333"
      bg="#1e1e1e"
      color="green.400"
      fontFamily="monospace"
      overflowY="auto"
      height="450px"
      maxHeight="800px"
    >
      {/* Terminal header bar */}
      <Flex
        bg="#2d2d2d"
        borderBottom="1px solid #333"
        align="center"
        p={2}
        justify="flex-start"
        borderTopRadius="md"
      >
        <Flex gap={2}>
          <IconButton
            aria-label="close"
            size="xs"
            bg="red.500"
            borderRadius="full"
            icon={<CloseIcon />}
            _hover={{ bg: 'red.400' }}
            onClick={onClose}
          />
        </Flex>
      </Flex>

      {/* Terminal content */}
      <Box p={4} height="100%" overflowY="auto">
        <Text whiteSpace="pre-wrap">{output}</Text>
      </Box>
    </Box>
  );
};

export default Console;
