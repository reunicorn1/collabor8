import { Box, Flex, Text, IconButton, Button } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import React from 'react';
import { selectFile } from '@store/selectors/fileSelectors';
import { useExecuteFileMutation } from '@store/services/file';
import { MdBuild } from 'react-icons/md';
import { useAppSelector } from '@hooks/useApp';
interface ConsoleProps {
  output: string;
  setOutput: any;
  onClose: () => void;
}

interface FileType {
  file_id: string;
  language: string;
}

const Console: React.FC<ConsoleProps> = ({ output, setOutput, onClose }) => {
  const fileSelector = useAppSelector(selectFile);
  const [executeFile, { isLoading }] = useExecuteFileMutation();

  const handleExecute = async () => {
    let file = fileSelector;
    console.log('Execute', file);
    if (file) {
      const res = await executeFile({ id: file.file_id, language: file.language }).unwrap();
      console.log(res?.output);
      setOutput(res?.output || '');
    }
  }

  return (
    <Box
      borderRadius="md"
      border="1px solid #333"
      bg="#1e1e1e"
      color="green.400"
      fontFamily="monospace"
      className='!overflow-hidden !bottom-0'
       style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      {/* Terminal header bar */}
      <Flex
        bg="#2d2d2d"
        borderBottom="1px solid #333"
        align="center"
        p={2}
        justify="flex-start"
        borderTopRadius="md"
        px={4}
      >
          <Button
            disabled={isLoading}
            isLoading={isLoading}
            ms='auto'
            rightIcon={<MdBuild />}
            variant='solid'
            colorScheme='teal'
            onClick={() => handleExecute()}
            className='font-mono !bg-transparent border !border-white'
          >
            run
          </Button>

      </Flex>
      {/* Terminal content */}
      <Box p={4} 
      style={{ flexGrow: 1, overflowY: 'auto' }}
      >
        <Text whiteSpace="pre-wrap"
        >{output}</Text>
      </Box>
    </Box>
  );
};

export default Console;
