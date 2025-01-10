import React, { useState, useEffect } from 'react';
import { db, auth } from "../firebaseConfig";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import defaultUserIcon from '../assets/defaultUserIcon.png';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [isPublic, setIsPublic] = useState(false); // State for doctor profile visibility
  const [adoptedAnimals, setAdoptedAnimals] = useState([]);
  const [helpedAnimals, setHelpedAnimals] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUser(userData);

          // If user is a doctor, set the isPublic state
          if (userData.userType === 'doctor') {
            setIsPublic(userData.isPublic || false);
          }
        }

        const fetchAnimalData = async (animalId) => {
          const animalRef = doc(db, "animals", animalId);
          const animalSnap = await getDoc(animalRef);
          return animalSnap.exists() ? animalSnap.data() : null;
        };

        const adoptionsRef = collection(db, "users", currentUser.uid, "adoptions");
        const adoptionSnapshot = await getDocs(adoptionsRef);
        const adoptedList = await Promise.all(
          adoptionSnapshot.docs.map(async (doc) => {
            const animalData = await fetchAnimalData(doc.data().animalId);
            return { id: doc.id, ...animalData };
          })
        );
        setAdoptedAnimals(adoptedList.filter((animal) => animal));

        const helpedRef = collection(db, "users", currentUser.uid, "helped");
        const helpedSnapshot = await getDocs(helpedRef);
        const helpedList = await Promise.all(
          helpedSnapshot.docs.map(async (doc) => {
            const animalData = await fetchAnimalData(doc.data().animalId);
            return { id: doc.id, ...animalData };
          })
        );
        setHelpedAnimals(helpedList.filter((animal) => animal));
      }
    };

    fetchUserData();
  }, []);

  // Function to handle the checkbox change
  const handlePublicProfileChange = async () => {
    const newIsPublic = !isPublic;
    setIsPublic(newIsPublic);

    if (user && user.userType === 'doctor') {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, { isPublic: newIsPublic });
    }
  };

  return (
    <div className="container mx-auto p-4">
      {user ? (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6 flex items-center">
          <img
            src={user.profileImageUrl || defaultUserIcon}
            alt={user.name || "User"}
            className="w-32 h-32 rounded-full object-cover mr-6"
          />
          <div className="text-left">
            <h1 className="text-2xl font-bold text-black">{user.name || "Anonymous User"}</h1>
            <p className="text-gray-700">{user.email}</p>
            <p className="text-gray-700">{user.mobileNumber || "No mobile number available"}</p>

            {user.userType === 'doctor' && (
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={handlePublicProfileChange}
                    className="mr-2"
                  />
                  Show profile in public
                </label>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>Loading user information...</p>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-purple-700 mb-4">Adopted Animals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {adoptedAnimals.length > 0 ? (
            adoptedAnimals.map((animal) => (
              <div key={animal.id} className="relative bg-white shadow-lg rounded-lg p-4">
                <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
                  Adopted
                </span>
                <img
                  src={animal.imageUrl || defaultUserIcon}
                  alt={animal.name || "Animal"}
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
                <h3 className="text-lg font-semibold text-gray-800">{animal.name || "Unnamed Animal"}</h3>
                <p className="text-gray-600">{animal.info || "No description available"}</p>
              </div>
            ))
          ) : (
            <p>No adopted animals found.</p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-purple-700 mb-4">Helped Animals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {helpedAnimals.length > 0 ? (
            helpedAnimals.map((animal) => (
              <div key={animal.id} className="relative bg-white shadow-lg rounded-lg p-4">
                <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
                  Helped
                </span>
                <img
                  src={animal.imageUrl || defaultUserIcon}
                  alt={animal.name || "Animal"}
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
                <h3 className="text-lg font-semibold text-gray-800">{animal.name || "Unnamed Animal"}</h3>
                <p className="text-gray-600">{animal.info || "No description available"}</p>
              </div>
            ))
          ) : (
            <p>No helped animals found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
