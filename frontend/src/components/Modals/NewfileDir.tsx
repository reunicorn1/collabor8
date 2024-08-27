import React, { useMemo } from 'react';
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
import { useParams } from 'react-router-dom';
import { useCreateFileMutation } from '@store/services/file';
import { useCreateDirectoryMutation } from '@store/services/directory';
import { createDocuments } from '@utils/createfiledir';
import { LanguageCode } from '@utils/codeExamples';
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
  const { projectId: project_id = '' } = useParams();
  const { setFileSelected } = useFile()!;
  const initialRef = React.useRef(null);
  const [newName, setNewName] = useState('');
  const root = ydoc.getMap(project_id);
  // const root = ydoc.getMap('root'); // This gets the value of the root if created before
  const [createFile] = useCreateFileMutation();
  const [createDir] = useCreateDirectoryMutation();

  const { data, set } = useYMap<any, any>(root); // Type Error

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };
  const handleSave = async () => {
    // TODO: Validation of the name in the database among sibling files should be made from database
    let id = null;
    console.log('=================>', { parent });
    if (newName) {
      // create a new fi
      console.log('xxxxxxxxxxxCreating File: ', { newName });
      console.log('xxxxxxxxxxxFor parent: ', {
        parent_id: parent === '0' ? project_id : parent,
      });
      console.log('xxxxxxxxxxxParent is project: ', { parent: parent === '0' });
      if (filedir === 'file') {
        await createFile({
          project_id,
          name: newName,
          parent_id: parent === '0' ? project_id : parent,
          file_content: '',
        })
          .unwrap()
          .then((res) => {
            const { _id } = res;
            id = _id;
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        await createDir({
          project_id,
          name: newName,
          parent_id: parent === '0' ? project_id : parent,
        })
          .unwrap()
          .then((res) => {
            const { _id } = res;
            id = _id;
          })
          .catch((err) => {
            console.error(err);
          });
      }
      console.log('this is the id created =================>', { id });
      if (id) {
        // Since creating a file in the Y.map depend on the path in the filetree, creation of the leaf has to be made first
        const leaf = createLeaf(filedir, id, newName, parent);
        addLeaf(data.filetree, leaf, parent); // also hopeless type error

        // file tree here will be updated with the new leaf so the file path will be found
        // const path = getPathFromId(data.filetree, id); //type error
        // console.log(path);
        const file = createDocuments({
          parent,
          root,
          _id: id,
          filedir,
          newName,
        }); //type error. This function creates the new ytext/ymap

        set('filetree', data.filetree); // trigger to re-render the structure for all clients connected
        if (file instanceof Y.Text) {
          const defaultLanguage: LanguageCode = 'javascript';
          setFileSelected({
            name: newName,
            value: file,
            id,
            language: defaultLanguage,
          });
        }
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
