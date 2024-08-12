import React from 'react';

interface Tab {
  id: string;
  name: string;
}

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string | null;
  onTabClick: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
}

const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTabId,
  onTabClick,
  onTabClose,
}) => (
  <div className="tabs-container">
    {tabs.map((tab) => (
      <div key={tab.id} className="tab">
        <button
          className={`tab-button ${activeTabId === tab.id ? 'active' : ''}`}
          onClick={() => onTabClick(tab.id)}
        >
          {tab.name}
        </button>
        <button className="tab-close-button" onClick={() => onTabClose(tab.id)}>
          &times;
        </button>
      </div>
    ))}
  </div>
);

export default TabBar;
