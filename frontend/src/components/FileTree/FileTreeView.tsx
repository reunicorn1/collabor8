import React from 'react';
import Entry from './Entry';
import * as Y from 'yjs';
import { YMapValueType } from '../../context/EditorContext';
import { getPathFromId, createFileDir } from '../../utils/followtree';
import { useFile } from '../../context/EditorContext';
import { Text } from '@chakra-ui/react';

interface FileTreeViewProps {
  data: Record<string, Y.Text | Y.Map<YMapValueType>>;
  ydoc: Y.Doc;
}

const FileTreeView: React.FC<FileTreeViewProps> = ({ data, ydoc }) => {
  const { setFileSelected, fileSelected } = useFile()!;

  const root = ydoc.getMap('root');
  const filetree = data.filetree?.children;

  const onFileClick = (id: string, name: string) => {
    // This is a function that deals with creation of new y.text per file
    // Indexing is id, and this is ued to find the path from the root until the file and then this
    // path will be used to create the model corresponding to it
    if (fileSelected?.id === id) return;
    const path = getPathFromId(data.filetree, id); // hopeless type error, I didn't assign types correcty at the beginning bc I did a lot of changes on how it was defined
    if (path) {
      const file = createFileDir(path, root, id, 'file'); // No new leafs are required since this file is already a part of the filetree model
      if (file) {
        setFileSelected({ name: name, value: file, id: id });
      } else {
        console.log('An Error occured during creation of this file');
      }
    } else {
      console.log('An Error occured during the retrival of this file');
    }
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
