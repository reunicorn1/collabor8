import { Box, Flex, Text, Button } from '@chakra-ui/react';
import React, { useState } from 'react';
import { selectFile } from '@store/selectors/fileSelectors';
import { useExecuteFileMutation } from '@store/services/file';
import { MdBuild } from 'react-icons/md';
import { useAppSelector } from '@hooks/useApp';
import { EXECUTION_PANEL_FILLER_TEXT } from '../constants';

const Console: React.FC = () => {
  const fileSelector = useAppSelector(selectFile);
  const [executeFile, { isLoading }] = useExecuteFileMutation();
  const [output, setOutput] = useState<string>(EXECUTION_PANEL_FILLER_TEXT);

  const handleExecute = async () => {
    let file = fileSelector;
    //console.log('Execute', file);
    if (file) {
      const res = await executeFile({
        id: file.file_id,
        language: file.language,
      }).unwrap();
      //console.log(res?.output);
      setOutput(res?.output || '');
    }
  };

  return (
    <Box
      borderRadius="md"
      border="1px solid #333"
      bg="#1e1e1e"
      color="green.400"
      fontFamily="monospace"
      className='flex h-full flex-col max-h-[300px]'
    >
      {/* Terminal header bar */}
      <Flex
        bg="#2d2d2d"
        borderBottom="1px solid #333"
        align="center"
        p={2}
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
      <Box className='flex-grow overflow-y-auto p-4'>
        <Text whiteSpace="pre-wrap">
          {output}
        </Text>
      </Box>
    </Box>
  );
};

export default Console;
