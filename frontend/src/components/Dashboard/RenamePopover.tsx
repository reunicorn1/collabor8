import React, { ChangeEvent } from 'react';
import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Heading,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';

// 1. Create a text input component
const TextInput = React.forwardRef((props: any, ref: any) => {
  return (
    <FormControl>
      <FormLabel htmlFor={props.id}>{props.label}</FormLabel>
      <Input ref={ref} id={props.id} {...props} />
    </FormControl>
  );
});

// 2. Create the form
const Form = ({ onCancel, project_name, onSave }) => {
  const [input, setInput] = useState(project_name);
  const handleInputChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const { value } = e.currentTarget;
    setInput(value); // hopeless TypeError related to the first one
  };
  return (
    <Stack spacing={4}>
      <Text
        fontFamily="mono"
        color="white"
        fontSize="xs"
        opacity="0.8"
        mb="-10px"
      >
        Project Name
      </Text>
      <TextInput
        fontFamily="mono"
        color="white"
        fontSize="sm"
        id="project_name"
        value={input}
        onChange={handleInputChange}
      />
      <ButtonGroup display="flex" justifyContent="flex-end">
        <Button
          isDisabled={input === project_name || !input}
          colorScheme="orange"
          size="sm"
          onClick={() => onSave(input)}
        >
          Save
        </Button>
        <Button size="sm" onClick={onCancel}>
          Cancel
        </Button>

      </ButtonGroup>
    </Stack>
  );
};

export const RenamePopover = ({ isOpen, onClose, project_name, onSave }) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="brand.900">
          <ModalHeader>
            <Heading as="h6" size="xs" fontFamily="mono" color="white">
              Rename a Project
            </Heading>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody>
            <Form
              onCancel={onClose}
              project_name={project_name}
              onSave={onSave}
            />
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
