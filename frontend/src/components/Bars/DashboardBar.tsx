import {
  Flex,
  Image,
  Spacer,
  Icon,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  IconButton,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { AddIcon, ChevronDownIcon } from '@chakra-ui/icons';
import DBMenu from '../Dashboard/DBMenu';
import BellMenu from '@components/Dashboard/BellMenu';
import NewProject from '@components/Modals/NewProject';
import { useNavigate } from 'react-router-dom';
import { selectUserDetails } from '@store/selectors/userSelectors';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  useGetUserProjectSharesQuery,
  useUpdateStatusMutation,
} from '@store/services/projectShare';

export default function DashboardBar() {
  const [invitations, setInvitations] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const userDetails = useSelector(selectUserDetails);
  const userId = userDetails?.user_id || '';
  const { data: userProjectShares } = useGetUserProjectSharesQuery(userId);
  const [updateShareStatus] = useUpdateStatusMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (userProjectShares) {
      const pendingInvitations = userProjectShares.filter(
        (share) => share.status === 'pending',
      );
      setInvitations(pendingInvitations);
      setNotificationCount(pendingInvitations.length);
    }
  }, [userProjectShares]);

  console.log('Invetations:=========>', invitations);

  const handleApproval = async (share_id) => {
    console.log('ON APPROVE share_id: ', share_id);
    try {
      await updateShareStatus({ share_id, status: 'accepted' }).unwrap();
      setInvitations((prev) => prev.filter((inv) => inv.share_id !== share_id));
      setNotificationCount((prev) => prev - 1);
      toast({
        title: 'Approval Confirmed',
        description: 'You have successfully onboarded a new contributor! 🎉',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
        variant: 'subtle',
      });
    } catch (error) {
      console.error('Failed to approve invitation:', error);
      toast({
        title: 'Approval Failed',
        description: 'Oops! Something went wrong. Please try again. 🛠️',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
        variant: 'subtle',
      });
    }
  };

  const handleDecline = async (share_id) => {
    console.log('ON DECLINE share_id: ', share_id);
    try {
      await updateShareStatus({ share_id, status: 'rejected' }).unwrap();
      setInvitations((prev) => prev.filter((inv) => inv.share_id !== share_id));
      setNotificationCount((prev) => prev - 1);
      toast({
        title: 'Invitation Declined',
        description: "You've declined the request. Maybe next time! 👋",
        status: 'info',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
        variant: 'subtle',
      });
    } catch (error) {
      console.error('Failed to decline invitation:', error);
      toast({
        title: 'Decline Failed',
        description: 'Something went wrong while declining the invitation. ⚙️',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
        variant: 'subtle',
      });
    }
  };

  return (
    <Flex
      bg="brand.900"
      alignItems="center"
      borderBottom="2px solid #524175"
      p={3}
      w="100%"
    >
      <Image
        src="/logo-bb.png"
        h="23px"
        ml={3}
        cursor="pointer"
        onClick={() => navigate('/dashboard')}
      />
      <Spacer />
      <ButtonGroup size="xs" isAttached variant="outline" onClick={onOpen}>
        <Button
          fontFamily="mono"
          color="white"
          _hover={{ color: 'black', bg: 'white' }}
        >
          New Project
        </Button>
        <IconButton
          _hover={{ color: 'black', bg: 'white' }}
          aria-label="Add a Project"
          color="white"
          icon={<AddIcon />}
        />
      </ButtonGroup>

      <BellMenu
        invitations={invitations}
        notificationCount={notificationCount}
        onApprove={handleApproval}
        onDecline={handleDecline}
      />

      <Box display="flex" alignItems="center">
        <DBMenu>
          <Avatar
            src={userDetails?.profile_picture}
            boxSize="22px"
            bg="purple.400"
            ml={4}
            mr={2}
          />
          <Icon color="white" as={ChevronDownIcon} />
        </DBMenu>
      </Box>
      <NewProject isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
}
