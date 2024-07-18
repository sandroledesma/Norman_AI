import React, { useState } from 'react';

function Profile() {
    const [isProfileOpen, setProfileOpen] = useState(true);
    const [isTicketsOpen, setTicketsOpen] = useState(true);
    const [isFilesOpen, setFilesOpen] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    
    const profileData = {
        firstname: 'John',
        lastname: 'Doe',
        username: 'johndoe',
        email: 'john.doe@example.com',
        organization: 'Tech Inc.',
        role: 'Support Specialist'
    };

    const handleProfileEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSaveChanges = () => {
        // Save changes to the backend
        setIsEditing(false);
    };

    const handleCancelChanges = () => {
        // Revert changes if needed
        setIsEditing(false);
    };

    const toggleSection = (section) => {
        if (section === 'profile') setProfileOpen(!isProfileOpen);
        if (section === 'tickets') setTicketsOpen(!isTicketsOpen);
        if (section === 'files') setFilesOpen(!isFilesOpen);
    };

    return (
        <div className="container mx-auto p-4">
            {/* Profile Information */}
            <div className="bg-gray-100 rounded-lg shadow-md mb-4">
                <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => toggleSection('profile')}>
                    <h2 className="text-xl font-semibold">Profile Information</h2>
                    <span className={`transform transition-transform ${isProfileOpen ? 'rotate-90' : 'rotate-0'}`}>▶</span>
                </div>
                {isProfileOpen && (
                    <div className="p-4">
                        {isEditing ? (
                            <div>
                                <div className="mb-4">
                                    <label className="block">First Name:</label>
                                    <input type="text" defaultValue={profileData.firstname} className="form-input mt-1 block w-full" />
                                </div>
                                <div className="mb-4">
                                    <label className="block">Last Name:</label>
                                    <input type="text" defaultValue={profileData.lastname} className="form-input mt-1 block w-full" />
                                </div>
                                <div className="mb-4">
                                    <label className="block">Username:</label>
                                    <input type="text" defaultValue={profileData.username} className="form-input mt-1 block w-full" />
                                </div>
                                <div className="mb-4">
                                    <label className="block">Email:</label>
                                    <input type="email" defaultValue={profileData.email} className="form-input mt-1 block w-full" />
                                </div>
                                <div className="mb-4">
                                    <label className="block">Organization:</label>
                                    <input type="text" defaultValue={profileData.organization} className="form-input mt-1 block w-full" />
                                </div>
                                <div className="mb-4">
                                    <label className="block">Role:</label>
                                    <input type="text" defaultValue={profileData.role} className="form-input mt-1 block w-full" />
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
                    <h2 className="text-xl font-semibold">Customer Service Tickets</h2>
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
                    <h2 className="text-xl font-semibold">File Upload</h2>
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
