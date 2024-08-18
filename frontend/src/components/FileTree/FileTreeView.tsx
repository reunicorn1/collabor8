import React from 'react';
import { File, Directory } from './types';
import Entry from './Entry';
import Spinner from '../../utils/Spinner';

interface FileTreeViewProps {
  fileTree: (File | Directory)[];
  loading: boolean;
  onFileClick: (fileId: string) => void;
}

const FileTreeView: React.FC<FileTreeViewProps> = ({
  fileTree,
  loading,
  onFileClick,
}) => (
  <div className="file-tree">
    {loading ? (
      <Spinner />
    ) : (
      fileTree.map((node) => (
        <Entry
          key={node.file_content || node.directory_name}
          entry={node}
          depth={1}
          onFileClick={onFileClick}
        />
      ))
    )}
  </div>
);

export default FileTreeView;
