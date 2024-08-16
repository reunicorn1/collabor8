import React, { useState } from 'react';
import { HStack, Button, Box } from '@chakra-ui/react';
import { useFile } from '../../context/EditorContext';
import * as Y from 'yjs';

type YMapValueType = Y.Text | null | Y.Map<YMapValueType>;

interface YMapProps<T, U extends Record<string, T>> {
  data: U; // The current data of the Y.Map
  // eslint-disable-next-line no-unused-vars
  set: (key: string, value: T) => void; // Function to set a value in the Y.Map
  entries: () => IterableIterator<[string, T]>;
  yMap: Y.Map<T>;
}
const DocumentManager = <T, U extends Record<string, T>>({
  data,
  set,
  entries,
  yMap,
}: YMapProps<T, U>) => {
  // const [documentList, setDocumentList] = useState(projectlist);
  const [counter, setCounter] = useState(1);
  const { setFileSelected } = useFile()!;
  const [documentList, setDocumentList] = useState<Array<YMapValueType>>([]);

  // Creating documents in the future will require the name of the file + parent directory
  // parent directory can be root or any other nested direcotry
  const createNewDocument = () => {
    if (data) {
      const text = new Y.Text();
      const metadata = {
        name: `${counter}`,
        parent: 'root',
        type: 'file',
        new: true,
      };
      // TODO: condition to check if the text is in yMap then load it instead of creating a new one
      set(`${counter}_metadata`, metadata);
      set(String(counter), text);
      console.log('New document has been added');
      // setDocumentList(projectlist);
      setCounter((c) => c + 1);
      setDocumentList([...documentList, text]);
    }
  };

  const clearDocuments = () => {
    if (data) {
      console.log('Items cleared');
      // TODO: Remove all elements from the map
      setDocumentList([]);
    }
  };

  const handleDocumentClick = (doc: YMapValueType) => {
    // Logic to handle what happens when a document button is clicked
    setFileSelected(doc);
    console.log(`Document clicked`);
  };

  const iterable = Array.from(entries()).filter(
    ([key]) => !key.endsWith('_metadata'),
  );
  // console.log('iterable', iterable);

  return (
    <Box p={4}>
      <HStack spacing={4}>
        <Button size="sm" colorScheme="teal" onClick={createNewDocument}>
          + Create New Document
        </Button>
        <Button size="sm" colorScheme="blue" onClick={clearDocuments}>
          - Delete All
        </Button>
        {data &&
          Array.from(iterable).map(([key, value]) => (
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
