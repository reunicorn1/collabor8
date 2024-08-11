import { useState, useEffect, useRef } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/xml/xml';
import * as Y from 'yjs';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { CodemirrorBinding } from 'y-codemirror';
import RandomColor from 'randomcolor';
import LanguageSelector from './LanguageSelector';
import ConnectionForm from './ConnectionForm';

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
  const ydoc = useRef(new Y.Doc()).current;
  const hocuspocusProviderRef = useRef(null);
  const bindingRef = useRef(null);

  useEffect(() => {
    if (connected) {
      console.log('Initializing HocuspocusProvider with', roomName, username);
      console.log('ydoc Obj: ', ydoc);
      hocuspocusProviderRef.current = new HocuspocusProvider({
        url: 'ws://localhost:9090',
        name: roomName,
        document: ydoc,
      });

      const awareness = hocuspocusProviderRef.current.awareness;
      console.log('Awareness:', awareness);
      const color = RandomColor();

      console.log(
        'Setting awareness state with name:',
        username,
        'and color:',
        color,
      );

      awareness.setLocalStateField('user', {
        name: username,
        color: color,
      });

      return () => {
        hocuspocusProviderRef.current.disconnect();
        console.log('Disconnected from HocuspocusProvider');
      };
    }
  }, [connected, roomName, username]);

  useEffect(() => {
    if (editorRef.current && !bindingRef.current && connected) {
      const editor = editorRef.current.editor;
      if (editor) {
        const yText = ydoc.getText('codemirror');
        const yUndoManager = new Y.UndoManager(yText);
        const awareness = hocuspocusProviderRef.current.awareness;

        bindingRef.current = new CodemirrorBinding(yText, editor, awareness, {
          yUndoManager,
        });

        return () => {
          bindingRef.current.destroy();
          bindingRef.current = null;
        };
      }
    }
  }, [editorRef.current, connected]);

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
