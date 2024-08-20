import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from '@chakra-ui/react';
import { RxDotsVertical } from 'react-icons/rx';

interface FileDirMenuProps {
  type: string;
  id: string;
  name: string;
}
export default function FileDirMenu({ type, id, name }: FileDirMenuProps) {
  return (
    <Menu isLazy>
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
      />
      <MenuList bg="grey" border="0.5px solid rgba(128, 128, 128, 0.5)">
        {type === 'file' ? (
          <>
            <MenuItem fontSize="xs">Open File</MenuItem>
            <MenuItem fontSize="xs">Rename File</MenuItem>
            <MenuItem fontSize="xs">Delete File</MenuItem>
          </>
        ) : (
          <>
            <MenuItem fontSize="xs">New File</MenuItem>
            <MenuItem fontSize="xs">New Folder</MenuItem>
            <MenuItem fontSize="xs">Rename Folder</MenuItem>
            <MenuItem fontSize="xs">Delete Folder</MenuItem>
          </>
        )}
      </MenuList>
    </Menu>
  );
}
