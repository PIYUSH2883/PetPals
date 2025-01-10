import React, { useState, useEffect } from 'react';
import { db, auth } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const DoctorSearch = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [publicDoctors, setPublicDoctors] = useState([]);
  const [searchCity, setSearchCity] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchPublicDoctors = async () => {
      try {
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(usersRef);

        const doctorsList = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.userType === 'doctor' && data.isPublic) {
            doctorsList.push(data);
          }
        });

        setPublicDoctors(doctorsList);
        setFilteredDoctors(doctorsList);
      } catch (error) {
        console.error("Error fetching public doctors:", error);
      }
    };

    fetchPublicDoctors();
  }, []);

  const handleSearch = () => {
    const filtered = publicDoctors.filter((doctor) =>
      doctor.city?.toLowerCase().includes(searchCity.toLowerCase())
    );
    setFilteredDoctors(filtered);
  };

  if (!isAuthenticated) {
    return <p>Please log in to search for doctors.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-purple-700 mb-6">Search for Public Doctors</h2>

      <div className="mb-4 flex">
        <input
          type="text"
          placeholder="Enter city name"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          className="p-2 border border-gray-300 rounded-l-md flex-grow"
        />
        <button
          onClick={handleSearch}
          className="bg-purple-700 text-white p-2 rounded-r-md hover:bg-purple-600"
        >
          Search
        </button>
      </div>

      {filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-2xl transition-shadow duration-300"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{doctor.name}</h3>
              
              <div className="flex items-center mb-2">
                <svg
                  className="w-5 h-5 text-purple-500 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 2C8.134 2 5 5.134 5 9c0 1.486.398 2.878 1.093 4.098C7.973 16.028 10.606 21 12 21s4.027-4.972 5.907-7.902A6.971 6.971 0 0019 9c0-3.866-3.134-7-7-7z"
                  />
                  <circle cx="12" cy="9" r="2" />
                </svg>
                <p className="text-gray-600">{doctor.city || "City not available"}</p>
              </div>

              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-purple-500 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 00-2 2v10a2 2 0 002 2h18a2 2 0 002-2V7a2 2 0 00-2-2H3zm18 2l-8.5 5L4 7"
                  />
                </svg>
                <p className="text-gray-600">{doctor.mobileNumber || "No contact number"}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No doctors found for the specified city.</p>
      )}
    </div>
  );
};

export default DoctorSearch;
