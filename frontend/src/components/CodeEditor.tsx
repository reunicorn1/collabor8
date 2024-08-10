import { ChangeEvent, useState } from 'react';
import CodeMirror, { Extension } from '@uiw/react-codemirror';
import { dracula } from '@uiw/codemirror-themes-all';
import { langs } from '@uiw/codemirror-extensions-langs';
import { codeExamples, LanguageCode } from '../utils/codeExamples';

const languageOptions: Record<LanguageCode, Extension> = {
  javascript: langs.javascript(),
  python: langs.python(),
  c: langs.c(),
  typescript: langs.typescript(),
  markdown: langs.markdown(),
  html: langs.html(),
};

function CodeEditor() {
  const [language, setLanguage] = useState<LanguageCode>('typescript');
  const [value, setValue] = useState<string>(codeExamples['typescript']);

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = event.target.value as LanguageCode;
    setLanguage(selectedLanguage);
    setValue(codeExamples[selectedLanguage]);
  };

  return (
    <div>
      <select onChange={handleLanguageChange} value={language}>
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="c">C</option>
        <option value="typescript">TypeScript</option>
        <option value="markdown">Markdown</option>
        <option value="html">HTML</option>
      </select>

      <CodeMirror
        value={value}
        height="200px"
        theme={dracula}
        extensions={[languageOptions[language]]}
        basicSetup={{
          foldGutter: false,
          dropCursor: false,
          allowMultipleSelections: false,
          indentOnInput: false,
        }}
      />
    </div>
  );
}

export default CodeEditor;
