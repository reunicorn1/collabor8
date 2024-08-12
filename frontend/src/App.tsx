import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard/Dashboard';
import axios from 'axios';

const App: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/api/v1/users/123e4567-e89b-12d3-a456-426614174000',
        );
        setUserId(response.data.user_id);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserId();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userId) {
    return <div>Error loading user data</div>;
  }

  return <Dashboard userId={userId} />;
};

export default App;
