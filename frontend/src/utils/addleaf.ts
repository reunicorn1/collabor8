interface FileNode {
  type: 'file';
  id: string;
  file_name: string;
}

interface DirectoryNode {
  type: 'dir';
  id: string;
  directory_name: string;
  children?: (FileNode | DirectoryNode)[];
}

type TreeNode = FileNode | DirectoryNode;

export function addLeaf(
  tree: TreeNode,
  newFile: FileNode,
  parentId: string, // ID of the directory where the new file should be added taken from the last value of fullPath or directly
): TreeNode {
  // Helper function to traverse and find the parent node
  function findDirectoryNode(
    node: TreeNode,
    targetId: string,
  ): DirectoryNode | null {
    console.log('addleaf', node, targetId);
    if (node.type === 'dir' && node.id === targetId) {
      return node as DirectoryNode;
    }

    if (node.type === 'dir' && node.children) {
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

export function createLeaf(filedir: string, id: string, file_name: string) {
  if (filedir === 'file') {
    return {
      type: 'file',
      id,
      file_name,
    } as FileNode;
  } else {
    return {
      type: 'dir',
      id,
      directory_name: file_name,
      children: [],
    } as DirectoryNode;
  }
}
