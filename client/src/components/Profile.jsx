import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

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
        fetchProfileData(id); // Ensure `id` is defined and correct
    }, [id]);

    const handleProfileEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
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
                body: JSON.stringify(profileData)
            });

            if (response.ok) {
                const updatedProfile = await response.json();
                setProfileData(updatedProfile);
                setIsEditing(false);
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
                    <div className="p-4">
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
                                <div className="mb-6">
                                    <label className="block text-left text-gray-700">Organization:</label>
                                    <input 
                                        type="text" 
                                        name="organization" 
                                        value={profileData.organization} 
                                        onChange={handleInputChange} 
                                        className="form-input mt-1 block w-full rounded border-gray-300 shadow-sm p-3" />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-left text-gray-700">Role:</label>
                                    <input 
                                        type="text" 
                                        name="role" 
                                        value={profileData.role} 
                                        onChange={handleInputChange} 
                                        className="form-input mt-1 block w-full rounded border-gray-300 shadow-sm p-3" />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button onClick={handleSaveChanges} className="bg-green-500 text-white px-4 py-2 rounded">Save Changes</button>
                                    <button onClick={handleCancelChanges} className="bg-red-500 text-white px-4 py-2 rounded">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p><strong>First Name:</strong> {profileData.firstname}</p>
                                <p><strong>Last Name:</strong> {profileData.lastname}</p>
                                <p><strong>Username:</strong> {profileData.username}</p>
                                <p><strong>Email:</strong> {profileData.email}</p>
                                <p><strong>Organization:</strong> {profileData.organization}</p>
                                <p><strong>Role:</strong> {profileData.role}</p>
                                <button onClick={handleProfileEditToggle} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">Edit Profile</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Tickets */}
            <div className="bg-gray-100 rounded-lg shadow-md mb-4">
                <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => toggleSection('tickets')}>
                    <h2 className="text-xl font-semibold">CUSTOMER SERVICE TICKET AI-GENT</h2>
                    <span className={`transform transition-transform ${isTicketsOpen ? 'rotate-90' : 'rotate-0'}`}>▶</span>
                </div>
                {isTicketsOpen && (
                    <div className="p-4">
                        <ul>
                            <li>Ticket #1: Issue with login</li>
                            <li>Ticket #2: Problem with billing</li>
                            <li>Ticket #3: Feature request</li>
                        </ul>
                    </div>
                )}
            </div>

            {/* File Upload */}
            <div className="bg-gray-100 rounded-lg shadow-md mb-4">
                <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => toggleSection('files')}>
                    <h2 className="text-xl font-semibold">FILE AND TICKET UPLOADS</h2>
                    <span className={`transform transition-transform ${isFilesOpen ? 'rotate-90' : 'rotate-0'}`}>▶</span>
                </div>
                {isFilesOpen && (
                    <div className="p-4">
                        <input type="file" className="form-input block w-full" />
                        <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Upload</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;
