import * as Y from 'yjs';
import { DirectoryNode, FileNode } from './addleaf';

type Node = DirectoryNode | FileNode;
type P = {
  parent: string;
  root: any;
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

export function findNode(node: Node, id: string): Node | null {
  // Check if current node is the target node
  if (node.id === id) {
    return node;
  }

  // If it's a directory, recursively search its children
  if (node.type !== 'file' && node.children) {
    for (const child of node.children) {
      const childFound = findNode(child, id);
      if (childFound) {
        return childFound;
      }
    }
  }

  return null;
}

export function deleteNode(root: Node, id: string): Node | null {
  console.log('root', root.id, 'myid', id);
  if (root.id === id) {
    return null;
  }

  // If it's a directory, recursively search its children
  if (root.type !== 'file' && root.children) {
    root.children = root.children
      .map((child) => deleteNode(child, id))
      .filter((child) => child !== null) as Node[]; // This filters the children list
  }
  return root; // Return the root node if it's not deleted
}
