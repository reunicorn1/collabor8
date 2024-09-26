import {
  IconButton,
  Text,
  useDisclosure,
  Button,
  useMediaQuery,
  Box,
  HStack,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineKeyboardVoice } from 'react-icons/md';
import { GoHome } from 'react-icons/go';
import { useSettings } from '../../context/EditorContext';
import ComingSoon from '@components/CodeEditor/ComingSoon';
import VoiceDrawer from '@components/CodeEditor/VoiceDrawer';
import { useAppDispatch, useAppSelector } from '@hooks/useApp';
import { togglePanelVisibility } from '@store/slices/fileSlice';
import { selectPanelVisiblity } from '@store/selectors/fileSelectors';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';
import DBMenu from '@components/Dashboard/DBMenu';
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
  const userDetails = useAppSelector(selectUserDetails);
  const [isAdBlockerDetected, setIsAdBlockerDetected] = useState(false);
  const user = useAppSelector(selectUserDetails);
  const toast = useToast();
  const isGuest = user?.roles.includes('guest');

  useEffect(() => {
    fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js')
      .then(() => setIsAdBlockerDetected(false))
      .catch(() => {
        setIsAdBlockerDetected(true);
        toast({
          title: 'AdBlocker Detected',
          description:
            'Please disable your AdBlocker to use the voice chat feature.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
          variant: 'subtle',
        });
      });
  }, [toast]);

  const goHome = () => {
    if (isGuest) {
      toast({
        title: '🏠 Home',
        description: 'Guest users cannot access the dashboard.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left',
        variant: 'subtle',
      });
    } else {
      navigate('/dashboard');
    }
  };

  const handleVoiceChat = () => {
    if (isAdBlockerDetected) {
      toast({
        title: '🎙️ Mic Check Failed',
        description:
          'AdBlocker must be disabled to use the voice chat feature.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left',
        variant: 'subtle',
      });
      return;
    }
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
      onOpenV();
    }
  };

  return (
    <Box className={className} {...rest}>
      <Box className="flex items-center justify-between p-4 gap-4">
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
          className={`
            flex items-center gap-2 capitalize
            before:inline-block before:size-2 before:rounded-full
            ${!mode ? 'before:bg-green-500' : 'before:bg-red-500'}
            sm:after:content-['mode']
            `}
        >
          {`${mode ? 'read' : 'write'}`}
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
        <DBMenu isGuest={userDetails?.roles === 'guest'}>
          <Icon color="white" as={ChevronDownIcon} />
        </DBMenu>
      </Box>

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
