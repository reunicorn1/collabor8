import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { File } from './types';
import CodeEditor from '../CodeEditor/CodeEditor';

interface FileTreeProps {
  projectId: string;
}

const FileTree: React.FC<FileTreeProps> = ({ projectId }) => {
  const [fileTree, setFileTree] = useState<File[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);

  useEffect(() => {
    const fetchFileTree = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/projects/${projectId}`,
        );
        const project = response.data;

        const flattenFiles = (nodes: File[]): File[] => {
          let files: File[] = [];
          nodes.forEach((node) => {
            if (node.type === 'file') {
              files.push(node);
            } else if (node.type === 'directory') {
              files = files.concat(flattenFiles(node.children || []));
            }
          });
          return files;
        };

        const files = flattenFiles(project.directories.concat(project.files));
        setFileTree(files);
      } catch (error) {
        console.error('Error fetching file tree:', error);
      }
    };

    fetchFileTree();
  }, [projectId]);

  useEffect(() => {
    if (selectedFileId) {
      const fetchFileContent = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/v1/projects/${projectId}/files/${selectedFileId}`,
          );
          setFileContent(response.data.file_content);
        } catch (error) {
          console.error('Error fetching file content:', error);
        }
      };

      fetchFileContent();
    }
  }, [selectedFileId, projectId]);

  const handleFileClick = (fileId: string) => {
    setSelectedFileId(fileId);
  };

  return (
    <div className="file-tree-container">
      <div className="file-tree">
        {fileTree.map((file) => (
          <div
            key={file.file_id}
            className="file-item"
            onClick={() => handleFileClick(file.file_id)}
          >
            {file.file_name}
          </div>
        ))}
      </div>
      {selectedFileId && fileContent && (
        <div className="code-editor">
          <CodeEditor fileContent={fileContent} />
        </div>
      )}
    </div>
  );
};

export default FileTree;
