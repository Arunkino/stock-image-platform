import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import ImageUpload from './ImageUpload';
import ImageGallery from './ImageGallery';
import { LogOut, Upload, Image } from 'lucide-react';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-3xl font-bold text-gray-900">Image Gallery</h1>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">Welcome, {user?.username}!</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-800">
              <Upload className="mr-2 h-6 w-6 text-indigo-600" />
              Upload Images
            </h2>
            <div className="bg-white shadow-md rounded-lg p-6">
              <ImageUpload />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-800">
              <Image className="mr-2 h-6 w-6 text-indigo-600" />
              Image Gallery
            </h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className=" overflow-y-auto">
                <ImageGallery />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;