import {
  Flex,
  IconButton,
  Text,
  useDisclosure,
  Button,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
//import { PiGithubLogo } from 'react-icons/pi';
import { MdOutlineKeyboardVoice } from 'react-icons/md';
import { GoHome } from 'react-icons/go';
//import { LanguageSelector, ThemeSelector } from '../CodeEditor';
import { useSettings } from '../../context/EditorContext';
import ComingSoon from '@components/CodeEditor/ComingSoon';
import VoiceDrawer from '@components/CodeEditor/VoiceDrawer';
import { useAppDispatch, useAppSelector } from '@hooks/useApp';
import { setPanelVisibility } from '@store/slices/fileSlice';
import { selectPanelVisiblity } from '@store/selectors/fileSelectors';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useRef, useState } from 'react';
//import { Doc } from 'yjs';

type MenuBarProps = {
  project: any;
  isLoading: boolean;
  isSuccess: boolean
  //ydoc: Doc;
}

export default function MenuBar({ project }: MenuBarProps) {
  const [isOpen, setIsOpen] = useState(false);
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
      <Flex
        justifyContent="space-between"
        alignItems="center"
        p='4'
      >
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
        {/*<ThemeSelector />
          <LanguageSelector />
        <Spacer />*/}
        <Text
          color="white"
          fontSize="xs" ml={2}
          className={`before:inline-block before:size-2 before:rounded-full
            ${!mode ? 'before:bg-green-500' : 'before:bg-red-500'} before:me-2`}
        >
          {mode ? `Read Mode` : `Write Mode`}
        </Text>
        <Button
          className="!text-sm !text-slate-200 !bg-transparent capitalize"
          p='0'
          h='max-content'
          onClick={() => dispatch(setPanelVisibility())}
          fontWeight='normal'
        >
          toggle panel
          <span className='block w-3 text-lg ms-2'>
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
          aria-label="slide menu button"
          fontSize="18px"
          size="xs"
          ml={1}
          mr={2}
          onClick={(e) => {
            e.bubbles = true;
            setIsOpen(true)
          }}
          icon={<HamburgerIcon className='pointer-events-none' />}
        />
      </Flex>
      <ComingSoon
        project={project}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <VoiceDrawer isOpen={isOpenV} onClose={onCloseV} />
    </div>
  );
}
