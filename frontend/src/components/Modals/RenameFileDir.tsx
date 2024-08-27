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

    await update({ id, data: { name: input } })
      .unwrap()
      // eslint-disable-next-line no-unused-vars
      .then((_) => {
        // handle the tree renaming using the filetree node
        const node = findNode(data.filetree, id);
        node.name = input;
        set('filetree', data.filetree); // trigger to re-render the structure for all clients connected
        console.log(
          '********************************* Renaming was successful',
        );
        handleClose();
      })
      .catch((err) => {
        console.error(err);
        setErrMsg(err.data.message);
      });
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
        <ModalContent bg="brand.900">
          <ModalHeader>
            <Text
              fontSize="sm"
              fontFamily="mono"
              color="white"
            >{`Rename ${filedir}`}</Text>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody pb={4}>
            <Divider mb={7} />
            <Input
              ref={initialRef}
              fontFamily="mono"
              color="white"
              fontSize="sm"
              value={input}
              onChange={handleChange}
            />
            <Text color="red.300" fontFamily="mono" fontSize="xs" mt={2}>
              {errmsg}
            </Text>
          </ModalBody>

          <ModalFooter mb={4}>
            <Button
              colorScheme="orange"
              mr={3}
              size="sm"
              isDisabled={!input || input === name}
              onClick={handleRename}
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
}
