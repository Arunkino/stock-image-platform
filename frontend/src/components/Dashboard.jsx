import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import ImageUpload from './ImageUpload';
import ImageGallery from './ImageGallery';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Welcome, {user?.username}!</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-8"
        >
          Logout
        </button>
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Upload Images</h2>
          <ImageUpload />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Image Gallery</h2>
          <ImageGallery />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;