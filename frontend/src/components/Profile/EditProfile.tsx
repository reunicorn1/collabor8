import {
  Box,
  Flex,
  Avatar,
  useBreakpointValue,
  Button,
  Heading,
  Spacer,
  ButtonGroup,
  IconButton,
  Input,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { useRef, useState, useEffect, ChangeEvent } from 'react';
import { FiEdit3 } from 'react-icons/fi';
import { FaPen } from 'react-icons/fa';
import { MdOutlineCancel } from 'react-icons/md';
import {
  useGetCurrentUserProfileQuery,
  useUpdateCurrentUserProfileMutation,
} from '@store/services/user';
import { User } from '../../types';
import { uploadFile } from '@uploadcare/upload-client';

export default function EditProfile() {
  // Data shown in the fields are from the data retrieved from the user's account
  // This can be found either in the global state, or by making an additional request
  // the states are used to create a duplicate local state which change based on user's
  // interactions with fields
  // When the user clicks save the part involved in that section is sent in an update api request
  // After the request is sent, data related to userdata is refetched so the state is updated globally as well
  const UPLOAD_CARE = import.meta.env.VITE_UPLOADCARE;
  const { data, refetch, isLoading } = useGetCurrentUserProfileQuery();
  const [updateProfile] = useUpdateCurrentUserProfileMutation();
  const [input, setInput] = useState<User>(); // hopeless typeError
  const [editInfo, setEditInfo] = useState(true);
  const [editBio, setEditBio] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const toast = useToast();
  const isMed = useBreakpointValue({ base: false, md: true });

  useEffect(() => {
    const uploading = async () => {
      if (selectedFile) {
        setLoading(true);
        const result = await uploadFile(selectedFile, {
          publicKey: UPLOAD_CARE,
          store: 'auto',
          metadata: {
            subsystem: 'js-client',
            pet: 'cat',
          },
        });
        setLoading(false);
        if (result.cdnUrl) {
          // setInput({ ...input, profile_picture: result.cdnUrl });
          await updateProfileAction({
            profile_picture: result.cdnUrl,
          });
        }
      }
    };
    uploading();
    // TODO: After file is selected and uploaded an API request to update the file can be made here
  }, [selectedFile]);

  // The main useEffect to retrieve data and set component properly
  useEffect(() => {
    if (data) setInput(data);
  }, [data]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.currentTarget;
    // TODO: when bio becomes part of the user data add handleInputchange to the textarea component.
    setInput({ ...input, [name]: value }); // hopeless TypeError related to the first one
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];
    if (file) {
      console.log('Selected file:', file.name);
      setSelectedFile(file);
    }
  };

  const handleButtonClick = () => {
    if (inputRef.current) inputRef.current.click();
  };

  const handleCancel = (type: string) => {
    // Cancel the edit mode of the profile info
    setInput(data);
    if (type === 'info') {
      setEditInfo(true);
    } else {
      setEditBio(true);
    }
  };

  const updateProfileAction = async (object: Partial<User>) => {
    // Send data to be updated
    try {
      await updateProfile(object).unwrap();
      refetch(); // Refetch the user profile after update
      toast({
        title: `Data has been updated successfully!`,
        variant: 'subtle',
        position: 'bottom-right',
        status: 'success',
        isClosable: true,
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleUpdateProfile = async () => {
    if (input) {
      await updateProfileAction({
        first_name: input.first_name, // TypeError
        last_name: input.last_name,
        email: input.email,
      });
    }
    handleCancel('info');
  };

  const handleUpdateBio = async () => {
    if (input && input.bio) {
      await updateProfileAction({
        bio: input.bio,
      });
    }
    handleCancel('bio');
  };
  // TODO: Create another function to create an update request specifically for bio

  function Avatar_C() {
    return (
      <Avatar
        size={{ base: 'xl', sm: '2xl' }}
        position={{ md: 'absolute' }}
        top={{ md: '150px' }}
        src={data?.profile_picture}
        borderColor="white"
      />
    );
  }

  return (
    <>
      {isLoading ? (
        <Box
          h="100vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Box className="loader"></Box>
        </Box>
      ) : (
        <>
          <Box
            bgGradient="linear(to-r, #F6D277, #F16145, #76449A)"
            h="100px"
            borderTopRadius="2xl"
          />
          {isMed && (
            <Flex p={20} pt={10} pb={0}>
              <Avatar_C />
            </Flex>
          )}
          <Box
            p={{ base: 10, md: 20 }}
            pt={10}
            pb={10}
            display="flex"
            justifyContent={{ base: 'space-between', md: 'flex-end' }}
            alignItems="center"
          >
            {!isMed && <Avatar_C />}
            <input
              type="file"
              ref={inputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            {!isMed ? (
              <Button
                leftIcon={<FiEdit3 />}
                variant="solid"
                size="xs"
                bg="white"
                fontFamily="mono"
                onClick={handleButtonClick}
                isLoading={loading}
              >
                Edit
              </Button>
            ) : (
              <Button
                colorScheme="white"
                variant="outline"
                size="sm"
                fontFamily="mono"
                onClick={handleButtonClick}
                isLoading={loading}
              >
                Upload new photo
              </Button>
            )}
          </Box>
          <Box
            p={5}
            ml={{ base: 10, md: 20 }}
            mr={{ base: 10, md: 20 }}
            mb={10}
            border="1px"
            borderRadius="2xl"
          >
            <Flex alignItems="center">
              <Heading fontFamily="mono" fontSize="md">
                Personal Info
              </Heading>
              <Spacer />
              {editInfo ? (
                <Button
                  leftIcon={<FiEdit3 />}
                  variant="solid"
                  size="xs"
                  bg="white"
                  fontFamily="mono"
                  onClick={() => setEditInfo(false)}
                >
                  Edit
                </Button>
              ) : (
                <ButtonGroup
                  size="xs"
                  bg="white"
                  borderRadius="lg"
                  variant="solid"
                  isAttached
                  fontFamily="mono"
                  _hover={{ bg: 'gray.600' }}
                >
                  {/* Save Button sends input data using api to update data, exit resets input to the 
                  original data and change the editInfo state */}
                  <Button onClick={handleUpdateProfile}>Save</Button>
                  <IconButton
                    borderLeft="1px, black"
                    bg="gray.200"
                    fontSize="15px"
                    aria-label="Cancel"
                    color="red.300"
                    icon={<MdOutlineCancel />}
                    onClick={() => handleCancel('info')}
                  />
                </ButtonGroup>
              )}
            </Flex>
            <Box
              display={{ base: 'block', md: 'flex' }}
              pt={5}
              alignItems="center"
              justifyContent="space-between"
            >
              <Box m={2} mb={{ base: 2, md: 0 }} mt={0}>
                <Heading fontFamily="mono" fontSize="sm" opacity="0.7">
                  First Name
                </Heading>
                {editInfo ? (
                  <Heading
                    fontFamily="mono"
                    fontSize="md"
                    mt={2}
                    isTruncated
                    maxWidth="100%"
                  >
                    {data?.first_name}
                  </Heading>
                ) : (
                  <Input
                    mt={2}
                    value={input?.first_name}
                    name="first_name"
                    fontFamily="mono"
                    onChange={handleInputChange}
                  />
                )}
              </Box>
              <Box m={2} mb={{ base: 2, md: 0 }} mt={0}>
                <Heading fontFamily="mono" fontSize="sm" opacity="0.7">
                  Last Name
                </Heading>
                {editInfo ? (
                  <Heading
                    fontFamily="mono"
                    fontSize="md"
                    mt={2}
                    isTruncated
                    maxWidth="100%"
                  >
                    {data?.last_name}
                  </Heading>
                ) : (
                  <Input
                    mt={2}
                    value={input?.last_name}
                    name="last_name"
                    fontFamily="mono"
                    onChange={handleInputChange}
                  />
                )}
              </Box>
              <Box m={2} mb={0} mt={0}>
                <Heading fontFamily="mono" fontSize="sm" opacity="0.7">
                  Email
                </Heading>
                {editInfo ? (
                  <Heading
                    fontFamily="mono"
                    fontSize="md"
                    mt={2}
                    isTruncated
                    maxWidth="100%"
                  >
                    {data?.email}
                  </Heading>
                ) : (
                  <Input
                    mt={2}
                    value={input?.email}
                    name="email"
                    fontFamily="mono"
                    onChange={handleInputChange}
                  />
                )}
              </Box>
            </Box>
          </Box>
          <Box
            p={5}
            m={{ base: 10, md: 20 }}
            mt={0}
            border="1px"
            borderRadius="2xl"
          >
            <Flex alignItems="center">
              <Heading fontFamily="mono" fontSize="md">
                Bio
              </Heading>
              <Spacer />
              {editBio ? (
                <Button
                  leftIcon={<FiEdit3 />}
                  variant="solid"
                  size="xs"
                  bg="white"
                  fontFamily="mono"
                  onClick={() => setEditBio(false)}
                >
                  Edit
                </Button>
              ) : (
                <ButtonGroup
                  size="xs"
                  bg="white"
                  borderRadius="lg"
                  variant="solid"
                  isAttached
                  fontFamily="mono"
                  _hover={{ bg: 'gray.600' }}
                >
                  {/* Save Button sends input data using api to update data, exit resets input to the 
                  original data and change the editInfo state */}
                  <Button onClick={handleUpdateBio}>Save</Button>
                  <IconButton
                    borderLeft="1px, black"
                    bg="gray.200"
                    fontSize="15px"
                    aria-label="Cancel"
                    color="red.300"
                    icon={<MdOutlineCancel />}
                    onClick={() => handleCancel('bio')}
                  />
                </ButtonGroup>
              )}
            </Flex>
            {editBio ? (
              <Box pt={5} fontFamily="mono" fontSize="sm">
                {data?.bio}
              </Box>
            ) : (
              <Textarea
                mt={7}
                name="bio"
                fontFamily="mono"
                fontSize="sm"
                size="lg"
                h="100%"
                value={input?.bio}
                onChange={handleInputChange}
              ></Textarea>
            )}
          </Box>
        </>
      )}
    </>
  );
}
