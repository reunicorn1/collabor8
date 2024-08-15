import { Box, Avatar, IconButton } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

export default function Shares() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      minHeight="100vh"
      p={3}
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        <Avatar name="avatar01" src="/avatar-1.png" size="md" m={1} />
        <Avatar name="avatar02" src="/avatar-2.png" size="md" m={1} />
        <Avatar name="avatar03" src="/avatar-3.png" size="md" m={1} />
      </Box>
      <IconButton
        mt={4}
        isRound={true}
        variant="solid"
        colorScheme="yellow"
        aria-label="Done"
        fontSize="20px"
        size="lg"
        icon={<AddIcon />}
      />
    </Box>
  );
}
