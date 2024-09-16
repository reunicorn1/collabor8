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
  useToast,
} from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateProjectMutation } from '@store/services/project';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewProject({ isOpen, onClose }: ModalProps) {
  const navigate = useNavigate();
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [createproject] = useCreateProjectMutation();
  const toast = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleChangeDescription = (e: any) => {
    setDescription(e.target.value);
  };
  const handleGoToProject = (project: any) => {
    // This function handles the click of a project item in the table it recives the id of the project
    // And it navigates to the project page using the id
    navigate(`/editor/${project._id}`, { state: project });
  };

  const handleCreate = () => {
    createproject({ project_name: name, description })
      .unwrap()
      .then((data) => {
        console.log('new project', data);
        // TODO: navigate to the project page
        handleGoToProject(data);
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: 'An Error occured while creating this project',
          status: 'error',
          variant: 'subtle',
          position: 'bottom-right',
          isClosable: true,
        });
      });
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={handleClose}
      >
        <ModalOverlay />
        <ModalContent
          bg="brand.900"
          w={['95%', '80%', '60%', '50%', '40%']}
          fontFamily="mono"
        >
          <ModalHeader color="white" fontSize={['sm', 'md']}>
            Create your project
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel color="grey" fontSize={['xs', 'sm']}>
                Title
              </FormLabel>
              <Input
                color="white"
                fontSize={['sm', 'md']}
                ref={initialRef}
                placeholder="Name your project"
                value={name}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel color="grey" fontSize={['xs', 'sm']} mt={4}>
                Description
              </FormLabel>
              <Textarea
                color="white"
                fontSize={['sm', 'md']}
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
              size={['sm', 'md']}
              isDisabled={!name || !description}
              onClick={handleCreate}
              ref={finalRef}
            >
              Create Project
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
