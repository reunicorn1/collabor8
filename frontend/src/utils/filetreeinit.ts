import * as Y from 'yjs';
import { YMapValueType } from '../context/EditorContext';

// This function creates a filetree metadata, if the database has already saved a session
// related to this room before, the filetree will be overwritten with whatever is in the server

export default function createfiletree(root: Y.Map<YMapValueType>) {
  if (!root.get('filetree')) {
    const rootnode = {
      type: 'dir',
      id: '0',
      directory_name: 'root',
      children: [],
    };
    root.set('filetree', rootnode); // hopeless type error
    console.log('A file tree stucture as metadata is created');
  } else {
    console.log('This is a loaded project, file tree is already provided');
    console.log(JSON.stringify(root.get('filetree')));
  }
}
