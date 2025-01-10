import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebaseConfig';
import Navbar from './components/Navbar';
import Home from './components/Home';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import AnimalList from './components/AnimalList';
import UploadAnimal from './components/UploadAnimal';
import UserProfile from './components/UserProfile';
import './App.css';
import './index.css';
import DoctorSearch from './components/DoctorSearchPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Set loading to false once the auth state is determined
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // A wrapper for protected routes that checks if the user is authenticated
  const ProtectedRoute = ({ children }) => {
    if (loading) return <div>Loading...</div>; // Optionally show a loader while checking auth state
    return user ? children : <Navigate to="/signin" />;
  };

  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/animallist" element={<AnimalList />} />
        <Route path="/doctorSearch" element={<DoctorSearch />} />

        {/* Protected Routes */}
        <Route 
          path="/upload" 
          element={
            <ProtectedRoute>
              <UploadAnimal user={user} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <UserProfile user={user} />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
