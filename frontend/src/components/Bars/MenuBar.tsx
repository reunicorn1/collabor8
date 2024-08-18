import { Flex, Button, Spacer, IconButton, Text, Box } from '@chakra-ui/react';
import { MdBuild } from 'react-icons/md';
import { ChatIcon, ArrowRightIcon } from '@chakra-ui/icons';
// import { useSettings } from '../../context/EditorContext';
import { LanguageSelector, ThemeSelector } from '../CodeEditor';
import { useSettings } from '../../context/EditorContext';

export default function MenuBar() {
  const { mode } = useSettings()!;

  return (
    <div>
      <Flex justifyContent="space-between" alignItems="center">
        <Flex>
          <ThemeSelector />
          <LanguageSelector />
        </Flex>
        <Spacer />
        <Box
          width="8px"
          height="8px"
          bg={mode ? `red.500` : `green.500`}
          borderRadius="50%"
        />
        <Text color="white" fontSize="xs" ml={2}>
          {mode ? `Read Mode` : `Write Mode`}
        </Text>
        <Button
          leftIcon={<MdBuild />}
          size="xs"
          colorScheme="green"
          variant="solid"
          ml={8}
        >
          Run
        </Button>
        <IconButton
          isRound={true}
          variant="outline"
          colorScheme="brand"
          aria-label="Done"
          fontSize="12px"
          size="xs"
          icon={<ChatIcon />}
          ml={2}
        />
        <IconButton
          isRound={true}
          variant="outline"
          colorScheme="brand"
          aria-label="Done"
          fontSize="12px"
          size="xs"
          icon={<ArrowRightIcon />}
        />
      </Flex>
    </div>
  );
}
