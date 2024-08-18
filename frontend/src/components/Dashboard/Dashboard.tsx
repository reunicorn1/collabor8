import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Project } from '../FileTree/types';
import './Dashboard.css';
import Spinner from '../../utils/Spinner';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  userId: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userId }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  // const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
  //   null,
  // );
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/users/${userId}/projects`,
        );
        setProjects(response.data.projects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [userId]);

  const handleClick = (id: string) => {
    navigate(`/editor/${id}`);
  };

  return (
    <div className="dashboard-container">
      <div className="projects-sidebar">
        <h2>My Environment</h2>
        {loading ? (
          <Spinner />
        ) : (
          <ul className="projects-list">
            {projects.length > 0 ? (
              projects.map((project) => (
                <li
                  key={project.project_id}
                  className={`project-item`}
                  onClick={() => handleClick(project.project_id)}
                >
                  {project.project_name}
                </li>
              ))
            ) : (
              <div className="placeholder">No projects found</div>
            )}
          </ul>
        )}
      </div>
      <div className="file-tree-container">
        <div className="placeholder">Select a project to view files</div>
      </div>
    </div>
  );
};

export default Dashboard;
