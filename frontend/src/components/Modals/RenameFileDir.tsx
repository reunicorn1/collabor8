import React, { useState } from 'react';
import * as Y from 'yjs';
import { useUpdateFileMutation } from '@store/services/file';
import { useUpdateDirectoryMutation } from '@store/services/directory';
import { findNode } from '@utils/createfiledir';
import { useYMap } from 'zustand-yjs';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Button,
  Text,
  Divider,
  FormControl,
} from '@chakra-ui/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  filedir: string;
  ydoc: Y.Doc;
  id: string;
  name: string;
}

import { useParams } from 'react-router-dom';
export default function RenameFileDir({
  isOpen,
  onClose,
  filedir,
  ydoc,
  id,
  name,
}: ModalProps) {
  const [input, setInput] = useState(name);
  const [errmsg, setErrMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { projectId: project_id = '' } = useParams();
  const initialRef = React.useRef(null);
  const [updateFile] = useUpdateFileMutation();
  const [updateDir] = useUpdateDirectoryMutation();
  const root = ydoc.getMap(project_id);
  const { data, set } = useYMap<any, any>(root); // Type Error

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (errmsg) setErrMsg('');
  };

  const handleRename = async () => {
    const update = filedir === 'file' ? updateFile : updateDir;

    setIsLoading(true);
    try {
      await update({ id, data: { name: input } }).unwrap();

      // handle the tree renaming using the filetree node
      const node = findNode(data.filetree, id);
      node.name = input;
      set('filetree', data.filetree); // trigger to re-render the structure for all clients connected
      console.log('********************************* Renaming was successful');
      handleClose();
    } catch (err) {
      console.error(err);
      setErrMsg(err.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (errmsg) setErrMsg('');
    setInput(input);
    onClose();
  };

  return (
    <>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent
          bg="brand.900"
          w={['95%', '80%', '60%', '50%', '40%']}
          fontFamily="mono"
        >
          <ModalCloseButton color="white" />
          <ModalHeader color="white" fontSize={['sm', 'md']}>
            <Text>{`Rename ${filedir}`}</Text>
          </ModalHeader>
          <ModalBody pb={6}>
            <Divider mb={5} />
            <FormControl>
              <Input
                ref={initialRef}
                color="white"
                fontSize={['sm', 'md']}
                placeholder={`Enter new ${filedir} name`}
                value={input}
                onChange={handleChange}
              />
              {errmsg && (
                <Text color="red.300" fontSize={['xs', 'sm']} mt={2}>
                  {errmsg}
                </Text>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter mb={4}>
            <Button
              colorScheme="orange"
              mr={3}
              size={['sm', 'md']}
              isDisabled={!input || input === name || isLoading}
              isLoading={isLoading}
              onClick={handleRename}
            >
              Done
            </Button>
            <Button size={['sm', 'md']} onClick={handleClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
