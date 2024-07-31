import React, {useState} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function Login(){
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        const response = await fetch('http://127.0.0.1:5555/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: loginUsername, password: loginPassword }),
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            globalThis.sessionStorage.setItem('authToken', 'is logged in');
            console.log('Login successful:', data);
            navigate(`/profile/${data.id}`);
            window.location.reload();
        } else {
            alert('Login failed');
        }
    };

    return(
        <div className="flex justify-center bg-light-green p-8 rounded shadow-md mb-12">
            <form className="w-full max-w-md" onSubmit={handleLogin}>
                <h2 className="text-3xl font-bold mb-6 text-center">Login to your account</h2>
                <div className="mb-4">
                    <label className="block text-left text-gray-700">USERNAME:</label>
                    <input 
                        type='username'
                        value={loginUsername}
                        onChange={(event) => setLoginUsername(event.target.value)}
                        className="form-input mt-1 block w-full rounded border-gray-300 shadow-sm p-3" 
                        placeholder="enter your username" 
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-left text-gray-700">PASSWORD:</label>
                    <input 
                        type='password' 
                        value={loginPassword}
                        onChange={(event) => setLoginPassword(event.target.value)}
                        className="form-input mt-1 block w-full rounded border-gray-300 shadow-sm p-3" 
                        placeholder="enter your password" 
                        required
                    />
                </div>
                <div className="flex justify-center mb-4">
                    <button type='submit' className="px-6 py-2 text-black bg-blue-500 rounded hover:bg-blue-700 transition">
                        LOGIN
                    </button>
                </div>
                <p className="text-center">Not an account holder yet?</p>
                <p className="text-center font-bold">
                    <NavLink reloadDocument to="/signup">Sign up today!</NavLink>
                </p>
            </form>
        </div>
    )
}

export default Login;