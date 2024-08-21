import React, { useState } from 'react';
import { File, Directory } from './types';
import { FaFolder, FaFolderOpen, FaFileCode } from 'react-icons/fa';
import { Box, Icon, Text, Spacer } from '@chakra-ui/react';
import { useFile } from '../../context/EditorContext';
import OptionsMenu from './OptionsMenu';
import * as Y from 'yjs';

interface EntryProps {
  entry: File | Directory;
  depth: number;
  // eslint-disable-next-line no-unused-vars
  onFileClick: (fileId: string, filename: string) => void;
  ydoc: Y.Doc;
}

const Entry: React.FC<EntryProps> = ({ entry, depth, onFileClick, ydoc }) => {
  const { fileSelected } = useFile()!;
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <>
      <Box
        color="white"
        pt={1}
        pb={1}
        _hover={{ bg: 'brand.800' }}
        bg={fileSelected?.id === entry.id ? '#41335C' : 'transparennt'}
        display="flex"
        alignItems="center"
        cursor="pointer"
        onClick={() => {
          if ('directory_name' in entry) {
            setIsExpanded((prev) => !prev);
          } else {
            onFileClick(entry.id, entry.file_name);
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

        <Spacer />
        <OptionsMenu
          type={entry.type}
          id={entry.id}
          name={entry.directory_name || entry.file_name}
          ydoc={ydoc}
        />
      </Box>
      {'directory_name' in entry && isExpanded && (
        <>
          {entry.children?.map((child) => (
            <Entry
              key={child.id}
              entry={child}
              depth={depth + 1}
              onFileClick={onFileClick}
              ydoc={ydoc}
            />
          ))}
        </>
      )}
    </>
  );
};

export default Entry;
