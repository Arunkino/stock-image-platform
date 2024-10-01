import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import { checkAuthStatus } from './features/auth/authSlice'; 
import { LoadingSpinner } from './components/LoadingSpinner';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Footer from './components/Footer';

const PrivateRoute = ({ children }) => {
  const { token, isLoading } = useSelector((state) => state.auth);
  
  if (isLoading) {
    return <LoadingSpinner/>;
  }
  
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <Router>
      <div>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;