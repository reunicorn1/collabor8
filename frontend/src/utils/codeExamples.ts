export type LanguageCode =
  | 'javascript'
  | 'python'
  | 'c'
  | 'typescript'
  | 'markdown'
  | 'html';

export const codeExamples: Record<LanguageCode, string> = {
  javascript: `console.log('Hello World');`,
  python: `print('Hello World')`,
  c: `#include <stdio.h>\n\nint main() {\n    printf("Hello World");\n    return 0;\n}`,
  typescript: `console.log('Hello World');`,
  markdown: `# Hello World\n\nThis is a markdown example.`,
  html: `<html>\n<head>\n    <title>Hello World</title>\n</head>\n<body>\n    <h1>Hello World</h1>\n</body>\n</html>`,
};
