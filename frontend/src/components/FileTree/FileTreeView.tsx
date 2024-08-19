import React from 'react';
import Entry from './Entry';
import * as Y from 'yjs';
import { YMapValueType } from '../../context/EditorContext';
import { Text } from '@chakra-ui/react';

interface FileTreeViewProps {
  data: Record<string, Y.Text | Y.Map<YMapValueType>>;
}

const FileTreeView: React.FC<FileTreeViewProps> = (data) => {
  const filetree = data['data'].filetree?.children;
  console.log(data['data'].filetree);
  const onFileClick = (name: string) => {
    // This is a function that deals with creation of new y.text per file
    // Indexing can be either file_id or name, I think name makes more sense because creation of
    // y.text originally starts with names
    console.log(data['data'].filetree);
    console.log(name);
  };

  return (
    <>
      {filetree && filetree?.length > 0 ? (
        filetree.map((node, index) => (
          <Entry key={index} entry={node} depth={1} onFileClick={onFileClick} />
        ))
      ) : (
        <Text color="white" fontSize="xs" fontFamily="mono" pl={8} pt={4}>
          No files or directories available.
        </Text>
      )}
    </>
  );
};

export default FileTreeView;
