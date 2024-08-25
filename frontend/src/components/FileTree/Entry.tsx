import React, { useState } from 'react';
// import { File, Directory } from '@types';
import { FaFolder, FaFolderOpen, FaFileCode } from 'react-icons/fa';
import { Box, Icon, Text, Spacer } from '@chakra-ui/react';
import { useFile } from '../../context/EditorContext';
import OptionsMenu from './OptionsMenu';
import * as Y from 'yjs';

interface File {
  type: 'file';
  id: string;
  name: string;
}

interface Directory {
  type: 'directory';
  id: string;
  name: string;
  children?: TreeNode[];
}

type TreeNode = File | Directory;

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
          if (entry.type === 'directory') {
            setIsExpanded((prev) => !prev);
          } else {
            onFileClick(entry.id, entry.name, entry.parent);
          }
        }}
        style={{ paddingLeft: `${depth * 20}px` }}
      >
        {entry.type === 'directory' ? (
          isExpanded ? (
            <Icon fontSize="14px" as={FaFolderOpen} />
          ) : (
            <Icon fontSize="14px" as={FaFolder} />
          )
        ) : (
          <Icon fontSize="14px" as={FaFileCode} />
        )}
        <Text fontFamily="mono" fontSize="xs" pl={2}>
          {entry.type === 'directory' ? entry.name : entry.name}
        </Text>

        <Spacer />
        {console.log('entry', entry)}
        <OptionsMenu
          type={entry.type}
          id={entry.id}
          name={entry.name || entry.name}
          ydoc={ydoc}
        />
      </Box>
      {entry.type === 'directory' && isExpanded && (
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
