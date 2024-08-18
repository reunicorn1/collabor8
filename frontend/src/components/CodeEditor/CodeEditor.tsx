import React, { useEffect, useRef } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
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
import { useYMap } from 'zustand-yjs';
import { getRandomUsername } from './names';
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
}

type YMapValueType = Y.Text | null | Y.Map<YMapValueType>;

const CodeEditor: React.FC<CodeEditorProps> = ({ projectId }) => {
  const websocket = import.meta.env.VITE_WS_SERVER;
  const { theme, language, mode, setMode } = useSettings()!;
  const { fileSelected, setAwareness, setSetting } = useFile()!;
  const editorRef = useRef<Editor | null>(null);
  const projectRoot = useRef<Y.Map<YMapValueType> | null>(null);
  const binding = useRef<CodemirrorBinding | null>(null);
  const ydoc = useRef(new Y.Doc());
  const awareness = useRef<Awareness | null>(null);

  projectRoot.current = ydoc.current.getMap('root');
  const { data, set, entries } = useYMap<
    Y.Map<YMapValueType> | Y.Text,
    Record<string, Y.Map<YMapValueType> | Y.Text>
  >(projectRoot.current); // Type Error

  setSetting(set);

  // An event listener for updates happneing in the ydoc
  ydoc.current.on('update', (update) => {
    console.log('Yjs update', update);
  });

  // A function to create a binding between file selected from the file tree and the editor
  const setupCodemirrorBinding = (text: Y.Text) => {
    return new CodemirrorBinding(text, editorRef.current!, awareness.current, {
      yUndoManager: new Y.UndoManager(text),
    });
  };

  useEffect(() => {
    if (!editorRef.current) return;
    // Creation of the connction with the websocket
    const provider = new WebsocketProvider(websocket, projectId, ydoc.current);
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
          removed.forEach((clientId) => {
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

    return () => {
      binding.current?.destroy();
      provider.disconnect();
    };
  }, [projectId, websocket]);

  useEffect(() => {
    if (fileSelected && editorRef.current && fileSelected instanceof Y.Text) {
      try {
        setMode(false);
        binding.current?.destroy();
        binding.current = setupCodemirrorBinding(fileSelected);
      } catch (err) {
        console.error('Error occured during binding, but this is serious', err);
      }
    } else {
      console.error('Error occured during binding of the file', fileSelected);
    }
  }, [fileSelected]);

  return (
    <div>
      {/* <DocumentManager
        data={data}
        set={set}
        entries={entries}
        yMap={projectRoot.current}
      /> */}
      <Tabs />
      <div className="literally-anything">
        <CodeMirror
          options={{
            mode: languageModes[language],
            theme: theme,
            lineNumbers: true,
            readOnly: false,
          }}
          editorDidMount={(editor) => {
            editorRef.current = editor;
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
