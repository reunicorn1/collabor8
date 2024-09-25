import {
  Flex,
  IconButton,
  Text,
  useDisclosure,
  Button,
  useMediaQuery,
  Box,
  HStack,
  useToast,
  Slide,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import { PiGithubLogo } from 'react-icons/pi';
import { MdOutlineKeyboardVoice } from 'react-icons/md';
import { GoHome } from 'react-icons/go';
//import { LanguageSelector, ThemeSelector } from '../CodeEditor';
import { useSettings } from '../../context/EditorContext';
import ComingSoon from '@components/CodeEditor/ComingSoon';
import VoiceDrawer from '@components/CodeEditor/VoiceDrawer';
import { useAppDispatch, useAppSelector } from '@hooks/useApp';
import { togglePanelVisibility } from '@store/slices/fileSlice';
import { selectPanelVisiblity } from '@store/selectors/fileSelectors';
import { HamburgerIcon } from '@chakra-ui/icons';
import ThemeSelector from './ThemeSelector';
import LanguageSelector from './LanguageSelector';
import { Project } from '@types';
import { selectUserDetails } from '@store/selectors/userSelectors';

type MenuBarProps = {
  project: Project;
  className?: string;
} & { [k: string]: any };

export default function MenuBar({
  className = '',
  project,
  ...rest
}: MenuBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLessThan768] = useMediaQuery('(max-width: 768px)');
  const dispatch = useAppDispatch();
  const {
    isOpen: isOpenV,
    onOpen: onOpenV,
    onClose: onCloseV,
  } = useDisclosure();
  const navigate = useNavigate();
  const { mode } = useSettings()!;
  const panelVisiblity = useAppSelector(selectPanelVisiblity);
  const [showAdBlockerNotification, setShowAdBlockerNotification] =
    useState(false);
  const user = useAppSelector(selectUserDetails);
  const toast = useToast();

  useEffect(() => {
    fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js')
      .then(() => setShowAdBlockerNotification(false))
      .catch(() => setShowAdBlockerNotification(true));
  }, []);

  const goHome = () => {
    navigate('/dashboard');
  };

  const handleVoiceChat = () => {
    // Check if the user is a guest
    if (
      user.username === 'guest' &&
      user.first_name === 'Guest' &&
      user.last_name === 'User'
    ) {
      toast({
        title: '🎙️ Mic Check Failed',
        description:
          'Login required to talk the talk. Let’s get you signed in 💬',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left',
        variant: 'subtle',
      });
    } else {
      if (showAdBlockerNotification) {
        toast({
          title: 'AdBlocker Detected',
          description:
            'Please disable your AdBlocker to use the voice chat feature.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
      } else {
        onOpenV();
      }
    }
  };

  return (
    <Box className={className} {...rest}>
      <Flex alignItems="center" justifyContent="space-between" gap="4" p="4">
        <HStack me={`${!isLessThan768 ? 'auto' : ''}`}>
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
          {!isLessThan768 && (
            <>
              <ThemeSelector />
              <LanguageSelector />
            </>
          )}
        </HStack>
        <Text
          color="white"
          fontSize="xs"
          ml={2}
          className={`before:inline-block before:size-2 before:rounded-full
            ${!mode ? 'before:bg-green-500' : 'before:bg-red-500'} before:me-2`}
        >
          {mode ? `Read Mode` : `Write Mode`}
        </Text>
        <Button
          className="!text-sm !text-slate-200 !bg-transparent capitalize"
          p="0"
          h="max-content"
          onClick={() => dispatch(togglePanelVisibility())}
          fontWeight="normal"
        >
          toggle panel
          <span className="block w-3 text-lg ms-2">
            {panelVisiblity ? '-' : '+'}
          </span>
        </Button>
        <IconButton
          isRound={true}
          color="white"
          _hover={{ bg: 'white', color: 'black' }}
          variant="ghost"
          aria-label="Done"
          fontSize="18px"
          size="xs"
          icon={<MdOutlineKeyboardVoice />}
          onClick={handleVoiceChat}
          ml={2}
        />
        {isLessThan768 && (
          <IconButton
            isRound={true}
            color="white"
            _hover={{ bg: 'white', color: 'black' }}
            variant="ghost"
            aria-label="slide menu button"
            fontSize="18px"
            size="xs"
            ml={1}
            mr={2}
            onClick={() => {
              setIsOpen(true);
            }}
            icon={<HamburgerIcon className="pointer-events-none" />}
          />
        )}
      </Flex>

      {/* AdBlocker Notification Bar */}
      <Slide
        direction="top"
        in={showAdBlockerNotification}
        style={{
          zIndex: 10,
          width: '100%',
          position: 'fixed',
          top: 0,
          left: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          p="4"
          bg="yellow.400"
          shadow="md"
          borderBottom="2px solid yellow.600"
          maxW="600px"
          borderRadius="md"
          mt="10px"
        >
          <Text fontSize="md" color="gray.800" textAlign="center">
            🚫 <strong>AdBlocker Detected:</strong> Please disable your
            AdBlocker to use the voice chat feature.
          </Text>
        </Box>
      </Slide>

      {/* DRAWERS */}
      {isLessThan768 && (
        <ComingSoon
          project={project}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
      <VoiceDrawer isOpen={isOpenV} onClose={onCloseV} />
    </Box>
  );
}
