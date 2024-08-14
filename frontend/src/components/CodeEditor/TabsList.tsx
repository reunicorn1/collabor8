import React, { useState } from 'react';
import { HStack, Button, Box } from '@chakra-ui/react';
import { useFile } from '../../context/EditorContext';
import * as Y from 'yjs';

type YMapValueType = Y.Text | null | Y.Map<YMapValueType>;

interface DocumentManagerProps {
  projectlist: Y.Map<YMapValueType> | null;
}
const DocumentManager: React.FC<DocumentManagerProps> = ({ projectlist }) => {
  const [documentList, setDocumentList] = useState(projectlist);
  const [counter, setCounter] = useState(1);
  const { setFileSelected } = useFile()!;

  projectlist?.observe(() => {
    if (projectlist) {
      setDocumentList(projectlist);
    }
  });

  // Creating documents in the future will require the name of the file + parent directory
  // parent directory can be root or any other nested direcotry
  const createNewDocument = () => {
    if (projectlist) {
      const text = new Y.Text();
      projectlist.set(String(counter), text);
      console.log('New document has been added');
      setDocumentList(projectlist);
      setCounter((c) => c + 1);
    }
  };

  const clearDocuments = () => {
    if (projectlist) {
      console.log('Items cleared');
      setDocumentList(projectlist);
      projectlist.clear();
    }
  };

  const handleDocumentClick = (doc: YMapValueType) => {
    // Logic to handle what happens when a document button is clicked
    setFileSelected(doc);
    console.log(`Document clicked`);
  };

  return (
    <Box p={4}>
      <HStack spacing={4}>
        <Button size="sm" colorScheme="teal" onClick={createNewDocument}>
          + Create New Document
        </Button>
        <Button size="sm" colorScheme="blue" onClick={clearDocuments}>
          - Delete All
        </Button>
        {documentList &&
          Array.from(documentList.entries()).map(([key, value]) => (
            <Button
              size="sm"
              colorScheme="black"
              variant="outline"
              key={key}
              onClick={() => handleDocumentClick(value)}
            >
              Document {key}
            </Button>
          ))}
      </HStack>
    </Box>
  );
};

export default DocumentManager;
