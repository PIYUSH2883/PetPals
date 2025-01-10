// src/components/UploadAnimal.jsx
import React, { useState } from 'react';
import { db, storage } from "../firebaseConfig.js";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const UploadAnimal = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [info, setInfo] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState('Open for Adoption');

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = '';
    if (image) {
      const imageRef = ref(storage, `animals/${new Date().getTime()}_${image.name}`); // Using timestamp for unique filename
      const snapshot = await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(snapshot.ref);
    }

    // Add a new document to Firestore and get its ID
    const animalDocRef = await addDoc(collection(db, "animals"), {
      name,
      type,
      location,
      info,
      status,
      imageUrl,
      createdAt: new Date(),
    });

    // Use the document ID as the animalId
    await updateDoc(animalDocRef, { animalId: animalDocRef.id });

    alert("Animal uploaded successfully!");

    // Reset form
    setName('');
    setType('');
    setLocation('');
    setInfo('');
    setImage(null);
    setImageUrl('');
    setStatus('Open for Adoption');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Upload Animal for Adoption/Help</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Animal Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Type</label>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Information</label>
          <textarea
            value={info}
            onChange={(e) => setInfo(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md"
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="Open for Adoption">Open for Adoption</option>
            <option value="Injured">Injured</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="mt-1 block w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Upload Animal
        </button>
      </form>
    </div>
  );
};

export default UploadAnimal;
