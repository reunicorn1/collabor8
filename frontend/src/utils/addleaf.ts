interface FileNode {
  type: 'file';
  id: string;
  name: string;
}

interface DirectoryNode {
  type: 'directory';
  id: string;
  name: string;
  children?: (FileNode | DirectoryNode)[];
}

type TreeNode = FileNode | DirectoryNode;

export function addLeaf(
  tree: TreeNode,
  newFile: FileNode,
  parentId: string, // ID of the directory where the new file should be added taken from the last value of fullPath or directly
): TreeNode {
  console.log('addleaf', tree, newFile, parentId);
  // Helper function to traverse and find the parent node
  function findDirectoryNode(
    node: TreeNode,
    targetId: string,
  ): DirectoryNode | null {
    console.log('findDirectoryNode method', node, targetId);
    if (node.type !== 'file' && node.id === targetId) {
      return node as DirectoryNode;
    }

    if (node.type !== 'file' && node.children) {
      for (const child of node.children) {
        const found = findDirectoryNode(child, targetId);
        if (found) return found;
      }
    }

    return null;
  }

  // Find the target directory to add the new file
  const targetDirectory = findDirectoryNode(tree, parentId);

  if (targetDirectory) {
    if (!targetDirectory.children) {
      targetDirectory.children = [];
    }
    targetDirectory.children.push(newFile);
    console.log('A new leaf has been added');
  } else {
    console.error('Target directory not found.');
  }

  return tree;
}

// Note: before adding an element to the tree, the new node object should be created and passed as an argument
// addleaf is only used with a fresh brand new file that isn't found in the filetree used for traversing.

export function createLeaf(
  filedir: string,
  id: string,
  name: string,
  parent: string,
) {
  if (filedir === 'file') {
    return {
      type: 'file',
      id,
      name,
      parent,
    } as FileNode;
  } else {
    return {
      type: 'directory',
      id,
      name,
      parent,
      children: [],
    } as DirectoryNode;
  }
}
