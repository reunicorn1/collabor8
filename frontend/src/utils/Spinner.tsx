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

// Keyframes for the animation
const fadeAnimation = keyframes`
  0% { opacity: 0; }
  25% { opacity: 1; }
  50% { opacity: 0; }
  75% { opacity: 1; }
  100% { opacity: 0; }
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

  // Update the snippet every 0.9 seconds
  useEffect(() => {
    const interval = setInterval(updateSnippet, 900);

    return () => clearInterval(interval);
  }, [updateSnippet]);

  return (
    <Center
      h="100vh"
      bgGradient="linear(to-b, brand.800, brand.900)"
      flexDirection="column"
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box position="relative">
          <Text
            fontFamily="mono"
            fontSize="5xl"
            color="brand.100"
            animation={`${fadeAnimation} 0.9s infinite`}
            whiteSpace="pre"
            textAlign="center"
          >
            {snippet}
          </Text>
        </Box>
        <Text color="white" fontFamily="mono" mt={4} fontSize="xl">
          Loading...
        </Text>
      </Box>
    </Center>
  );
};

export default CodeSnippetLoader;
