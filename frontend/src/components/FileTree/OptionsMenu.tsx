import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { RxDotsVertical } from 'react-icons/rx';
import * as Y from 'yjs';
import NewfileDir from '../Modals/NewfileDir';
import RenameFileDir from '../Modals/RenameFileDir';
import { useDeleteDirectoryMutation } from '@store/services/directory';
import { useDeleteFileMutation } from '@store/services/file';
import { deleteNode } from '@utils/createfiledir';
import { useParams } from 'react-router-dom';
import { useYMap } from 'zustand-yjs';
import { useState } from 'react';

interface FileDirMenuProps {
  type: string;
  id: string;
  name: string;
  ydoc: Y.Doc;
}
export default function OptionsMenu({
  type,
  id,
  name,
  ydoc,
}: FileDirMenuProps) {
  const { projectId: project_id = '' } = useParams();
  const [deleteFile] = useDeleteFileMutation();
  const [deleteDir] = useDeleteDirectoryMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenR,
    onOpen: onOpenR,
    onClose: onCloseR,
  } = useDisclosure();
  const [filedir, setFileDir] = useState('');
  const root = ydoc.getMap(project_id);
  const { data, set } = useYMap<any, any>(root); // Type Error

  const handleClick = (filedir: string, open: any) => {
    setFileDir(filedir);
    open();
  };

  const handleDelete = async () => {
    // Requirements: [id] of the file to be deleted, the [root] and the [filetree].
    // Deleting is:
    // 1- Sending an API request to delete the node from the database
    // 2- follow the tree to cut the node with it's children
    // 3- Remove the y.text from the y.map which is the root of the project since direct children
    const deleteDoc = type === 'file' ? deleteFile : deleteDir;
    await deleteDoc(id)
      .unwrap()
      // eslint-disable-next-line no-unused-vars
      .then((_) => {
        // Delete the node from existence with all it's children
        // Delete the node from the ymap root
        deleteNode(data?.filetree, id);
        root.delete(id);
        root.delete(`${id}_metadata`);

        set('filetree', data.filetree); // trigger to re-render the structure for all clients connected
      })
      .catch((err) => {
        console.error('An error occured while deleting this document', err);
      });
  };

  // Updating is:
  // 1- Sending an API request to change the name of the file in the database
  // 2- following the tree in the filetree object which will contain the node of this corresponding file
  // And then change the name attribute there and trigger the change to be broadcasted

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        color="transparent"
        mr={3.2}
        _hover={{ bg: 'transparent', color: 'white' }}
        _active={{ bg: 'transparent', color: 'white' }}
        variant="ghost"
        aria-label="Done"
        fontSize="12px"
        color='white'
        size="xs"
        icon={<RxDotsVertical />}
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
      <MenuList bg="grey" border="0.5px solid rgba(128, 128, 128, 0.5)">
        {type === 'file' ? (
          <>
            <MenuItem
              fontSize="xs"
              onClick={(e) => {
                handleClick('file', onOpenR);
                e.stopPropagation();
              }}
            >
              Rename File
            </MenuItem>
            <MenuItem
              fontSize="xs"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              Delete File
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem
              fontSize="xs"
              onClick={(e) => {
                handleClick('file', onOpen);
                e.stopPropagation();
              }}
            >
              New File
            </MenuItem>
            <MenuItem
              fontSize="xs"
              onClick={(e) => {
                handleClick('directory', onOpen);
                e.stopPropagation();
              }}
            >
              New Folder
            </MenuItem>
            <MenuItem
              fontSize="xs"
              onClick={(e) => {
                handleClick('directory', onOpenR);
                e.stopPropagation();
              }}
            >
              Rename Folder
            </MenuItem>
            <MenuItem
              fontSize="xs"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              Delete Folder
            </MenuItem>
          </>
        )}
        <NewfileDir
          isOpen={isOpen}
          onClose={onClose}
          filedir={filedir}
          parent={id}
        />
        <RenameFileDir
          isOpen={isOpenR}
          onClose={onCloseR}
          filedir={filedir}
          ydoc={ydoc}
          id={id}
          name={name}
        />
      </MenuList>
    </Menu>
  );
}
