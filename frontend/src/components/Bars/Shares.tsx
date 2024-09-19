import { Box, Avatar, IconButton, Tooltip, useMediaQuery } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useFile } from '../../context/EditorContext';
import { useDisclosure } from '@chakra-ui/react';
import ShareMenu from '../Modals/ShareMenu';
import { Project, ProjectShares } from '@types';
import { useSelector } from 'react-redux';
import { selectUserDetails } from '@store/selectors';

interface SharesProps {
  project: Project | ProjectShares;
  className?: string;
  [k: string]: any;
}

export default function Shares({ className = '', project, ...rest }: SharesProps) {
  const { awareness } = useFile()!; // why so excited?
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLessThan640] = useMediaQuery('(max-width: 640px)');
  const userDetails = useSelector(selectUserDetails);

  // TODO: The plus icon is displayed only for the project owner
  return (
    <Box
      className={className}
      {...rest}
    //display="flex"
    //flexDirection="column"
    //alignItems="center"
    //minHeight="100vh"
    //p={3}
    >
      <Box
        className="flex flex-wrap items-center gap-2 p-2 md:flex-col"
        key={crypto.randomUUID()}
      //flexDirection="column"
      //alignItems="center"
      >
        {Array.from(awareness)?.map(([_, value], index) => (
          <Tooltip key={index} label={value['user'].name} placement="bottom">
            <Avatar name={value['user'].name} />
          </Tooltip>
        ))}
        {isLessThan640 && (
          <IconButton
            isRound={true}
            colorScheme="yellow"
            aria-label="add collabroator"
            //fontSize="20px"
            //size="lg"
            onClick={onOpen}
            icon={<AddIcon className='pointer-events-none' />}
          />
        )}
      </Box>
      {!isLessThan640 && project.username === userDetails.username
        ? (
          <IconButton
            mt={4}
            mx="auto"
            isRound={true}
            variant="solid"
            colorScheme="yellow"
            aria-label="add collabroator"
            fontSize="20px"
            size="lg"
            onClick={onOpen}
            icon={<AddIcon className='pointer-events-none' />}
          />
        )
        : null
      }
      <ShareMenu onClose={onClose} isOpen={isOpen} project={project} />
    </Box>
  );
}
