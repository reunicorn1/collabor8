import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileTree from '../FileTree/FileTree';
import { File } from '../FileTree/types';
import './Dashboard.css';

interface DashboardProps {
  userId: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userId }) => {
  const [projects, setProjects] = useState<File[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/users/${userId}/projects`,
        );
        setProjects(response.data.projects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, [userId]);

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  return (
    <div className="dashboard-container">
      <div className="projects-sidebar">
        <h2>Projects</h2>
        <ul className="projects-list">
          {projects.map((project) => (
            <li
              key={project.file_id}
              className={`project-item ${project.file_id === selectedProjectId ? 'selected' : ''}`}
              onClick={() => handleProjectSelect(project.file_id)}
            >
              {project.file_name}{' '}
            </li>
          ))}
        </ul>
      </div>
      <div className="file-tree-container">
        {selectedProjectId ? (
          <FileTree projectId={selectedProjectId} />
        ) : (
          <div className="placeholder">Select a project to view files</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
