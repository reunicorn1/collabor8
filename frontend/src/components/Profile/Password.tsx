import {
  Box,
  Heading,
  Spacer,
  Button,
  Flex,
  FormLabel,
  Input,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useState, ChangeEvent } from 'react';
import { FiEdit3 } from 'react-icons/fi';
import { useChangePasswordMutation } from '@store/services/auth';

interface Pass {
  old: string;
  new: string;
  again: string;
}

export default function Password() {
  const [changePassword] = useChangePasswordMutation();
  const toast = useToast();
  const [passmode, setPassmode] = useState(false);
  const [errmsg, setErrMsg] = useState('');
  const [passSet, setPassSet] = useState<Pass>({
    old: '',
    new: '',
    again: '',
  } as Pass);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setPassSet({ ...passSet, [name]: value });
    if (errmsg) setErrMsg('');
  };

  const handleUpdate = async () => {
    // This function isn't tested properly
    if (passSet.new === passSet.again) {
      try {
        await changePassword({ old: passSet.old, new: passSet.new }).unwrap();
        toast({
          title: `Password has been updated successfully!`,
          variant: 'subtle',
          position: 'bottom-right',
          status: 'success',
          isClosable: true,
        });
        if (errmsg) setErrMsg('');
      } catch (err) {
        console.log(err);
        setErrMsg(err.data.message);
      }
    } else {
      setErrMsg('The passwords you entered do not match. Please try again.');
    }
  };

  return (
    <Box pt={20}>
      <Box p={5} m={20} mt={0} border="1px" borderRadius="2xl">
        <Flex alignItems="center">
          <Heading fontFamily="mono" fontSize="md">
            Password
          </Heading>
          <Spacer />
          <Button
            leftIcon={!passmode ? <FiEdit3 /> : undefined}
            variant="solid"
            size="xs"
            bg="white"
            fontFamily="mono"
            onClick={() => setPassmode(!passmode)}
          >
            {passmode ? `Hide` : `Change Password`}
          </Button>
        </Flex>
        {!passmode ? (
          <Heading fontFamily="mono" fontSize="sm" opacity="0.7" mt={5}>
            Update your password to keep your account secure.
          </Heading>
        ) : (
          <Stack w="50%" mt={4}>
            <FormLabel fontSize="sm" mt={2} fontFamily="mono">
              Old password
            </FormLabel>
            <Input
              size="sm"
              variant="filled"
              type="password"
              bg="brand.100"
              name="old"
              value={passSet.old}
              onChange={handleInputChange}
            />
            <FormLabel fontSize="sm" mt={2} fontFamily="mono">
              New password
            </FormLabel>
            <Input
              size="sm"
              variant="filled"
              type="password"
              bg="brand.100"
              name="new"
              value={passSet.new}
              onChange={handleInputChange}
            />
            <FormLabel fontSize="sm" mt={2} fontFamily="mono">
              Confirm new password
            </FormLabel>
            <Input
              size="sm"
              variant="filled"
              type="password"
              bg="brand.100"
              name="again"
              value={passSet.again}
              onChange={handleInputChange}
            />
            <Text color="red.300" fontFamily="mono" fontSize="xs">
              {errmsg}
            </Text>
            <Button
              colorScheme="white"
              variant="outline"
              w="180px"
              size="sm"
              fontFamily="mono"
              mt={5}
              onClick={handleUpdate}
              isDisabled={
                !Object.values(passSet).every((pass) => pass && pass.length > 0)
              }
            >
              Update password
            </Button>
          </Stack>
        )}
      </Box>
    </Box>
  );
}
