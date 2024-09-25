import React, { SetStateAction, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Heading,
  Flex,
  Box,
  Text,
  Avatar,
  Spacer,
  Input,
  InputRightElement,
  InputGroup,
  Select,
  Divider,
} from '@chakra-ui/react';
//import { FaLink } from 'react-icons/fa6';
import {
  useCreateProjectShareMutation,
  useGetProjectSharesByProjectIdQuery,
  useInviteUserMutation,
  useUpdateProjectShareMutation,
} from '@store/services/projectShare';
import { selectUserDetails } from '@store/selectors/userSelectors';
import { Project, ProjectShares } from '@types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | ProjectShares;
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const ShareMenu: React.FC<ModalProps> = ({ isOpen, onClose, project }) => {
  /**
   * TODO:
   * 1- Be able to invite people using their username, and by then we create a new project share entity
   * 2- Display people who have access: if they are pending we display pending, if not we display their access mode
   * 3- Be able to toggle the menu button is enough to make a request to update the project share entity access level
   */
  const [createProjectShare, { isLoading: projectShareLoading }] =
    useCreateProjectShareMutation();
  const [inviteUser, { isLoading }] = useInviteUserMutation();
  const [updateShares] = useUpdateProjectShareMutation();
  const { data: shares, refetch } = useGetProjectSharesByProjectIdQuery(
    project.project_id,
  );
  const userDetails = useSelector(selectUserDetails);
  const { projectId } = useParams();

  const finalRef = useRef(null);
  const [inviteeType, setInviteeType] = useState<'' | 'email' | 'username'>('');
  const [inviteeValue, setInviteeValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [accessPermission, setAccessPermission] = useState<'read' | 'write'>(
    'read',
  );
  const toast = useToast();

  //console.log({ project })
  // Handlers
  const handleClose = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setErrorMessage('');
    setInviteeType('');
    setAccessPermission('read');
  };

  const handleInvite = async () => {
    if (inviteeType === 'email') {
      await handleEmailInvite();
    } else {
      await handleUsernameInvite();
    }
  };

  const handleEmailInvite = async () => {
    if (!emailRegex.test(inviteeValue)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (inviteeValue === userDetails.email) {
      toastRoasting(
        'Trying to invite yourself? Come on, we all need a buddy, but not like this!',
      );
      return;
    }

    setErrorMessage('');

    try {
      await inviteUser({
        _id: project._id,
        invitee_email: inviteeValue,
        access_level: accessPermission,
        project_id: project.project_id,
        inviter_email: userDetails.email ?? userDetails.username,
      }).unwrap();

      toastSuccess('Email has been sent successfully to your partner');
    } catch (error: any) {
      toastError(`Oops, an error occurred: ${error.data?.message}`);
    }
  };

  const handleUsernameInvite = async () => {
    if (inviteeValue === userDetails.username) {
      toastRoasting(
        'Nice try inviting yourself! But how about inviting someone else?',
      );
      return;
    }

    try {
      await createProjectShare({
        project_id: project.project_id,
        access_level: accessPermission,
        username: inviteeValue,
        project_name: project.project_name,
      }).unwrap();

      toastSuccess(
        `User ${inviteeValue} has been invited to collaborate successfully`,
      );
      refetch();
    } catch (error: any) {
      handleInviteError(error);
    }
  };

  const handleInviteError = (error: any) => {
    console.log('Failed to send invitation to the user', error);
    if (error.status === 409) {
      setErrorMessage('This user is already a contributor to this project');
    } else if (error.status === 404) {
      setErrorMessage("This user doesn't exist");
    }
  };

  const handlePermissionChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
    invitee: any,
  ) => {
    const newPermission = event.target.value === 'can edit' ? 'write' : 'read';

    try {
      await updateShares({
        id: invitee.share_id,
        data: { access_level: newPermission },
      }).unwrap();

      refetch();
      console.log('Access level has been changed');
    } catch (error: any) {
      console.error('An error occurred while updating the access level', error);
    }
  };

  const toastSuccess = (message: string) => {
    toast({
      title: '🎉 Invitation Sent!',
      description: `Success! ${message}`,
      status: 'success',
      duration: 7000,
      isClosable: true,
      position: 'bottom-left',
      variant: 'subtle',
    });
  };

  const toastError = (message: string) => {
    toast({
      title: '🚨 Error Encountered!',
      description: `Oops! ${message}. Please check and try again.`,
      status: 'error',
      duration: 7000,
      isClosable: true,
      position: 'bottom-left',
      variant: 'subtle',
    });
  };

  const toastRoasting = (message: string) => {
    toast({
      title: '🙃 Nice Try!',
      description: message,
      status: 'warning',
      duration: 7000,
      isClosable: true,
      position: 'bottom-left',
      variant: 'subtle',
    });
  };

  return (
    <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent bg="brand.900">
        <ModalHeader>
          <Flex alignItems="center">
            <Heading as="h6" size="xs" fontFamily="mono" color="white">
              Share this project
            </Heading>
            <Spacer />
          </Flex>
        </ModalHeader>
        <ModalBody>
          <ShareTypeSelector
            inviteeType={inviteeType}
            onChange={(e) => setInviteeType(e.target.value as any)}
          />
          {inviteeType && (
            <InviteBy
              type={inviteeType}
              value={inviteeValue}
              permission={accessPermission}
              handlePermission={setAccessPermission}
              handleInputChange={(e) => setInviteeValue(e.target.value as any)}
              handleInvitation={handleInvite}
              isLoading={isLoading || projectShareLoading}
            />
          )}
          {errorMessage && (
            <Text color="red.300" fontFamily="mono" fontSize="xs" mt={2}>
              {errorMessage}
            </Text>
          )}
          <Heading as="h6" size="xs" fontFamily="mono" color="gray" mt={6}>
            Who has access
          </Heading>
          <Divider opacity={0.5} mt={2} mb={2} />
          <Box mt={3} mb={3}>
            <AccessList
              userDetails={userDetails}
              shares={shares}
              handlePermissionChange={handlePermissionChange}
            />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

// Component to select invitation method
const ShareTypeSelector: React.FC<{
  inviteeType: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
}> = ({ inviteeType, onChange }) => (
  <Select
    placeholder="Invite a friend to collaborate by"
    size="sm"
    color="orange"
    value={inviteeType}
    onChange={onChange}
    mb="0.5rem"
    className="flex items-center !mb-2"
    outline="white"
  >
    <option value="username">username</option>
    <option value="email">email</option>
  </Select>
);

// Component for invitation by username or email
const InviteBy = ({
  type,
  value,
  permission,
  handlePermission,
  handleInputChange,
  handleInvitation,
  isLoading,
}) => (
  <InputGroup size="sm">
    <Input
      pr="4.5rem"
      placeholder={`Invite others by ${type !== 'email' ? 'username' : 'email'}`}
      fontFamily="mono"
      value={value}
      color="white"
      onChange={handleInputChange}
      type={type}
    />
    <InputRightElement width={value ? '8.8rem' : '3.25rem'} pr={1}>
      {value && (
        <Select
          size="sm"
          variant="unstyled"
          value={permission}
          onChange={(e) => handlePermission(e.target.value)}
          color="orange"
        >
          <option value="write">can edit</option>
          <option value="read">can view</option>
        </Select>
      )}
      <Button
        isLoading={isLoading}
        h="1.5rem"
        size="sm"
        onClick={handleInvitation}
        colorScheme="orange"
        isDisabled={!value}
      >
        Invite
      </Button>
    </InputRightElement>
  </InputGroup>
);

// Component to list users with access
const AccessList = ({ userDetails, shares, handlePermissionChange }) => (
  <>
    <Flex alignItems="center">
      <Avatar
        name={`${userDetails?.first_name} ${userDetails?.last_name}`}
        src={userDetails?.profile_picture}
        size="sm"
      />
      <Text m={3} fontSize="sm" color="white">
        {`${userDetails?.first_name} ${userDetails?.last_name} (you)`}
      </Text>
      <Spacer />
      <Text fontSize="sm" color="white" pr={4}>
        owner
      </Text>
    </Flex>
    {shares?.map((invitee, index) => (
      <Flex alignItems="center" key={index}>
        <Avatar
          name={`${invitee?.first_name} ${invitee?.last_name}`}
          src={invitee?.profile_picture}
          size="sm"
        />
        <Text m={3} fontSize="sm" color="white">
          {invitee?.username}
        </Text>
        <Spacer />
        <Select
          size="sm"
          w="150px"
          color="orange"
          value={invitee?.access_level === 'write' ? 'can edit' : 'can view'}
          onChange={(e) => handlePermissionChange(e, invitee)}
        >
          <option value="write">can edit</option>
          <option value="read">can view</option>
        </Select>
      </Flex>
    ))}
  </>
);

export default ShareMenu;
