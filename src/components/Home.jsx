import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const Home = () => {
  const [animals, setAnimals] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch animals data from Firestore
  useEffect(() => {
    const fetchAnimals = async () => {
      const animalCollection = collection(db, "animals");
      const animalSnapshot = await getDocs(animalCollection);
      // Filter animals open for adoption or needing help
      const availableAnimals = animalSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((animal) => animal.status === "Open for Adoption" || animal.status === "Injured");
      setAnimals(availableAnimals.slice(0, 6)); // Display only the first 6 available animals
    };
    fetchAnimals();
  }, []);

  // Check user authentication status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  // Handle animal image click
  const handleAnimalClick = () => {
    if (user) {
      navigate('/animallist');
    } else {
      navigate('/signin');
    }
  };

  return (
    <div className="mx-10 p-4">
      {/* Welcome Section */}
      <section className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-purple-700 mb-4">Welcome to PetPals</h1>
        <p className="text-xl text-gray-700 mb-4">
          Our mission is to connect loving homes with animals in need. Whether you're looking to adopt a pet or need assistance in helping an injured street animal, we’re here to support you. Browse through animals ready for adoption and help make a difference by providing them with a safe and caring environment.
        </p>
        <p className="text-xl text-gray-700">
          Join us in our goal to make a positive impact on street animal's lives. Explore available pets or find resources for animal care!
        </p>
      </section>

      {/* Animals Available Section */}
      <section className='mt-14'>
        <h2 className="text-3xl font-bold text-purple-600 mb-10">Animals Available for Adoption</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {animals.map((animal) => (
            <div 
              key={animal.id} 
              className="bg-white shadow-md rounded-lg overflow-hidden border border-purple-200 cursor-pointer"
              onClick={handleAnimalClick}
            >
              <img
                src={animal.imageUrl}
                alt={animal.description}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-purple-700">{animal.name}</h3>
                <p className="text-gray-600 mb-2">{animal.description}</p>
                <p className="text-gray-500">Location: {animal.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
