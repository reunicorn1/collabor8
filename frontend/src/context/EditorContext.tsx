/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext, useState, ReactNode, useContext } from 'react';
import * as Y from 'yjs';

type YMapValueType = Y.Text | null | Y.Map<YMapValueType>;
type Theme = string;
type Language = string;
interface Awareness {
  [key: string]: object;
}

// Update SettingsContextType to include the proper types
interface SettingsContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (language: Language) => void;
}

// Update FileContextType to include the proper types
interface FileContextType {
  fileSelected: YMapValueType;
  setFileSelected: (file: YMapValueType) => void;
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
  const [fileSelected, setFileSelected] = useState<YMapValueType>(null);
  const [awareness, setAwareness] = useState<Awareness>({});
  const [fileTree, setFileTree] = useState<Y.Map<YMapValueType> | null>(null);

  return (
    <SettingsContext.Provider
      value={{ theme, setTheme, language, setLanguage }}
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
