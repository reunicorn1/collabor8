import React from 'react';
import Entry from './Entry';
import { createDocuments } from '@utils/createfiledir';
import { useFile } from '@context/EditorContext';
import { Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { Singleton } from '@constants';
import { useAppDispatch } from '@hooks/useApp';
import { displayPanel } from '@store/slices/fileSlice';

interface FileTreeViewProps {
  data: any;
  //ydoc: Y.Doc;
}

const FileTreeView: React.FC<FileTreeViewProps> = ({ data }) => {
  const { setFileSelected, fileSelected } = useFile()!;
  const { projectId = '' } = useParams();
  const dispatch = useAppDispatch();
  const ydoc = Singleton.getYdoc();
  const root = ydoc.getMap(projectId ?? data._id); // This gets the value of the root if created before
  const filetree = data.filetree?.children;
  //console.log('Root:-------->', root);
  //console.log('FileTree:----->', filetree);

  const onFileClick = (id: string, name: string, parent: string) => {
    // const parent = getParentID(filetree, id);
    console.log('+++++++++++++++++++++>', { parent });
    // This is a function that deals with creation of new y.text per file
    // Indexing is id, and this is ued to find the path from the root until the file and then this
    // path will be used to create the model corresponding to it
    const getFileLanguage = (fileName: string): string => {
      const ext = fileName.split('.').pop();
      const languageMap: Record<string, string> = {
        js: 'javascript',
        py: 'python',
        c: 'c',
        ts: 'typescript',
        md: 'markdown',
        html: 'html',
      };
      return languageMap[ext || ''];
    };

    if (fileSelected?.id === id) return;
    const file = createDocuments({
      parent,
      root,
      _id: id,
      filedir: 'file',
      newName: name,
    });
    if (file) {
      const fileLanguage = getFileLanguage(name);
      setFileSelected({
        name: name,
        value: file,
        id: id,
        language: fileLanguage,
      });
      dispatch(displayPanel());
    } else {
      console.log('An Error occured during creation of this file');
    }
  };

  return (
    <>
      {filetree && filetree?.length > 0 ? (
        filetree.map((node, index) => (
          <Entry
            key={`${index}-${node.id}`}
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
