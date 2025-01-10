import React, { useState, useEffect } from 'react';
import { db, auth } from "../firebaseConfig";
import { collection, getDocs, updateDoc, doc, addDoc } from "firebase/firestore";

const AnimalList = () => {
  const [animals, setAnimals] = useState([1]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [actionType, setActionType] = useState(""); // Track if action is "adopt" or "help"
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchAnimals = async () => {
      const animalCollection = collection(db, "animals");
      const animalSnapshot = await getDocs(animalCollection);
      // Filter animals open for adoption or needing help
      const availableAnimals = animalSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((animal) => animal.status === "Open for Adoption" || animal.status === "Injured");
      setAnimals(availableAnimals);
    };
    fetchAnimals();
  }, []);

  const handleAdoptClick = (animal) => {
    setSelectedAnimal(animal);
    setActionType("adopt");
    setShowConfirmation(true);
  };

  const handleHelpClick = (animal) => {
    setSelectedAnimal(animal);
    setActionType("help");
    setShowConfirmation(true);
  };

  const confirmAction = async () => {
    const currentUser = auth.currentUser;

    if (selectedAnimal && currentUser) {
      try {
        const animalRef = doc(db, "animals", selectedAnimal.id);
        const userActionsRef = collection(db, "users", currentUser.uid, actionType === "adopt" ? "adoptions" : "helped");

        // Update the animal's status to "Archived"
        await updateDoc(animalRef, { status: "Archived" });
        console.log("Animal status updated to 'Archived'");

        // Record only the animal's unique ID in the user's profile under the appropriate subcollection
        await addDoc(userActionsRef, {
          animalId: selectedAnimal.id, // Send only the unique ID
          actionDate: new Date(),
        });
        console.log("Animal ID recorded in user's profile");

        alert(`Success! Please visit ${selectedAnimal.location} to ${actionType === "adopt" ? "adopt" : "help"} ${selectedAnimal.name}.`);
        setShowConfirmation(false);

        // Remove actioned animal from the list
        setAnimals(animals.filter((animal) => animal.id !== selectedAnimal.id));
      } catch (error) {
        console.error("Error adding document:", error);
        alert("An error occurred. Please try again.");
      }
    } else {
      alert("Please sign in to proceed.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Animals Available for Adoption or Help</h1>
      {animals.length === 0 ? (
        <p className="text-center text-2xl text-gray-500">{animals.length>0?<b>Loading...</b>:<b>No animal to adopt</b>}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {animals.map((animal) => (
            <div key={animal.id} className="p-4 border rounded-lg shadow-md relative">
              <img
                src={animal.imageUrl}
                alt={animal.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h2 className="text-xl font-bold">{animal.name}</h2>
              <p><strong>Type:</strong> {animal.type}</p>
              <p><strong>Location:</strong> {animal.location}</p>
              <p><strong>Information:</strong> {animal.info}</p>
              <span
                className={`absolute top-2 right-2 px-2 py-1 rounded text-sm font-semibold ${
                  animal.status === "Open for Adoption" ? "bg-blue-500" : "bg-green-500"
                } text-white`}
              >
                {animal.status === "Open for Adoption" ? "Adopt" : "Help"}
              </span>
              {animal.status === "Open for Adoption" ? (
                <button
                  onClick={() => handleAdoptClick(animal)}
                  className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Want to Adopt
                </button>
              ) : (
                <button
                  onClick={() => handleHelpClick(animal)}
                  className="mt-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                >
                  Offer Help
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h3 className="text-lg font-bold mb-4">Confirm {actionType === "adopt" ? "Adoption" : "Help"}</h3>
            <p>Are you sure you want to {actionType === "adopt" ? "adopt" : "help"} {selectedAnimal.name}?</p>
            <div className="mt-6 flex justify-around">
              <button
                onClick={confirmAction}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimalList;
