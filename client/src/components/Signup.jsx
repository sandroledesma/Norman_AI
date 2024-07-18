import React from 'react';

function Signup() {
    return (
        <div className="flex justify-center bg-white p-8 rounded shadow-md mb-12">
            <form className="w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center">Sign up now!</h2>
                
                <div className="mb-4">
                    <label className="block text-left text-gray-700">ORGANIZATION:</label>
                    <select 
                        className="form-input mt-1 block w-full rounded border-gray-300 shadow-sm p-3" 
                        placeholder="Select your Organization">
                        <option value="org1">Organization 1</option>
                        <option value="org2">Organization 2</option>
                        <option value="org3">Organization 3</option>
                    </select>
                </div>
                
                <p className="text-center mb-6">
                    Please reach out to our enterprise team if your Organization is not in this list
                </p>
                
                <div className="mb-4">
                    <label className="block text-left text-gray-700">FIRST NAME:</label>
                    <input 
                        type='text' 
                        className="form-input mt-1 block w-full rounded border-gray-300 shadow-sm p-3" 
                        placeholder="enter your first name" 
                    />
                </div>
                
                <div className="mb-4">
                    <label className="block text-left text-gray-700">LAST NAME:</label>
                    <input 
                        type='text' 
                        className="form-input mt-1 block w-full rounded border-gray-300 shadow-sm p-3" 
                        placeholder="enter your last name" 
                    />
                </div>
                
                <div className="mb-4">
                    <label className="block text-left text-gray-700">E-MAIL:</label>
                    <input 
                        type='email' 
                        className="form-input mt-1 block w-full rounded border-gray-300 shadow-sm p-3" 
                        placeholder="enter your email" 
                    />
                </div>
                
                <div className="mb-4">
                    <label className="block text-left text-gray-700">USERNAME:</label>
                    <input 
                        type='text' 
                        className="form-input mt-1 block w-full rounded border-gray-300 shadow-sm p-3" 
                        placeholder="enter a username" 
                    />
                </div>
                
                <div className="mb-6">
                    <label className="block text-left text-gray-700">PASSWORD:</label>
                    <input 
                        type='password' 
                        className="form-input mt-1 block w-full rounded border-gray-300 shadow-sm p-3" 
                        placeholder="enter your password" 
                    />
                </div>
                
                <div className="flex justify-center mb-4">
                    <button type='submit' className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 transition">
                        SIGNUP
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Signup;
