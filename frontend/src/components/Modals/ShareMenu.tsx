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
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  useCreateProjectShareMutation,
  useGetProjectSharesByProjectIdQuery,
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

const ShareMenu: React.FC<ModalProps> = ({ isOpen, onClose, project }) => {
  /**
   * TODO:
   * 1- Be able to invite people using their username, and by then we create a new project share entity
   * 2- Display people who have access: if they are pending we display pending, if not we display their access mode
   * 3- Be able to toggle the menu button is enough to make a request to update the project share entity access level
   */
  const url = import.meta.env.VITE_URL;
  const [createProjectShare] = useCreateProjectShareMutation();
  const { data, refetch } = useGetProjectSharesByProjectIdQuery(
    project.project_id,
  );
  const [updateShares] = useUpdateProjectShareMutation();
  const userDetails = useSelector(selectUserDetails);
  const finalRef = useRef(null);
  const location = useLocation();
  const [clicked, setClicked] = useState(false);
  const [invitee, setInvitee] = useState('');
  const [errmsg, setErrMsg] = useState('');
  const [permission, setPermission] = useState('can edit');
  const toast = useToast();

  // // This function handles copying the link to the clipboard
  // const copyToClipboard = (text: string) => {
  //   navigator.clipboard.writeText(text).then(
  //     () => {
  //       // Success feedback (optional)
  //       console.log('Link copied to clipboard!');
  //     },
  //     (err) => {
  //       // Error handling (optional)
  //       console.error('Failed to copy the link: ', err);
  //     },
  //   );
  // };

  // This function handles clicking the "copy link" button
  // const handleClick = () => {
  //   console.log(`${url}${location.pathname}`);
  //   copyToClipboard(`${url}${location.pathname}`);
  //   setClicked(true);
  // };

  // This function handles closing the menu
  const handleClose = () => {
    if (errmsg) setErrMsg('');
    setClicked(false);
    setInvitee('');
    setPermission('can edit');
    onClose();
  };

  const handleInvite = async () => {
    // TODO: info sent, email in the input plus the option selected in the menu
    // This will be sent to an endpoint to send an email to this user about the invitation
    // And also to notify the user in his email so he accepts the invitation. This function is triggered by clicking the invite button
    try {
      await createProjectShare({
        project_id: project.project_id,
        access_level: permission === 'can read' ? 'read' : 'write',
        username: invitee,
        project_name: 'project',
      }).unwrap();
      // The list of project shared should be updated with a refetch();
      toast({
        title: `User ${invitee} has been invited to collaborate successfully`,
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvitee(e.target.value);
    if (errmsg) setErrMsg('');
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
            {/* <Button
              size="sm"
              variant="ghost"
              color="orange"
              leftIcon={<FaLink />}
              _hover={{
                color: 'black',
                bg: 'white',
              }}
              onClick={handleClick}
            >
              {clicked ? `Link copied!` : `Copy link`}
            </Button> */}
          </Flex>
        </ModalHeader>
        <ModalBody>
          {/* <Alert status="info" bg="orange.200" fontSize="sm" mb={6}>
            <AlertIcon color="orange.600" />
            Sharing project via link only allow people to view
          </Alert> */}
          <InputGroup size="sm">
            <Input
              pr="4.5rem"
              placeholder="Invite others by username"
              fontFamily="mono"
              value={invitee}
              color="white"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(e)
              }
            />
            <InputRightElement width={invitee ? '8.8rem' : '3.25rem'} pr={1}>
              {invitee && (
                <Select
                  size="sm"
                  variant="unstyled"
                  color="white"
                  value={permission}
                  onChange={handleSelectChange}
                >
                  <option value="can edit">can edit</option>
                  <option value="can view">can view</option>
                </Select>
              )}
              <Button
                h="1.5rem"
                size="sm"
                onClick={handleInvite}
                colorScheme="orange"
                isDisabled={!invitee}
              >
                Invite
              </Button>
            </InputRightElement>
          </InputGroup>
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

export default ShareMenu;
