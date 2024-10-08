import React, { useState, useEffect, useCallback } from 'react';
import { Box, Center, Text } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

// set of code snippets
const codeSnippets = [
  'const a = 1;',
  'let b = "hello";',
  'function foo() {}',
  'if (x > 10) { console.log("x is large"); }',
  'for (let i = 0; i < 10; i++) { console.log(i); }',
  'class MyClass {}',
  'return Math.random();',
  'import React from "react";',
];

// Keyframes for fade animation
const fadeAnimation = keyframes`
  0% { opacity: 0; transform: scale(0.95); }
  50% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(0.95); }
`;

// random code snippet excluding the current snippet
const getRandomSnippet = (excludeSnippet: string) => {
  const filteredSnippets = codeSnippets.filter(
    (snippet) => snippet !== excludeSnippet,
  );
  const randomIndex = Math.floor(Math.random() * filteredSnippets.length);
  return filteredSnippets[randomIndex];
};

const CodeSnippetLoader: React.FC = () => {
  const [snippet, setSnippet] = useState(getRandomSnippet(''));

  const updateSnippet = useCallback(() => {
    setSnippet((prevSnippet) => getRandomSnippet(prevSnippet));
  }, []);

  // Update the snippet every 1.5 seconds
  useEffect(() => {
    const interval = setInterval(updateSnippet, 1500);

    return () => clearInterval(interval);
  }, [updateSnippet]);

  return (
    <Center
      h="100vh"
      bgGradient="linear(to-b, brand.800, brand.900)"
      flexDirection="column"
      px={[4, 8]}
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box position="relative">
          <Text
            fontFamily="mono"
            fontSize={['2xl', '4xl', '5xl']}
            color="brand.100"
            animation={`${fadeAnimation} 1.5s ease-in-out infinite`}
            whiteSpace="pre-wrap"
            textAlign="center"
            aria-live="polite"
          >
            {snippet}
          </Text>
        </Box>
      </Box>
    </Center>
  );
};

export default CodeSnippetLoader;
