import React from 'react';
import { NavLink } from 'react-router-dom';

function Login(){
    return(
        <div className="flex justify-center bg-white p-8 rounded shadow-md mb-12">
            <form className="w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center">Login to your account</h2>
                <div className="mb-4">
                    <label className="block text-left text-gray-700">EMAIL:</label>
                    <input 
                        type='email' 
                        className="form-input mt-1 block w-full rounded border-gray-300 shadow-sm p-3" 
                        placeholder="enter your email" 
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