import React, { useState, useEffect, useRef } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import './codemirrorSetup';
import * as Y from 'yjs';
import { CodemirrorBinding } from 'y-codemirror';
import RandomColor from 'randomcolor';
import { LanguageSelector, ThemeSelector, ConnectionForm } from './index';
import { WebsocketProvider } from 'y-websocket';
import { codeExamples, LanguageCode } from '../../utils/codeExamples';
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
  fileContent: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ fileContent }) => {
  const [language, setLanguage] = useState<LanguageCode>('typescript');
  const [theme, setTheme] = useState('dracula');
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState('');
  const [roomName, setRoomName] = useState('');
  const editorRef = useRef<Editor | null>(null);

  useEffect(() => {
    if (connected) {
      const ydoc = new Y.Doc();
      const provider = new WebsocketProvider(
        'ws://localhost:9090',
        roomName,
        ydoc,
      );

      provider.on('status', (event: { status: string }) => {
        console.log(event.status); // logs "connected" or "disconnected"
      });

      provider.on('sync', (isSynced: boolean) => console.log(isSynced));

      const awareness = provider.awareness;
      const color = RandomColor();

      awareness.setLocalStateField('user', { name: username, color });

      const yText = ydoc.getText('codemirror');
      yText.insert(0, fileContent); // Initialize the editor with the file content
      const yUndoManager = new Y.UndoManager(yText);

      const binding = new CodemirrorBinding(
        yText,
        editorRef.current,
        awareness,
        {
          yUndoManager,
        },
      );

      return () => {
        binding.destroy();
        provider.disconnect();
      };
    }
  }, [connected, language, roomName, username, fileContent]);

  const handleLanguageChange = (selectedLanguage: LanguageCode) => {
    setLanguage(selectedLanguage);
  };

  const handleThemeChange = (selectedTheme: string) => {
    setTheme(selectedTheme);
  };

  const handleConnect = (username: string, roomName: string) => {
    setUsername(username);
    setRoomName(roomName);
    setConnected(true);
  };

  if (!connected) {
    return <ConnectionForm onConnect={handleConnect} />;
  }

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
