import { useState, useEffect, useRef } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/xml/xml';
import 'codemirror/theme/dracula.css';
import 'codemirror/theme/eclipse.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/theme/solarized.css';
import 'codemirror/theme/twilight.css';
import 'codemirror/theme/zenburn.css';
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

const CodeEditor = () => {
  const [language, setLanguage] = useState<LanguageCode>('typescript');
  const [value, setValue] = useState(codeExamples['typescript']);
  const [theme, setTheme] = useState('dracula');
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState('');
  const [roomName, setRoomName] = useState('');
  const editorRef = useRef<Editor | null>(null);
  const ydoc = useRef(new Y.Doc()).current;

  useEffect(() => {
    if (connected) {
      const provider = new WebsocketProvider(
        'ws://localhost:9090',
        roomName,
        ydoc,
      );
      const awareness = provider.awareness;
      const color = RandomColor();

      awareness.setLocalStateField('user', { name: username, color });

      const editor = editorRef.current;
      if (editor) {
        const yText = ydoc.getText('codemirror');
        const yUndoManager = new Y.UndoManager(yText);

        const binding = new CodemirrorBinding(yText, editor, awareness, {
          yUndoManager,
        });
        return () => {
          binding.destroy();
          provider.disconnect();
        };
      }
    }
  }, [connected, roomName, username, ydoc]);

  const handleLanguageChange = (selectedLanguage: LanguageCode) => {
    setLanguage(selectedLanguage);
    setValue(codeExamples[selectedLanguage]);
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
          value={value}
          options={{
            mode: languageModes[language],
            theme: theme,
            lineNumbers: true,
          }}
          editorDidMount={(editor) => (editorRef.current = editor)}
          onChange={(editor, data, value) => setValue(value)}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
