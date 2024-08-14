import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const [render, setRender] = useState(true);
  const [aware, setAware] = useState();

  // Type guard to check if a value is Y.Text
  const isYText = (value: YMapValueType): value is Y.Text => {
    return value instanceof Y.Text;
  };

  const initializeDocument = useCallback(() => {
    const ydoc = new Y.Doc();
    const projectRoot = ydoc.getMap('root');
    projectRoot.observe(() => setRender(!render));
    setFileTree(projectRoot);

    const provider = new WebsocketProvider(
      'ws://localhost:9090',
      projectId,
      ydoc,
    );
    setAware(provider.awareness);

    provider.awareness.setLocalStateField('user', {
      name: 'User',
      color: RandomColor(),
    });

    // If the y.map is empty and new with no files
    // TODO: An API request can be done in this part to create a corresponding file
    // But the editor in a new project always had to come with an empty file
    // But you have to check if this is a new project or not.
    if (projectRoot.size === 0 && editorRef.current) {
      const yText = ydoc.getText('main-file');
      projectRoot.set('main-file', yText);
      setBinding(
        new CodemirrorBinding(yText, editorRef.current, provider.awareness, {
          yUndoManager: new Y.UndoManager(yText),
        }),
      );
    } else {
      const key = Array.from(projectRoot.keys())[0];
      const text = projectRoot.get(key);
      setBinding(
        new CodemirrorBinding(text, editorRef.current, provider.awareness, {
          yUndoManager: new Y.UndoManager(text),
        }),
      );
    }

    return () => {
      binding?.destroy();
      provider.disconnect();
    };
  }, []);

  useEffect(() => {
    if (fileSelected && editorRef.current && fileSelected instanceof Y.Text) {
      setBinding(
        new CodemirrorBinding(fileSelected, editorRef.current, aware, {
          yUndoManager: new Y.UndoManager(fileSelected),
        }),
      );
    }
  }, [fileSelected, aware]);

  // const handleLanguageChange = (selectedLanguage: LanguageCode) => {
  //   setLanguage(selectedLanguage);
  // };

  // const handleThemeChange = (selectedTheme: string) => {
  //   setTheme(selectedTheme);
  // };

  return (
    <div>
      <DocumentManager projectlist={fileTree} render={render} />
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
          editorDidMount={(editor) => {
            editorRef.current = editor;
            initializeDocument();
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
