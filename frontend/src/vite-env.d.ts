/// <reference types="vite/client" />

declare module 'y-codemirror' {
  import { Text } from 'yjs';
  import { Editor } from 'codemirror';
  import { Awareness } from 'y-websocket';

  export class CodemirrorBinding {
    constructor(
      yText: Text,
      editor: Editor,
      awareness: Awareness,
      options?: {
        yUndoManager?: any;
      },
    );

    destroy(): void;
  }
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
