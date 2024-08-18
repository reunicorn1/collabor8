import React, { useState, useEffect, useContext } from 'react';
import CodeEditor from '../CodeEditor/CodeEditor';
import useFileTreeData from '../../hooks/useFileTreeData';
import useFileContentData from '../../hooks/useFileContentData';
import FileTreeView from './FileTreeView';
import { useFile } from '../../context/EditorContext';
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

const FileTree: React.FC<FileTreeProps> = () => {
  // const { fileTree, loading, error } = useFileTreeData(projectId);
  // const { fetchFileContent } = useFileContentData();
  const { fileSelected, setFileSelected, filetree } = useFile();
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  // useEffect(() => {
  //   if (projectId) {
  //     // clear tabs when the project changes
  //     setTabs([]);
  //     setActiveTabId(null);
  //   }
  // }, [projectId]);

  const handleFileClick = async (fileId: string) => {
    // For now remove tabs
    const existingTab = tabs.find((tab) => tab.id === fileId);
    if (existingTab) {
      setActiveTabId(fileId);
      return;
    }
    // TODO create a method to retrieve the ytext of the selected file and then this file content
    // Will be sent to the editor to be bound
  };

  // const handleCloseTab = (tabId: string) => {
  //   setTabs((prevTabs) => {
  //     const newTabs = prevTabs.filter((tab) => tab.id !== tabId);
  //     if (activeTabId === tabId && newTabs.length > 0) {
  //       setActiveTabId(newTabs[0].id);
  //     } else if (newTabs.length === 0) {
  //       setActiveTabId(null);
  //     }
  //     return newTabs;
  //   });
  // };

  // const handleTabClick = (tabId: string) => {
  //   setActiveTabId(tabId);
  // };

  return (
    <div className="file-tree-container">
      {/* {error && <div className="error">{error}</div>} */}
      {fileTree && (
        <FileTreeView
          fileTree={fileTree}
          loading={loading}
          onFileClick={handleFileClick}
        />
      )}
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        // onTabClick={handleTabClick}
        // onTabClose={handleCloseTab}
      />
    </div>
  );
};

export default FileTree;
