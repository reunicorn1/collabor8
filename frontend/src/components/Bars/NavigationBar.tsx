import {
  Box,
  Image,
  Flex,
  Spacer,
  Divider,
  Text,
  Button,
  Heading
} from '@chakra-ui/react';

export default function NavigationBar() {
  return (
    <Flex alignItems="center" bg="black" p={3}>
      <Image src="/logo-bb.png" h="25px" ml={3} />
      <Divider
        ml={10}
        mr={10}
        orientation="vertical"
        borderColor="white"
        borderWidth="1px"
        h="23px"
      />
      <Box display="flex">
        <Heading color="white" fontFamily="mono" mr={5} size="xs">
          Home
        </Heading>
        <Heading color="white" fontFamily="mono" ml={5} mr={5} size="xs">
          Features
        </Heading>
        <Heading color="white" fontFamily="mono" ml={5} size="xs">
          About
        </Heading>
      </Box>
      <Spacer />
      <Heading color="white" fontFamily="mono" size="xs">
        Sign Up
      </Heading>
      <Button
        ml={7}
        color="white"
        colorScheme="gray"
        variant="outline"
        size="xs"
        fontFamily="mono"
        _hover={{ bg: 'white', color: 'black' }}
      >
        Log in
      </Button>
    </Flex>
  );
}
