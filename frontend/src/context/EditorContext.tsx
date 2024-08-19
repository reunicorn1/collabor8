/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext, useState, ReactNode, useContext } from 'react';
import * as Y from 'yjs';

export type YMapValueType = Y.Text | null | Y.Map<YMapValueType>;
type Theme = string;
type Language = string;
type Awareness = [
  number,
  {
    [x: string]: any;
  },
][];
export type FileType = {
  name: string;
  value: YMapValueType;
};

interface SettingsContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  mode: boolean;
  setMode: (mode: boolean) => void;
}

interface FileContextType {
  fileSelected: FileType | null;
  setFileSelected: (file: FileType) => void;
  awareness: Awareness;
  setAwareness: (awareness: Awareness) => void;
  fileTree: Y.Map<YMapValueType> | null;
  setFileTree: (fileTree: Y.Map<YMapValueType> | null) => void;
}

// Initialize contexts with null as default
const SettingsContext = createContext<SettingsContextType | null>(null);
const FileContext = createContext<FileContextType | null>(null);

interface EditorProviderProps {
  children: ReactNode;
}

export function useSettings() {
  return useContext(SettingsContext);
}

export function useFile() {
  return useContext(FileContext);
}

export function EditorProvider({ children }: EditorProviderProps) {
  const [theme, setTheme] = useState<Theme>('dracula');
  const [language, setLanguage] = useState<Language>('typescript');
  const [fileSelected, setFileSelected] = useState<FileType | null>(null);
  const [awareness, setAwareness] = useState<Awareness>([]);
  const [fileTree, setFileTree] = useState<Y.Map<YMapValueType> | null>(null);
  const [mode, setMode] = useState<boolean>(true);

  return (
    <SettingsContext.Provider
      value={{ theme, setTheme, language, setLanguage, mode, setMode }}
    >
      <FileContext.Provider
        value={{
          fileSelected,
          setFileSelected,
          awareness,
          setAwareness,
          fileTree,
          setFileTree,
        }}
      >
        {children}
      </FileContext.Provider>
    </SettingsContext.Provider>
  );
}
