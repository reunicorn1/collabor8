import {
  Box,
  Text,
  Divider,
  useDisclosure,
  Icon,
  Flex,
} from '@chakra-ui/react';
import DashboardBar from '@components/Bars/DashboardBar';
import { useState, lazy, Suspense } from 'react';
import {
  RiProfileFill,
  RiProfileLine,
  RiLockPasswordLine,
  RiLockPasswordFill,
  RiDeleteBin5Line,
} from 'react-icons/ri';
import DeleteAccount from '@components/Profile/DeleteAccount';
import ThemedLoader from '@utils/Spinner';
import usePageTitle from '@hooks/useTitle';

// lazy load components
const EditProfile = lazy(() => import('@components/Profile/EditProfile'));
const Password = lazy(() => import('@components/Profile/Password'));

enum ProfileTab {
  Edit = 'Edit',
  Password = 'Password',
}

export default function Profile() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeTab, setActiveTab] = useState<ProfileTab>(ProfileTab.Edit);
  usePageTitle('Profile - Collabor8');
  const handleTabChange = (tab: ProfileTab) => setActiveTab(tab);

  // Reusable SidebarItem component
  const SidebarItem = ({
    isActive,
    iconActive,
    iconInactive,
    label,
    onClick,
  }: {
    isActive: boolean;
    iconActive: any;
    iconInactive: any;
    label: string;
    onClick: () => void;
  }) => (
    <Flex
      p={2}
      pl={4}
      alignItems="center"
      _hover={{ bg: '#524175' }}
      bg={isActive ? '#524175' : 'transparent'}
      cursor="pointer"
      onClick={onClick}
      role="tab"
      aria-selected={isActive}
    >
      <Icon as={isActive ? iconActive : iconInactive} />
      <Text pl={2} fontFamily="mono" fontSize="xs">
        {label}
      </Text>
    </Flex>
  );

  return (
    <>
      <DashboardBar />
      <Box
        display={{ base: 'block', md: 'flex' }}
        minHeight="100vh"
        width="100%"
      >
        {/* Sidebar */}
        <Box
          bg="brand.900"
          w={{ base: '100%', md: '230px' }}
          color="white"
          borderRight="2px solid #524175"
          p={{ base: 3, md: 4 }}
        >
          {/* Sidebar Items */}
          <SidebarItem
            isActive={activeTab === ProfileTab.Edit}
            iconActive={RiProfileFill}
            iconInactive={RiProfileLine}
            label="Edit Profile"
            onClick={() => handleTabChange(ProfileTab.Edit)}
          />

          <SidebarItem
            isActive={activeTab === ProfileTab.Password}
            iconActive={RiLockPasswordFill}
            iconInactive={RiLockPasswordLine}
            label="Password"
            onClick={() => handleTabChange(ProfileTab.Password)}
          />

          <Divider pt={5} />

          {/* Delete Account */}
          <Flex
            p={2}
            pl={4}
            mt={5}
            alignItems="center"
            _hover={{ bg: 'red.600', color: 'white' }}
            cursor="pointer"
            onClick={onOpen}
            color="red.300"
          >
            <Icon as={RiDeleteBin5Line} />
            <Text pl={2} fontFamily="mono" fontSize="xs">
              Delete Account
            </Text>
          </Flex>
        </Box>

        {/* Main Content */}
        <Box className="p-5 md:p-10 pb-5 flex flex-col w-full min-h-screen bg-brand-100">
          <Box
            bg="brand.900"
            color="white"
            minHeight="100vh"
            borderTopRadius="2xl"
            p={{ base: 4, md: 6 }}
          >
            <Suspense fallback={<ThemedLoader />}>
              {activeTab === ProfileTab.Edit ? <EditProfile /> : <Password />}
            </Suspense>
          </Box>
        </Box>

        {/* Delete Account Modal */}
        <DeleteAccount isOpen={isOpen} onClose={onClose} />
      </Box>
    </>
  );
}
