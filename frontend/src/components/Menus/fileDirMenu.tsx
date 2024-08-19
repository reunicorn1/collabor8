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
import { YMapValueType } from '../../context/EditorContext';
import { useFile } from '../../context/EditorContext';
import * as Y from 'yjs';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  filedir: string;
  set: <VAL extends Y.Text | Y.Map<YMapValueType>>(
    // eslint-disable-next-line no-unused-vars
    key: string,
    // eslint-disable-next-line no-unused-vars
    value: VAL,
  ) => VAL;
}
// Eslint was disabled for this method because it's used in an uncasual way

const NewfileDir: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  filedir,
  set,
}) => {
  const { setFileSelected } = useFile()!;
  const initialRef = React.useRef(null);
  const [newName, setNewName] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  const handleSave = () => {
    // TODO: Validation of the name in the database among sibling files should be made from database
    // If success onClose
    if (newName) {
      const metadata = {
        name: newName,
        parent: 'root',
        type: filedir,
        new: true,
      };
      const newValue = filedir === 'file' ? new Y.Text() : new Y.Map();
      set(`${newName}_metadata`, metadata); // Type Error
      set(newName, newValue); // Type Error
      if (newValue instanceof Y.Text)
        setFileSelected({ name: newName, value: newValue });
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
          <ModalCloseButton />
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
