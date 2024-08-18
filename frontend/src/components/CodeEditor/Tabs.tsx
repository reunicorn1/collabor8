import { Box, Text, Image } from '@chakra-ui/react';
import { useState } from 'react';
import { LanguageCode } from '../../utils/codeExamples';
import { useSettings } from '../../context/EditorContext';

export default function Tabs() {
  const [tabslist, setTabsList] = useState([]);
  const { language } = useSettings()!;
  const languageModes: Record<LanguageCode, string> = {
    javascript: 'javascript.png',
    python: 'python.png',
    c: 'c.png',
    typescript: 'typescript.png',
    markdown: 'markdown.png',
    html: 'html.png',
  };

  const handleClick = () => {
    // TODO: This fucntion changes the value of the fileselected state to the corresponding tab object
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
        {/* for every open tab there will be a corresponding box tab that binds the ytext with the editor */}
        <Box
          w="18%"
          display="flex"
          bg="brand.900"
          borderTop="2px solid yellow"
          borderRight="0.5px solid rgba(128, 128, 128, 0.5)"
          borderBottom="0.5px solid rgba(128, 128, 128, 0.5)"
          borderLeft="0.5px solid rgba(128, 128, 128, 0.5)"
          alignContent="center"
          alignItems="center"
          justifyContent="center"
        >
          <Image
            src={`/lang-logo/${languageModes[language]}`}
            boxSize="15px"
            mr={2}
          />

          <Text color="white" fontSize="xs" fontFamily="mono">
            CodeEditor.tsx
          </Text>
        </Box>
      </Box>
    </>
  );
}
