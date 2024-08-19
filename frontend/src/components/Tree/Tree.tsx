import {
  Flex,
  Text,
  Spacer,
  IconButton,
  useDisclosure,
  Box,
} from '@chakra-ui/react';
import { VscNewFile, VscNewFolder } from 'react-icons/vsc';
import { useState } from 'react';
import * as Y from 'yjs';
import NewfileDir from '../Menus/fileDirMenu';
import { useYMap } from 'zustand-yjs';
import { YMapValueType } from '../../context/EditorContext';
import FileTreeView from '../FileTree/FileTreeView';

interface TreeProps {
  ydoc: Y.Doc;
}

const Tree: React.FC<TreeProps> = ({ ydoc }) => {
  // The buttons of this component creates new files and direcoties in y.map (root) of the project
  // When a new file is created it becomes selected by default
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filedir, setFileDir] = useState('');
  const root = ydoc.getMap('root'); // This gets the value of the root if created before

  const { data, set, entries } = useYMap<
    Y.Map<YMapValueType> | Y.Text,
    Record<string, Y.Map<YMapValueType> | Y.Text>
  >(root); // Type Error

  const handleCreateNew = (type: string) => {
    // Creating the file or dir starts by calling a menu to name the new file
    // name of the file is used to create a new y.text or y.map and then that is
    // set as a key value pair using the above function "setting"
    // changes should be reflected on the structure of the file tree since it's used for re-rendering the filetree
    setFileDir(type);
    onOpen();
  };

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
          Project Name
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
        set={set}
        data={data}
      />
      <Box bg="brand.900" h="100%" overflow="scroll">
        <FileTreeView data={data} />
      </Box>
    </>
  );
};

export default Tree;
