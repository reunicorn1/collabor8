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
} from '@chakra-ui/react';
import React, { useRef } from 'react';
import { FaLink } from 'react-icons/fa6';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShareMenu: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const url = import.meta.env.VITE_URL;
  const finalRef = useRef(null);
  const location = useLocation();
  const [clicked, setClicked] = useState(false);
  const [invitee, setInvitee] = useState('');
  const [permission, setPermission] = useState('can edit');

  // This function handles copying the link to the clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        // Success feedback (optional)
        console.log('Link copied to clipboard!');
      },
      (err) => {
        // Error handling (optional)
        console.error('Failed to copy the link: ', err);
      },
    );
  };

  // This function handles clicking the "copy link" button
  const handleClick = () => {
    console.log(`${url}${location.pathname}`);
    copyToClipboard(`${url}${location.pathname}`);
    setClicked(true);
  };

  // This function handles closing the menu
  const handleClose = () => {
    setClicked(false);
    setInvitee('');
    setPermission('can edit');
    onClose();
  };

  //   const handleInvite = () => {
  //     // TODO: info sent, email in the input plus the option selected in the menu
  //     // This will be sent to an endpoint to send an email to this user about the invitation
  //     // And also to notify the user in his email so he accepts the invitation. This function is triggered by clicking the invite button
  //   }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvitee(e.target.value);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPermission(e.target.value);
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
            <Button
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
            </Button>
          </Flex>
        </ModalHeader>
        <ModalBody>
          <Alert status="info" bg="orange.200" fontSize="sm" mb={6}>
            <AlertIcon color="orange.600" />
            Sharing project via link only allow people to view
          </Alert>
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
                  <option value="option1">can edit</option>
                  <option value="option2">can view</option>
                </Select>
              )}
              <Button
                h="1.5rem"
                size="sm"
                onClick={handleClick}
                colorScheme="orange"
              >
                Invite
              </Button>
            </InputRightElement>
          </InputGroup>
          <Heading as="h6" size="xs" fontFamily="mono" color="gray" mt={6}>
            Who has access
          </Heading>
          <Divider opacity={0.5} mt={2} mb={2} />
          {/* TODO: This box will contain a list of contributors with the ability to change their allowed permissions, changing the option should trigger an api request */}
          <Box mt={3} mb={3}>
            <Flex alignItems="center">
              <Avatar name="Reem Osama" src="" size="sm" />
              {/* TODO: If you are the owner you should have (you) string beside your name */}
              <Text m={3} fontSize="sm" color="white">
                Reem Osama (you)
              </Text>
              <Spacer />
              {/* The value of the select for the owner doesn't change, it shows a string "owner" but for others
               changing the value sends a request to the database with the new value */}
              <Text fontSize="sm" color="white" pr={4}>
                owner
              </Text>
            </Flex>
            <Flex alignItems="center">
              <Avatar name="Mohamed Elfadil" src="" size="sm" />
              <Text m={3} fontSize="sm" color="white">
                Mohamed Elfadil
              </Text>
              <Spacer />
              <Select w="5.5rem" size="sm" variant="unstyled" color="white">
                <option value="option1">can edit</option>
                <option value="option2">can view</option>
              </Select>
            </Flex>
            <Flex alignItems="center">
              <Avatar name="Mohannad Babiker" src="" size="sm" />
              <Text m={3} fontSize="sm" color="white">
                Mohannad Babiker
              </Text>
              <Spacer />
              <Select w="5.5rem" size="sm" variant="unstyled" color="white">
                <option value="option1">can edit</option>
                <option value="option2">can view</option>
              </Select>
            </Flex>
            <Flex alignItems="center">
              <Avatar name="Abdallah Abdelrahman" src="" size="sm" />
              <Text m={3} fontSize="sm" color="white">
                Abdallah Abdelrahman
              </Text>
              <Spacer />
              <Select w="5.5rem" size="sm" variant="unstyled" color="white">
                <option value="option1">can edit</option>
                <option value="option2">can view</option>
              </Select>
            </Flex>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ShareMenu;
