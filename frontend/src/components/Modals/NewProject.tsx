import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  Textarea,
} from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { useCreateProjectMutation } from '@store/services/project';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewProject({ isOpen, onClose }: ModalProps) {
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [createproject] = useCreateProjectMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleCreate = () => {
    createproject({ project_name: name, description })
      .unwrap()
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent bg="brand.900">
          <ModalHeader color="white" fontFamily="mono" fontSize="sm">
            Create your project
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel color="grey" fontFamily="mono" fontSize="xs">
                Title
              </FormLabel>
              <Input
                color="white"
                fontFamily="mono"
                fontSize="sm"
                ref={initialRef}
                placeholder="Name your project"
                value={name}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel color="grey" fontFamily="mono" fontSize="xs" mt={4}>
                Description
              </FormLabel>
              <Textarea
                color="white"
                fontFamily="mono"
                fontSize="sm"
                ref={initialRef}
                placeholder="Tell us about your project"
                value={description}
                onChange={handleChangeDescription}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter mb={4}>
            <Button
              colorScheme="orange"
              mr={3}
              size="sm"
              isDisabled={!name || !description}
              onClick={handleCreate}
            >
              Create Project
            </Button>
            <Button size="sm" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
