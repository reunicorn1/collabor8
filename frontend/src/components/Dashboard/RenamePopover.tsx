import React, { ChangeEvent } from 'react'
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Input,
  Popover,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  Stack,
  useDisclosure,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
import FocusLock from "react-focus-lock"
import { useState } from "react"

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
  const [input, setInput] = useState(project_name)
  const handleInputChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const { value } = e.currentTarget;
    setInput(value); // hopeless TypeError related to the first one
  };
  return (
    <Stack spacing={4}>
      <TextInput
        label='Project Name'
        id='project_name'
        value={input}
        onChange={handleInputChange}
      />
      <ButtonGroup display='flex' justifyContent='flex-end'>
        <Button variant='outline' onClick={onCancel}>
          Cancel
        </Button>
        <Button isDisabled={input === project_name || !input}
          colorScheme='teal' onClick={() => onSave(input)}>
          Save
        </Button>
      </ButtonGroup>
    </Stack>
  )
}


export const RenamePopover = ({ isOpen, onClose, project_name, onSave }) => {
  const projectNameRef = React.useRef(null)
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Form onCancel={onClose} project_name={project_name} onSave={onSave}
            />
          </ModalBody>

          <ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

