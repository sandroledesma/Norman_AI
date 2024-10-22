import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Tickets from './Tickets';

function Profile() {
    const { id } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [isProfileOpen, setProfileOpen] = useState(true);
    const [isTicketsOpen, setTicketsOpen] = useState(false);
    const [isFilesOpen, setFilesOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const fetchProfileData = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:5555/profile/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setProfileData(data);
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };
    
    useEffect(() => {
        fetchProfileData(id);
    }, [id]);

    const handleProfileEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setProfileData({
            ...profileData,
            [name]: value
        });
    };

    const handleSaveChanges = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5555/profile/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstname: profileData.firstname,
                    lastname: profileData.lastname,
                    username: profileData.username,
                    email: profileData.email
                })
            });

            if (response.ok) {
                const updatedProfile = await response.json();
                setProfileData(updatedProfile);
                setIsEditing(false);
                console.log('Profile updated successfully:', updatedProfile)
            } else {
                const errorData = await response.json();
                console.error('Error updating profile:', errorData.error);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleCancelChanges = () => {
        setIsEditing(false);
    };

    const toggleSection = (section) => {
        if (section === 'profile') setProfileOpen(!isProfileOpen);
        if (section === 'tickets') setTicketsOpen(!isTicketsOpen);
        if (section === 'files') setFilesOpen(!isFilesOpen);
    };

    if (!profileData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            {/* Profile Information */}
            <div className="bg-gray-100 rounded-lg shadow-md mb-4">
                <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => toggleSection('profile')}>
                    <h2 className="text-xl font-semibold">PROFILE INFORMATION</h2>
                    <span className={`transform transition-transform ${isProfileOpen ? 'rotate-90' : 'rotate-0'}`}>▶</span>
                </div>
                {isProfileOpen && (
                    <div className="p-4 bg-light-green">
                        {isEditing ? (
                            <div>
                                <div className="mb-6">
                                    <label className="block text-left text-gray-700">First Name:</label>
                                    <input 
                                        type="text" 
                                        name="firstname" 
                                        value={profileData.firstname} 
                                        onChange={handleInputChange} 
                                        className="form-input mt-1 block w-full rounded border-gray-300 shadow-sm p-3" />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-left text-gray-700">Last Name:</label>
                                    <input 
                                        type="text" 
                                        name="lastname" 
                                        value={profileData.lastname} 
                                        onChange={handleInputChange} 
                                        className="form-input mt-1 block w-full rounded border-gray-300 shadow-sm p-3" />
                                </div>
                                <div className="mb-6">
                                    <label className="text-left text-gray-700">Username:</label>
                                    <input 
                                        type="text" 
                                        name="username" 
                                        value={profileData.username} 
                                        onChange={handleInputChange} 
                                        className="form-input mt-1 block w-full rounded border-gray-300 shadow-sm p-3" />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-left text-gray-700">Email:</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        value={profileData.email} 
                                        onChange={handleInputChange} 
                                        className="form-input mt-1 block w-full rounded border-gray-300 shadow-sm p-3" />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button onClick={handleSaveChanges} className="bg-green-500 text-black px-4 py-2 rounded">SAVE CHANGES</button>
                                    <button onClick={handleCancelChanges} className="bg-red-500 text-black px-4 py-2 rounded">CANCEL</button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p><strong>Organization:</strong> {profileData.organization?.name}</p>
                                <p><strong>Role:</strong> {profileData.role?.name}</p>
                                <br/>
                                <p><strong>Name:</strong> {profileData.firstname} {profileData.lastname}</p>
                                <p><strong>Username:</strong> {profileData.username}</p>
                                <p><strong>Email:</strong> {profileData.email}</p>
                                <button onClick={handleProfileEditToggle} className="bg-blue-500 text-black px-4 py-2 rounded mt-4">EDIT PROFILE</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Tickets */}
            <div>
                <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => toggleSection('tickets')}>
                    <h2 className="text-xl font-semibold">CUSTOMER SERVICE TICKET AI-GENT</h2>
                    <span className={`transform transition-transform ${isTicketsOpen ? 'rotate-90' : 'rotate-0'}`}>▶</span>
                </div>
                {isTicketsOpen && (
                    <Tickets />
                )}
            </div>
            <br/>
            
            {/* File Upload */}
            <div className="bg-gray-100 rounded-lg shadow-md mb-4">
                <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => toggleSection('files')}>
                    <h2 className="text-xl font-semibold">FILE AND TICKET UPLOADS</h2>
                    <span className={`transform transition-transform ${isFilesOpen ? 'rotate-90' : 'rotate-0'}`}>▶</span>
                </div>
                {isFilesOpen && (
                    <div className="p-4 bg-light-green">
                        <input type="file" className="form-input block w-full" />
                        <button className="bg-blue-500 text-black px-4 py-2 rounded mt-2">UPLOAD</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;
