import React from 'react';
import Entry from './Entry';
import * as Y from 'yjs';
import { YMapValueType } from '../../context/EditorContext';
import { getPathFromId, createFileDir } from '../../utils/followtree';
import { createDocuments } from '@utils/createfiledir';
import { useFile } from '../../context/EditorContext';
import { Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

interface FileTreeViewProps {
  data: any;
  ydoc: Y.Doc;
}

const FileTreeView: React.FC<FileTreeViewProps> = ({ data, ydoc }) => {
  const { setFileSelected, fileSelected } = useFile()!;
  const { projectId = '' } = useParams();

  const root = ydoc.getMap(projectId); // This gets the value of the root if created before
  const filetree = data.filetree?.children;
  console.log('Root:-------->', root);
  console.log('FileTree:----->', filetree);

  // const getParentID = (tree: Record<string, any>, id, parentId = null) => {
  //   if (!tree) return null;
  //   return Object.entries(tree).find(([k, v]) => {
  //     if (v.type === 'file' && v.id === id) {
  //       return parentId;
  //     }
  //     return getParentID(v.children, id, k);
  //   });
  // };

  const onFileClick = (id: string, name: string, parent: string) => {
    // const parent = getParentID(filetree, id);
    console.log('+++++++++++++++++++++>', { parent });
    // This is a function that deals with creation of new y.text per file
    // Indexing is id, and this is ued to find the path from the root until the file and then this
    // path will be used to create the model corresponding to it
    if (fileSelected?.id === id) return;
    const file = createDocuments({
      parent,
      root,
      _id: id,
      filedir: 'file',
      newName: name,
    });
    if (file) {
      setFileSelected({ name: name, value: file, id: id });
    } else {
      console.log('An Error occured during creation of this file');
    }
    // const path = getPathFromId(data.filetree, id); // hopeless type error, I didn't assign types correcty at the beginning bc I did a lot of changes on how it was defined
    // if (path) {
    //   // extact parent base on fileId

    //   const file = createFileDir({
    //     fullPath: path,
    //     root,
    //     id_: id,
    //     filedir: 'file',
    //     parent,
    //     newName: name,
    //   }); // No new leafs are required since this file is already a part of the filetree model
    //   if (file) {
    //     setFileSelected({ name: name, value: file, id: id });
    //   } else {
    //     console.log('An Error occured during creation of this file');
    //   }
    // } else {
    //   console.log('An Error occured during the retrival of this file');
    // }
  };

  return (
    <>
      {filetree && filetree?.length > 0 ? (
        filetree.map((node, index) => (
          <Entry
            key={index}
            entry={node}
            depth={1}
            onFileClick={onFileClick}
            ydoc={ydoc}
          />
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
