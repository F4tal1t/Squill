import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BrutalDashboard from '../components/BrutalDashboard';

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/');
  };

  return <BrutalDashboard onLogout={handleLogout} />;
}