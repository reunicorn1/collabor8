import React, { useState, useEffect, useRef } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import './codemirrorSetup';
import * as Y from 'yjs';
import { CodemirrorBinding } from 'y-codemirror';
import RandomColor from 'randomcolor';
// import { LanguageSelector, ThemeSelector } from './index';
import { WebsocketProvider } from 'y-websocket';
import { LanguageCode } from '../../utils/codeExamples';
import { Editor } from 'codemirror';
import { useFile, useSettings } from '../../context/EditorContext';
import DocumentManager from './TabsList';

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
  const { fileSelected, fileTree, setFileTree } = useFile()!;
  const editorRef = useRef<Editor | null>();
  const [binding, setBinding] = useState<CodemirrorBinding | null>(null);
  const [aware, setAware] = useState();

  // Type guard to check if a value is Y.Text
  const isYText = (value: YMapValueType): value is Y.Text => {
    return value instanceof Y.Text;
  };

  useEffect(() => {
    const ydoc = new Y.Doc();
    const projectRoot = ydoc.getMap('root');
    projectRoot.observeDeep((arg0, arg1) => {
      console.log(arg0, arg1);
    });
    setFileTree(projectRoot); // Fix Type Error

    const provider = new WebsocketProvider(
      'ws://localhost:9090',
      projectId,
      ydoc,
    );

    provider.on('status', (event: { status: string }) => {
      console.log(`WebSocket status: ${event.status}`);
    });

    const awareness = provider.awareness;
    setAware(awareness); // Fix type error

    const color = RandomColor();
    awareness.setLocalStateField('user', { name: 'User', color }); //TODO: Use a default until we implement the redux store

    // TODO: An API request can be done in this part to create a corresponding file
    // But the editor in a new project always had to come with an empty file
    // But you have to check if this is a new project or not. projetRoot.keys is of type iterableIterator
    const firstItem = projectRoot.keys().next();
    if (firstItem.done) {
      const yText = ydoc.getText('main-file');
      projectRoot.set('main-file', yText);

      const yUndoManager = new Y.UndoManager(yText);
      if (editorRef.current)
        setBinding(
          new CodemirrorBinding(yText, editorRef.current, awareness, {
            yUndoManager,
          }),
        );
    }

    return () => {
      if (binding) binding.destroy();
      provider.disconnect();
    };
  }, [editorRef.current]);

  useEffect(() => {
    console.log('a file has been selected', fileSelected);
    if (isYText(fileSelected) && editorRef.current) {
      const yUndoManager = new Y.UndoManager(fileSelected);
      setBinding(
        new CodemirrorBinding(fileSelected, editorRef.current, aware, {
          yUndoManager,
        }),
      );
    }
  }, [aware, fileSelected]);

  // const handleLanguageChange = (selectedLanguage: LanguageCode) => {
  //   setLanguage(selectedLanguage);
  // };

  // const handleThemeChange = (selectedTheme: string) => {
  //   setTheme(selectedTheme);
  // };

  return (
    <div>
      <DocumentManager projectlist={fileTree} />
      {/* <div className="selectors">
        <LanguageSelector
          language={language}
          onLanguageChange={handleLanguageChange}
        />
        <ThemeSelector theme={theme} onThemeChange={handleThemeChange} />
      </div> */}
      <div>
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
