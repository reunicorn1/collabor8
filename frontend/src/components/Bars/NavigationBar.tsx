import { Box, Image, Flex } from '@chakra-ui/react';

export default function NavigationBar() {
  return (
    <Flex justifyContent="center">
      <Box h="50px" bg="black" w="100%">
        <Image src="/logo-w.png" h="45px" />
      </Box>
    </Flex>
  );
}
