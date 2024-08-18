import { useState, useEffect } from 'react';
import axios from 'axios';
import { Project, File, Directory } from '../components/FileTree/types';

const useFileTreeData = (projectId: string) => {
  const [fileTree, setFileTree] = useState<(File | Directory)[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFileTree = async () => {
      setLoading(true);
      try {
        const response = await axios.get<Project>(
          `http://localhost:3000/api/v1/projects/${projectId}`,
        );
        setFileTree(response.data.children);
      } catch (err) {
        setError('Error fetching file tree.');
      } finally {
        setLoading(false);
      }
    };

    fetchFileTree();
  }, [projectId]);

  return { fileTree, loading, error };
};

export default useFileTreeData;
