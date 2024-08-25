import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { RxDotsVertical } from 'react-icons/rx';
import * as Y from 'yjs';
import NewfileDir from '../Modals/NewfileDir';
import { useState } from 'react';

interface FileDirMenuProps {
  type: string;
  id: string;
  name: string;
  ydoc: Y.Doc;
}
export default function OptionsMenu({ type, id, ydoc }: FileDirMenuProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [parent, setParent] = useState('');
  const [filedir, setFileDir] = useState('');

  const handleClick = (filedir: string) => {
    setFileDir(filedir);
    setParent(id);
    console.log(
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaid',
      id,
    );

    onOpen();
  };

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        color="transparent"
        mr={3.2}
        _hover={{ bg: 'transparent', color: 'white' }}
        _active={{ bg: 'transparent', color: 'white' }}
        variant="ghost"
        aria-label="Done"
        fontSize="12px"
        size="xs"
        icon={<RxDotsVertical />}
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
      <MenuList bg="grey" border="0.5px solid rgba(128, 128, 128, 0.5)">
        {type === 'file' ? (
          <>
            <MenuItem fontSize="xs">Rename File</MenuItem>
            <MenuItem fontSize="xs">Delete File</MenuItem>
          </>
        ) : (
          <>
            <MenuItem
              fontSize="xs"
              onClick={(e) => {
                handleClick('file');
                e.stopPropagation();
              }}
            >
              New File
            </MenuItem>
            <MenuItem
              fontSize="xs"
              onClick={(e) => {
                handleClick('directory');
                e.stopPropagation();
              }}
            >
              New Folder
            </MenuItem>
            <MenuItem fontSize="xs">Rename Folder</MenuItem>
            <MenuItem fontSize="xs">Delete Folder</MenuItem>
          </>
        )}
        <NewfileDir
          isOpen={isOpen}
          onClose={onClose}
          filedir={filedir}
          ydoc={ydoc}
          parent={parent}
        />
      </MenuList>
    </Menu>
  );
}
