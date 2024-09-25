import React from 'react';
import { Box, Flex, Text, Button, useToast } from '@chakra-ui/react';
//import { CloseIcon } from '@chakra-ui/icons';
import { selectFile } from '@store/selectors/fileSelectors';
import { useExecuteFileMutation } from '@store/services/file';
import { MdBuild } from 'react-icons/md';
import { useAppSelector } from '@hooks/useApp';
import { selectUserDetails } from '@store/selectors/userSelectors';
import { EXECUTION_PANEL_FILLER_TEXT } from '../constants';
import LineNumberedText from '@components/CodeEditor/LineNumber';

const intialOutput = {
  output: {
    stdout: EXECUTION_PANEL_FILLER_TEXT,
    stderr: '',
  },
};

const Console: React.FC = () => {
  const fileSelector = useAppSelector(selectFile);
  const user = useAppSelector(selectUserDetails);
  const toast = useToast();
  const [executeFile, { data = intialOutput, isLoading }] =
    useExecuteFileMutation();
  const { output } = data;

  const handleExecute = async () => {
    if (
      user.username === 'guest' &&
      user.first_name === 'Guest' &&
      user.last_name === 'User'
    ) {
      toast({
        title: 'Whoa! 🚀 Code Without a License?',
        description: 'Time to suit up! Log in to unlock full coding powers. 🔑',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
        variant: 'subtle',
      });
      return;
    }

    let file = fileSelector;
    //console.log('Execute', file);
    if (file) {
      try {
        await executeFile({
          id: file.file_id,
          language: file.language,
        }).unwrap();
        //console.log(res?.output);
      } catch (err) {
        //console.log({err})
      }
    }
  };

  return (
    <Box
      borderRadius="md"
      border="1px solid #333"
      bg="#1e1e1e"
      color="green.400"
      fontFamily="monospace"
      className="flex h-full flex-col max-h-[300px]"
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
          ms="auto"
          size="xs"
          rightIcon={<MdBuild />}
          variant="solid"
          colorScheme="teal"
          onClick={() => handleExecute()}
          className="font-mono !bg-transparent border !border-white"
        >
          run
        </Button>
      </Flex>
      {/* Terminal content */}
      <Box className="flex-grow overflow-auto space-y-4 p-4">
        {output.stdout && (
          <div className="space-y-4">
            <Text className="text-green-400">Standard Output:</Text>
            <LineNumberedText color="green.400" text={output.stdout} />
          </div>
        )}
        {output.stderr && (
          <div className="space-y-4">
            <Text className="text-red-400">Standard Error:</Text>
            <LineNumberedText color="red.400" text={output.stderr} />
          </div>
        )}
      </Box>
    </Box>
  );
};

export default Console;
