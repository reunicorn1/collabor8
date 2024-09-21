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
  const leftPosition = useBreakpointValue({
    base: '120px',
    sm: '350px',
    md: '350px',
  });

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
    // TODO: Data doesnt update between users so i added a refetch to update the data
    refetch();
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
        size={{ base: 'xl', sm: 'xl', md: '2xl' }}
        position={{ md: 'absolute' }}
        top={{ md: '150px' }}
        src={data?.profile_picture}
        left={{ md: leftPosition }}
        borderColor="white"
      />
    );
  }

  /**
   *   return (
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
                    original data and change the editInfo state 
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
              <Flex className="flex flex-col md:flex-row justify-between pt-5"
              >
                <Box>
                  <Heading 
                  fontFamily="mono"
                  className="text-sm md:text-base lg:text-lg opacity-70"
                  >
                    First Name
                  </Heading>
                  {editInfo ? (
                    <Heading
                    fontFamily="mono"
                    className="text-md md:text-lg lg:text-xl mt-2"
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
                <Box>
                  <Heading
                  fontFamily="mono"
                  className="text-sm md:text-base lg:text-lg opacity-70"
                  >
                    Last Name
                  </Heading>
                  {editInfo ? (
                    <Heading 
                    fontFamily="mono"
                    className="text-md md:text-lg lg:text-xl mt-2"
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
                <Box>
                  <Heading 
                  fontFamily="mono"
                  className="text-sm md:text-base lg:text-lg opacity-70"
                  >
                    Email
                  </Heading>
                  {editInfo ? (
                    <Heading
                    fontFamily="mono"
                    className="text-md md:text-lg lg:text-xl mt-2"
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
              </Flex>
            </Box>
            <Box
              p={5}
              m={{ base: 10, md: 20 }}
              mt={0}
              border="1px"
              borderRadius="2xl"
            >
              <Flex alignItems="center">
                <Heading
                fontFamily="mono" fontSize="md">
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
                    original data and change the editInfo state 
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
    )
   
   */


  const fileSection = (
    <div className="p-10 md:p-20 flex justify-between md:justify-end items-center">
      <div className="flex items-start s-12">
        <Avatar_C />
      </div>
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        className="flex items-center font-bold whitespace-normal w-auto break-words border text-white rounded-lg text-xs font-mono px-4 py-2 md:text-red-500"
        onClick={handleButtonClick}
        disabled={loading}
      >
        Upload new photo
      </button>
    </div>
  );

  const personalInfoSection = (

    <div className="p-5 mx-10 md:mx-20 border rounded-2xl mb-10">
      <div className="flex items-center">
        <h2 className="font-mono text-md">Personal Info</h2>
        <div className="ml-auto">
          {editInfo ? (
            <Button
              size="xs"
              className="flex items-center bg-white text-xs font-mono px-4 py-2"
              onClick={() => setEditInfo(false)}
            >
              <FiEdit3 className="mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex space-x-1">
              {/* Save Button sends input data using api to update data, exit resets input to the 
                  original data and change the editInfo state */}
              <Button
                size="xs"
                className="bg-white font-mono text-xs px-4 py-2 rounded-l-lg"
                onClick={handleUpdateProfile}
              >
                Save
              </Button>
              <Button
                size="xs"
                className="bg-gray-200 font-mono text-xs px-4 py-2 rounded-r-lg text-red-300"
                onClick={() => handleCancel('info')}
              >
                <MdOutlineCancel />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div className="flex flex-col md:flex-row justify-between pt-5">
        <div>
          <h3 className="font-mono text-sm md:text-base lg:text-lg opacity-70">
            First Name
          </h3>
          {editInfo ? (
            <h3 className="font-mono text-md md:text-lg lg:text-xl mt-2">
              {data?.first_name}
            </h3>
          ) : (
            <input
              className="mt-2 text-black"
              value={input?.first_name}
              name="first_name"
              onChange={handleInputChange}
            />
          )}
        </div>
        <div>
          <h3 className="font-mono text-sm md:text-base lg:text-lg opacity-70">
            Last Name
          </h3>
          {editInfo ? (
            <h3 className="font-mono text-md md:text-lg lg:text-xl mt-2">
              {data?.last_name}
            </h3>
          ) : (
            <input
              className="mt-2 text-black"
              value={input?.last_name}
              name="last_name"
              onChange={handleInputChange}
            />
          )}
        </div>
        <div>
          <h3 className="font-mono text-sm md:text-base lg:text-lg opacity-70">
            Email
          </h3>
          {editInfo ? (
            <h3 className="font-mono text-md md:text-lg lg:text-xl mt-2">
              {data?.email}
            </h3>
          ) : (
            <input
              className="mt-2 text-black"
              value={input?.email}
              name="email"
              onChange={handleInputChange}
            />
          )}
        </div>
      </div>
    </div>
  );

  const bioSection = (
    <div className="p-5 mx-10 md:mx-20 mt-0 border rounded-2xl">
      <div className="flex items-center">
        <h2 className="font-mono text-md">Bio</h2>
        <div className="ml-auto">
          {editBio ? (
            <Button
              size="xs"
              className="flex items-center bg-white text-xs font-mono px-4 py-2"
              onClick={() => setEditBio(false)}
            >
              <FiEdit3 className="mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex space-x-1">
              {/* Save Button sends input data using api to update data, exit resets input to the 
                    original data and change the editInfo state */}
              <Button
                size="xs"
                className="bg-white font-mono text-xs px-4 py-2 rounded-l-lg"
                onClick={handleUpdateBio}
              >
                Save
              </Button>
              <Button
                size="xs"
                className="bg-gray-200 font-mono text-xs px-4 py-2 rounded-r-lg text-red-300"
                onClick={() => handleCancel('bio')}
              >
                <MdOutlineCancel />
              </Button>
            </div>
          )}
        </div>
      </div>

      {editBio ? (
        <p className="pt-5 font-mono text-sm">{data?.bio}</p>
      ) : (
        <textarea
          className="mt-7 font-mono text-sm w-full h-24 resize-none text-black"
          name="bio"
          value={input?.bio}
          onChange={handleInputChange}
        />
      )}
    </div>

  );
  return (
    <>
      {isLoading ? (
        <div className="h-screen flex justify-center items-center">
          <div className="loader"></div>
        </div>
      ) : (
        <>
          {/* Top Gradient Bar */}
          <div className="h-16 md:h-24 bg-gradient-to-r from-[#F6D277] via-[#F16145] to-[#76449A] rounded-t-2xl" />

          {/* Avatar Section */}

          {/* File Input & Avatar Section */}
          {fileSection}
          {/* Personal Info Section */}
          {personalInfoSection}
          {/* Bio Section */}
          {bioSection}
        </>
      )}
    </>
  );
}
