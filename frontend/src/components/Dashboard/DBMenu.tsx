import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuDivider,
  Avatar,
  Text,
} from '@chakra-ui/react';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { ReactNode } from 'react';

type DBMenuProps = {
  children: ReactNode;
};

export default function DBMenu({ children }: DBMenuProps) {
  return (
    <Menu>
      <MenuButton>{children}</MenuButton>
      <MenuList bg="purple.700">
        <MenuGroup>
          <MenuItem>
            <Avatar boxSize="23px" bg="purple.400" mr={2} />
            <Text fontSize="sm">@username</Text>
          </MenuItem>
        </MenuGroup>
        <MenuDivider />
        <MenuGroup>
          <MenuItem fontSize="xs" icon={<FiUser fontSize="13px" />}>
            Profile
          </MenuItem>
          <MenuItem
            fontSize="xs"
            icon={<FiLogOut fontSize="13px" />}
            _hover={{ bg: 'red.500', color: 'white' }}
          >
            Log Out
          </MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  );
}
