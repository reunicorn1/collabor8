import React, { useState, useEffect, useRef } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import './codemirrorSetup';
import * as Y from 'yjs';
import { CodemirrorBinding } from 'y-codemirror';
import RandomColor from 'randomcolor';
import { LanguageSelector, ThemeSelector } from './index';
import { WebsocketProvider } from 'y-websocket';
import { LanguageCode } from '../../utils/codeExamples';
import { Editor } from 'codemirror';

const languageModes: Record<LanguageCode, string> = {
  javascript: 'javascript',
  python: 'python',
  c: 'text/x-csrc',
  typescript: 'javascript',
  markdown: 'markdown',
  html: 'xml',
};

interface CodeEditorProps {
  projectId: string;
  fileId: string;
  fileContent: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  projectId,
  fileId,
  fileContent,
}) => {
  const [language, setLanguage] = useState<LanguageCode>('typescript');
  const [theme, setTheme] = useState('dracula');
  const editorRef = useRef<Editor | null>(null);

  useEffect(() => {
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(
      'ws://localhost:9090',
      projectId,
      ydoc,
    );

    provider.on('status', (event: { status: string }) => {
      console.log(`WebSocket status: ${event.status}`);
    });

    const awareness = provider.awareness;
    const color = RandomColor();
    awareness.setLocalStateField('user', { name: 'User', color }); //TODO: Use a default until we implement the redux store

    let yText = ydoc.getText(fileId);
    if (yText.length === 0) {
      yText.insert(0, fileContent);
    }

    const yUndoManager = new Y.UndoManager(yText);
    const binding = new CodemirrorBinding(yText, editorRef.current, awareness, {
      yUndoManager,
    });

    return () => {
      binding.destroy();
      provider.disconnect();
    };
  }, [projectId, fileId, fileContent]);

  const handleLanguageChange = (selectedLanguage: LanguageCode) => {
    setLanguage(selectedLanguage);
  };

  const handleThemeChange = (selectedTheme: string) => {
    setTheme(selectedTheme);
  };

  return (
    <div className="code-editor-container">
      <div className="selectors">
        <LanguageSelector
          language={language}
          onLanguageChange={handleLanguageChange}
        />
        <ThemeSelector theme={theme} onThemeChange={handleThemeChange} />
      </div>
      <div className="editor">
        <CodeMirror
          options={{
            mode: languageModes[language],
            theme: theme,
            lineNumbers: true,
          }}
          editorDidMount={(editor) => (editorRef.current = editor)}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
