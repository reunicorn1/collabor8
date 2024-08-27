import {
  Flex,
  Spacer,
  IconButton,
  Text,
  Box,
  useDisclosure,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { PiGithubLogo } from 'react-icons/pi';
import { MdOutlineKeyboardVoice } from 'react-icons/md';
import { GoHome } from 'react-icons/go';
import { LanguageSelector, ThemeSelector } from '../CodeEditor';
import { useSettings } from '../../context/EditorContext';
import ComingSoon from '@components/CodeEditor/ComingSoon';

export default function MenuBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const { mode } = useSettings()!;

  const goHome = () => {
    navigate('/dashboard');
  };

  return (
    <div>
      <Flex justifyContent="space-between" alignItems="center">
        <Flex>
          <IconButton
            isRound={true}
            color="white"
            _hover={{ bg: 'white', color: 'black' }}
            variant="ghost"
            aria-label="Done"
            fontSize="20px"
            size="xs"
            icon={<GoHome />}
            onClick={goHome}
            ml={2}
          />
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
        {/* <Button
          leftIcon={<MdBuild />}
          size="xs"
          colorScheme="yellow"
          variant="solid"
          ml={8}
        >
          Run
        </Button> */}
        <IconButton
          isRound={true}
          color="white"
          _hover={{ bg: 'white', color: 'black' }}
          variant="ghost"
          aria-label="Done"
          fontSize="18px"
          size="xs"
          icon={<MdOutlineKeyboardVoice />}
          ml={2}
        />
        <IconButton
          isRound={true}
          color="white"
          _hover={{ bg: 'white', color: 'black' }}
          variant="ghost"
          aria-label="Done"
          fontSize="18px"
          size="xs"
          ml={1}
          mr={2}
          onClick={onOpen}
          icon={<PiGithubLogo />}
        />
      </Flex>
      <ComingSoon isOpen={isOpen} onClose={onClose} />
    </div>
  );
}
