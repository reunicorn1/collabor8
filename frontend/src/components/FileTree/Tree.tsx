import {
  Flex,
  Text,
  Spacer,
  IconButton,
  useDisclosure,
  Box,
} from '@chakra-ui/react';
import { VscNewFile, VscNewFolder } from 'react-icons/vsc';
import React, { useState } from 'react';
import * as Y from 'yjs';
import NewfileDir from '../Modals/NewfileDir';
import { useYMap } from 'zustand-yjs';
import { YMapValueType } from '../../context/EditorContext';
import FileTreeView from '../FileTree/FileTreeView';
import { useParams } from 'react-router-dom';

interface TreeProps {
  ydoc: Y.Doc;
  name: string;
}

const Tree: React.FC<TreeProps> = ({ ydoc, name }) => {
  // The buttons of this component creates new files and direcoties in y.map (root) of the project
  // When a new file is created it becomes selected by default
  const { projectId = '' } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filedir, setFileDir] = useState('');
  const root = ydoc.getMap(projectId); // This gets the value of the root if created before

  const { data } = useYMap<any, any>(root);

  const handleCreateNew = (type: string) => {
    // Creating the file or dir starts by calling a menu to name the new file
    // name of the file is used to create a new y.text or y.map and then that is
    // set as a key value pair using the above function "setting"
    // changes should be reflected on the structure of the file tree since it's used for re-rendering the filetree
    setFileDir(type);
    onOpen();
  };

  console.log('------------------_>', { root });
  return (
    <>
      <Flex
        h="40px"
        display="flex"
        background="brand.900"
        color="white"
        alignItems="center"
        justifyItems="center"
        borderBottom="2px solid #524175"
      >
        <Text fontSize="xs" ml={4} fontFamily="mono">
          {/* Project name is retriened from an api request of from a context */}
          {name}
        </Text>
        <Spacer />
        <IconButton
          m={1}
          mr={0}
          colorScheme="blue"
          aria-label="New File"
          boxSize="30px"
          fontSize="18px"
          size="sm"
          variant="ghost"
          color="white"
          icon={<VscNewFile />}
          _hover={{ color: 'black', bg: 'white' }}
          onClick={() => handleCreateNew('file')}
        />
        <IconButton
          m={1}
          ml={0}
          colorScheme="blue"
          boxSize="30px"
          size="sm"
          fontSize="18px"
          variant="ghost"
          color="white"
          aria-label="New File"
          _hover={{ color: 'black', bg: 'white' }}
          icon={<VscNewFolder />}
          onClick={() => handleCreateNew('directory')}
        />
      </Flex>
      <NewfileDir
        isOpen={isOpen}
        onClose={onClose}
        filedir={filedir}
        ydoc={ydoc}
        parent={projectId}
      />
      <Box bg="brand.900" h="100%" overflow="hidden">
        <FileTreeView data={data} ydoc={ydoc} />
      </Box>
    </>
  );
};

export default Tree;
