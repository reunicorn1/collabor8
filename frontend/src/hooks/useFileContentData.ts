import { useState } from 'react';
import axios from 'axios';

const useFileContentData = () => {
  const [error, setError] = useState<string | null>(null);

  const fetchFileContent = async (projectId: string, fileId: string) => {
    try {
      const response = await axios.get<{
        file_name: string;
        file_content: string;
      }>(`http://localhost:3000/api/v1/projects/${projectId}/files/${fileId}`);
      return response.data;
    } catch (err) {
      setError('Error fetching file content.');
      throw err;
    }
  };

  return { fetchFileContent, error };
};

export default useFileContentData;
