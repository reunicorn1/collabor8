import React, { useState, useEffect } from 'react';
import CodeEditor from '../CodeEditor/CodeEditor';
import useFileTreeData from '../../hooks/useFileTreeData';
import useFileContentData from '../../hooks/useFileContentData';
import FileTreeView from './FileTreeView';
import TabBar from './TabBar';
import './FileTree.css';

interface FileTreeProps {
  projectId: string;
}

interface Tab {
  id: string;
  name: string;
  content: string;
}

const FileTree: React.FC<FileTreeProps> = ({ projectId }) => {
  const { fileTree, loading, error } = useFileTreeData(projectId);
  const { fetchFileContent } = useFileContentData();
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      // clear tabs when the project changes
      setTabs([]);
      setActiveTabId(null);
    }
  }, [projectId]);

  const handleFileClick = async (fileId: string) => {
    const existingTab = tabs.find((tab) => tab.id === fileId);
    if (existingTab) {
      setActiveTabId(fileId);
      return;
    }

    try {
      const { file_name, file_content } = await fetchFileContent(
        projectId,
        fileId,
      );
      setTabs((prevTabs) => [
        ...prevTabs,
        { id: fileId, name: file_name, content: file_content },
      ]);
      setActiveTabId(fileId);
    } catch (error) {
      console.error('Error fetching file content:', error);
    }
  };

  const handleCloseTab = (tabId: string) => {
    setTabs((prevTabs) => {
      const newTabs = prevTabs.filter((tab) => tab.id !== tabId);
      if (activeTabId === tabId && newTabs.length > 0) {
        setActiveTabId(newTabs[0].id);
      } else if (newTabs.length === 0) {
        setActiveTabId(null);
      }
      return newTabs;
    });
  };

  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
  };

  return (
    <div className="file-tree-container">
      {error && <div className="error">{error}</div>}
      <FileTreeView
        fileTree={fileTree}
        loading={loading}
        onFileClick={handleFileClick}
      />
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onTabClick={handleTabClick}
        onTabClose={handleCloseTab}
      />
      {activeTabId && <CodeEditor projectId={projectId} fileId={activeTabId} />}
    </div>
  );
};

export default FileTree;
