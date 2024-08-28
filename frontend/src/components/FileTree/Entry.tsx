import React, { useState } from 'react';
// import { File, Directory } from '@types';
import { FaFolder, FaFolderOpen, FaFileCode } from 'react-icons/fa';
import { Box, Icon, Text, Spacer, Image } from '@chakra-ui/react';
import { useFile } from '../../context/EditorContext';
import OptionsMenu from './OptionsMenu';
import * as Y from 'yjs';
import { LanguageCode } from '../../utils/codeExamples';

interface File {
  type: 'file';
  id: string;
  name: string;
  language?: LanguageCode;
}

interface Directory {
  type: 'directory';
  id: string;
  name: string;
  children?: TreeNode[];
}

type TreeNode = File | Directory;

interface EntryProps {
  entry: any;
  depth: number;
  // eslint-disable-next-line no-unused-vars
  onFileClick: (fileId: string, filename: string, parent: string) => void;
  ydoc: Y.Doc;
}

const Entry: React.FC<EntryProps> = ({ entry, depth, onFileClick, ydoc }) => {
  const { fileSelected } = useFile()!;
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const extensionToLanguageCode: Record<string, LanguageCode> = {
    js: 'javascript',
    ts: 'typescript',
    py: 'python',
    c: 'c',
    md: 'markdown',
    html: 'html',
  };

  const languageIcons: Record<LanguageCode, string> = {
    javascript: 'javascript.png',
    python: 'python.png',
    c: 'c.png',
    typescript: 'typescript.png',
    markdown: 'markdown.png',
    html: 'html.png',
  };

  const getFileExtension = (filename: string): string => {
    const parts = filename.split('.');
    return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
  };

  const getFileIcon = (filename: string): string => {
    const ext = getFileExtension(filename);
    const languageCode = extensionToLanguageCode[ext] || 'unknown';
    return `/lang-logo/${languageIcons[languageCode] || 'unknown.png'}`;
  };

  return (
    <>
      <Box
        color="white"
        pt={1}
        pb={1}
        _hover={{ bg: 'brand.800' }}
        bg={fileSelected?.id === entry.id ? '#41335C' : 'transparent'}
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
          <Image
            src={getFileIcon(entry.name)}
            boxSize="15px"
            mr={2}
            alt="file icon"
          />
        )}
        <Text
          fontFamily="mono"
          fontSize="xs"
          pl={2}
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          flex="20"
        >
          {entry.name}
        </Text>
        <Spacer />
        <OptionsMenu
          type={entry.type}
          id={entry.id}
          name={entry.name}
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
