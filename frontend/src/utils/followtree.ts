import * as Y from 'yjs';
import { YMapValueType } from '../context/EditorContext';

interface ProjectNode {
  id: number;
  type: 'file' | 'dir';
  file_name?: string;
  directory_name?: string;
  project_id: string;
  parent: number;
  children?: ProjectNode[];
}

interface Project {
  projectId: string;
  id: number;
  children: ProjectNode[];
}

export function getPathFromId(
  project: Project, // This is filetree object
  targetId: number, // The file id selected
): string[] | null {
  function findNodePath(
    node: ProjectNode,
    id: number,
    path: string[],
  ): string[] | null {
    // Check if current node is the target node
    if (node.id === id) {
      return path;
    }

    // If it's a directory, recursively search its children
    if (node.type === 'dir' && node.children) {
      for (const child of node.children) {
        const childPath = findNodePath(child, id, [
          ...path,
          node.directory_name || '',
        ]);
        if (childPath) {
          return childPath;
        }
      }
    }

    return null;
  }

  // Start the search from the root
  for (const child of project.children) {
    const fullPath = findNodePath(child, targetId, []);
    if (fullPath) {
      return fullPath;
    }
  }

  return null; // If the ID is not found
}

// use previous function to get fullpath which is a string full of ids
export function createFileDir(
  fullPath: string[],
  root: YMapValueType,
  _id: string,
  filedir: string,
) {
  // using the root y.maps will be created until the file is reached
  // Data stored in the fullpath consist of ids which is used to index files
  let fileroot = root;
  for (const path of fullPath) {
    if (!(fileroot instanceof Y.Map)) {
      console.error('Invalid map structure encountered.');
      return;
    }
    const subdir = fileroot.get(path); // Subdirectory which is a y.map
    if (!(subdir instanceof Y.Map)) {
      console.error(`Subdirectory "${path}" is missing or not a Y.Map.`);
      return;
    }
    fileroot = subdir;
  }
  if (!fileroot || !(fileroot instanceof Y.Map)) return; // double check for eslint tho un-necessary
  const newfile = filedir === 'file' ? new Y.Text() : new Y.Map();
  fileroot.set(_id, newfile); // type error hopeless
}

// To adjust the sturcture of the filetree and add a leaf at the end of whether a file or a dir use addleaf methods.
// use the last value of the path as the parent id
