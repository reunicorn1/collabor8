import {
  Flex,
  Text,
  IconButton,
  useDisclosure,
  Box,
  Image,
  useMediaQuery,
} from '@chakra-ui/react';
import { VscNewFile, VscNewFolder } from 'react-icons/vsc';
import React, { ReactNode, useState } from 'react';
import NewfileDir from '../Modals/NewfileDir';
import { useYMap } from 'zustand-yjs';
import FileTreeView from '../FileTree/FileTreeView';
import { useParams } from 'react-router-dom';
import { Singleton } from '@constants';

interface TreeProps {
  //ydoc: Y.Doc;
  name: string;
  className?: string;
  [k: string]: any;
}

const Tree: React.FC<TreeProps> = ({ className = '', name }) => {
  // The buttons of this component creates new files and direcoties in y.map (root) of the project
  // When a new file is created it becomes selected by default
  const [isLessThan768] = useMediaQuery('(max-width: 768px)');
  const { projectId = '' } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filedir, setFileDir] = useState('');
  const root = Singleton.getYdoc().getMap(projectId); // This gets the value of the root if created before

  const { data } = useYMap<any, any>(root);

  const handleCreateNew = (type: string) => {
    // Creating the file or dir starts by calling a menu to name the new file
    // name of the file is used to create a new y.text or y.map and then that is
    // set as a key value pair using the above function "setting"
    // changes should be reflected on the structure of the file tree since it's used for re-rendering the filetree
    setFileDir(type);
    onOpen();
  };

  return (
    <Box className={className}>
      <Flex
        h="40px"
        display="flex"
        color="white"
        alignItems="center"
        justifyItems="center"
        borderBottom="2px solid #524175"
        py="20px"
      >
        <Tooltip text={name} className="me-auto">
          <Text
            me="auto"
            fontSize="xs"
            ml={4}
            fontFamily="mono"
            className="md:max-w-24 md:overflow-hidden md:whitespace-nowrap md:text-ellipsis lg:max-w-none"
          >
            {name}
          </Text>
        </Tooltip>
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
        parent={projectId}
      />
      <FileTreeView data={data} />
      {!isLessThan768 && (
        <Box className="mt-auto p-4 opacity-50">
          <Image src="/logo-bb.png" w="100%" />
        </Box>
      )}
    </Box>
  );
};

const Tooltip: React.FC<{
  text: string;
  children: ReactNode;
  className: string;
}> = ({ className = '', text, children }) => {
  return (
    <Box className={`relative group ${className}`}>
      <Box className="hidden group-hover:block group-focus:block absolute z-10 bg-black text-white p-1 rounded-md">
        {text}
      </Box>
      {children}
    </Box>
  );
};
export default Tree;
