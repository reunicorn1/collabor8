import React, { useState } from 'react';
import { File, Directory } from './types';
import { FaFolder, FaFolderOpen, FaFileCode } from 'react-icons/fa';
import { Box, Icon, IconButton, Text } from '@chakra-ui/react';
import { RxDotsVertical } from "react-icons/rx";

interface EntryProps {
  entry: File | Directory;
  depth: number;
  // eslint-disable-next-line no-unused-vars
  onFileClick: (fileId: string) => void;
}

const Entry: React.FC<EntryProps> = ({ entry, depth, onFileClick }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <>
      <Box
        color="white"
        pt={1}
        pb={1}
        _hover={{ bg: 'brand.800' }}
        display="flex"
        alignItems="center"
        cursor="pointer"
        onClick={() => {
          if ('directory_name' in entry) {
            setIsExpanded((prev) => !prev);
          } else {
            onFileClick(entry.file_name);
          }
        }}
        style={{ paddingLeft: `${depth * 20}px` }}
      >
        {'directory_name' in entry ? (
          isExpanded ? (
            <Icon fontSize="14px" as={FaFolderOpen} />
          ) : (
            <Icon fontSize="14px" as={FaFolder} />
          )
        ) : (
          <Icon fontSize="14px" as={FaFileCode} />
        )}
        <Text fontFamily="mono" fontSize="xs" pl={2}>
          {'directory_name' in entry ? entry.directory_name : entry.file_name}
        </Text>
      </Box>
      {'directory_name' in entry && isExpanded && (
        <>
          {entry.children?.map((child) => (
            <Entry
              key={child.file_name || child.directory_name}
              entry={child}
              depth={depth + 1}
              onFileClick={onFileClick}
            />
          ))}
        </>
      )}
    </>
  );
};

export default Entry;
