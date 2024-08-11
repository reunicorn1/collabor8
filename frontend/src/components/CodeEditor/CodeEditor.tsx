import { useState, useEffect, useRef } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/xml/xml';
import * as Y from 'yjs';
import { CodemirrorBinding } from 'y-codemirror';
import RandomColor from 'randomcolor';
import LanguageSelector from './LanguageSelector';
import ConnectionForm from './ConnectionForm';
import { WebsocketProvider } from 'y-websocket';

const languageModes = {
  javascript: 'javascript',
  python: 'python',
  c: 'text/x-csrc',
  typescript: 'javascript',
  markdown: 'markdown',
  html: 'xml',
};

function CodeEditor() {
  const [language, setLanguage] = useState('typescript');
  const [value, setValue] = useState('// TypeScript code');
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState('');
  const [roomName, setRoomName] = useState('');
  const editorRef = useRef(null);
  const ydoc = new Y.Doc();

  useEffect(() => {
    if (connected) {
      const provider = new WebsocketProvider(
        'ws://localhost:9090',
        roomName,
        ydoc,
      );

      const awareness = provider.awareness;
      const color = RandomColor();

      awareness.setLocalStateField('user', {
        name: username,
        color: color,
      });

      if (editorRef.current && connected) {
        const editor = editorRef.current;
        if (editor) {
          const yText = ydoc.getText('codemirror');
          const yUndoManager = new Y.UndoManager(yText);
          const awareness = provider.awareness;

          const bindingRef = new CodemirrorBinding(yText, editor, awareness, {
            yUndoManager,
          });
          return () => {
            bindingRef.destroy();
          };
        }
      }

      return () => {
        provider.disconnect();
        console.log('Disconnected from WebsocketProvider');
      };
    }
  }, [connected, roomName, username]);

  const handleLanguageChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    setValue('// New code');
  };

  const handleConnect = (username, roomName) => {
    setUsername(username);
    setRoomName(roomName);
    setConnected(true);
  };

  if (!connected) {
    return <ConnectionForm onConnect={handleConnect} />;
  }

  return (
    <div className="p-4 space-y-4">
      <LanguageSelector
        language={language}
        onLanguageChange={handleLanguageChange}
      />
      <CodeMirror
        value={value}
        options={{
          mode: languageModes[language],
          lineNumbers: true,
        }}
        editorDidMount={(editor) => {
          editorRef.current = editor;
        }}
        onChange={(editor, data, value) => {
          setValue(value);
        }}
      />
    </div>
  );
}

export default CodeEditor;
