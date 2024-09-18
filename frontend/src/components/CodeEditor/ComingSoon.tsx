import {
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  Flex,
  DrawerCloseButton,
  Box,
  Center,
  Text,
  Heading,
  Button,
  IconButton,
} from '@chakra-ui/react';
import LanguageSelector from '@components/Bars/LanguageSelector';
import ThemeSelector from '@components/Bars/ThemeSelector';
import Tree from '@components/FileTree/Tree';
import { Singleton } from '../../constants';
import { FaGithub } from 'react-icons/fa';
import { Doc } from 'yjs';
import { CloseIcon } from '@chakra-ui/icons';

interface ModalProps {
  project?: any;
  isOpen: boolean;
  onClose: () => void;
  //ydoc?: Doc;
}

export default function ComingSoon({
  isOpen,
  onClose,
  project,
}: ModalProps) {
  return (
    <Box className={`transition
    fixed top-0 bottom-0 z-10 w-3/4 flex flex-col gap-4 bg-[#001845]
    ${isOpen ? 'translate-x-0 shadow-xl shadow-[#524175]' : '-translate-x-full '}
    
    `}>
      <IconButton
        aria-label='close menu'
        onClick={onClose}
        icon={<CloseIcon />}
        variant='unstyled'
        color='white'
        className='absolute top-2 right-2 self-end !rounded-full border border-white'
      />
      <Heading color='brand.100' className='px-4 text-white !font-mono capitalize'>
        file tree
      </Heading>
      <Tree name={project?.project_name} />
    </Box>
  );
}
