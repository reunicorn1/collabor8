import { Box, Avatar, IconButton, Tooltip } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useFile } from '../../context/EditorContext';
import { useDisclosure } from '@chakra-ui/react';
import ShareMenu from '../Modals/ShareMenu';
import { Project, ProjectShares } from '@types';
import { useSelector } from 'react-redux';
import { selectUserDetails } from '@store/selectors';

interface SharesProps {
  project: Project | ProjectShares;
}

export default function Shares({ project }: SharesProps) {
  const { awareness } = useFile()!; // why so excited?
  const { isOpen, onOpen, onClose } = useDisclosure();
  const userDetails = useSelector(selectUserDetails);

  // TODO: The plus icon is displayed only for the project owner
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      minHeight="100vh"
      p={3}
    >
      <Box
        display="flex"
        key={crypto.randomUUID()}
        flexDirection="column"
        alignItems="center"
      >
        {Array.from(awareness)?.map(([_, value], index) => (
          <>
            <Tooltip key={index} label={value['user'].name} placement="bottom">
              <Avatar name={value['user'].name} size="md" m={1} />
            </Tooltip>
          </>
        ))}
        {/* 
        <Avatar name="avatar02" src="/avatar-2.png" size="md" m={1} />
        <Avatar name="avatar03" src="/avatar-3.png" size="md" m={1} /> */}
      </Box>{' '}
      {project.username === userDetails.username && (
        <>
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

          <ShareMenu onClose={onClose} isOpen={isOpen} project={project} />
        </>
      )}
    </Box>
  );
}
