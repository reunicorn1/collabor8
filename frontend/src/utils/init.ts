import * as Y from 'yjs';
import { YMapValueType } from '../context/EditorContext';

// This function initilizes the project by using a y.doc and then checking
// if it has filetree in the y.map. This function is used in the codeeditor component
// after making sure that the component renders and connects successfully with the provider

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
  }
}
