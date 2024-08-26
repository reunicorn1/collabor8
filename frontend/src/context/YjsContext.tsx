import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as Y from 'yjs';

// context for the Yjs document
export const YjsContext = createContext<Y.Doc | null>(null);

interface YjsProviderProps {
  children: ReactNode;
}

export const YjsProvider: React.FC<YjsProviderProps> = ({ children }) => {
  const [doc, setDoc] = useState(new Y.Doc());

  useEffect(() => {
    const ydoc = new Y.Doc();
    setDoc(ydoc);

    return () => {
      ydoc.destroy();
    };
  }, []);

  return <YjsContext.Provider value={doc}>{children}</YjsContext.Provider>;
};
