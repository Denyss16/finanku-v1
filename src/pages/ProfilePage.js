import React, { useState } from 'react';
import TargetTracker from '../components/TargetTracker';
import { User, Mail, Camera, X, Check } from 'lucide-react';

export default function ProfilePage({ currentUser: user, userTargets: targets, onUpdateProfile, onSaveTarget }) {
    const [isEditMode, setIsEditMode] = useState(false);
  const [editedName, setEditedName] = useState(user ? user.name : '');
  const [editedPhoto, setEditedPhoto] = useState(user ? user.photoUrl : '');

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-lg font-bold">Silakan login untuk melihat profil Anda.</p>
      </div>
    );
  }

      const handleSaveChanges = () => {
    onUpdateProfile({ name: editedName, photoUrl: editedPhoto });
    setIsEditMode(false);
  };

  const handleCancelEdit = () => {
    setEditedName(user.name);
    setEditedPhoto(user.photoUrl || '');
    setIsEditMode(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 shadow-2xl rounded-2xl p-8 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center md:space-x-8">
              <div className="relative mb-6 md:mb-0">
                <img 
                  src={user.photoUrl || `https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=random&color=fff&size=128`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                {isEditMode && (
                  <div className="absolute bottom-0 right-0 bg-white rounded-full p-2">
                     <Camera className="text-blue-600" size={20}/>
                  </div>
                )}
              </div>
              <div className="text-center md:text-left flex-grow">
                {!isEditMode ? (
                  <h2 className="text-4xl font-bold drop-shadow-md">{user.name}</h2>
                ) : (
                  <input 
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full bg-white bg-opacity-20 text-white text-4xl font-bold rounded-lg p-2 border-2 border-transparent focus:border-white focus:outline-none"
                  />
                )}
                <div className="flex items-center justify-center md:justify-start mt-2 text-blue-100">
                  <Mail size={18} className="mr-2"/>
                  <p>{user.email}</p>
                </div>
                 {isEditMode && (
                  <div className="mt-4">
                    <input 
                      type="text"
                      placeholder="URL Foto Profil"
                      value={editedPhoto}
                      onChange={(e) => setEditedPhoto(e.target.value)}
                      className="w-full bg-white bg-opacity-20 text-white rounded-lg p-2 placeholder-blue-200 focus:outline-none"
                    />
                  </div>
                )}
              </div>
              <div className="mt-6 md:mt-0">
                {!isEditMode ? (
                  <button onClick={() => setIsEditMode(true)} className="bg-white text-blue-600 font-bold py-2 px-6 rounded-full hover:bg-blue-100 transition-colors shadow-md">
                    Edit Profil
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button onClick={handleSaveChanges} className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg">
                      <Check size={20}/>
                    </button>
                    <button onClick={handleCancelEdit} className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg">
                      <X size={20}/>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <TargetTracker targets={targets} onUpdateTarget={onSaveTarget} />
        </div>
      </div>
    </div>
  );
}
