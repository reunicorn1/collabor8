import * as Y from 'yjs';
import { YMapValueType } from '../context/EditorContext';

interface ProjectNode {
  type: 'directory';
  id: string;
  name: string;
  children: [];
}

interface Project {
  projectId: string;
  id: number;
  children: ProjectNode[];
}

export function getPathFromId(
  project: Project, // This is filetree object
  targetId: string, // The file id selected
): string[] | null {
  function findNodePath(
    node: ProjectNode,
    id: string,
    path: string[],
  ): string[] | null {
    // Check if current node is the target node
    if (node.id === id) {
      return path;
    }

    // If it's a directory, recursively search its children
    if (node.type === 'directory' && node.children) {
      for (const child of node.children) {
        const childPath = findNodePath(child, id, [...path, node.id || '']);
        if (childPath) {
          return childPath;
        }
      }
    }

    return null;
  }

  // Start the search from the root
  for (const child of project.children) {
    const fullPath = findNodePath(child, targetId, []); // I'll be creating a list of ids which creates the path
    if (fullPath) {
      return fullPath;
    }
  }

  return []; // If the ID is not found
}

// use previous function to get fullpath which is a string full of ids
// this function works only when I want to click a file that's already found in the tree
type P = {
  fullPath: string[];
  parent: string;
  root: YMapValueType;
  _id: string;
  filedir: string;
  newName: string;
};
export function createFileDir({
  fullPath,
  parent,
  root,
  _id,
  filedir,
  newName,
}: P) {
  // using the root y.maps will be created until the file is reached
  // Data stored in the fullpath consist of ids which is used to index files
  let fileroot = root;

  for (const path of fullPath) {
    if (!(fileroot instanceof Y.Map)) {
      console.error('Invalid map structure encountered.'); // This is happens if the main root wasn't y.map
      return;
    }
    let subdir = fileroot.get(path); // Subdirectory which is a y.map
    if (!subdir) {
      subdir = new Y.Map(); // If not found then build the path and create it
      // for every new creation add metadata
      const metadata = {
        id: _id,
        type: filedir,
        new: true,
        name: newName,
        parent_id: parent,
      };
      fileroot.set(`${path}_metadata`, metadata); // Type Error
      fileroot.set(path, subdir);
    }
    fileroot = subdir;
  }
  if (!fileroot || !(fileroot instanceof Y.Map)) return; // double check for eslint tho un-necessary
  let newfile = fileroot.get(_id);
  if (!newfile) {
    console.log(
      'The file you just clicked was created freshly and is not in the yjs object',
    );
    newfile = filedir === 'file' ? new Y.Text() : new Y.Map();
    // Add metadata for every new creation
    const metadata = {
      id: _id,
      type: filedir,
      new: true,
      name: newName,
      parent_id: parent,
    };
    fileroot.set(`${_id}_metadata`, metadata); // Type Error
    fileroot.set(_id, newfile);
  } else {
    console.log('file is already found in the ymap');
  }
  return newfile;
}

// To adjust the sturcture of the filetree and add a leaf at the end of whether a file or a dir use addleaf methods.
// use the last value of the path as the parent id
