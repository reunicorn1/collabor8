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
import DocumentManager from './TabsList';
import { Awareness } from 'y-protocols/awareness.js';
import { useYMap } from 'zustand-yjs';

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
}

type YMapValueType = Y.Text | null | Y.Map<YMapValueType>;

const CodeEditor: React.FC<CodeEditorProps> = ({ projectId }) => {
  const { theme, language } = useSettings()!;
  const { fileSelected } = useFile()!;
  const editorRef = useRef<Editor | null>(null);
  // const [render, setRender] = useState(true);
  const projectRoot = useRef<Y.Map<YMapValueType> | null>(null);
  const binding = useRef<CodemirrorBinding | null>(null);
  const ydoc = useRef(new Y.Doc());
  projectRoot.current = ydoc.current.getMap('root');

  const { data, set, entries } = useYMap<
    Y.Map<YMapValueType> | Y.Text,
    Record<string, Y.Map<YMapValueType> | Y.Text>
  >(projectRoot.current); // Type Error
  const awareness = useRef<Awareness | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;
    console.log(projectRoot.current);
    const provider = new WebsocketProvider(
      'ws://localhost:1234',
      projectId,
      ydoc.current,
    );
    provider.on('status', (event) => {
      console.log(event.status); // logs "connected" or "disconnected"
    });

    awareness.current = provider.awareness;

    awareness.current.setLocalStateField('user', {
      name: 'User',
      color: RandomColor(),
    });

    const setupCodemirrorBinding = (text: Y.Text) => {
      return new CodemirrorBinding(
        text,
        editorRef.current!,
        awareness.current,
        {
          yUndoManager: new Y.UndoManager(text),
        },
      );
    };

    if (projectRoot.current && provider) {
      if (projectRoot.current.size === 0) {
        const yText = ydoc.current.getText('main-file');
        projectRoot.current.set('main-file', yText);
        binding.current = setupCodemirrorBinding(yText);
        console.log('this is because file is brand new', binding.current);
      } else {
        const key = Array.from(projectRoot.current.keys())[0];
        const text = projectRoot.current.get(key);

        if (text instanceof Y.Text) {
          binding.current = setupCodemirrorBinding(text);
          console.log('this is because file is not new', binding.current);
        } else {
          console.error('Error occurred during the setup of the binding');
        }
      }
    }

    return () => {
      binding.current?.destroy();
      provider.disconnect();
    };
  }, [projectId]);

  useEffect(() => {
    if (fileSelected && editorRef.current && fileSelected instanceof Y.Text) {
      try {
        binding.current?.destroy();
        binding.current = new CodemirrorBinding(
          fileSelected,
          editorRef.current,
          awareness.current,
          {
            yUndoManager: new Y.UndoManager(fileSelected),
          },
        );
      } catch (err) {
        console.error('Error occured during binding, but this is serious', err);
      }
    } else {
      console.error('Error occured during binding of the file', fileSelected);
    }
  }, [fileSelected]);

  // const handleLanguageChange = (selectedLanguage: LanguageCode) => {
  //   setLanguage(selectedLanguage);
  // };

  // const handleThemeChange = (selectedTheme: string) => {
  //   setTheme(selectedTheme);
  // };

  return (
    <div>
      <DocumentManager data={data} set={set} entries={entries} />
      {/* <div className="selectors">
        <LanguageSelector
          language={language}
          onLanguageChange={handleLanguageChange}
        />
        <ThemeSelector theme={theme} onThemeChange={handleThemeChange} />
      </div> */}
      <div
        style={{
          width: '100%',
        }}
      >
        <CodeMirror
          options={{
            mode: languageModes[language],
            theme: theme,
            lineNumbers: true,
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
