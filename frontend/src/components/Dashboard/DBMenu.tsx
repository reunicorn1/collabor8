import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuDivider,
  Avatar,
  Text,
  useToast,
} from '@chakra-ui/react';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { ReactNode } from 'react';
import { selectUserDetails } from '@store/selectors/userSelectors';
import { useSelector, useDispatch } from 'react-redux';
import { unsetCredentials } from '@store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

type DBMenuProps = {
  children: ReactNode;
};

export default function DBMenu({ children }: DBMenuProps) {
  const navigate = useNavigate();
  const toast = useToast();
  const userDetails = useSelector(selectUserDetails) || 'username';
  const dispatch = useDispatch();
  // TODO: to logout you need to do two actions: logout using the API endpoint, and unset credentials
  // Unset credentials is done below, but this should be made from the service after removing the
  // access token from the database using the endpoint

  const handleLogout = () => {
    dispatch(unsetCredentials());
    toast({
      title: 'See you later, coder! 👋',
      description: 'You’re now logged out. Until next time!',
      variant: 'subtle',
      position: 'bottom-left',
      status: 'success',
      isClosable: true,
    });
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  return (
    <Menu>
      <MenuButton>{children}</MenuButton>
      <MenuList bg="purple.700">
        <MenuGroup>
          <MenuItem onClick={handleProfile}>
            <Avatar boxSize="23px" bg="purple.400" mr={2} />
            <Text fontSize="sm">{`@${userDetails?.username}`}</Text>
          </MenuItem>
        </MenuGroup>
        <MenuDivider />
        <MenuGroup>
          <MenuItem
            onClick={handleProfile}
            fontSize="xs"
            icon={<FiUser fontSize="13px" />}
          >
            Profile
          </MenuItem>
          <MenuItem
            fontSize="xs"
            icon={<FiLogOut fontSize="13px" />}
            _hover={{ bg: 'red.500', color: 'white' }}
            onClick={handleLogout}
          >
            Log Out
          </MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  );
}
