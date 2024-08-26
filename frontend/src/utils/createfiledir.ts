import * as Y from 'yjs';
import { YMapValueType } from '../context/EditorContext';

type P = {
  parent: string;
  root: YMapValueType;
  _id: string;
  filedir: string;
  newName: string;
};
export function createDocuments({
  parent, //parent to b used for the metadata
  root, // I'm creating files and directories as direct children of the root in the model structure
  _id, // id of the new file as key
  filedir, // string to differentiate files from dirs
  newName, // used in the metadata
}: P) {
  if (root instanceof Y.Map) {
    let newfile = root.get(_id);
    if (!newfile) {
      console.log(
        'The file you just clicked was created freshly and is not in the yjs object',
      );
      newfile = filedir === 'file' ? new Y.Text() : new Y.Map();
      console.log('id please have a value ============>', _id);
      const metadata = {
        id: _id,
        type: filedir,
        new: true,
        name: newName,
        parent_id: parent,
      };
      root.set(`${_id}_metadata`, metadata); // Type Error
      root.set(_id, newfile);
    } else {
      console.log('file is already found in the ymap');
    }
    return newfile;
  }
}
