import React, { useState } from 'react';
import { File, Directory } from './types';
import './FileTree.css';

interface EntryProps {
  entry: File | Directory;
  depth: number;
  onFileClick: (fileId: string) => void;
}

const Entry: React.FC<EntryProps> = ({ entry, depth, onFileClick }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <>
      <button
        className="entry-button"
        onClick={() => {
          if ('directory_name' in entry) {
            setIsExpanded((prev) => !prev);
          } else if ('file_content' in entry) {
            onFileClick(entry.file_id);
          }
        }}
        style={{ paddingLeft: `${depth * 20}px` }}
      >
        {'directory_name' in entry && (
          <div className="toggle-icon">{isExpanded ? '-' : '+'}</div>
        )}
        <span className="name">
          {'directory_name' in entry ? entry.directory_name : entry.file_name}
        </span>
      </button>
      {'directory_name' in entry && isExpanded && (
        <div className="directory-children">
          {entry.children?.map((child) => (
            <Entry
              key={child.file_content || child.directory_name}
              entry={child}
              depth={depth + 1}
              onFileClick={onFileClick}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Entry;
