import { Box, Avatar, IconButton, Tooltip } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useFile } from '../../context/EditorContext';
import { useDisclosure } from '@chakra-ui/react';
import ShareMenu from '../Menus/ShareMenu';

export default function Shares() {
  const { awareness } = useFile()!;
  const { isOpen, onOpen, onClose } = useDisclosure()

  // TODO: Based on collaberators username their avatar will be retrieved from the database
  // And their name will be used to refer to their presnece
  // Anyonous people will have their name selected from a set of random names to refer to their presence
  // Users in the awareness object are displayed here if they're one of the collaborators their Corresponding Avatar will be displayed

  // TODO: Awareness doesn't sync when a user leaves properly and names don't match
  // TODO: The plus icon is displayed only for the project owner

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      minHeight="100vh"
      p={3}
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        {Array.from(awareness).map(([key, value]) => (
          <>
            <Tooltip label={value['user'].name} placement="bottom">
              <Avatar key={key} name={value['user'].name} size="md" m={1} />
            </Tooltip>
          </>
        ))}
        {/* 
        <Avatar name="avatar02" src="/avatar-2.png" size="md" m={1} />
        <Avatar name="avatar03" src="/avatar-3.png" size="md" m={1} /> */}
      </Box>
      <IconButton
        mt={4}
        isRound={true}
        variant="solid"
        colorScheme="yellow"
        aria-label="Done"
        fontSize="20px"
        size="lg"
        onClick={onOpen}
        icon={<AddIcon />}
      />
      <ShareMenu onClose={onClose} isOpen={isOpen} />
    </Box>
  );
}
