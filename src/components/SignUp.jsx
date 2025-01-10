// src/components/SignUp.jsx
import React, { useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [city, setCity] = useState('');
  const [userType, setUserType] = useState('normal');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 6;
  const validateMobileNumber = (mobileNumber) => /^[0-9]{10}$/.test(mobileNumber);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (name.trim() === '') {
      setError('Please enter your name.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password should be at least 6 characters.');
      return;
    }
    if (!validateMobileNumber(mobileNumber)) {
      setError('Mobile number should be exactly 10 digits.');
      return;
    }
    if (city.trim() === '') {
      setError('Please enter your city.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user data to Firestore with default isPublic value set to false for doctors
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name,
        email,
        mobileNumber,
        city,
        userType,
        isPublic: userType === 'doctor' ? false : null, // Only relevant for doctors
      });

      setSuccessMessage('User registered successfully!');
      
      // Clear the form fields
      setName('');
      setEmail('');
      setPassword('');
      setMobileNumber('');
      setCity('');
      setUserType('normal');

      // Navigate to a different page after successful sign-up if needed
      navigate('/');  // Replace '/' with your desired route
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">Sign Up</h2>
      
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {successMessage && <p className="text-green-500 text-sm mb-2">{successMessage}</p>}

      <form onSubmit={handleSignUp} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="tel"
          placeholder="Mobile Number (10 digits)"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <select
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        >
          <option value="normal">Normal Person</option>
          <option value="doctor">Animal Doctor</option>
        </select>
        <button type="submit" className="w-full py-2 bg-purple-700 text-white rounded hover:bg-purple-800">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
