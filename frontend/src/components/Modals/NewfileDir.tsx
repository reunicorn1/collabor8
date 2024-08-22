import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  Input,
  Button,
  Text,
  Divider,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useYMap } from 'zustand-yjs';
import { useFile } from '../../context/EditorContext';
import { createLeaf, addLeaf } from '../../utils/addleaf';
import { YMapValueType } from '../../context/EditorContext';
import { getPathFromId, createFileDir } from '../../utils/followtree';
import { v4 as uuidv4 } from 'uuid';
import * as Y from 'yjs';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  filedir: string;
  ydoc: Y.Doc;
  parent: string;
}
// Eslint was disabled for this method because it's used in an uncasual way

const NewfileDir: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  filedir,
  ydoc,
  parent,
}) => {
  const { setFileSelected } = useFile()!;
  const initialRef = React.useRef(null);
  const [newName, setNewName] = useState('');
  const root = ydoc.getMap('root'); // This gets the value of the root if created before

  const { data, set } = useYMap<
    Y.Map<YMapValueType> | Y.Text,
    Record<string, Y.Map<YMapValueType> | Y.Text>
  >(root); // Type Error

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };
  const handleSave = () => {
    // TODO: Validation of the name in the database among sibling files should be made from database
    if (newName) {
      const id = uuidv4();
      // Since creating a file in the Y.map depend on the path in the filetree, creation of the leaf has to be made first
      const leaf = createLeaf(filedir, id, newName);
      addLeaf(data.filetree, leaf, parent); // also hopeless type error

      // file tree here will be updated with the new leaf so the file path will be found
      const path = getPathFromId(data.filetree, id); //type error
      console.log(path);
      if (path) {
        const file = createFileDir(path, root, id, filedir); //type error. This function creates the new ytext/ymap

        set('filetree', data.filetree); // trigger to re-render the structure for all clients connected
        if (file instanceof Y.Text)
          setFileSelected({ name: newName, value: file, id: id });
      } else {
        console.log('An Error occured during the retrival of this file');
      }
    }
    handleClose();
  };

  const handleClose = () => {
    setNewName('');
    onClose();
  };

  return (
    <>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent bg="brand.900">
          <ModalHeader>
            <Text
              fontSize="sm"
              fontFamily="mono"
              color="white"
            >{`Create new ${filedir}`}</Text>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody pb={4}>
            <FormControl>
              <Divider mb={7} />
              <Input
                ref={initialRef}
                fontFamily="mono"
                color="white"
                fontSize="sm"
                value={newName}
                onChange={handleChange}
                placeholder={`Choose your ${filedir} name`}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter mb={4}>
            <Button
              colorScheme="orange"
              mr={3}
              size="sm"
              onClick={handleSave}
              isDisabled={!newName}
            >
              Done
            </Button>
            <Button onClick={handleClose} size="sm">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewfileDir;
