import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { MdOutlineEdit, MdDeleteOutline } from 'react-icons/md';
import { ReactNode } from 'react';

type DBMenuProps = {
  children: ReactNode;
};

export default function MenuProject({ children }: DBMenuProps) {
  return (
    <Menu>
      <MenuButton onClick={(e) => e.stopPropagation()}>{children}</MenuButton>
      <MenuList bg="gray">
        <MenuItem fontSize="xs" icon={<MdOutlineEdit fontSize="12px" />}>
          Rename
        </MenuItem>
        <MenuItem fontSize="xs" icon={<MdDeleteOutline fontSize="12px" />}>
          Delete
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
