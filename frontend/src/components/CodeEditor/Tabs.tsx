import { Box, Text, Image } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
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
    // TODO: This fucntion changes the value of the file selected state to the corresponding tab object
    console.log(tabslist);
    setFileSelected(file);
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
        {tabslist &&
          tabslist.map((file, index) => (
            <Box
              key={crypto.randomUUID()}
              w="18%"
              display="flex"
              bg="brand.900"
              cursor="pointer"
              onClick={() => handleClick(file)}
              borderTop={
                fileSelected && fileSelected === file
                  ? '2px solid yellow'
                  : '0.5px solid rgba(128, 128, 128, 0.5)'
              }
              borderRight="0.5px solid rgba(128, 128, 128, 0.5)"
              borderBottom="0.5px solid rgba(128, 128, 128, 0.5)"
              borderLeft="0.5px solid rgba(128, 128, 128, 0.5)"
              alignContent="center"
              alignItems="center"
              justifyContent="center"
            >
              <Image
                key={crypto.randomUUID()}
                src={`/lang-logo/${languageModes[language]}`}
                boxSize="15px"
                mr={2}
              />

              <Text color="white" fontSize="xs" fontFamily="mono" key={index}>
                {file.name}
              </Text>
            </Box>
          ))}
      </Box>
    </>
  );
}
