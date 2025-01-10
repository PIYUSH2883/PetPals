import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { FaUserCircle, FaBars } from 'react-icons/fa';

const Navbar = ({ user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate('/');
      setIsDropdownOpen(false);
    });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleSearchClick = () => {
    navigate('/doctorSearch');
  };

  return (
    <nav className="bg-purple-700 p-4 text-white w-full">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold">
          <Link to="/">PetPals</Link>
        </h1>

        {/* Desktop Navigation Links */}
        <div className="hidden sm:flex items-center space-x-8">
          {!user ? (
            <>
              <Link to="/" className="hover:text-purple-200">Home</Link>
              <Link to="/signin" className="hover:text-purple-200">Sign In</Link>
              <Link to="/signup" className="hover:text-purple-200">Sign Up</Link>
            </>
          ) : (
            <>
              <button 
                onClick={handleSearchClick} 
                className="hover:text-purple-200 focus:outline-none"
              >
                Search Doctor
              </button>
              <Link to="/animallist" className="hover:text-purple-200">All Animals</Link>
              <Link to="/upload" className="hover:text-purple-200">Add Animal</Link>
              <div className="relative">
                <button onClick={toggleDropdown} className="focus:outline-none">
                  <FaUserCircle size={28} />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white text-purple-700 shadow-md rounded-md overflow-hidden">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 hover:bg-purple-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="block w-full px-4 py-2 hover:bg-purple-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMobileMenu}
          className="sm:hidden focus:outline-none"
        >
          <FaBars size={24} />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-purple-800 text-white w-full mt-2 space-y-1">
          {!user ? (
            <>
              <Link to="/signin" className="block px-4 py-2 hover:bg-purple-700">Sign In</Link>
              <Link to="/signup" className="block px-4 py-2 hover:bg-purple-700">Sign Up</Link>
            </>
          ) : (
            <>
              <Link to="/" className="block px-4 py-2 hover:bg-purple-700">Home</Link>
              <button 
                onClick={handleSearchClick} 
                className="block w-full px-4 py-2 hover:bg-purple-700 text-center"
              >
                Search Doctor
              </button>
              <Link to="/animallist" className="block px-4 py-2 hover:bg-purple-700">All Animals</Link>
              <Link to="/upload" className="block px-4 py-2 hover:bg-purple-700">Add Animal</Link>
              <Link to="/profile" className="block px-4 py-2 hover:bg-purple-700">Profile</Link>
              <button 
                onClick={handleLogout} 
                className="block w-full px-4 py-2 hover:bg-purple-700 text-center"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
