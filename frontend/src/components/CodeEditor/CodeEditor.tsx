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
import { Awareness } from 'y-protocols/awareness.js';
import { getRandomUsername } from './names';
import { YMapValueType } from '../../context/EditorContext';
import Tabs from './Tabs';
import { useAppSelector } from '../../hooks/useApp';
import { selectAccessToken, selectUserDetails } from '@store/selectors';
import { useFindMyShareQuery } from '@store/services/projectShare';
import { Project, ProjectShares } from '@types';
import { useSelector } from 'react-redux';

const languageModes: Record<LanguageCode, string> = {
  javascript: 'javascript',
  python: 'python',
  c: 'text/x-csrc',
  typescript: 'javascript',
  markdown: 'markdown',
  html: 'xml',
  unknown: 'javascript',
};
// Definition of interfaces and types

interface CodeEditorProps {
  project: Project | ProjectShares;
  ydoc: Y.Doc;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ydoc, project }) => {
  const userDetails = useSelector(selectUserDetails);
  const { data } = useFindMyShareQuery(project._id);
  console.log(data);
  const { theme, language, mode, setMode } = useSettings()!;
  const token = useAppSelector(selectAccessToken);
  const user = useAppSelector(selectUserDetails);
  const { fileSelected, setAwareness, setFileTree } = useFile()!;
  const editorRef = useRef<Editor | null>(null);
  const projectRoot = useRef<Y.Map<YMapValueType> | null>(null);
  const binding = useRef<CodemirrorBinding | null>(null);
  const ydoc_ = useRef(ydoc);
  const awareness = useRef<Awareness | null>(null);

  projectRoot.current = ydoc_.current.getMap(project._id);

  // A function to create a binding between file selected from the file tree and the editor
  const setupCodemirrorBinding = (text: Y.Text) => {
    return new CodemirrorBinding(text, editorRef.current!, awareness.current, {
      yUndoManager: new Y.UndoManager(text),
    });
  };

  // effects for socket provider and awareness
  useEffect(() => {
    if (project?.username !== userDetails?.username) {
      setMode(data?.access_level === 'read');
    } else {
      setMode(false);
    }
    // Creating a connection with the web socket
    const websocket = import.meta.env.VITE_WS_SERVER;
    if (!editorRef.current) return;

    // Creation of the connction with the websocket
    /**
     * token based on role=owner
     *
     */
    const provider = new WebsocketProvider(
      websocket,
      project._id,
      ydoc_.current,
      {
        params: {
          token,
          username: project.username,
        },
      },
    );
    provider.on('status', (event: { status: unknown }) => {
      console.log('%c======================>', 'background:white;color:red', {
        status: event.status,
      }); // logs "connected" or "disconnected"
      if (event.status === 'connected') {
        // Awareness information related to the presence of the user's cursor
        awareness.current = provider.awareness;
        awareness.current.setLocalStateField('user', {
          name: user?.username || getRandomUsername(),
          color: RandomColor(),
        });
      }
    });

    // An event listener to clean up once the user is removed
    provider.on('close', () => {
      provider.awareness.setLocalState(null); // Removes the local awareness state
    });

    // Awareness information related to the presence of the user's cursor
    awareness.current = provider.awareness;
    awareness.current.setLocalStateField('user', {
      name: user?.username || getRandomUsername(), // TODO: import the username from the context and use it here else use Random
      color: RandomColor(),
    });

    // Awareness data is shared among different components so it's stored in a state

    const updateAwareness = () => {
      const aware = Array.from(awareness.current?.states);
      setAwareness(aware);
    };
    updateAwareness();

    // Observations and changes to awarness are tracked using these observers
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
      binding.current?.destroy();
      provider.disconnect();
    });

    if (projectRoot.current) {
      setFileTree(projectRoot.current);
    }
    return () => {
      binding.current?.destroy();
      provider?.disconnect();
    };
  }, [project._id]);

  useEffect(() => {
    if (
      fileSelected &&
      editorRef.current &&
      fileSelected.value instanceof Y.Text
    ) {
      try {
        binding.current?.destroy();
        binding.current = setupCodemirrorBinding(fileSelected.value);
      } catch (err) {
        console.error('Error occured during binding, but this is serious', err);
      }
    } else {
      console.error('Error occured during binding of the file', fileSelected);
    }
  }, [fileSelected]);

  useEffect(() => {
    if (fileSelected?.id) {
      editorRef.current?.setOption(
        'mode',
        languageModes[language as LanguageCode] || 'javascript',
      );
    }
  }, [language, fileSelected]);

  return (
    <Box h="100%" bg="brand.900">
      <Tabs />
      <Box opacity={fileSelected ? '1' : '0'}>
        <CodeMirror
          options={{
            mode: languageModes[language as LanguageCode] || 'javascript',
            theme: theme,
            lineNumbers: true,
            readOnly: mode,
            tabSize: 2,
            indentUnit: 4,
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
