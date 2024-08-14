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
}

const CodeEditor: React.FC<CodeEditorProps> = ({ projectId, fileId }) => {
  const [language, setLanguage] = useState<LanguageCode>('typescript');
  const [theme, setTheme] = useState('dracula');
  const [initialValue, setInitialValue] = useState<string>('');
  const editorRef = useRef<Editor | null>(null);

  useEffect(() => {
    console.log('Connecting to WebSocket server...');
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(
      'ws://localhost:9090',
      projectId,
      ydoc,
    );

    ydoc.on('update', (update) => {
      Y.applyUpdate(ydoc, update);
      console.log('Y.Doc updated');
    });

    provider.on('status', (event: { status: string }) => {
      console.log(`WebSocket status: ${event.status}`);
    });

    const awareness = provider.awareness;
    const color = RandomColor();
    awareness.setLocalStateField('user', { name: 'User', color }); //TODO: Use a default until we implement the redux store
    const yMap = ydoc.getMap('files');
    let yText = ydoc.getText(fileId);

    if (!(yText instanceof Y.Text)) {
      console.log('Creating new Y.Text');
      yText = new Y.Text();
      yMap.set(fileId, yText);
    }

    const metadata = {
      fileId,
      projectId,
    };

    yMap.set(`${fileId}_metadata`, metadata);
    setInitialValue(yText.toString());
    // if (!yText.length) {
    //   yText.insert(0, 'tester');
    // }

    const yUndoManager = new Y.UndoManager(yText);
    const binding = new CodemirrorBinding(yText, editorRef.current, awareness, {
      yUndoManager,
    });

    const handleYTextUpdate = () => {
      setInitialValue(yText.toString());
    };
    yText.observe(handleYTextUpdate);

    return () => {
      binding.destroy();
      provider.disconnect();
      yText.unobserve(handleYTextUpdate);
    };
  }, [projectId, fileId, language, theme]);

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
