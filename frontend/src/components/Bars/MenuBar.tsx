import {
  Flex,
  Spacer,
  IconButton,
  Text,
  Box,
  useDisclosure,
  Button,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { PiGithubLogo } from 'react-icons/pi';
import { MdOutlineKeyboardVoice } from 'react-icons/md';
import { GoHome } from 'react-icons/go';
import { LanguageSelector, ThemeSelector } from '../CodeEditor';
import { useSettings } from '../../context/EditorContext';
import ComingSoon from '@components/CodeEditor/ComingSoon';
import VoiceDrawer from '@components/CodeEditor/VoiceDrawer';
import { useAppDispatch, useAppSelector } from '@hooks/useApp';
import { setPanelVisibility } from '@store/slices/fileSlice';
import { selectPanelVisiblity } from '@store/selectors/fileSelectors';

export default function MenuBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useAppDispatch();
  const {
    isOpen: isOpenV,
    onOpen: onOpenV,
    onClose: onCloseV,
  } = useDisclosure();
  const navigate = useNavigate();
  const { mode } = useSettings()!;
  const panelVisiblity = useAppSelector(selectPanelVisiblity);

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
        <Button
          className="!text-sm !text-slate-200 !bg-transparent"
          onClick={() => dispatch(setPanelVisibility())}
        >
          toggle panel
          <span className='text-lg ms-2'>
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
          onClick={onOpenV}
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
      <VoiceDrawer isOpen={isOpenV} onClose={onCloseV} />
    </div>
  );
}
