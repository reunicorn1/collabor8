import { useContext } from 'react';
import * as Y from 'yjs';
import { YjsContext } from '../context/YjsContext';

export const useYjs = (): Y.Doc => {
  const context = useContext(YjsContext);
  if (context === null) {
    throw new Error('useYjs must be used within a YjsProvider');
  }
  return context;
};
