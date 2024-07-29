import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [signupFirstName, setSignupFirstName] = useState('');
    const [signupLastName, setSignupLastName] = useState('');
    const [signupUsername, setSignupUsername] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupOrganization, setSignupOrganization] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [organizations, setOrganizations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchOrganizations() {
            try {
                const response = await fetch('http://127.0.0.1:5555/organizations');
                if (!response.ok) {
                    throw new Error('Failed to fetch organizations');
                }
                const data = await response.json();
                setOrganizations(data);
            } catch (error) {
                console.error('Error fetching organizations:', error);
            }
        }
        fetchOrganizations();
    }, []);

    const handleSignup = async (event) => {
        event.preventDefault();
        const response = await fetch('http://127.0.0.1:5555/signup', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstname: signupFirstName, 
                lastname: signupLastName, 
                username: signupUsername, 
                password: signupPassword, 
                organization: signupOrganization,
                email: signupEmail
            }), 
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            alert("Sign-up successful, redirecting to profile page!");
            navigate(`/profile/${data.id}`);
        } else {
            const errorData = await response.json();
            alert(`Signup failed: ${errorData.error}`);
        }
    };
    
    return (
        <div className="flex bg-light-green justify-center bg-white p-8 rounded shadow-md mb-12">
            <form className="w-full max-w-md" onSubmit={handleSignup}>
                <h2 className="text-3xl font-bold mb-6 text-center">Sign up now!</h2>
                
                <div className="mb-4">
                    <label className="block text-left text-gray-700">ORGANIZATION:</label>
                    <select
                        className="form-input mt-1 block w-full rounded border-gray-300 shadow-sm p-3"
                        value={signupOrganization}
                        onChange={(event) => setSignupOrganization(event.target.value)}
                        placeholder="Select your Organization">

                        <option value="">Select your Organization</option>
                        {organizations.map(org => (
                            <option key={org.id} value={org.id}>
                                {org.name}
                            </option>
                        ))}
                    </select>
                </div>
                
                <p className="text-center mb-6">
                    Please reach out to our enterprise team if your Organization is not in this list
                </p>
                
                <div className="mb-4">
                    <label className="block text-left text-gray-700">FIRST NAME:</label>
                    <input 
                        type='text'
                        value={signupFirstName}
                        onChange={(event) => setSignupFirstName(event.target.value)}
                        className="form-input mt-1 block w-full rounded border-gray-300 shadow-sm p-3" 
                        placeholder="enter your first name"
                        required
                    />
                </div>
                
                <div className="mb-4">
                    <label className="block text-left text-gray-700">LAST NAME:</label>
                    <input 
                        type='text' 
                        value={signupLastName}
                        onChange={(event) => setSignupLastName(event.target.value)}
                        className="form-input mt-1 block w-full rounded border-gray-300 shadow-sm p-3" 
                        placeholder="enter your last name" 
                        required
                    />
                </div>
                
                <div className="mb-4">
                    <label className="block text-left text-gray-700">E-MAIL:</label>
                    <input 
                        type='email'
                        value={signupEmail}
                        onChange={(event) => setSignupEmail(event.target.value)} 
                        className="form-input mt-1 block w-full rounded border-gray-300 shadow-sm p-3" 
                        placeholder="enter your email" 
                        required
                    />
                </div>
                
                <div className="mb-4">
                    <label className="block text-left text-gray-700">USERNAME:</label>
                    <input 
                        type='text' 
                        value={signupUsername}
                        onChange={(event) => setSignupUsername(event.target.value)}
                        className="form-input mt-1 block w-full rounded border-gray-300 shadow-sm p-3" 
                        placeholder="enter a username" 
                        required
                    />
                </div>
                
                <div className="mb-6">
                    <label className="block text-left text-gray-700">PASSWORD:</label>
                    <input 
                        type='password'
                        value={signupPassword}
                        onChange={(event) => setSignupPassword(event.target.value)}
                        className="form-input mt-1 block w-full rounded border-gray-300 shadow-sm p-3" 
                        placeholder="enter your password" 
                        required
                    />
                </div>
                
                <div className="flex justify-center mb-4">
                    <button type='submit' className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 transition">
                        Sign up!
                    </button>
                </div>
                
            </form>
        </div>
    );
}

export default Signup;
