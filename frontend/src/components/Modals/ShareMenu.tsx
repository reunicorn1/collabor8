import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Alert,
  AlertIcon,
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
  useToast,
} from '@chakra-ui/react';
import React, { useRef } from 'react';
import { FaLink } from 'react-icons/fa6';
import { useLocation, useParams } from 'react-router-dom';
import { useState } from 'react';
import {
  useCreateProjectShareMutation,
  useGetProjectSharesByProjectIdQuery,
  useInviteUserMutation,
  useUpdateProjectShareMutation,
} from '@store/services/projectShare';
import { useSelector } from 'react-redux';
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
  const url = import.meta.env.VITE_URL;
  const [createProjectShare] = useCreateProjectShareMutation();
  const [invite, { isLoading }] = useInviteUserMutation();
  const { data, refetch } = useGetProjectSharesByProjectIdQuery(
    project.project_id,
  );
  const [updateShares] = useUpdateProjectShareMutation();
  const userDetails = useSelector(selectUserDetails);
  const finalRef = useRef(null);
  const [clicked, setClicked] = useState(false);
  const [inviteeType, setInviteeType] = useState('');
  const [value, setValue] = useState('');
  const [errmsg, setErrMsg] = useState('');
  const [permission, setPermission] = useState('read');
  const toast = useToast();
  const { projectId: project_id } = useParams();

  // This function handles closing the menu
  const handleClose = () => {
    if (errmsg) setErrMsg('');
    setClicked(false);
    setInviteeType('');
    setPermission('');
    onClose();
  };

  const handleInvite = async () => {
    if (inviteeType === 'email') {
      // send email to user
      if (!emailRegex.test(value)) {
        setErrMsg('Please enter a valid email address.');
        return;
      } else {
        setErrMsg('');
      }
      invite({
        invitee_email: value,
        access_level: permission,
        project_id,
        inviter_email: userDetails.email ?? userDetails.username,
      })
        .unwrap()
        .then(_ => {
          toast({
            title: 'Project Invitation',
            description: 'Email has been sent successfully to your partner',
            variant: 'subtle',
            status: 'success',
            position: 'bottom-left',
          });
        })
        .catch(err => {
          toast({
            title: 'Project Invitation',
            variant: 'subtle',
            description: `Oops, an error occured: ${err.data?.message}`,
            status: 'error',
            position: 'bottom-left',
          })
        });
      return;
    }
    // send invitation by username
    try {
      await createProjectShare({
        project_id: project.project_id,
        access_level: permission === 'can read' ? 'read' : 'write',
        username: value,
        project_name: 'project',
      }).unwrap();
      // The list of project shared should be updated with a refetch();
      toast({
        title: `User ${value} has been invited to collaborate successfully`,
        variant: 'subtle',
        position: 'bottom-right',
        status: 'success',
        isClosable: true,
      });
      refetch();
    } catch (err: any) {
      console.log('Failed to send invitataion to the user', err);
      if (err.status === 500) {
        setErrMsg('This user is already a contributer in this project');
      } else if (err.status === 404) {
        setErrMsg("This user doesn't exist");
      }
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPermission(e.target.value);
  };

  const handleChangeInvtation = async (
    e: React.ChangeEvent<HTMLSelectElement>,
    invitee,
  ) => {
    const permission = e.target.value === 'can edit' ? 'write' : 'read';
    await updateShares({
      id: invitee.share_id,
      data: { access_level: permission },
    })
      .unwrap()
      .then((_) => {
        refetch();
        console.log('Access level has been changed');
      })
      .catch((err) => {
        console.log(
          'An error occured during updating the access level of this user',
          err,
        );
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
          <Select
            placeholder="Share project by"
            size="sm"
            color="orange"
            value={inviteeType}
            onChange={(e) => setInviteeType(e.target.value)}
            mb="0.5rem"
            className="!mb-2"
            outline="white"
          >
            <option value="text">username</option>
            <option value="email">email</option>
          </Select>
          {inviteeType && (
            <InviteBy
              handleInvitation={handleInvite}
              handleInputChange={(e) => setValue(e.target.value)}
              handlePermission={setPermission}
              permission={permission}
              value={value}
              type={inviteeType}
            />
          )}
          <Text color="red.300" fontFamily="mono" fontSize="xs" mt={2}>
            {errmsg}
          </Text>
          <Heading as="h6" size="xs" fontFamily="mono" color="gray" mt={6}>
            Who has access
          </Heading>
          <Divider opacity={0.5} mt={2} mb={2} />
          <Box mt={3} mb={3}>
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
            {/* This is a list of all contributors with their access mode as a toggle which sends a request when changed */}
            {data?.map((invitee, index) => {
              return (
                <Flex alignItems="center" key={index}>
                  <Avatar
                    name={`${invitee?.first_name} ${invitee?.last_name}`}
                    src={invitee?.profile_picture}
                    size="sm"
                  />
                  <Text m={3} fontSize="sm" color="white">
                    {`${invitee?.first_name} ${invitee?.last_name}`}
                  </Text>
                  <Spacer />
                  {invitee?.status === 'pending' ? (
                    <Text fontSize="sm" color="white">
                      {invitee?.status}
                    </Text>
                  ) : (
                    <Select
                      w="5.5rem"
                      size="sm"
                      variant="unstyled"
                      color="white"
                      value={
                        invitee?.access_level === 'write'
                          ? 'can edit'
                          : 'can view'
                      }
                      onChange={(e) => handleChangeInvtation(e, invitee)}
                    >
                      <option value="can edit">can edit</option>
                      <option value="can view">can view</option>
                    </Select>
                  )}
                </Flex>
              );
            })}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

function InviteBy({
  type,
  value,
  permission,
  handlePermission,
  handleInputChange,
  handleInvitation,
}) {
  return (
    <InputGroup size="sm">
      <Input
        pr="4.5rem"
        placeholder={`Invite others by ${type === 'text' ? 'username' : 'email'}`}
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
            variant='unstyled'
            value={permission}
            onChange={(e) => handlePermission(e.target.value)}
            color='orange'
          >
            <option value="write">can edit</option>
            <option value="read"> can view</option>
          </Select>
        )}
        <Button
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
}
export default ShareMenu;
