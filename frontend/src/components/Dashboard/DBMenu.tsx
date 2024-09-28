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
import { performLogout } from '@store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@hooks/useApp';

type DBMenuProps = {
  children: ReactNode;
  isGuest?: boolean;
  className?: string;
};

export default function DBMenu({
  isGuest = false,
  className = '',
  children,
}: DBMenuProps) {
  const navigate = useNavigate();
  const toast = useToast();
  const userDetails: any = useAppSelector(selectUserDetails) || 'username';
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    navigate(location.pathname.concat('?logout=true'));
    dispatch(performLogout());
    // dispatch(unsetCredentials());
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
    if (isGuest) return;
    navigate('/profile');
  };

  return (
    <Menu>
      <MenuButton>{children}</MenuButton>
      <MenuList className={`!bg-brand-850 ${className}`}>
        <MenuGroup>
          <MenuItem onClick={handleProfile}>
            <Avatar
              src={userDetails?.profile_picture}
              boxSize={['20px', '23px']}
              bg="purple.400"
              mr={2}
            />
            <Text fontSize={['xs', 'sm']}>{`@${userDetails?.username}`}</Text>
          </MenuItem>
        </MenuGroup>
        <MenuDivider />
        <MenuGroup>
          {!isGuest && (
            <MenuItem
              onClick={handleProfile}
              fontSize={['xx-small', 'xs']}
              icon={<FiUser fontSize="13px" />}
            >
              Profile
            </MenuItem>
          )}
          <MenuItem
            fontSize={['xx-small', 'xs']}
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
