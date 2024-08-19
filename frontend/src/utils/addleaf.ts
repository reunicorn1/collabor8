interface FileNode {
  type: 'file';
  id: number;
  file_name: string;
  project_id: string;
}

interface DirectoryNode {
  type: 'dir';
  id: number;
  directory_name: string;
  project_id: string;
  children?: (FileNode | DirectoryNode)[];
}

type TreeNode = FileNode | DirectoryNode;

export function addLeaf(
  tree: TreeNode,
  newFile: FileNode,
  parentId: number, // ID of the directory where the new file should be added taken from the last value of fullPath or directly
): TreeNode {
  // Helper function to traverse and find the parent node
  function findDirectoryNode(
    node: TreeNode,
    targetId: number,
  ): DirectoryNode | null {
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
  } else {
    console.error('Target directory not found.');
  }

  return tree;
}

// Note: before adding an element to the tree, the new node object should be created and passed as an argument
// addleaf is only used with a fresh brand new file that isn't found in the filetree used for traversing.
