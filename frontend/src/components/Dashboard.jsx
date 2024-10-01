import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import ImageUpload from './ImageUpload';
import { fetchImages } from '../features/images/imageSlice';

const Dashboard = () => {

    
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    const images = dispatch(fetchImages());
    console.log(images);
})
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Welcome, {user?.username}!</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
        {/* Add more dashboard content here */}
      </div>
      <div>
        <ImageUpload/>
      </div>
    </div>
  );
};

export default Dashboard;