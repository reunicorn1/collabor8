import React, { useEffect, useRef } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { Box } from '@chakra-ui/react';
import './codemirrorSetup';
import * as Y from 'yjs';
import { CodemirrorBinding } from 'y-codemirror';
import RandomColor from 'randomcolor';
import { WebsocketProvider } from 'y-websocket';
import { LanguageCode } from '../../utils/codeExamples';
import { Editor } from 'codemirror';
import { useFile, useSettings } from '../../context/EditorContext';
// import DocumentManager from './TabsList';
import { Awareness } from 'y-protocols/awareness.js';
import { getRandomUsername } from './names';
import { YMapValueType } from '../../context/EditorContext';
import createfiletree from '../../utils/filetreeinit';
import Tabs from './Tabs';

const languageModes: Record<LanguageCode, string> = {
  javascript: 'javascript',
  python: 'python',
  c: 'text/x-csrc',
  typescript: 'javascript',
  markdown: 'markdown',
  html: 'xml',
};
// Definition of interfaces and types

interface CodeEditorProps {
  projectId: string;
  ydoc: Y.Doc;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ projectId, ydoc }) => {
  const { theme, language, mode, setMode } = useSettings()!;
  const { fileSelected, setAwareness, setFileTree } = useFile()!;
  const editorRef = useRef<Editor | null>(null);
  const projectRoot = useRef<Y.Map<YMapValueType> | null>(null);
  const binding = useRef<CodemirrorBinding | null>(null);
  const ydoc_ = useRef(ydoc);
  const awareness = useRef<Awareness | null>(null);
  const [wsProvider, setProvider] = useState<WebsocketProvider | null>(null);

  projectRoot.current = ydoc_.current.getMap('root');
  createfiletree(projectRoot.current); // This initlizes the filetree metadata structure

  // An event listener for updates happneing in the ydoc
  ydoc_.current.on('update', (update) => {
    console.log('Yjs update', update);
  });
  // A function to create a binding between file selected from the file tree and the editor
  const setupCodemirrorBinding = (text: Y.Text) => {
    return new CodemirrorBinding(text, editorRef.current!, awareness.current, {
      yUndoManager: new Y.UndoManager(text),
    });
  };

  console.log({ wsProvider });
  // effects for socket provider and awareness
  useEffect(() => {
    const websocket = import.meta.env.VITE_WS_SERVER;

    if (!editorRef.current) return;

    // Creation of the connction with the websocket
    const provider = new WebsocketProvider(websocket, projectId, ydoc_.current);
    provider.on('status', (event: { status: unknown }) => {
      console.log(event.status); // logs "connected" or "disconnected"
    });

    // An event listener to clean up once the user is removed
    provider.on('close', () => {
      provider.awareness.setLocalState(null); // Removes the local awareness state
    });

    // Awareness information related to the presence of the user's cursor
    awareness.current = provider.awareness;
    awareness.current.setLocalStateField('user', {
      name: getRandomUsername(), // TODO: import the username from the context and use it here else use Random
      color: RandomColor(),
    });

    // Awareness data is shared among different components so it's stored in a state

    const updateAwareness = () => {
      const aware = Array.from(awareness.current?.states);
      setAwareness(aware);
    };
    updateAwareness();

    //Observations and changes to awarness are tracked using these observers
    awareness.current.on('update', ({ added, removed }) => {
      if (awareness.current) {
        // Log added users
        if (added.length > 0) {
          added.forEach((clientId: number) => {
            const user = awareness.current?.getStates().get(clientId);
            console.log('User joined:', user);
            console.log(awareness.current?.getStates());
            updateAwareness();
          });
        }

        // Log removed users
        if (removed.length > 0) {
          removed.forEach((clientId: number) => {
            console.log('User left:', clientId);
            console.log(awareness.current?.getStates());
            updateAwareness();
          });
        }

      }
    });
    // Clean up before the user leaves
    window.addEventListener('beforeunload', () => {
      provider.awareness.setLocalState(null);
    });

    if (projectRoot.current) {
      setFileTree(projectRoot.current);
    }
    return () => {
      binding.current?.destroy();
      provider.disconnect();
    };

  }, [projectId]);

  useEffect(() => {
    if (
      fileSelected &&
      editorRef.current &&
      fileSelected.value instanceof Y.Text
    ) {
      try {
        setMode(false);
        binding.current?.destroy();
        binding.current = setupCodemirrorBinding(fileSelected.value);
      } catch (err) {
        console.error('Error occured during binding, but this is serious', err);
      }
    } else {
      setMode(true);
      console.error('Error occured during binding of the file', fileSelected);
    }
  }, [fileSelected]);

  return (
    <Box h="100%" bg="brand.900">
      <Tabs />
      <Box opacity={fileSelected ? '1' : '0'}>
        <CodeMirror
          options={{
            mode: languageModes[language],
            theme: theme,
            lineNumbers: true,
            readOnly: mode,
          }}
          editorDidMount={(editor) => {
            editorRef.current = editor;
          }}
        />
      </Box>
    </Box>
  );
};
export default CodeEditor;
