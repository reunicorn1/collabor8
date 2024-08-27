import { Box, Text, Image, Spacer, CloseButton } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { LanguageCode } from '../../utils/codeExamples';
import { useSettings, useFile } from '../../context/EditorContext';
import { FileType } from '../../context/EditorContext';

export default function Tabs() {
  const [tabslist, setTabsList] = useState<FileType[]>([]);
  const { language } = useSettings()!;
  const { fileSelected, setFileSelected } = useFile()!;
  const languageModes: Record<LanguageCode, string> = {
    javascript: 'javascript.png',
    python: 'python.png',
    c: 'c.png',
    typescript: 'typescript.png',
    markdown: 'markdown.png',
    html: 'html.png',
  };

  useEffect(() => {
    if (!fileSelected) return;
    const foundTab = tabslist.find((tab) => tab.id === fileSelected.id);
    if (!foundTab) {
      setTabsList([...tabslist, fileSelected]);
    } else {
      setFileSelected(foundTab);
    }
  }, [fileSelected, setFileSelected, tabslist]);

  const handleClick = (file: FileType) => {
    console.log(tabslist);
    setFileSelected(file);
  };

  const handleClose = (file: FileType, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedFile = tabslist.filter((tab) => tab.id !== file.id);
    setTabsList(updatedFile);
    if (updatedFile.length > 0) {
      setFileSelected(updatedFile[updatedFile.length - 1]);
    } else {
      setFileSelected(null); // type error -_-
    }
  };

  return (
    <>
      <Box
        display="flex"
        h="40px"
        bg="brand.900"
        borderBottom="2px solid #524175"
        // overflowX="scroll"
        // whiteSpace="nowrap"
      >
        {tabslist.map((file) => (
          <Box
            key={file.id}
            w="20%"
            display="flex"
            bg="brand.900"
            cursor="pointer"
            onClick={() => handleClick(file)}
            borderTop={
              fileSelected && fileSelected.id === file.id
                ? '2px solid yellow'
                : '0.5px solid rgba(128, 128, 128, 0.5)'
            }
            borderRight="0.5px solid rgba(128, 128, 128, 0.5)"
            borderBottom="0.5px solid rgba(128, 128, 128, 0.5)"
            borderLeft="0.5px solid rgba(128, 128, 128, 0.5)"
            alignContent="center"
            alignItems="center"
            overflow="hidden"
            textOverflow="ellipsis"
            pl={6}
          >
            <Image
              src={`/lang-logo/${languageModes[file.language as LanguageCode] || 'unknown.png'}`}
              boxSize="15px"
              mr={2}
            />
            <Text color="white" fontSize="xs" fontFamily="mono">
              {file.name}
            </Text>
            <Spacer />
            <CloseButton
              color="white"
              size="sm"
              _hover={{ bg: '#323232', color: 'white' }}
              mr={2}
              onClick={(e) => handleClose(file, e)}
            />
          </Box>
        ))}
      </Box>
    </>
  );
}
